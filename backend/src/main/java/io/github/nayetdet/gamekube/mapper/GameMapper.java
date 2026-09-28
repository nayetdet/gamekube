package io.github.nayetdet.gamekube.mapper;

import io.github.nayetdet.gamekube.game.Game;
import io.github.nayetdet.gamekube.game.GameInstance;
import io.github.nayetdet.gamekube.payload.http.response.GameInstanceResponse;
import io.github.nayetdet.gamekube.payload.http.response.GameResponse;
import org.springframework.stereotype.Component;

@Component
public class GameMapper {

  public GameResponse toResponse(Game game) {
    return GameResponse.builder()
        .id(game.getId())
        .name(game.getName())
        .description(game.getDescription())
        .image("/v1/games/" + game.getId() + "/image")
        .build();
  }

  public GameInstanceResponse toResponse(GameInstance instance) {
    return GameInstanceResponse.builder().url(instance.getUrl()).build();
  }
}
