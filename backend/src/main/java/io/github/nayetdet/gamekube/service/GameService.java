package io.github.nayetdet.gamekube.service;

import io.fabric8.kubernetes.api.model.IntOrString;
import io.fabric8.kubernetes.api.model.Service;
import io.fabric8.kubernetes.api.model.ServiceBuilder;
import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.fabric8.kubernetes.api.model.apps.DeploymentBuilder;
import io.fabric8.kubernetes.api.model.networking.v1.Ingress;
import io.fabric8.kubernetes.api.model.networking.v1.IngressBuilder;
import io.fabric8.kubernetes.api.model.networking.v1.IngressSpecBuilder;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.github.nayetdet.gamekube.mapper.GameMapper;
import io.github.nayetdet.gamekube.payload.response.GameResponse;
import java.net.URI;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class GameService {

  private final KubernetesClient kubernetesClient;
  private final GameMapper gameMapper;

  @Value("${game.namespace}")
  private String namespace;

  @Value("${game.domain}")
  private String domain;

  @Value("${game.tls-secret:}")
  private String tlsSecret;

  @Value("${game.readiness-timeout-seconds}")
  private long timeout;

  @Value("${game.protocol}")
  private String protocol;

  public GameResponse createCaveStoryGame() {
    String name = "cavestory-" + UUID.randomUUID().toString().substring(0, 8);
    String host = name + "." + domain;

    kubernetesClient
        .apps()
        .deployments()
        .inNamespace(namespace)
        .resource(getDeployment(name))
        .create();

    kubernetesClient.services().inNamespace(namespace).resource(getService(name)).create();
    kubernetesClient
        .network()
        .v1()
        .ingresses()
        .inNamespace(namespace)
        .resource(getIngress(name, host))
        .create();

    kubernetesClient
        .apps()
        .deployments()
        .inNamespace(namespace)
        .withName(name)
        .waitUntilReady(timeout, TimeUnit.SECONDS);

    return gameMapper.toResponse(URI.create(protocol + "://" + host + "/"));
  }

  private Deployment getDeployment(String name) {
    return new DeploymentBuilder()
        .withNewMetadata()
        .withName(name)
        .addToLabels("app", name)
        .endMetadata()
        .withNewSpec()
        .withReplicas(1)
        .withNewSelector()
        .addToMatchLabels("app", name)
        .endSelector()
        .withNewTemplate()
        .withNewMetadata()
        .addToLabels("app", name)
        .endMetadata()
        .withNewSpec()
        .addNewContainer()
        .withName("cavestory")
        .withImage("ghcr.io/nayetdet/cavestory-nx-docker:latest")
        .addNewPort()
        .withName("http")
        .withContainerPort(3000)
        .endPort()
        .endContainer()
        .endSpec()
        .endTemplate()
        .endSpec()
        .build();
  }

  private Service getService(String name) {
    return new ServiceBuilder()
        .withNewMetadata()
        .withName(name)
        .endMetadata()
        .withNewSpec()
        .addToSelector("app", name)
        .addNewPort()
        .withName("http")
        .withPort(3000)
        .withTargetPort(new IntOrString("http"))
        .endPort()
        .endSpec()
        .build();
  }

  private Ingress getIngress(String name, String host) {
    IngressSpecBuilder specBuilder = new IngressSpecBuilder().withIngressClassName("traefik");

    if (tlsSecret != null && !tlsSecret.isBlank()) {
      specBuilder.addNewTl().addToHosts(host).withSecretName(tlsSecret).endTl();
    }

    return new IngressBuilder()
        .withNewMetadata()
        .withName(name)
        .endMetadata()
        .withSpec(
            specBuilder
                .addNewRule()
                .withHost(host)
                .withNewHttp()
                .addNewPath()
                .withPath("/")
                .withPathType("Prefix")
                .withNewBackend()
                .withNewService()
                .withName(name)
                .withNewPort()
                .withName("http")
                .endPort()
                .endService()
                .endBackend()
                .endPath()
                .endHttp()
                .endRule()
                .build())
        .build();
  }
}
