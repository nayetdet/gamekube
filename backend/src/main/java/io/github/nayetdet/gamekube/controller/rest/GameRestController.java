package io.github.nayetdet.gamekube.controller.rest;

import io.github.nayetdet.gamekube.controller.rest.docs.GameRestControllerDocs;
import io.github.nayetdet.gamekube.payload.response.GameInstanceResponse;
import io.github.nayetdet.gamekube.payload.response.GameResponse;
import io.github.nayetdet.gamekube.security.annotation.PreAuthorizeUser;
import io.github.nayetdet.gamekube.service.GameService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Duration;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
public class GameRestController implements GameRestControllerDocs {

  private final GameService gameService;

  @Override
  @GetMapping
  public ResponseEntity<List<GameResponse>> search() {
    return ResponseEntity.ok(gameService.search());
  }

  @Override
  @PreAuthorizeUser
  @PostMapping("/{gameId}")
  public ResponseEntity<GameInstanceResponse> deploy(@PathVariable String gameId) {
    return ResponseEntity.status(HttpStatus.CREATED).body(gameService.deploy(gameId));
  }

  @Override
  @GetMapping(value = "/{gameId}/image", produces = MediaType.IMAGE_JPEG_VALUE)
  public ResponseEntity<byte[]> image(@PathVariable String gameId) {
    return ResponseEntity.ok()
        .contentType(MediaType.IMAGE_JPEG)
        .cacheControl(CacheControl.maxAge(Duration.ofDays(1)).cachePublic())
        .body(gameService.image(gameId));
  }
}
