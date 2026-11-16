package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.exception.GameInstanceActiveException;
import io.github.nayetdet.gamekube.exception.GameInstanceAlreadyActiveException;
import io.github.nayetdet.gamekube.exception.GameNotFoundException;
import io.github.nayetdet.gamekube.exception.GameSaveNotFoundException;
import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.game.Game;
import io.github.nayetdet.gamekube.game.GameInstance;
import io.github.nayetdet.gamekube.game.GameInstanceLifecycleProvider;
import io.github.nayetdet.gamekube.game.GameInstanceProvider;
import io.github.nayetdet.gamekube.game.GameProvider;
import io.github.nayetdet.gamekube.mapper.GameMapper;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.http.response.GameInstanceResponse;
import io.github.nayetdet.gamekube.payload.http.response.GameResponse;
import io.github.nayetdet.gamekube.repository.UserRepository;
import io.github.nayetdet.gamekube.security.AuthenticationHelper;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@Service
@RequiredArgsConstructor
public class GameService {

  private final GameMapper gameMapper;
  private final GameProvider gameProvider;
  private final GameInstanceProvider gameInstanceProvider;
  private final GameInstanceLifecycleProvider gameInstanceLifecycleProvider;
  private final StorageService storageService;
  private final UserRepository userRepository;
  private final PresenceNotifier presenceNotifier;
  private final GameHistoryService gameHistoryService;

  @Value("${gamekube.game.storage.save-bucket}")
  private String saveBucket;

  public List<GameResponse> search() {
    return gameProvider.findAll().stream().map(gameMapper::toResponse).toList();
  }

  public GameResponse find(String gameId) {
    Game game = gameProvider.find(gameId);
    if (game == null) {
      throw new GameNotFoundException();
    }
    return gameMapper.toResponse(game);
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

    boolean claimed = false;
    GameInstance instance = gameInstanceProvider.instance(game);
    try {
      claimed = gameInstanceLifecycleProvider.provision(instance);
      if (!claimed) {
        throw new GameInstanceAlreadyActiveException();
      }

      GameInstanceResponse response =
          gameMapper.toResponse(
              gameInstanceProvider.provision(
                  game, () -> gameInstanceLifecycleProvider.renew(instance)));
      gameHistoryService.record(instance.getUsername(), gameId);
      presenceNotifier.changed(instance.getUsername());
      return response;
    } catch (RuntimeException exception) {
      if (claimed) {
        try {
          gameInstanceProvider.destroy(game, instance);
          gameInstanceLifecycleProvider.destroy(instance);
        } catch (RuntimeException cleanupException) {
          exception.addSuppressed(cleanupException);
        }
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
      gameInstanceLifecycleProvider.renew(instance);
      gameInstanceProvider.destroy(game, instance);
      gameInstanceLifecycleProvider.destroy(instance);
      presenceNotifier.changed(instance.getUsername());
    }
  }

  public StreamingResponseBody downloadSave(String gameId) {
    if (gameProvider.find(gameId) == null) {
      throw new GameNotFoundException();
    }

    User user =
        userRepository
            .findByKeycloakId(AuthenticationHelper.getKeycloakId())
            .orElseThrow(UserNotFoundException::new);

    String prefix = savePrefix(gameId, user);
    List<String> keys = storageService.listKeys(saveBucket, prefix);
    if (keys.isEmpty()) {
      throw new GameSaveNotFoundException();
    }

    return outputStream -> storageService.writePrefixAsZip(saveBucket, prefix, keys, outputStream);
  }

  public void deleteSave(String gameId) {
    if (gameProvider.find(gameId) == null) {
      throw new GameNotFoundException();
    }

    User user =
        userRepository
            .findByKeycloakId(AuthenticationHelper.getKeycloakId())
            .orElseThrow(UserNotFoundException::new);

    if (gameInstanceLifecycleProvider
        .findCurrentGameId(user.getUsername().toLowerCase(Locale.ROOT))
        .filter(gameId::equals)
        .isPresent()) {
      throw new GameInstanceActiveException();
    }

    String prefix = savePrefix(gameId, user);
    List<String> keys = storageService.listKeys(saveBucket, prefix);
    if (keys.isEmpty()) {
      throw new GameSaveNotFoundException();
    }

    storageService.deleteObjects(saveBucket, keys);
  }

  public void heartbeat(String gameId, String username) {
    gameInstanceLifecycleProvider.renew(
        GameInstance.builder().gameId(gameId).username(username).build());
  }

  private String savePrefix(String gameId, User user) {
    return gameId + "/" + user.getId() + "/";
  }
}
