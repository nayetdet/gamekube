package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.exception.GameNotFoundException;
import io.github.nayetdet.gamekube.game.GameInstanceProvider;
import io.github.nayetdet.gamekube.game.GameSpec;
import io.github.nayetdet.gamekube.game.GameSpecProvider;
import io.github.nayetdet.gamekube.mapper.GameMapper;
import io.github.nayetdet.gamekube.payload.response.GameResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GameService {

  private final GameMapper gameMapper;
  private final GameSpecProvider gameSpecProvider;
  private final GameInstanceProvider gameInstanceProvider;

  public GameResponse start(String gameId) {
    GameSpec game = gameSpecProvider.find(gameId);
    if (game == null) {
      throw new GameNotFoundException();
    }

    return gameMapper.toResponse(game, gameInstanceProvider.deploy(game));
  }
}
