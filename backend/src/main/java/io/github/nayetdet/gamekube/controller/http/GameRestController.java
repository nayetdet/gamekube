package io.github.nayetdet.gamekube.controller.http;

import io.github.nayetdet.gamekube.controller.http.docs.GameRestControllerDocs;
import io.github.nayetdet.gamekube.payload.http.response.GameInstanceResponse;
import io.github.nayetdet.gamekube.payload.http.response.GameResponse;
import io.github.nayetdet.gamekube.security.annotation.PreAuthorizeUser;
import io.github.nayetdet.gamekube.service.GameHistoryService;
import io.github.nayetdet.gamekube.service.GameService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Duration;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@RestController
@RequestMapping("/v1/games")
@RequiredArgsConstructor
@Tag(name = "Games", description = "Game catalog and the authenticated user's game instance")
public class GameRestController implements GameRestControllerDocs {

  private final GameService gameService;
  private final GameHistoryService gameHistoryService;

  @PreAuthorizeUser
  @GetMapping("/{gameId}/friends")
  public List<String> friendsWhoPlayed(@PathVariable String gameId) {
    return gameHistoryService.friendsForGame(gameId);
  }

  @Override
  @GetMapping
  public ResponseEntity<List<GameResponse>> search() {
    return ResponseEntity.ok(gameService.search());
  }

  @Override
  @GetMapping("/{gameId}")
  public ResponseEntity<GameResponse> find(@PathVariable String gameId) {
    return ResponseEntity.ok(gameService.find(gameId));
  }

  @Override
  @GetMapping(value = "/{gameId}/image", produces = MediaType.IMAGE_JPEG_VALUE)
  public ResponseEntity<byte[]> image(@PathVariable String gameId) {
    return ResponseEntity.ok()
        .contentType(MediaType.IMAGE_JPEG)
        .cacheControl(CacheControl.maxAge(Duration.ofDays(1)).cachePublic())
        .body(gameService.image(gameId));
  }

  @Override
  @PreAuthorizeUser
  @PostMapping("/{gameId}/instance")
  public ResponseEntity<GameInstanceResponse> provision(@PathVariable String gameId) {
    return ResponseEntity.status(HttpStatus.CREATED).body(gameService.provision(gameId));
  }

  @Override
  @PreAuthorizeUser
  @DeleteMapping("/{gameId}/instance")
  public ResponseEntity<Void> destroy(@PathVariable String gameId) {
    gameService.destroy(gameId);
    return ResponseEntity.noContent().build();
  }

  @Override
  @PreAuthorizeUser
  @GetMapping(value = "/{gameId}/save", produces = "application/zip")
  public ResponseEntity<StreamingResponseBody> downloadSave(@PathVariable String gameId) {
    StreamingResponseBody body = gameService.downloadSave(gameId);
    HttpHeaders headers = new HttpHeaders();
    headers.setContentDisposition(
        ContentDisposition.attachment().filename(gameId + "-save.zip").build());
    return ResponseEntity.ok()
        .headers(headers)
        .contentType(MediaType.parseMediaType("application/zip"))
        .body(body);
  }

  @Override
  @PreAuthorizeUser
  @DeleteMapping("/{gameId}/save")
  public ResponseEntity<Void> deleteSave(@PathVariable String gameId) {
    gameService.deleteSave(gameId);
    return ResponseEntity.noContent().build();
  }
}
