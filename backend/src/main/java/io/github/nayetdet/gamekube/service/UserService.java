package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.mapper.UserMapper;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.query.UserQuery;
import io.github.nayetdet.gamekube.payload.query.page.ApplicationPage;
import io.github.nayetdet.gamekube.payload.request.UserUpdateRequest;
import io.github.nayetdet.gamekube.payload.response.UserResponse;
import io.github.nayetdet.gamekube.repository.UserRepository;
import io.github.nayetdet.gamekube.security.authorization.AuthorizationHelper;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final KeycloakService keycloakService;
  private final UserMapper userMapper;
  private final UserRepository userRepository;

  @Transactional(readOnly = true)
  public ApplicationPage<UserResponse> search(UserQuery query) {
    return new ApplicationPage<>(
        userRepository.search(query, query.getPageable()).map(userMapper::toResponse));
  }

  @Transactional(readOnly = true)
  public Optional<UserResponse> find(String username) {
    return userRepository.findByUsername(username).map(userMapper::toResponse);
  }

  @Transactional(readOnly = true)
  public void updateEmail(String username) {
    User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
    AuthorizationHelper.validateResourceAccess(user.getKeycloakId());
    keycloakService.updateEmail(user.getKeycloakId());
  }

  @Transactional
  public void update(String username, UserUpdateRequest request) {
    User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
    AuthorizationHelper.validateResourceAccess(user.getKeycloakId());
    userMapper.update(user, request);
    userRepository.save(user);
  }

  @Transactional
  public void delete(String username) {
    User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
    AuthorizationHelper.validateResourceAccess(user.getKeycloakId());
    userRepository.delete(user);
    userRepository.flush();
    keycloakService.delete(user.getKeycloakId());
  }
}
