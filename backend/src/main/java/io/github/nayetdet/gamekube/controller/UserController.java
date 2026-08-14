package io.github.nayetdet.gamekube.controller;

import io.github.nayetdet.gamekube.controller.docs.UserControllerDocs;
import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.payload.query.UserQuery;
import io.github.nayetdet.gamekube.payload.query.page.ApplicationPage;
import io.github.nayetdet.gamekube.payload.request.UserUpdateRequest;
import io.github.nayetdet.gamekube.payload.response.UserResponse;
import io.github.nayetdet.gamekube.security.authorization.annotation.PreAuthorizeAdmin;
import io.github.nayetdet.gamekube.security.authorization.annotation.PreAuthorizeUser;
import io.github.nayetdet.gamekube.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
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
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController implements UserControllerDocs {

  private final UserService userService;

  @Override
  @PreAuthorizeAdmin
  @GetMapping
  public ResponseEntity<ApplicationPage<UserResponse>> search(@ParameterObject UserQuery query) {
    return ResponseEntity.ok(userService.search(query));
  }

  @Override
  @PreAuthorizeAdmin
  @GetMapping("/{username}")
  public ResponseEntity<UserResponse> find(@PathVariable String username) {
    return userService
        .find(username)
        .map(ResponseEntity::ok)
        .orElseThrow(UserNotFoundException::new);
  }

  @Override
  @PreAuthorizeUser
  @GetMapping("/me")
  public ResponseEntity<UserResponse> findSelf() {
    return userService.findSelf().map(ResponseEntity::ok).orElseThrow(UserNotFoundException::new);
  }

  @Override
  @PreAuthorizeUser
  @PostMapping("/{username}/reset-email")
  public ResponseEntity<Void> updateEmail(@PathVariable String username) {
    userService.updateEmail(username);
    return ResponseEntity.noContent().build();
  }

  @Override
  @PreAuthorizeUser
  @PutMapping("/{username}")
  public ResponseEntity<Void> update(
      @PathVariable String username, @RequestBody @Valid UserUpdateRequest request) {
    userService.update(username, request);
    return ResponseEntity.noContent().build();
  }

  @Override
  @PreAuthorizeUser
  @DeleteMapping("/{username}")
  public ResponseEntity<Void> delete(@PathVariable String username) {
    userService.delete(username);
    return ResponseEntity.noContent().build();
  }
}
