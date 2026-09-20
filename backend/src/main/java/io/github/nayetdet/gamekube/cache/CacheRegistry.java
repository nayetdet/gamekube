package io.github.nayetdet.gamekube.cache;

import lombok.experimental.UtilityClass;

@UtilityClass
public class CacheRegistry {

  // Game
  public static final String GAME = "game";
  public static final String GAME_COLLECTION = "game:collection";
  public static final String GAME_IMAGE = "game:image";

  // Game Instance
  public static final String GAME_INSTANCE_LEASE = "game:instance:lease:%s";
  public static final String GAME_INSTANCE_EXPIRATIONS = "game:instance:expirations";
  public static final String GAME_INSTANCE_LOCK = "game:instance:lock:%s";

  // Presence
  public static final String PRESENCE = "presence:%s";
}
