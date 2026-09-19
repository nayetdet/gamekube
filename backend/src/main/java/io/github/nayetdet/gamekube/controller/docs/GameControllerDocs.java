package io.github.nayetdet.gamekube.controller.docs;

import io.github.nayetdet.gamekube.payload.response.GameResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "Games", description = "Endpoints for managing games")
public interface GameControllerDocs {

  @Operation(
      summary = "Create a game instance",
      responses = {
        @ApiResponse(
            description = "Created",
            responseCode = "201",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = GameResponse.class))),
        @ApiResponse(
            description = "Internal Server Error",
            responseCode = "500",
            content = @Content)
      })
  ResponseEntity<GameResponse> start(@PathVariable("gameId") String gameId);
}
