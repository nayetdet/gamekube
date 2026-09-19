package io.github.nayetdet.gamekube.controller.docs;

import io.github.nayetdet.gamekube.payload.response.GameInstanceResponse;
import io.github.nayetdet.gamekube.payload.response.GameResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

@Tag(name = "Games", description = "Endpoints for managing games")
public interface GameControllerDocs {

  @Operation(
      summary = "List available games",
      responses =
          @ApiResponse(
              description = "Games",
              responseCode = "200",
              content =
                  @Content(
                      mediaType = "application/json",
                      schema = @Schema(implementation = GameResponse.class))))
  ResponseEntity<List<GameResponse>> findAll();

  @Operation(
      summary = "Deploy a game instance",
      responses = {
        @ApiResponse(
            description = "Created",
            responseCode = "201",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = GameInstanceResponse.class))),
        @ApiResponse(
            description = "Internal Server Error",
            responseCode = "500",
            content = @Content)
      })
  ResponseEntity<GameInstanceResponse> deploy(@PathVariable String gameId);

  @Operation(
      summary = "Get a game's image",
      security = @SecurityRequirement(name = "bearerAuth"),
      responses = {
        @ApiResponse(
            description = "Game image",
            responseCode = "200",
            content =
                @Content(
                    mediaType = MediaType.IMAGE_JPEG_VALUE,
                    schema = @Schema(type = "string", format = "binary"))),
        @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content),
        @ApiResponse(responseCode = "404", description = "Not Found", content = @Content)
      })
  ResponseEntity<byte[]> image(@PathVariable String gameId);
}
