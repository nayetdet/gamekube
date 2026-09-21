package io.github.nayetdet.gamekube.controller.http;

import io.github.nayetdet.gamekube.controller.http.docs.MessageControllerDocs;
import io.github.nayetdet.gamekube.payload.http.query.page.ApplicationPage;
import io.github.nayetdet.gamekube.payload.http.request.MessageRequest;
import io.github.nayetdet.gamekube.payload.http.response.MessageResponse;
import io.github.nayetdet.gamekube.security.annotation.PreAuthorizeUser;
import io.github.nayetdet.gamekube.service.MessageService;
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
@RequestMapping("/v1/messages")
@RequiredArgsConstructor
public class MessageController implements MessageControllerDocs {

  private final MessageService messageService;

  @Override
  @PreAuthorizeUser
  @GetMapping("/{username}")
  public ResponseEntity<ApplicationPage<MessageResponse>> findConversation(
      @PathVariable String username,
      @ParameterObject @PageableDefault(size = 50) Pageable pageable,
      Principal principal) {
    return ResponseEntity.ok(
        messageService.findConversation(principal.getName(), username, pageable));
  }

  @Override
  @PreAuthorizeUser
  @PostMapping("/{username}")
  public ResponseEntity<MessageResponse> create(
      @PathVariable String username,
      @RequestBody @Valid MessageRequest request,
      Principal principal) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(messageService.create(principal.getName(), username, request));
  }

  @Override
  @PreAuthorizeUser
  @PatchMapping("/{username}")
  public ResponseEntity<Void> markAsRead(@PathVariable String username, Principal principal) {
    messageService.updateReadStatus(principal.getName(), username);
    return ResponseEntity.noContent().build();
  }

  @Override
  @PreAuthorizeUser
  @GetMapping("/unread/count")
  public ResponseEntity<Map<String, Long>> countUnread(Principal principal) {
    return ResponseEntity.ok(
        Map.of("unreadCount", messageService.countUnread(principal.getName())));
  }
}
