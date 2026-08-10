package io.github.nayetdet.gamekube.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.nayetdet.gamekube.controller.docs.GameControllerDocs;
import io.github.nayetdet.gamekube.payload.response.GameResponse;
import io.github.nayetdet.gamekube.service.GameService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/v1/games")
@RequiredArgsConstructor
@Tag(name = "Games", description = "Endpoints for managing games")
public class GameController implements GameControllerDocs {

    private final GameService gameService;

    @Override
    @PostMapping("/cavestory")
    public ResponseEntity<GameResponse> createCaveStoryGame() {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(gameService.createCaveStoryGame());
    }

}
