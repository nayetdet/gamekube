package io.github.nayetdet.gamekube.service;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import io.github.nayetdet.gamekube.exception.GameNotFoundException;
import io.github.nayetdet.gamekube.game.Game;
import io.github.nayetdet.gamekube.game.GameProvider;
import io.github.nayetdet.gamekube.mapper.GameMapper;
import io.github.nayetdet.gamekube.payload.http.response.GameResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GameServiceFindTest {
  @Mock private GameProvider gameProvider;
  @Mock private GameMapper gameMapper;
  @InjectMocks private GameService gameService;

  @Test
  void returnsGameWhenFound() {
    Game game = Game.builder().id("doom").build();
    GameResponse response = GameResponse.builder().id("doom").build();
    when(gameProvider.find("doom")).thenReturn(game);
    when(gameMapper.toResponse(game)).thenReturn(response);
    assertSame(response, gameService.find("doom"));
  }

  @Test
  void rejectsUnknownGame() {
    assertThrows(GameNotFoundException.class, () -> gameService.find("unknown"));
  }
}
