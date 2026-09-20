package io.github.nayetdet.gamekube.game;

import com.fasterxml.jackson.dataformat.yaml.YAMLMapper;
import io.fabric8.kubernetes.api.model.HasMetadata;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.utils.Serialization;
import io.github.nayetdet.gamekube.cache.CacheRegistry;
import io.github.nayetdet.gamekube.exception.GameInvalidException;
import io.github.nayetdet.gamekube.exception.GameNotFoundException;
import io.github.nayetdet.gamekube.exception.GameUnreadableManifestException;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GameProvider {

  private static final String GAME_MANIFEST_PATTERN = "classpath*:games/*.{yaml,yml}";
  private static final Pattern GAME_ID_PATTERN = Pattern.compile("[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");

  private final KubernetesClient kubernetesClient;

  @Cacheable(cacheNames = CacheRegistry.GAME, unless = "#result == null")
  public Game find(String gameId) {
    return findAll().stream().filter(game -> game.getId().equals(gameId)).findFirst().orElse(null);
  }

  @Cacheable(cacheNames = CacheRegistry.GAME_COLLECTION)
  public List<Game> findAll() {
    return load();
  }

  @Cacheable(cacheNames = CacheRegistry.GAME_IMAGE, key = "#game.id", unless = "#result == null")
  public byte[] image(Game game) {
    String imagePath = game.getImage();
    if (imagePath == null || imagePath.isBlank()) {
      throw new GameNotFoundException();
    }

    String resourcePath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
    Resource resource = new ClassPathResource(resourcePath);
    if (!resource.exists()) {
      throw new GameNotFoundException();
    }

    try {
      return resource.getContentAsByteArray();
    } catch (IOException exception) {
      throw new GameNotFoundException();
    }
  }

  private List<Game> load() {
    try {
      Resource[] manifests =
          new PathMatchingResourcePatternResolver().getResources(GAME_MANIFEST_PATTERN);

      List<Resource> sortedManifests =
          Arrays.stream(manifests)
              .sorted(
                  Comparator.comparing(
                      resource -> resource.getFilename() == null ? "" : resource.getFilename()))
              .toList();

      List<Game> games = new ArrayList<>();
      Set<String> gameIds = new HashSet<>();
      for (Resource resource : sortedManifests) {
        Game game = load(resource);
        if (!gameIds.add(game.getId())) {
          throw new GameInvalidException();
        }

        games.add(game);
      }

      if (games.isEmpty()) {
        throw new GameInvalidException();
      }

      return List.copyOf(games);
    } catch (IOException exception) {
      throw new GameUnreadableManifestException(exception);
    }
  }

  private Game load(Resource resource) {
    String gameId = extractGameId(resource);
    try (InputStream inputStream = resource.getInputStream()) {
      Game game = new YAMLMapper().readValue(inputStream, Game.class);
      game.setId(gameId);
      validate(game);
      return game;
    } catch (IOException exception) {
      throw new GameUnreadableManifestException(exception);
    } catch (GameInvalidException exception) {
      throw exception;
    } catch (RuntimeException exception) {
      throw new GameInvalidException(exception);
    }
  }

  private String extractGameId(Resource resource) {
    String filename = resource.getFilename();
    if (filename == null || !(filename.endsWith(".yaml") || filename.endsWith(".yml"))) {
      throw new GameInvalidException();
    }

    String gameId = filename.substring(0, filename.lastIndexOf('.'));
    if (!GAME_ID_PATTERN.matcher(gameId).matches()) {
      throw new GameInvalidException();
    }

    return gameId;
  }

  private void validate(Game game) {
    if (game.getName() == null || game.getName().isBlank()) {
      throw new GameInvalidException();
    }

    if (game.getDescription() == null || game.getDescription().isBlank()) {
      throw new GameInvalidException();
    }

    if (game.getResources() == null || game.getResources().isEmpty()) {
      throw new GameInvalidException();
    }

    List<HasMetadata> resources =
        game.getResources().stream()
            .map(Serialization::asYaml)
            .flatMap(
                manifest ->
                    kubernetesClient
                        .load(new ByteArrayInputStream(manifest.getBytes(StandardCharsets.UTF_8)))
                        .items()
                        .stream())
            .toList();

    if (resources.isEmpty()) {
      throw new GameInvalidException();
    }
  }
}
