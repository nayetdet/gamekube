package io.github.nayetdet.gamekube.mapper;

import io.github.nayetdet.gamekube.model.ChatMessage;
import io.github.nayetdet.gamekube.payload.response.ChatMessageResponse;
import org.springframework.stereotype.Component;

@Component
public class ChatMessageMapper {

  public ChatMessageResponse toResponse(ChatMessage message) {
    if (message == null) {
      return null;
    }
    return ChatMessageResponse.builder()
        .id(message.getId())
        .senderUsername(message.getSender().getUsername())
        .recipientUsername(message.getRecipient().getUsername())
        .content(message.getContent())
        .status(message.getStatus())
        .createdAt(message.getCreatedAt())
        .readAt(message.getReadAt())
        .build();
  }
}
