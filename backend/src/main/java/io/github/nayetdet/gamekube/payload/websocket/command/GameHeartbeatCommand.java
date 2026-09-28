package io.github.nayetdet.gamekube.payload.websocket.command;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GameHeartbeatCommand {

  @Schema(
      description = "Identifier of the game instance whose activity lease should be renewed.",
      example = "sonic-triple-trouble-7f8d9",
      requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank
  private String gameId;
}
