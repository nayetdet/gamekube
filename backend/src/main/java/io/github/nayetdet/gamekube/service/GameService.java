package io.github.nayetdet.gamekube.service;

import io.fabric8.kubernetes.api.model.HasMetadata;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.FieldValidateable;
import io.fabric8.kubernetes.client.utils.Serialization;
import io.github.nayetdet.gamekube.exception.GameDeploymentException;
import io.github.nayetdet.gamekube.exception.GameInvalidException;
import io.github.nayetdet.gamekube.exception.GameNotFoundException;
import io.github.nayetdet.gamekube.game.GameSpec;
import io.github.nayetdet.gamekube.game.GameSpecProvider;
import io.github.nayetdet.gamekube.mapper.GameMapper;
import io.github.nayetdet.gamekube.payload.response.GameResponse;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GameService {

  private final KubernetesClient kubernetesClient;
  private final GameMapper gameMapper;
  private final GameSpecProvider gameSpecProvider;

  @Value("${game.namespace}")
  private String namespace;

  @Value("${game.domain}")
  private String domain;

  @Value("${game.tls-secret:}")
  private String tlsSecret;

  @Value("${game.protocol}")
  private String protocol;

  public GameResponse startGame(String gameId) {
    GameSpec game = gameSpecProvider.find(gameId);
    if (game == null) {
      throw new GameNotFoundException();
    }

    String instance = gameId + "-" + UUID.randomUUID().toString().substring(0, 8);
    String host = instance + "." + domain;
    List<HasMetadata> resources;

    try {
      resources =
          game.getSpecs().stream()
              .map(Serialization::asYaml)
              .map(
                  manifest ->
                      manifest
                          .replace("${GAME_ID}", gameId)
                          .replace("${GAME_NAME}", instance)
                          .replace("${GAME_HOST}", host)
                          .replace("${GAME_NAMESPACE}", namespace)
                          .replace("${GAME_TLS_SECRET}", tlsSecret))
              .peek(
                  manifest -> {
                    if (manifest.contains("${")) {
                      throw new GameInvalidException();
                    }
                  })
              .flatMap(
                  manifest ->
                      kubernetesClient
                          .load(
                              new java.io.ByteArrayInputStream(
                                  manifest.getBytes(StandardCharsets.UTF_8)))
                          .items()
                          .stream())
              .toList();
    } catch (RuntimeException exception) {
      throw new GameInvalidException(exception);
    }

    if (resources.isEmpty()) {
      throw new GameInvalidException();
    }

    for (HasMetadata resource : resources) {
      if (resource.getApiVersion() == null
          || resource.getApiVersion().isBlank()
          || resource.getKind() == null
          || resource.getKind().isBlank()
          || resource.getMetadata() == null
          || resource.getMetadata().getName() == null
          || resource.getMetadata().getName().isBlank()
          || !namespace.equals(resource.getMetadata().getNamespace())) {
        throw new GameInvalidException();
      }
    }

    try {
      for (HasMetadata resource : resources) {
        kubernetesClient
            .resource(resource)
            .inNamespace(namespace)
            .dryRun()
            .fieldValidation(FieldValidateable.Validation.STRICT)
            .fieldManager("gamekube")
            .serverSideApply();
      }
    } catch (RuntimeException exception) {
      throw new GameInvalidException(exception);
    }

    try {
      for (HasMetadata resource : resources) {
        kubernetesClient
            .resource(resource)
            .inNamespace(namespace)
            .fieldManager("gamekube")
            .serverSideApply();
      }
    } catch (RuntimeException exception) {
      throw new GameDeploymentException(exception);
    }

    return gameMapper.toResponse(game, URI.create(protocol + "://" + host + "/"));
  }
}
