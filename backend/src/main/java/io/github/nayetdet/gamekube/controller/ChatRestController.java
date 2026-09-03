package io.github.nayetdet.gamekube.controller;

import io.github.nayetdet.gamekube.controller.docs.ChatRestControllerDocs;
import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.query.page.ApplicationPage;
import io.github.nayetdet.gamekube.payload.request.ChatMessageRequest;
import io.github.nayetdet.gamekube.payload.response.ChatMessageResponse;
import io.github.nayetdet.gamekube.repository.UserRepository;
import io.github.nayetdet.gamekube.security.authorization.AuthorizationHelper;
import io.github.nayetdet.gamekube.security.authorization.annotation.PreAuthorizeUser;
import io.github.nayetdet.gamekube.service.ChatService;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
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
public class ChatRestController implements ChatRestControllerDocs {

  private final ChatService chatService;
  private final UserRepository userRepository;

  @Override
  @PreAuthorizeUser
  @GetMapping("/{username}/messages")
  public ResponseEntity<ApplicationPage<ChatMessageResponse>> getConversation(
      @PathVariable String username,
      @ParameterObject @PageableDefault(size = 50) Pageable pageable) {
    User currentUser = getCurrentUser();
    return ResponseEntity.ok(
        chatService.getConversation(currentUser.getUsername(), username, pageable));
  }

  @Override
  @PreAuthorizeUser
  @PostMapping("/messages")
  public ResponseEntity<ChatMessageResponse> sendMessage(
      @RequestBody @Valid ChatMessageRequest request) {
    User currentUser = getCurrentUser();
    return ResponseEntity.ok(chatService.sendMessage(currentUser.getUsername(), request));
  }

  @Override
  @PreAuthorizeUser
  @PutMapping("/{username}/read")
  public ResponseEntity<Void> markAsRead(@PathVariable String username) {
    User currentUser = getCurrentUser();
    chatService.markConversationAsRead(currentUser.getUsername(), username);
    return ResponseEntity.noContent().build();
  }

  @Override
  @PreAuthorizeUser
  @GetMapping("/unread-count")
  public ResponseEntity<Map<String, Long>> getUnreadCount() {
    User currentUser = getCurrentUser();
    return ResponseEntity.ok(
        Map.of("unreadCount", chatService.getUnreadCount(currentUser.getUsername())));
  }

  private User getCurrentUser() {
    return userRepository
        .findByKeycloakId(AuthorizationHelper.getCurrentKeycloakId())
        .orElseThrow(UserNotFoundException::new);
  }
}
