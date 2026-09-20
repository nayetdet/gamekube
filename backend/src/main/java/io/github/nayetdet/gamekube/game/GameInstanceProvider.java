package io.github.nayetdet.gamekube.game;

import io.fabric8.kubernetes.api.model.HasMetadata;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.FieldValidateable;
import io.fabric8.kubernetes.client.utils.Serialization;
import io.github.nayetdet.gamekube.exception.GameInstanceDestroyException;
import io.github.nayetdet.gamekube.exception.GameInstanceProvisionException;
import io.github.nayetdet.gamekube.exception.GameInvalidException;
import io.github.nayetdet.gamekube.security.AuthenticationHelper;
import java.io.ByteArrayInputStream;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GameInstanceProvider {

  private final KubernetesClient kubernetesClient;

  @Value("${gamekube.game.infra.namespace}")
  private String namespace;

  @Value("${gamekube.game.infra.domain}")
  private String domain;

  @Value("${gamekube.game.infra.tls-secret}")
  private String tlsSecret;

  @Value("${gamekube.game.infra.protocol}")
  private String protocol;

  @Value("${gamekube.game.infra.readiness-timeout}")
  private Duration readinessTimeout;

  public GameInstance provision(Game game) {
    GameInstance instance = instance(game);
    List<HasMetadata> resources = load(game, instance);
    validate(resources);
    apply(resources);
    wait(instance);
    return instance;
  }

  public void destroy(Game game) {
    destroy(game, instance(game));
  }

  public void destroy(Game game, GameInstance instance) {
    List<HasMetadata> resources = load(game, instance);

    try {
      for (HasMetadata resource : resources.reversed()) {
        kubernetesClient.resource(resource).inNamespace(namespace).delete();
      }
    } catch (RuntimeException exception) {
      throw new GameInstanceDestroyException(exception);
    }
  }

  public GameInstance instance(Game game) {
    String username = AuthenticationHelper.getUsername().toLowerCase(Locale.ROOT);
    String name = game.getId() + "-" + username;
    String host = username + "." + game.getId() + "." + domain;
    return GameInstance.builder()
        .gameId(game.getId())
        .username(username)
        .name(name)
        .host(host)
        .url(URI.create(protocol + "://" + host + "/"))
        .build();
  }

  private List<HasMetadata> load(Game game, GameInstance gameInstance) {
    try {
      List<HasMetadata> resources =
          game.getResources().stream()
              .map(Serialization::asYaml)
              .map(
                  manifest -> {
                    String resolvedManifest =
                        manifest
                            .replace("${GAME_ID}", game.getId())
                            .replace("${GAME_NAME}", gameInstance.getName())
                            .replace("${GAME_HOST}", gameInstance.getHost())
                            .replace("${GAME_NAMESPACE}", namespace)
                            .replace("${GAME_TLS_SECRET}", tlsSecret);

                    if (resolvedManifest.contains("${")) {
                      throw new GameInvalidException();
                    }

                    return resolvedManifest;
                  })
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
      return resources;
    } catch (GameInvalidException exception) {
      throw exception;
    } catch (RuntimeException exception) {
      throw new GameInvalidException(exception);
    }
  }

  private void validate(List<HasMetadata> resources) {
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
  }

  private void apply(List<HasMetadata> resources) {
    try {
      for (HasMetadata resource : resources) {
        kubernetesClient
            .resource(resource)
            .inNamespace(namespace)
            .fieldManager("gamekube")
            .serverSideApply();
      }
    } catch (RuntimeException exception) {
      throw new GameInstanceProvisionException(exception);
    }
  }

  private void wait(GameInstance gameInstance) {
    try {
      kubernetesClient
          .apps()
          .deployments()
          .inNamespace(namespace)
          .withName(gameInstance.getName())
          .waitUntilReady(readinessTimeout.toSeconds(), TimeUnit.SECONDS);
    } catch (RuntimeException exception) {
      throw new GameInstanceProvisionException(exception);
    }
  }
}
