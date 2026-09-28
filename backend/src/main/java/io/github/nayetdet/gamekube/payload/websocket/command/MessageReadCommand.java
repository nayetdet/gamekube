package io.github.nayetdet.gamekube.payload.websocket.command;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MessageReadCommand {

  @Schema(
      description = "Username of the conversation participant whose messages were read.",
      example = "alice",
      requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank
  private String senderUsername;
}
