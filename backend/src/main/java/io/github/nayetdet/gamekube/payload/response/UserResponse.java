package io.github.nayetdet.gamekube.payload.response;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.github.nayetdet.gamekube.enums.PresenceStatus;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

  private UUID id;
  private UUID keycloakId;
  private String username;
  private String name;
  private String description;
  private PresenceStatus status;

  @Getter(AccessLevel.NONE)
  private LocalDateTime lastSeenAt;

  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  @JsonGetter("lastSeenAt")
  @JsonInclude(JsonInclude.Include.NON_NULL)
  public LocalDateTime getLastSeenAtForSerialization() {
    return status == PresenceStatus.OFFLINE ? lastSeenAt : null;
  }
}
