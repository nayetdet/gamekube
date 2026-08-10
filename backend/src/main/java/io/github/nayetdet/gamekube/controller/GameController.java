package io.github.nayetdet.gamekube.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.github.nayetdet.gamekube.service.GameService;

@RestController
@RequestMapping("/v1/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/cavestory")
    public ResponseEntity<Deployment> createCaveStory() {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(gameService.createCaveStoryDeployment());
    }
}
