package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.cache.CacheRegistry;
import io.github.nayetdet.gamekube.enums.PresenceStatus;
import java.time.Duration;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PresenceService {

  private final StringRedisTemplate redisTemplate;

  @Value("${gamekube.presence.heartbeat-timeout}")
  private Duration heartbeatTimeout;

  public void heartbeat(String username, String sessionId) {
    String key = key(username);
    long expiresAt = System.currentTimeMillis() + heartbeatTimeout.toMillis();
    redisTemplate.opsForZSet().add(key, sessionId, expiresAt);
    redisTemplate.expire(key, heartbeatTimeout);
  }

  public PresenceStatus status(String username) {
    String key = key(username);
    long now = System.currentTimeMillis();
    redisTemplate.opsForZSet().removeRangeByScore(key, 0, now);
    return Objects.requireNonNullElse(
                redisTemplate.opsForZSet().count(key, now, Double.POSITIVE_INFINITY), 0L)
            > 0
        ? PresenceStatus.ONLINE
        : PresenceStatus.OFFLINE;
  }

  private String key(String username) {
    return CacheRegistry.PRESENCE + ":" + username;
  }
}
