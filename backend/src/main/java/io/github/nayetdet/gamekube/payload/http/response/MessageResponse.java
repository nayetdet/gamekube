package io.github.nayetdet.gamekube.payload.http.response;

import io.github.nayetdet.gamekube.enums.MessageStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.util.UUID;
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
public class MessageResponse {

  @Schema(description = "Unique identifier of the persisted message.", format = "uuid")
  private UUID id;

  @Schema(description = "Username of the authenticated user who sent the message.", example = "bob")
  private String senderUsername;

  @Schema(description = "Username of the message recipient.", example = "alice")
  private String recipientUsername;

  @Schema(description = "Message body.", example = "Hey, want to play a match?")
  private String content;

  @Schema(description = "Current delivery/read state of the message.", example = "SENT")
  private MessageStatus status;

  @Schema(description = "UTC timestamp at which the message was created.", format = "date-time")
  private LocalDateTime createdAt;

  @Schema(
      description = "UTC timestamp at which the recipient read the message; null until read.",
      format = "date-time",
      nullable = true)
  private LocalDateTime readAt;
}
