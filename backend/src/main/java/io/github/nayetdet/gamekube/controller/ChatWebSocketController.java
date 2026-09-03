package io.github.nayetdet.gamekube.controller;

import io.github.nayetdet.gamekube.payload.request.ChatMessageRequest;
import io.github.nayetdet.gamekube.payload.response.ChatMessageResponse;
import io.github.nayetdet.gamekube.service.ChatService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

  private final ChatService chatService;

  @MessageMapping("/chat.send")
  public ChatMessageResponse handleSendMessage(
      Principal principal, @Payload @Valid ChatMessageRequest request) {
    if (principal == null) {
      throw new IllegalArgumentException("Unauthenticated WebSocket session");
    }

    return chatService.sendMessage(principal.getName(), request);
  }

  @MessageMapping("/chat.read")
  public void handleMarkAsRead(Principal principal, @Payload Map<String, String> payload) {
    if (principal == null) {
      throw new IllegalArgumentException("Unauthenticated WebSocket session");
    }

    String senderUsername = payload.get("senderUsername");
    if (senderUsername != null && !senderUsername.isBlank()) {
      chatService.markConversationAsRead(principal.getName(), senderUsername);
    }
  }
}
