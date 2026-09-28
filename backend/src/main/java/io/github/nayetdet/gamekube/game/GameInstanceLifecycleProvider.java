package io.github.nayetdet.gamekube.game;

import io.github.nayetdet.gamekube.cache.GameInstanceCacheRegistry;
import io.github.nayetdet.gamekube.exception.GameNotFoundException;
import java.time.Duration;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GameInstanceLifecycleProvider {

  private final GameProvider gameProvider;
  private final GameInstanceProvider gameInstanceProvider;
  private final StringRedisTemplate redisTemplate;

  @Value("${gamekube.game.instance.idle-timeout}")
  private Duration idleTimeout;

  @Value("${gamekube.game.instance.cleanup.lock-timeout}")
  private Duration lockTimeout;

  @Value("${gamekube.game.infra.domain}")
  private String domain;

  public Optional<String> findCurrentGameId(String username) {
    String activeKey = GameInstanceCacheRegistry.activeKey(username);
    String gameId = redisTemplate.opsForValue().get(activeKey);
    if (gameId == null) {
      return Optional.empty();
    }

    if (!hasActiveLease(GameInstanceCacheRegistry.key(gameId, username))) {
      redisTemplate.delete(activeKey);
      return Optional.empty();
    }

    return Optional.of(gameId);
  }

  public boolean provision(GameInstance instance) {
    if (gameProvider.find(instance.getGameId()) == null) {
      throw new GameNotFoundException();
    }

    String activeKey = GameInstanceCacheRegistry.activeKey(instance.getUsername());
    if (!Boolean.TRUE.equals(
        redisTemplate.opsForValue().setIfAbsent(activeKey, instance.getGameId(), idleTimeout))) {
      return false;
    }

    try {
      renew(GameInstanceCacheRegistry.key(instance.getGameId(), instance.getUsername()));
      return true;
    } catch (RuntimeException exception) {
      redisTemplate.delete(activeKey);
      throw exception;
    }
  }

  public void renew(GameInstance instance) {
    if (gameProvider.find(instance.getGameId()) == null) {
      throw new GameNotFoundException();
    }

    String instanceKey =
        GameInstanceCacheRegistry.key(instance.getGameId(), instance.getUsername());

    if (hasActiveLease(instanceKey)) {
      renew(instanceKey);
      redisTemplate.expire(
          GameInstanceCacheRegistry.activeKey(instance.getUsername()), idleTimeout);
    }
  }

  public void destroy(GameInstance instance) {
    String activeKey = GameInstanceCacheRegistry.activeKey(instance.getUsername());
    if (instance.getGameId().equals(redisTemplate.opsForValue().get(activeKey))) {
      redisTemplate.delete(activeKey);
      String instanceKey =
          GameInstanceCacheRegistry.key(instance.getGameId(), instance.getUsername());

      redisTemplate.delete(GameInstanceCacheRegistry.LEASE.formatted(instanceKey));
      redisTemplate.opsForZSet().remove(GameInstanceCacheRegistry.EXPIRATIONS, instanceKey);
    }
  }

  public void cleanup() {
    Set<String> expired =
        redisTemplate
            .opsForZSet()
            .rangeByScore(
                GameInstanceCacheRegistry.EXPIRATIONS, 0, System.currentTimeMillis(), 0, 100);

    if (expired == null) {
      return;
    }

    expired.forEach(this::cleanup);
  }

  private void cleanup(String instance) {
    String lock = GameInstanceCacheRegistry.LOCK.formatted(instance);
    if (!Boolean.TRUE.equals(
        redisTemplate.opsForValue().setIfAbsent(lock, "locked", lockTimeout))) {
      return;
    }

    try {
      if (hasActiveLease(instance)) {
        refresh(instance);
        return;
      }

      String[] owner = instance.split("\\|", 2);
      Game game = gameProvider.find(owner[0]);
      if (game != null) {
        gameInstanceProvider.destroy(
            game,
            GameInstance.builder()
                .gameId(owner[0])
                .username(owner[1])
                .name(game.getId() + "-" + owner[1])
                .host(owner[1] + "." + game.getId() + "." + domain)
                .build());
      }

      redisTemplate.opsForZSet().remove(GameInstanceCacheRegistry.EXPIRATIONS, instance);
      String activeKey = GameInstanceCacheRegistry.activeKey(owner[1]);
      if (owner[0].equals(redisTemplate.opsForValue().get(activeKey))) {
        redisTemplate.delete(activeKey);
      }

    } finally {
      redisTemplate.delete(lock);
    }
  }

  private boolean hasActiveLease(String instance) {
    return Boolean.TRUE.equals(
        redisTemplate.hasKey(GameInstanceCacheRegistry.LEASE.formatted(instance)));
  }

  private void renew(String instance) {
    redisTemplate
        .opsForValue()
        .set(GameInstanceCacheRegistry.LEASE.formatted(instance), "active", idleTimeout);

    redisTemplate
        .opsForZSet()
        .add(
            GameInstanceCacheRegistry.EXPIRATIONS,
            instance,
            System.currentTimeMillis() + idleTimeout.toMillis());
  }

  private void refresh(String instance) {
    long remaining =
        redisTemplate.getExpire(
            GameInstanceCacheRegistry.LEASE.formatted(instance), TimeUnit.MILLISECONDS);

    if (remaining > 0) {
      redisTemplate
          .opsForZSet()
          .add(
              GameInstanceCacheRegistry.EXPIRATIONS,
              instance,
              System.currentTimeMillis() + remaining);

      String[] owner = instance.split("\\|", 2);
      redisTemplate.expire(
          GameInstanceCacheRegistry.activeKey(owner[1]), Duration.ofMillis(remaining));
    }
  }
}
