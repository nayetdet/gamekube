package io.github.nayetdet.gamekube.payload.websocket.event;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
@Schema(description = "Notification emitted after messages are marked as read.")
public class MessagesReadEvent {

  @Schema(description = "Username of the user who read the messages.", example = "alice")
  String readerUsername;

  @Schema(
      description = "UTC timestamp at which the messages were marked as read.",
      example = "2026-09-21T14:30:00",
      format = "date-time")
  String readAt;

  @Schema(description = "Number of messages whose status changed to READ.", example = "3")
  int count;
}
