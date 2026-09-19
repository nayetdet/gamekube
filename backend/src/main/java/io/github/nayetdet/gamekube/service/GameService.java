package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.exception.GameNotFoundException;
import io.github.nayetdet.gamekube.game.Game;
import io.github.nayetdet.gamekube.game.GameInstanceProvider;
import io.github.nayetdet.gamekube.game.GameProvider;
import io.github.nayetdet.gamekube.mapper.GameMapper;
import io.github.nayetdet.gamekube.payload.response.GameInstanceResponse;
import io.github.nayetdet.gamekube.payload.response.GameResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GameService {

  private final GameMapper gameMapper;
  private final GameProvider gameProvider;
  private final GameInstanceProvider gameInstanceProvider;

  public List<GameResponse> findAll() {
    return gameProvider.findAll().stream().map(gameMapper::toResponse).toList();
  }

  public byte[] image(String gameId) {
    Game game = gameProvider.find(gameId);
    if (game == null) {
      throw new GameNotFoundException();
    }

    return gameProvider.image(game);
  }

  public GameInstanceResponse deploy(String gameId) {
    Game game = gameProvider.find(gameId);
    if (game == null) {
      throw new GameNotFoundException();
    }

    return gameMapper.toResponse(gameInstanceProvider.deploy(game));
  }
}
