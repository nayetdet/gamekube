package io.github.nayetdet.gamekube.controller;

import io.github.nayetdet.gamekube.controller.docs.GameControllerDocs;
import io.github.nayetdet.gamekube.payload.response.GameInstanceResponse;
import io.github.nayetdet.gamekube.payload.response.GameResponse;
import io.github.nayetdet.gamekube.service.GameService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/games")
@RequiredArgsConstructor
@Tag(name = "Games", description = "Endpoints for managing games")
public class GameController implements GameControllerDocs {

  private final GameService gameService;

  @Override
  @GetMapping
  public ResponseEntity<List<GameResponse>> findAll() {
    return ResponseEntity.ok(gameService.findAll());
  }

  @PostMapping("/{gameId}")
  public ResponseEntity<GameInstanceResponse> deploy(@PathVariable("gameId") String gameId) {
    return ResponseEntity.status(HttpStatus.CREATED).body(gameService.deploy(gameId));
  }
}
