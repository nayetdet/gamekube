package io.github.nayetdet.gamekube.controller;

import io.github.nayetdet.gamekube.controller.docs.FriendshipControllerDocs;
import io.github.nayetdet.gamekube.payload.request.FriendshipRequestPayload;
import io.github.nayetdet.gamekube.payload.request.FriendshipStatusRequest;
import io.github.nayetdet.gamekube.payload.response.FriendshipResponse;
import io.github.nayetdet.gamekube.payload.response.UserResponse;
import io.github.nayetdet.gamekube.security.annotation.PreAuthorizeUser;
import io.github.nayetdet.gamekube.service.FriendshipService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/friendships")
@RequiredArgsConstructor
public class FriendshipController implements FriendshipControllerDocs {

  private final FriendshipService friendshipService;

  @Override
  @PreAuthorizeUser
  @PostMapping
  public ResponseEntity<FriendshipResponse> create(
      @RequestBody @Valid FriendshipRequestPayload payload) {
    return ResponseEntity.status(HttpStatus.CREATED).body(friendshipService.create(payload));
  }

  @Override
  @PreAuthorizeUser
  @PatchMapping("/{id}")
  public ResponseEntity<FriendshipResponse> update(
      @PathVariable UUID id, @RequestBody @Valid FriendshipStatusRequest request) {
    return ResponseEntity.ok(friendshipService.update(id, request.getStatus()));
  }

  @Override
  @PreAuthorizeUser
  @DeleteMapping("/{username}")
  public ResponseEntity<Void> delete(@PathVariable String username) {
    friendshipService.delete(username);
    return ResponseEntity.noContent().build();
  }

  @Override
  @PreAuthorizeUser
  @GetMapping
  public ResponseEntity<List<UserResponse>> findAcceptedFriends() {
    return ResponseEntity.ok(friendshipService.findAcceptedFriends());
  }

  @Override
  @PreAuthorizeUser
  @GetMapping("/requests/received")
  public ResponseEntity<List<FriendshipResponse>> findPendingReceivedRequests() {
    return ResponseEntity.ok(friendshipService.findPendingReceivedRequests());
  }

  @Override
  @PreAuthorizeUser
  @GetMapping("/requests/sent")
  public ResponseEntity<List<FriendshipResponse>> findPendingSentRequests() {
    return ResponseEntity.ok(friendshipService.findPendingSentRequests());
  }
}
