package io.github.nayetdet.gamekube.payload.response;

import io.github.nayetdet.gamekube.enums.MessageStatus;
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

  private UUID id;
  private String senderUsername;
  private String recipientUsername;
  private String content;
  private MessageStatus status;
  private LocalDateTime createdAt;
  private LocalDateTime readAt;
}
