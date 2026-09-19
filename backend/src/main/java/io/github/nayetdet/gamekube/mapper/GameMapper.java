package io.github.nayetdet.gamekube.mapper;

import io.github.nayetdet.gamekube.game.GameSpec;
import io.github.nayetdet.gamekube.payload.response.GameResponse;
import java.net.URI;
import org.springframework.stereotype.Component;

@Component
public class GameMapper {

  public GameResponse toResponse(GameSpec game, URI url) {
    return GameResponse.builder()
        .id(game.getId())
        .name(game.getName())
        .description(game.getDescription())
        .url(url)
        .build();
  }
}
