package io.github.nayetdet.gamekube.config;

import io.fabric8.kubernetes.api.model.HasMetadata;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.github.nayetdet.gamekube.exception.GameInvalidException;
import io.github.nayetdet.gamekube.exception.GameUnreadableManifestException;
import java.io.IOException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

@Configuration
public class GameSpecsConfig {

  private static final String GAME_MANIFEST_PATTERN = "classpath*:games/*.{yaml,yml}";
  private static final Pattern GAME_ID_PATTERN = Pattern.compile("[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");

  @Bean(name = "gameSpecs")
  public Map<String, List<HasMetadata>> gameSpecs(KubernetesClient kubernetesClient) {
    try {
      PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
      List<Resource> manifests = Arrays.asList(resolver.getResources(GAME_MANIFEST_PATTERN));
      manifests.sort(
          Comparator.comparing(
              resource -> resource.getFilename() == null ? "" : resource.getFilename()));

      Map<String, List<HasMetadata>> games = new LinkedHashMap<>();
      for (Resource resource : manifests) {
        String filename = resource.getFilename();
        if (filename == null || !(filename.endsWith(".yaml") || filename.endsWith(".yml"))) {
          throw new GameInvalidException("Game manifest filename is invalid");
        }

        String id = filename.substring(0, filename.lastIndexOf('.'));
        if (!GAME_ID_PATTERN.matcher(id).matches()) {
          throw new GameInvalidException("Game ID is invalid");
        }

        if (games.containsKey(id)) {
          throw new GameInvalidException("Game ID is duplicated");
        }

        try (var inputStream = resource.getInputStream()) {
          List<HasMetadata> resources = kubernetesClient.load(inputStream).items();
          if (resources.isEmpty()) {
            throw new GameInvalidException("Game manifest is empty");
          }
          games.put(id, resources);
        } catch (IOException exception) {
          throw new GameUnreadableManifestException(exception);
        } catch (GameInvalidException exception) {
          throw exception;
        } catch (RuntimeException exception) {
          throw new GameInvalidException("Game manifest could not be parsed", exception);
        }
      }

      if (games.isEmpty()) {
        throw new GameInvalidException("No games are configured");
      }

      return Map.copyOf(games);
    } catch (IOException exception) {
      throw new GameUnreadableManifestException(exception);
    }
  }
}
