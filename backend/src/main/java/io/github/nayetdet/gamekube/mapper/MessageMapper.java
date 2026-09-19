package io.github.nayetdet.gamekube.mapper;

import io.github.nayetdet.gamekube.model.Message;
import io.github.nayetdet.gamekube.payload.response.MessageResponse;
import org.springframework.stereotype.Component;

@Component
public class MessageMapper {

  public MessageResponse toResponse(Message message) {
    if (message == null) {
      return null;
    }

    return MessageResponse.builder()
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
