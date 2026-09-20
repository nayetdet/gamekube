package io.github.nayetdet.gamekube.controller.rest;

import io.github.nayetdet.gamekube.controller.rest.docs.ChatRestControllerDocs;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/chats")
@RequiredArgsConstructor
public class ChatRestController implements ChatRestControllerDocs {

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
  @PostMapping("/{username}/messages")
  public ResponseEntity<MessageResponse> create(
      @PathVariable String username,
      @RequestBody @Valid MessageRequest request,
      Principal principal) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(chatService.create(principal.getName(), username, request));
  }

  @Override
  @PreAuthorizeUser
  @PatchMapping("/{username}/messages")
  public ResponseEntity<Void> markAsRead(@PathVariable String username, Principal principal) {
    chatService.updateReadStatus(principal.getName(), username);
    return ResponseEntity.noContent().build();
  }

  @Override
  @PreAuthorizeUser
  @GetMapping("/unread-messages/count")
  public ResponseEntity<Map<String, Long>> countUnread(Principal principal) {
    return ResponseEntity.ok(Map.of("unreadCount", chatService.countUnread(principal.getName())));
  }
}
