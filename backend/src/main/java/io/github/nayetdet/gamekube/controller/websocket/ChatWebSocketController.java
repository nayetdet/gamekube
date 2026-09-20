package io.github.nayetdet.gamekube.controller.websocket;

import io.github.nayetdet.gamekube.exception.UserUnauthorizedException;
import io.github.nayetdet.gamekube.payload.request.MessageRequest;
import io.github.nayetdet.gamekube.payload.response.MessageResponse;
import io.github.nayetdet.gamekube.service.ChatService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

  private final ChatService chatService;

  @MessageMapping("/chat.send")
  public MessageResponse send(Principal principal, @Payload @Valid MessageRequest request) {
    if (principal == null) {
      throw new UserUnauthorizedException();
    }

    return chatService.create(principal.getName(), request.getRecipientUsername(), request);
  }

  @MessageMapping("/chat.read")
  public void markAsRead(Principal principal, @Payload Map<String, String> payload) {
    if (principal == null) {
      throw new UserUnauthorizedException();
    }

    String senderUsername = payload.get("senderUsername");
    if (senderUsername != null && !senderUsername.isBlank()) {
      chatService.updateReadStatus(principal.getName(), senderUsername);
    }
  }
}
