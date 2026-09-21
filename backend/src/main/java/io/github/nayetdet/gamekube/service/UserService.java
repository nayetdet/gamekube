package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.cache.UserCacheRegistry;
import io.github.nayetdet.gamekube.enums.PresenceStatus;
import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.game.GameInstanceLifecycleProvider;
import io.github.nayetdet.gamekube.mapper.UserMapper;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.query.UserQuery;
import io.github.nayetdet.gamekube.payload.query.page.ApplicationPage;
import io.github.nayetdet.gamekube.payload.request.UserRequest;
import io.github.nayetdet.gamekube.payload.response.UserResponse;
import io.github.nayetdet.gamekube.repository.UserRepository;
import io.github.nayetdet.gamekube.security.AuthenticationHelper;
import io.github.nayetdet.gamekube.security.AuthorizationHelper;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final GameInstanceLifecycleProvider gameInstanceLifecycleProvider;
  private final KeycloakService keycloakService;
  private final UserMapper userMapper;
  private final UserRepository userRepository;
  private final StringRedisTemplate redisTemplate;

  @Value("${gamekube.user.presence.heartbeat-timeout}")
  private Duration heartbeatTimeout;

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

  @Transactional(readOnly = true)
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

  @Transactional
  public void delete(String username) {
    User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
    AuthorizationHelper.validateResourceAccess(user.getKeycloakId());
    userRepository.delete(user);
    userRepository.flush();
    keycloakService.delete(user.getKeycloakId());
  }

  public void markAsOnline(String username, String sessionId) {
    String cacheKey = UserCacheRegistry.presenceKey(username);
    long expiresAt = System.currentTimeMillis() + heartbeatTimeout.toMillis();
    redisTemplate.opsForZSet().add(cacheKey, sessionId, expiresAt);
    redisTemplate.expire(cacheKey, heartbeatTimeout);
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
    }
  }

  private PresenceStatus status(String username) {
    String cacheKey = UserCacheRegistry.presenceKey(username);
    long currentTime = System.currentTimeMillis();
    redisTemplate.opsForZSet().removeRangeByScore(cacheKey, 0, currentTime);
    return Objects.requireNonNullElse(
                redisTemplate.opsForZSet().count(cacheKey, currentTime, Double.POSITIVE_INFINITY),
                0L)
            > 0
        ? PresenceStatus.ONLINE
        : PresenceStatus.OFFLINE;
  }
}
