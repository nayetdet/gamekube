package io.github.nayetdet.gamekube.payload.response;

import io.github.nayetdet.gamekube.enums.PresenceStatus;
import java.time.LocalDateTime;
import java.util.UUID;
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
  private PresenceStatus presenceStatus;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
