package io.github.nayetdet.gamekube.payload.response;

import io.github.nayetdet.gamekube.model.ChatMessageStatus;
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
public class ChatMessageResponse {

  private UUID id;
  private String senderUsername;
  private String recipientUsername;
  private String content;
  private ChatMessageStatus status;
  private LocalDateTime createdAt;
  private LocalDateTime readAt;
}
