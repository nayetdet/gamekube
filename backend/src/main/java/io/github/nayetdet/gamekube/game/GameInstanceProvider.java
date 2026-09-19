package io.github.nayetdet.gamekube.game;

import io.fabric8.kubernetes.api.model.HasMetadata;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.FieldValidateable;
import io.fabric8.kubernetes.client.utils.Serialization;
import io.github.nayetdet.gamekube.exception.GameDeploymentException;
import io.github.nayetdet.gamekube.exception.GameInvalidException;
import java.io.ByteArrayInputStream;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GameInstanceProvider {

  private final KubernetesClient kubernetesClient;

  @Value("${game.namespace}")
  private String namespace;

  @Value("${game.domain}")
  private String domain;

  @Value("${game.tls-secret:}")
  private String tlsSecret;

  @Value("${game.protocol}")
  private String protocol;

  public URI deploy(GameSpec spec) {
    String instanceName = spec.getId() + "-" + UUID.randomUUID().toString().substring(0, 8);
    String host = instanceName + "." + domain;
    GameInstance instance =
        GameInstance.builder()
            .name(instanceName)
            .host(host)
            .url(URI.create(protocol + "://" + host + "/"))
            .build();

    List<HasMetadata> resources = load(spec, instance);
    validate(resources);
    apply(resources);
    return instance.getUrl();
  }

  private List<HasMetadata> load(GameSpec spec, GameInstance instance) {
    try {
      List<HasMetadata> resources =
          spec.getResources().stream()
              .map(Serialization::asYaml)
              .map(
                  manifest -> {
                    String resolvedManifest =
                        manifest
                            .replace("${GAME_ID}", spec.getId())
                            .replace("${GAME_NAME}", instance.getName())
                            .replace("${GAME_HOST}", instance.getHost())
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
      throw new GameDeploymentException(exception);
    }
  }
}
