package io.github.nayetdet.gamekube.controller;

import io.github.nayetdet.gamekube.controller.docs.FriendshipControllerDocs;
import io.github.nayetdet.gamekube.payload.request.FriendshipRequestPayload;
import io.github.nayetdet.gamekube.payload.response.FriendshipResponse;
import io.github.nayetdet.gamekube.payload.response.UserResponse;
import io.github.nayetdet.gamekube.security.authorization.annotation.PreAuthorizeUser;
import io.github.nayetdet.gamekube.service.FriendshipService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/friends")
@RequiredArgsConstructor
public class FriendshipController implements FriendshipControllerDocs {

  private final FriendshipService friendshipService;

  @Override
  @PreAuthorizeUser
  @PostMapping("/requests")
  public ResponseEntity<FriendshipResponse> sendFriendRequest(
      @RequestBody @Valid FriendshipRequestPayload payload) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(friendshipService.sendFriendRequest(payload));
  }

  @Override
  @PreAuthorizeUser
  @PostMapping("/requests/{id}/accept")
  public ResponseEntity<FriendshipResponse> acceptFriendRequest(@PathVariable UUID id) {
    return ResponseEntity.ok(friendshipService.acceptFriendRequest(id));
  }

  @Override
  @PreAuthorizeUser
  @PostMapping("/requests/{id}/reject")
  public ResponseEntity<FriendshipResponse> rejectFriendRequest(@PathVariable UUID id) {
    return ResponseEntity.ok(friendshipService.rejectFriendRequest(id));
  }

  @Override
  @PreAuthorizeUser
  @DeleteMapping("/{username}")
  public ResponseEntity<Void> removeFriendship(@PathVariable String username) {
    friendshipService.removeFriendship(username);
    return ResponseEntity.noContent().build();
  }

  @Override
  @PreAuthorizeUser
  @GetMapping
  public ResponseEntity<List<UserResponse>> listFriends() {
    return ResponseEntity.ok(friendshipService.listFriends());
  }

  @Override
  @PreAuthorizeUser
  @GetMapping("/requests/received")
  public ResponseEntity<List<FriendshipResponse>> listReceivedRequests() {
    return ResponseEntity.ok(friendshipService.listReceivedRequests());
  }

  @Override
  @PreAuthorizeUser
  @GetMapping("/requests/sent")
  public ResponseEntity<List<FriendshipResponse>> listSentRequests() {
    return ResponseEntity.ok(friendshipService.listSentRequests());
  }
}
