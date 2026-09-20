package io.github.nayetdet.gamekube.cache;

import lombok.experimental.UtilityClass;

@UtilityClass
public class CacheRegistry {

  // Game
  public static final String GAME = "game";
  public static final String GAME_COLLECTION = "game:collection";
  public static final String GAME_IMAGE = "game:image";

  // Presence
  public static final String PRESENCE = "presence:%s";
}
