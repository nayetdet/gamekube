package io.github.nayetdet.gamekube.payload.response;

import io.github.nayetdet.gamekube.model.User;
import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
    UUID id,
    String keycloakId,
    String username,
    String email,
    String firstName,
    String lastName,
    boolean active,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {
  public static UserResponse fromEntity(User user) {
    return new UserResponse(
        user.getId(),
        user.getKeycloakId(),
        user.getUsername(),
        user.getEmail(),
        user.getFirstName(),
        user.getLastName(),
        user.isActive(),
        user.getCreatedAt(),
        user.getUpdatedAt());
  }
}
