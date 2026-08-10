package io.github.nayetdet.gamekube.controller.docs;

import org.springframework.http.ResponseEntity;

import io.fabric8.kubernetes.api.model.apps.Deployment;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

public interface GameControllerDocs {

    @Operation(
        summary = "Create a Cave Story game instance",
        responses = {
            @ApiResponse(
                description = "Created",
                responseCode = "201",
                content = @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = Deployment.class)
                )
            ),
            @ApiResponse(description = "Internal Server Error", responseCode = "500", content = @Content)
        }
    )
    ResponseEntity<Deployment> createCaveStory();

}
