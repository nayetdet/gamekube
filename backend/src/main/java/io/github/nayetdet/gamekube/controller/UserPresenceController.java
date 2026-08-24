package io.github.nayetdet.gamekube.controller;

import io.github.nayetdet.gamekube.controller.docs.UserPresenceControllerDocs;
import io.github.nayetdet.gamekube.payload.request.UserPresenceRequest;
import io.github.nayetdet.gamekube.payload.response.UserPresenceResponse;
import io.github.nayetdet.gamekube.security.authorization.annotation.PreAuthorizeUser;
import io.github.nayetdet.gamekube.service.UserPresenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserPresenceController implements UserPresenceControllerDocs {

  private final UserPresenceService userPresenceService;

  @Override
  @PreAuthorizeUser
  @PutMapping("/me/presence")
  public ResponseEntity<UserPresenceResponse> updateSelfPresence(
      @RequestBody @Valid UserPresenceRequest request) {
    return ResponseEntity.ok(userPresenceService.updateSelfPresence(request));
  }

  @Override
  @PreAuthorizeUser
  @GetMapping("/{username}/presence")
  public ResponseEntity<UserPresenceResponse> getPresenceByUsername(@PathVariable String username) {
    return ResponseEntity.ok(userPresenceService.getPresenceByUsername(username));
  }
}
