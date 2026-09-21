package io.github.nayetdet.gamekube.payload.websocket.command;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageSendCommand {

  @Schema(description = "Username of the friend who should receive the message.", example = "alice")
  @Size(min = 3, max = 50)
  private String recipientUsername;

  @Schema(
      description = "Message body. It must contain at least one non-whitespace character.",
      example = "Hey, want to play a match?",
      maxLength = 2000,
      requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank
  @Size(max = 2000)
  private String content;
}
