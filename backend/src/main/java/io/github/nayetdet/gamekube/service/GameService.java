package io.github.nayetdet.gamekube.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.fabric8.kubernetes.api.model.apps.DeploymentBuilder;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.github.nayetdet.gamekube.payload.response.GameResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GameService {
    
    private final KubernetesClient kubernetesClient;

    @Value("${game.url}")
    private String gameUrl;

    public GameResponse createCaveStoryDeployment() {
        Deployment deployment = new DeploymentBuilder()
                .withNewMetadata()
                    .withName("cavestory")
                    .addToLabels("app", "cavestory")
                .endMetadata()
                .withNewSpec()
                    .withReplicas(1)
                    .withNewSelector()
                        .addToMatchLabels("app", "cavestory")
                    .endSelector()
                    .withNewTemplate()
                        .withNewMetadata()
                            .addToLabels("app", "cavestory")
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

        kubernetesClient.apps()
                .deployments()
                .inNamespace("gamekube")
                .resource(deployment)
                .create();

        return new GameResponse(gameUrl);
    }

}
