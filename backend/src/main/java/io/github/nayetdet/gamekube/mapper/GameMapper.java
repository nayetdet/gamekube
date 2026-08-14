package io.github.nayetdet.gamekube.mapper;

import io.github.nayetdet.gamekube.payload.response.GameResponse;
import java.net.URI;
import org.springframework.stereotype.Component;

@Component
public class GameMapper {

  public GameResponse toResponse(URI url) {
    return GameResponse.builder().url(url).build();
  }
}
