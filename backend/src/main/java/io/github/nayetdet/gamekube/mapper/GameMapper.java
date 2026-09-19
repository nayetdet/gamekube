package io.github.nayetdet.gamekube.mapper;

import io.github.nayetdet.gamekube.game.Game;
import io.github.nayetdet.gamekube.game.GameInstance;
import io.github.nayetdet.gamekube.payload.response.GameInstanceResponse;
import io.github.nayetdet.gamekube.payload.response.GameResponse;
import org.springframework.stereotype.Component;

@Component
public class GameMapper {

  public GameResponse toResponse(Game game) {
    return GameResponse.builder()
        .id(game.getId())
        .name(game.getName())
        .description(game.getDescription())
        .image(game.getImage())
        .build();
  }

  public GameInstanceResponse toResponse(GameInstance instance) {
    return GameInstanceResponse.builder()
        .name(instance.getName())
        .host(instance.getHost())
        .url(instance.getUrl())
        .build();
  }
}
