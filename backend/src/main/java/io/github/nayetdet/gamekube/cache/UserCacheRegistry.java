package io.github.nayetdet.gamekube.cache;

import lombok.experimental.UtilityClass;

@UtilityClass
public class UserCacheRegistry {

  public static final String PRESENCE = "user:presence:%s";

  public static String presenceKey(String username) {
    return PRESENCE.formatted(username);
  }
}
