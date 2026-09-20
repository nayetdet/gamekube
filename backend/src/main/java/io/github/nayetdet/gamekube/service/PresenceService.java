package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.cache.CacheRegistry;
import io.github.nayetdet.gamekube.enums.PresenceStatus;
import io.github.nayetdet.gamekube.repository.UserRepository;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PresenceService {

  private final UserRepository userRepository;
  private final StringRedisTemplate redisTemplate;

  @Value("${gamekube.presence.heartbeat-timeout}")
  private Duration heartbeatTimeout;

  public void markAsOnline(String username, String sessionId) {
    String cacheKey = String.format(CacheRegistry.PRESENCE, username);
    long currentTime = System.currentTimeMillis();
    long expiresAt = currentTime + heartbeatTimeout.toMillis();
    redisTemplate.opsForZSet().add(cacheKey, sessionId, expiresAt);
    redisTemplate.expire(cacheKey, heartbeatTimeout);
  }

  @Transactional
  public void markAsOffline(String username, String sessionId) {
    String cacheKey = String.format(CacheRegistry.PRESENCE, username);
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

  public PresenceStatus status(String username) {
    String cacheKey = String.format(CacheRegistry.PRESENCE, username);
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
