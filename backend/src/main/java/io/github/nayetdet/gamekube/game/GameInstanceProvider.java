package io.github.nayetdet.gamekube.game;

import io.fabric8.kubernetes.api.model.HasMetadata;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.FieldValidateable;
import io.fabric8.kubernetes.client.utils.Serialization;
import io.github.nayetdet.gamekube.exception.GameInstanceDestroyException;
import io.github.nayetdet.gamekube.exception.GameInstanceProvisionException;
import io.github.nayetdet.gamekube.exception.GameInvalidException;
import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.repository.UserRepository;
import io.github.nayetdet.gamekube.security.AuthenticationHelper;
import java.io.ByteArrayInputStream;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GameInstanceProvider {

  private final KubernetesClient kubernetesClient;
  private final UserRepository userRepository;

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

  @Value("${gamekube.game.infra.shutdown-timeout}")
  private Duration shutdownTimeout;

  @Value("${gamekube.game.storage.save-bucket}")
  private String saveBucket;

  @Value("${gamekube.game.auth.oidc-issuer-url}")
  private String issuerUrl;

  @Value("${gamekube.game.auth.oidc-internal-issuer-url}")
  private String internalIssuerUrl;

  @Value("${gamekube.game.auth.cookie-secret}")
  private String cookieSecret;

  @Value("${gamekube.game.auth.client-id}")
  private String clientId;

  @Value("${gamekube.game.auth.client-secret}")
  private String clientSecret;

  public GameInstance provision(Game game, Runnable keepAlive) {
    GameInstance instance = instance(game);
    List<HasMetadata> resources = load(game, instance, true);
    validate(resources);

    try {
      if (!waitForPods(
          instance,
          resources.stream()
              .map(HasMetadata::getMetadata)
              .map(metadata -> metadata.getLabels())
              .filter(Objects::nonNull)
              .map(labels -> labels.get("user"))
              .filter(Objects::nonNull)
              .findFirst()
              .orElse(null),
          keepAlive)) {
        throw new GameInstanceProvisionException(
            new TimeoutException("Timed out waiting for game Pods to terminate"));
      }
    } catch (GameInstanceProvisionException exception) {
      throw exception;
    } catch (InterruptedException exception) {
      Thread.currentThread().interrupt();
      throw new GameInstanceProvisionException(exception);
    } catch (RuntimeException exception) {
      throw new GameInstanceProvisionException(exception);
    }

    apply(resources);
    waitForDeployment(instance, keepAlive);
    return instance;
  }

  public void destroy(Game game) {
    destroy(game, instance(game));
  }

  public void destroy(Game game, GameInstance instance) {
    List<HasMetadata> resources = load(game, instance, false);

    boolean previousPodsTerminated;
    try {
      for (HasMetadata resource : resources.reversed()) {
        if ("PersistentVolumeClaim".equals(resource.getKind())) {
          continue;
        }

        kubernetesClient.resource(resource).inNamespace(namespace).delete();
      }

      previousPodsTerminated = waitForPods(instance, null, null);
    } catch (InterruptedException exception) {
      Thread.currentThread().interrupt();
      throw new GameInstanceDestroyException(exception);
    } catch (RuntimeException exception) {
      throw new GameInstanceDestroyException(exception);
    }

    if (!previousPodsTerminated) {
      throw new GameInstanceDestroyException(
          new TimeoutException("Timed out waiting for game Pods to terminate"));
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

  private List<HasMetadata> load(
      Game game, GameInstance gameInstance, boolean requireExistingUser) {
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
                            .replace("${GAME_SAVE_BUCKET}", saveBucket)
                            .replace("${GAME_TLS_SECRET}", tlsSecret)
                            .replace(
                                "${GAME_USER_ID}",
                                userRepository
                                    .findByUsernameIgnoreCase(gameInstance.getUsername())
                                    .map(user -> user.getId().toString())
                                    .or(
                                        () ->
                                            requireExistingUser
                                                ? Optional.empty()
                                                : Optional.of(""))
                                    .orElseThrow(UserNotFoundException::new))
                            .replace("${GAME_USERNAME}", gameInstance.getUsername())
                            .replace("${GAME_KEYCLOAK_ISSUER_URL}", issuerUrl)
                            .replace("${GAME_KEYCLOAK_INTERNAL_ISSUER_URL}", internalIssuerUrl)
                            .replace("${GAME_KEYCLOAK_COOKIE_SECRET}", encodeSecret(cookieSecret))
                            .replace("${GAME_KEYCLOAK_CLIENT_ID}", clientId)
                            .replace("${GAME_KEYCLOAK_CLIENT_SECRET}", encodeSecret(clientSecret));

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
    } catch (UserNotFoundException exception) {
      throw exception;
    } catch (GameInvalidException exception) {
      throw exception;
    } catch (RuntimeException exception) {
      throw new GameInvalidException(exception);
    }
  }

  private String encodeSecret(String value) {
    return Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
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

  private void waitForDeployment(GameInstance gameInstance, Runnable keepAlive) {
    long deadline = System.nanoTime() + readinessTimeout.toNanos();
    long nextKeepAlive = System.nanoTime();
    while (System.nanoTime() < deadline) {
      var deployment =
          kubernetesClient
              .apps()
              .deployments()
              .inNamespace(namespace)
              .withName(gameInstance.getName())
              .get();

      if (deployment != null
          && deployment.getSpec() != null
          && deployment.getStatus() != null
          && deployment.getStatus().getReadyReplicas() != null
          && deployment.getStatus().getReadyReplicas()
              >= Objects.requireNonNullElse(deployment.getSpec().getReplicas(), 1)) {
        return;
      }

      if (System.nanoTime() >= nextKeepAlive) {
        keepAlive.run();
        nextKeepAlive = System.nanoTime() + Duration.ofSeconds(20).toNanos();
      }

      try {
        TimeUnit.SECONDS.sleep(1);
      } catch (InterruptedException exception) {
        Thread.currentThread().interrupt();
        throw new GameInstanceProvisionException(exception);
      }
    }

    throw new GameInstanceProvisionException(
        new TimeoutException("Timed out waiting for game Deployment to become ready"));
  }

  private boolean waitForPods(GameInstance gameInstance, String userId, Runnable keepAlive)
      throws InterruptedException {
    long deadline = System.nanoTime() + shutdownTimeout.toNanos();
    while (true) {
      if (kubernetesClient
          .pods()
          .inNamespace(namespace)
          .withLabel("game", gameInstance.getGameId())
          .list()
          .getItems()
          .stream()
          .noneMatch(
              pod -> {
                Map<String, String> labels = pod.getMetadata().getLabels();
                return labels != null
                    && (gameInstance.getName().equals(labels.get("app"))
                        || (userId != null && userId.equals(labels.get("user"))));
              })) {
        return true;
      }

      if (System.nanoTime() >= deadline) {
        return false;
      }

      if (keepAlive != null) {
        keepAlive.run();
      }

      TimeUnit.SECONDS.sleep(10);
    }
  }
}
