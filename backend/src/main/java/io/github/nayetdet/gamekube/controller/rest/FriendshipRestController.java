package io.github.nayetdet.gamekube.controller.rest;

import io.github.nayetdet.gamekube.controller.rest.docs.FriendshipRestControllerDocs;
import io.github.nayetdet.gamekube.payload.request.FriendshipRequest;
import io.github.nayetdet.gamekube.payload.response.FriendshipResponse;
import io.github.nayetdet.gamekube.payload.response.UserResponse;
import io.github.nayetdet.gamekube.security.annotation.PreAuthorizeUser;
import io.github.nayetdet.gamekube.service.FriendshipService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/friendships")
@Tag(name = "Friendships", description = "Friendships and pending friendship requests")
@RequiredArgsConstructor
public class FriendshipRestController implements FriendshipRestControllerDocs {

  private final FriendshipService friendshipService;

  @Override
  @PreAuthorizeUser
  @GetMapping
  public ResponseEntity<List<UserResponse>> findAcceptedFriends(Principal principal) {
    return ResponseEntity.ok(friendshipService.findAcceptedFriends(principal.getName()));
  }

  @Override
  @PreAuthorizeUser
  @GetMapping("/requests/received")
  public ResponseEntity<List<FriendshipResponse>> findPendingReceivedRequests(Principal principal) {
    return ResponseEntity.ok(friendshipService.findPendingReceivedRequests(principal.getName()));
  }

  @Override
  @PreAuthorizeUser
  @GetMapping("/requests/sent")
  public ResponseEntity<List<FriendshipResponse>> findPendingSentRequests(Principal principal) {
    return ResponseEntity.ok(friendshipService.findPendingSentRequests(principal.getName()));
  }

  @Override
  @PreAuthorizeUser
  @PostMapping
  public ResponseEntity<FriendshipResponse> create(
      @RequestBody @Valid FriendshipRequest payload, Principal principal) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(friendshipService.create(principal.getName(), payload));
  }

  @Override
  @PreAuthorizeUser
  @PutMapping("/{username}/accept")
  public ResponseEntity<FriendshipResponse> accept(
      @PathVariable String username, Principal principal) {
    return ResponseEntity.ok(friendshipService.decide(principal.getName(), username, true));
  }

  @Override
  @PreAuthorizeUser
  @PutMapping("/{username}/reject")
  public ResponseEntity<FriendshipResponse> reject(
      @PathVariable String username, Principal principal) {
    return ResponseEntity.ok(friendshipService.decide(principal.getName(), username, false));
  }

  @Override
  @PreAuthorizeUser
  @DeleteMapping("/{username}")
  public ResponseEntity<Void> delete(
      @PathVariable("username") String friendUsername, Principal principal) {
    friendshipService.delete(principal.getName(), friendUsername);
    return ResponseEntity.noContent().build();
  }
}
