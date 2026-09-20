package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.exception.GameInstanceAlreadyActiveException;
import io.github.nayetdet.gamekube.exception.GameNotFoundException;
import io.github.nayetdet.gamekube.game.Game;
import io.github.nayetdet.gamekube.game.GameInstance;
import io.github.nayetdet.gamekube.game.GameInstanceLifecycleProvider;
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
  private final GameInstanceLifecycleProvider gameInstanceLifecycleProvider;

  public List<GameResponse> search() {
    return gameProvider.findAll().stream().map(gameMapper::toResponse).toList();
  }

  public byte[] image(String gameId) {
    Game game = gameProvider.find(gameId);
    if (game == null) {
      throw new GameNotFoundException();
    }

    return gameProvider.image(game);
  }

  public GameInstanceResponse provision(String gameId) {
    Game game = gameProvider.find(gameId);
    if (game == null) {
      throw new GameNotFoundException();
    }

    GameInstance instance = gameInstanceProvider.instance(game);
    boolean claimed = false;
    try {
      claimed = gameInstanceLifecycleProvider.provision(instance);
      if (!claimed) {
        throw new GameInstanceAlreadyActiveException();
      }

      return gameMapper.toResponse(gameInstanceProvider.provision(game));
    } catch (RuntimeException exception) {
      if (claimed) {
        gameInstanceLifecycleProvider.destroy(instance);
      }
      throw exception;
    }
  }

  public void destroy(String gameId) {
    Game game = gameProvider.find(gameId);
    if (game == null) {
      throw new GameNotFoundException();
    }

    GameInstance instance = gameInstanceProvider.instance(game);
    if (gameInstanceLifecycleProvider
        .findCurrentGameId(instance.getUsername())
        .filter(gameId::equals)
        .isPresent()) {
      gameInstanceProvider.destroy(game, instance);
      gameInstanceLifecycleProvider.destroy(instance);
    }
  }

  public void heartbeat(String gameId, String username) {
    gameInstanceLifecycleProvider.renew(
        GameInstance.builder().gameId(gameId).username(username).build());
  }
}
