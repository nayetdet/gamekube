package io.github.nayetdet.gamekube.service;

import org.springframework.stereotype.Service;

import io.fabric8.kubernetes.client.KubernetesClient;

@Service
public class GameService {

    private final KubernetesClient kubernetesClient;

    public GameService(KubernetesClient kubernetesClient) {
        this.kubernetesClient = kubernetesClient;
    }

    public String createGame() {
        return "";
    }

}
