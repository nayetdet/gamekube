package io.github.nayetdet.gamekube.cache;

import java.util.Locale;
import lombok.experimental.UtilityClass;

@UtilityClass
public class GameInstanceCacheRegistry {

  public static final String LEASE = "game:instance:lease:%s";
  public static final String ACTIVE = "game:instance:active:%s";
  public static final String EXPIRATIONS = "game:instance:expirations";
  public static final String LOCK = "game:instance:lock:%s";

  public static String key(String gameId, String username) {
    return "%s|%s".formatted(gameId, username.toLowerCase(Locale.ROOT));
  }

  public static String activeKey(String username) {
    return ACTIVE.formatted(username.toLowerCase(Locale.ROOT));
  }
}
