package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.cache.UserCacheRegistry;
import io.github.nayetdet.gamekube.enums.UserStatus;
import io.github.nayetdet.gamekube.exception.UserAvatarInvalidException;
import io.github.nayetdet.gamekube.exception.UserAvatarNotFoundException;
import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.game.GameInstanceLifecycleProvider;
import io.github.nayetdet.gamekube.mapper.UserMapper;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.http.query.UserQuery;
import io.github.nayetdet.gamekube.payload.http.query.page.ApplicationPage;
import io.github.nayetdet.gamekube.payload.http.request.UserRequest;
import io.github.nayetdet.gamekube.payload.http.response.UserResponse;
import io.github.nayetdet.gamekube.repository.UserRepository;
import io.github.nayetdet.gamekube.security.AuthenticationHelper;
import io.github.nayetdet.gamekube.security.AuthorizationHelper;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

  private static final Map<String, String> ALLOWED_AVATAR_TYPES =
      Map.of(
          MediaType.IMAGE_JPEG_VALUE,
          ".jpg",
          MediaType.IMAGE_PNG_VALUE,
          ".png",
          MediaType.IMAGE_GIF_VALUE,
          ".gif",
          "image/webp",
          ".webp");

  private final GameInstanceLifecycleProvider gameInstanceLifecycleProvider;
  private final KeycloakService keycloakService;
  private final StorageService storageService;
  private final UserMapper userMapper;
  private final UserRepository userRepository;
  private final StringRedisTemplate redisTemplate;
  private final PresenceNotifier presenceNotifier;

  public UserResponse toPresenceResponse(User user) {
    return userMapper.toResponse(
        user,
        status(user.getUsername()),
        gameInstanceLifecycleProvider.findCurrentGameId(user.getUsername()).orElse(null));
  }

  @Value("${gamekube.user.presence.heartbeat-timeout}")
  private Duration heartbeatTimeout;

  @Value("${gamekube.user.storage.avatar-bucket}")
  private String avatarBucket;

  @Transactional(readOnly = true)
  public ApplicationPage<UserResponse> search(UserQuery query) {
    if (query.getStatus() == null) {
      return new ApplicationPage<>(
          userRepository
              .search(query, query.getPageable())
              .map(
                  user ->
                      userMapper.toResponse(
                          user,
                          status(user.getUsername()),
                          gameInstanceLifecycleProvider
                              .findCurrentGameId(user.getUsername())
                              .orElse(null))));
    }

    List<UserResponse> responses =
        userRepository.search(query, Pageable.unpaged()).stream()
            .map(
                user ->
                    userMapper.toResponse(
                        user,
                        status(user.getUsername()),
                        gameInstanceLifecycleProvider
                            .findCurrentGameId(user.getUsername())
                            .orElse(null)))
            .filter(user -> user.getStatus() == query.getStatus())
            .toList();

    Pageable pageable = query.getPageable();
    return new ApplicationPage<>(
        new PageImpl<>(
            responses.stream().skip(pageable.getOffset()).limit(pageable.getPageSize()).toList(),
            pageable,
            responses.size()));
  }

  @Transactional(readOnly = true)
  public Optional<UserResponse> find(String username) {
    return userRepository
        .findByUsername(username)
        .map(
            user ->
                userMapper.toResponse(
                    user,
                    status(user.getUsername()),
                    gameInstanceLifecycleProvider
                        .findCurrentGameId(user.getUsername())
                        .orElse(null)));
  }

  @Transactional(readOnly = true)
  public Optional<UserResponse> findSelf() {
    return userRepository
        .findByKeycloakId(AuthenticationHelper.getKeycloakId())
        .map(
            user ->
                userMapper.toResponse(
                    user,
                    status(user.getUsername()),
                    gameInstanceLifecycleProvider
                        .findCurrentGameId(user.getUsername())
                        .orElse(null)));
  }

  public void updateEmail(String username) {
    User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
    AuthorizationHelper.validateResourceAccess(user.getKeycloakId());
    keycloakService.updateEmail(user.getKeycloakId());
  }

  @Transactional
  public void update(String username, UserRequest request) {
    User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
    AuthorizationHelper.validateResourceAccess(user.getKeycloakId());
    userMapper.update(user, request);
    userRepository.save(user);
  }

  @Transactional(readOnly = true)
  public StorageService.StorageObject getAvatar(String username) {
    User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
    if (user.getAvatarKey() == null) {
      throw new UserAvatarNotFoundException();
    }

    return storageService
        .getObject(avatarBucket, user.getAvatarKey())
        .orElseThrow(UserAvatarNotFoundException::new);
  }

  @Transactional
  public void updateAvatar(String username, MultipartFile file) {
    User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
    AuthorizationHelper.validateResourceAccess(user.getKeycloakId());

    if (file == null || file.isEmpty()) {
      throw new UserAvatarInvalidException("Avatar file must not be empty");
    }

    String contentType = file.getContentType();
    String extension = contentType != null ? ALLOWED_AVATAR_TYPES.get(contentType) : null;
    if (extension == null) {
      throw new UserAvatarInvalidException("Avatar must be a JPEG, PNG, GIF, or WebP image");
    }

    byte[] content;
    try {
      content = file.getBytes();
    } catch (IOException exception) {
      throw new UserAvatarInvalidException("Failed to read avatar file");
    }

    String previousKey = user.getAvatarKey();
    String newKey = user.getId() + "/" + UUID.randomUUID() + extension;
    storageService.putObject(avatarBucket, newKey, content, contentType);
    if (previousKey != null && !previousKey.equals(newKey)) {
      storageService.deleteObject(avatarBucket, previousKey);
    }

    user.setAvatarKey(newKey);
    userRepository.save(user);
  }

  public void delete(String username) {
    User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
    AuthorizationHelper.validateResourceAccess(user.getKeycloakId());
    if (user.getAvatarKey() != null) {
      storageService.deleteObject(avatarBucket, user.getAvatarKey());
    }
    keycloakService.delete(user.getKeycloakId());
    userRepository.delete(user);
  }

  public void markAsOnline(String username, String sessionId) {
    boolean wasOffline = status(username) == UserStatus.OFFLINE;
    String cacheKey = UserCacheRegistry.presenceKey(username);
    long expiresAt = System.currentTimeMillis() + heartbeatTimeout.toMillis();
    redisTemplate.opsForZSet().add(cacheKey, sessionId, expiresAt);
    redisTemplate.expire(cacheKey, heartbeatTimeout);
    if (wasOffline) presenceNotifier.changed(username);
  }

  @Transactional
  public void markAsOffline(String username, String sessionId) {
    String cacheKey = UserCacheRegistry.presenceKey(username);
    long currentTime = System.currentTimeMillis();
    redisTemplate.opsForZSet().remove(cacheKey, sessionId);
    redisTemplate.opsForZSet().removeRangeByScore(cacheKey, 0, currentTime);
    if (Objects.requireNonNullElse(
            redisTemplate.opsForZSet().count(cacheKey, currentTime, Double.POSITIVE_INFINITY), 0L)
        == 0) {
      userRepository.updateLastSeenAt(
          username,
          LocalDateTime.ofInstant(
              java.time.Instant.ofEpochMilli(currentTime), java.time.ZoneOffset.UTC));
      presenceNotifier.changed(username);
    }
  }

  private UserStatus status(String username) {
    String cacheKey = UserCacheRegistry.presenceKey(username);
    long currentTime = System.currentTimeMillis();
    redisTemplate.opsForZSet().removeRangeByScore(cacheKey, 0, currentTime);
    return Objects.requireNonNullElse(
                redisTemplate.opsForZSet().count(cacheKey, currentTime, Double.POSITIVE_INFINITY),
                0L)
            > 0
        ? UserStatus.ONLINE
        : UserStatus.OFFLINE;
  }
}
