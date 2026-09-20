package io.github.nayetdet.gamekube.controller.rest.docs;

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

@Tag(name = "Games", description = "Game catalog and the authenticated user's game instance")
public interface GameRestControllerDocs {

  @Operation(
      summary = "List the available games",
      responses =
          @ApiResponse(
              description = "Games",
              responseCode = "200",
              content =
                  @Content(
                      mediaType = "application/json",
                      schema = @Schema(implementation = GameResponse.class))))
  ResponseEntity<List<GameResponse>> search();

  @Operation(
      summary = "Create the authenticated user's instance for a game",
      security = @SecurityRequirement(name = "bearerAuth"),
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
            responseCode = "502",
            content = @Content)
      })
  ResponseEntity<GameInstanceResponse> provision(@PathVariable String gameId);

  @Operation(
      summary = "Delete the authenticated user's instance for a game",
      security = @SecurityRequirement(name = "bearerAuth"),
      responses = {
        @ApiResponse(description = "Destroyed", responseCode = "204", content = @Content),
        @ApiResponse(
            description = "Internal Server Error",
            responseCode = "502",
            content = @Content)
      })
  ResponseEntity<Void> destroy(@PathVariable String gameId);

  @Operation(
      summary = "Get a game's cover image",
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
