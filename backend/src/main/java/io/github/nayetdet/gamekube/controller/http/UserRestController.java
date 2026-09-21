package io.github.nayetdet.gamekube.controller.http;

import io.github.nayetdet.gamekube.controller.http.docs.UserRestControllerDocs;
import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.payload.http.query.UserQuery;
import io.github.nayetdet.gamekube.payload.http.query.page.ApplicationPage;
import io.github.nayetdet.gamekube.payload.http.request.UserRequest;
import io.github.nayetdet.gamekube.payload.http.response.UserResponse;
import io.github.nayetdet.gamekube.security.annotation.PreAuthorizeAdmin;
import io.github.nayetdet.gamekube.security.annotation.PreAuthorizeUser;
import io.github.nayetdet.gamekube.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserRestController implements UserRestControllerDocs {

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
  @PatchMapping("/{username}/email")
  public ResponseEntity<Void> updateEmail(@PathVariable String username) {
    userService.updateEmail(username);
    return ResponseEntity.noContent().build();
  }

  @Override
  @PreAuthorizeUser
  @PutMapping("/{username}")
  public ResponseEntity<Void> update(
      @PathVariable String username, @RequestBody @Valid UserRequest request) {
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
