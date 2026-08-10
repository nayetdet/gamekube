package io.github.nayetdet.gamekube.service;

import org.springframework.stereotype.Service;

import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.fabric8.kubernetes.api.model.apps.DeploymentBuilder;
import io.fabric8.kubernetes.client.KubernetesClient;

@Service
public class GameService {

    private final KubernetesClient kubernetesClient;

    public GameService(KubernetesClient kubernetesClient) {
        this.kubernetesClient = kubernetesClient;
    }

    public Deployment createCaveStoryDeployment() {
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

        return kubernetesClient.apps()
                .deployments()
                .inNamespace("gamekube")
                .resource(deployment)
                .create();
    }

}
