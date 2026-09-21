package io.github.nayetdet.gamekube.payload.websocket.event;

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
@Schema(description = "Message delivered through a user's private WebSocket queue.")
public class MessageEvent {

  private UUID id;
  private String senderUsername;
  private String recipientUsername;
  private String content;
  private MessageStatus status;
  private LocalDateTime createdAt;
  private LocalDateTime readAt;

  public static MessageEvent from(
      UUID id,
      String senderUsername,
      String recipientUsername,
      String content,
      MessageStatus status,
      LocalDateTime createdAt,
      LocalDateTime readAt) {
    return MessageEvent.builder()
        .id(id)
        .senderUsername(senderUsername)
        .recipientUsername(recipientUsername)
        .content(content)
        .status(status)
        .createdAt(createdAt)
        .readAt(readAt)
        .build();
  }
}
