package io.github.nayetdet.gamekube.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import io.github.nayetdet.gamekube.game.Game;
import org.junit.jupiter.api.Test;

class GameMapperTest {
  @Test
  void exposesOptionalVideoUrlFromManifest() throws Exception {
    Game game =
        new YAMLMapper()
            .readValue("name: Doom\nvideoUrl: https://youtu.be/5CHEbfDjIKw\n", Game.class);
    game.setId("doom");
    assertEquals("https://youtu.be/5CHEbfDjIKw", new GameMapper().toResponse(game).getVideoUrl());
    game.setVideoUrl(null);
    assertNull(new GameMapper().toResponse(game).getVideoUrl());
  }
}
