package io.github.nayetdet.gamekube.mapper;

import io.github.nayetdet.gamekube.enums.PresenceStatus;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.request.UserRequest;
import io.github.nayetdet.gamekube.payload.response.UserResponse;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

  public UserResponse toResponse(User user) {
    return toResponse(user, null);
  }

  public UserResponse toResponse(User user, PresenceStatus status) {
    if (user == null) {
      return null;
    }

    return UserResponse.builder()
        .id(user.getId())
        .keycloakId(user.getKeycloakId())
        .username(user.getUsername())
        .name(user.getName())
        .description(user.getDescription())
        .status(status)
        .lastSeenAt(user.getLastSeenAt())
        .createdAt(user.getCreatedAt())
        .updatedAt(user.getUpdatedAt())
        .build();
  }

  public void update(User user, UserRequest request) {
    user.setUsername(request.getUsername());
    user.setName(request.getName());
    user.setDescription(request.getDescription());
  }
}
