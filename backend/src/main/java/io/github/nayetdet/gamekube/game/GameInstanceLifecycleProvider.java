package io.github.nayetdet.gamekube.game;

import io.github.nayetdet.gamekube.cache.CacheRegistry;
import io.github.nayetdet.gamekube.exception.GameNotFoundException;
import java.time.Duration;
import java.util.Locale;
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

  public void provision(GameInstance instance) {
    if (gameProvider.find(instance.getGameId()) == null) {
      throw new GameNotFoundException();
    }

    renew(key(instance));
  }

  public void renew(GameInstance instance) {
    if (gameProvider.find(instance.getGameId()) == null) {
      throw new GameNotFoundException();
    }

    if (active(key(instance))) {
      renew(key(instance));
    }
  }

  public void destroy(GameInstance instance) {
    redisTemplate.delete(CacheRegistry.GAME_INSTANCE_LEASE.formatted(key(instance)));
    redisTemplate.opsForZSet().remove(CacheRegistry.GAME_INSTANCE_EXPIRATIONS, key(instance));
  }

  public void cleanup() {
    Set<String> expired =
        redisTemplate
            .opsForZSet()
            .rangeByScore(
                CacheRegistry.GAME_INSTANCE_EXPIRATIONS, 0, System.currentTimeMillis(), 0, 100);

    if (expired == null) {
      return;
    }

    expired.forEach(this::cleanup);
  }

  private void cleanup(String instance) {
    String lock = CacheRegistry.GAME_INSTANCE_LOCK.formatted(instance);
    if (!Boolean.TRUE.equals(
        redisTemplate.opsForValue().setIfAbsent(lock, "locked", lockTimeout))) {
      return;
    }

    try {
      if (active(instance)) {
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

      redisTemplate.opsForZSet().remove(CacheRegistry.GAME_INSTANCE_EXPIRATIONS, instance);
    } finally {
      redisTemplate.delete(lock);
    }
  }

  private boolean active(String instance) {
    return Boolean.TRUE.equals(
        redisTemplate.hasKey(CacheRegistry.GAME_INSTANCE_LEASE.formatted(instance)));
  }

  private void renew(String instance) {
    redisTemplate
        .opsForValue()
        .set(CacheRegistry.GAME_INSTANCE_LEASE.formatted(instance), "active", idleTimeout);

    redisTemplate
        .opsForZSet()
        .add(
            CacheRegistry.GAME_INSTANCE_EXPIRATIONS,
            instance,
            System.currentTimeMillis() + idleTimeout.toMillis());
  }

  private void refresh(String instance) {
    long remaining =
        redisTemplate.getExpire(
            CacheRegistry.GAME_INSTANCE_LEASE.formatted(instance), TimeUnit.MILLISECONDS);

    if (remaining > 0) {
      redisTemplate
          .opsForZSet()
          .add(
              CacheRegistry.GAME_INSTANCE_EXPIRATIONS,
              instance,
              System.currentTimeMillis() + remaining);
    }
  }

  private String key(GameInstance instance) {
    return instance.getGameId() + "|" + instance.getUsername().toLowerCase(Locale.ROOT);
  }
}
