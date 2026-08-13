package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.exception.ResourceNotFoundException;
import io.github.nayetdet.gamekube.exception.UserAlreadyExistsException;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.request.UserCreateRequest;
import io.github.nayetdet.gamekube.payload.request.UserUpdateRequest;
import io.github.nayetdet.gamekube.payload.response.UserResponse;
import io.github.nayetdet.gamekube.repository.UserRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;

  @Transactional
  public UserResponse createUser(UserCreateRequest request) {
    if (userRepository.existsByEmail(request.email())) {
      throw new UserAlreadyExistsException(
          "Já existe um usuário cadastrado com o e-mail: " + request.email());
    }
    if (userRepository.existsByUsername(request.username())) {
      throw new UserAlreadyExistsException(
          "Já existe um usuário cadastrado com o username: " + request.username());
    }

    User user =
        User.builder()
            .username(request.username())
            .email(request.email())
            .firstName(request.firstName())
            .lastName(request.lastName())
            .keycloakId(request.keycloakId())
            .active(true)
            .build();

    User savedUser = userRepository.save(user);
    return UserResponse.fromEntity(savedUser);
  }

  @Transactional(readOnly = true)
  public UserResponse getUserById(UUID id) {
    User user =
        userRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Usuário não encontrado com o ID: " + id));
    return UserResponse.fromEntity(user);
  }

  @Transactional(readOnly = true)
  public UserResponse getUserByKeycloakId(String keycloakId) {
    User user =
        userRepository
            .findByKeycloakId(keycloakId)
            .orElseThrow(
                () ->
                    new ResourceNotFoundException(
                        "Usuário não encontrado com o Keycloak ID: " + keycloakId));
    return UserResponse.fromEntity(user);
  }

  @Transactional(readOnly = true)
  public List<UserResponse> getAllUsers() {
    return userRepository.findAll().stream().map(UserResponse::fromEntity).toList();
  }

  @Transactional
  public UserResponse updateUser(UUID id, UserUpdateRequest request) {
    User user =
        userRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Usuário não encontrado com o ID: " + id));

    if (userRepository.existsByEmailAndIdNot(request.email(), id)) {
      throw new UserAlreadyExistsException(
          "O e-mail " + request.email() + " já está em uso por outro usuário");
    }
    if (userRepository.existsByUsernameAndIdNot(request.username(), id)) {
      throw new UserAlreadyExistsException(
          "O username " + request.username() + " já está em uso por outro usuário");
    }

    user.setUsername(request.username());
    user.setEmail(request.email());
    user.setFirstName(request.firstName());
    user.setLastName(request.lastName());
    if (request.active() != null) {
      user.setActive(request.active());
    }

    User updatedUser = userRepository.save(user);
    return UserResponse.fromEntity(updatedUser);
  }

  @Transactional
  public void deleteUser(UUID id) {
    User user =
        userRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Usuário não encontrado com o ID: " + id));
    userRepository.delete(user);
  }
}
