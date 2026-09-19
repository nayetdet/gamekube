package io.github.nayetdet.gamekube.controller;

import io.github.nayetdet.gamekube.controller.docs.ChatControllerDocs;
import io.github.nayetdet.gamekube.payload.query.page.ApplicationPage;
import io.github.nayetdet.gamekube.payload.request.MessageRequest;
import io.github.nayetdet.gamekube.payload.response.MessageResponse;
import io.github.nayetdet.gamekube.security.annotation.PreAuthorizeUser;
import io.github.nayetdet.gamekube.service.ChatService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/chats")
@RequiredArgsConstructor
public class ChatController implements ChatControllerDocs {

  private final ChatService chatService;

  @Override
  @PreAuthorizeUser
  @GetMapping("/{username}/messages")
  public ResponseEntity<ApplicationPage<MessageResponse>> findConversation(
      @PathVariable String username,
      @ParameterObject @PageableDefault(size = 50) Pageable pageable,
      Principal principal) {
    return ResponseEntity.ok(chatService.findConversation(principal.getName(), username, pageable));
  }

  @Override
  @PreAuthorizeUser
  @PostMapping("/messages")
  public ResponseEntity<MessageResponse> create(
      @RequestBody @Valid MessageRequest request, Principal principal) {
    return ResponseEntity.ok(chatService.create(principal.getName(), request));
  }

  @Override
  @PreAuthorizeUser
  @PutMapping("/{username}/read")
  public ResponseEntity<Void> markAsRead(@PathVariable String username, Principal principal) {
    chatService.updateReadStatus(principal.getName(), username);
    return ResponseEntity.noContent().build();
  }

  @Override
  @PreAuthorizeUser
  @GetMapping("/messages/unread/count")
  public ResponseEntity<Map<String, Long>> countUnread(Principal principal) {
    return ResponseEntity.ok(Map.of("unreadCount", chatService.countUnread(principal.getName())));
  }

  @MessageMapping("/chat.send")
  public MessageResponse handleSendMessage(
      Principal principal, @Payload @Valid MessageRequest request) {
    if (principal == null) {
      throw new IllegalArgumentException("Unauthenticated WebSocket session");
    }

    return chatService.create(principal.getName(), request);
  }

  @MessageMapping("/chat.read")
  public void handleMarkAsRead(Principal principal, @Payload Map<String, String> payload) {
    if (principal == null) {
      throw new IllegalArgumentException("Unauthenticated WebSocket session");
    }

    String senderUsername = payload.get("senderUsername");
    if (senderUsername != null && !senderUsername.isBlank()) {
      chatService.updateReadStatus(principal.getName(), senderUsername);
    }
  }
}
