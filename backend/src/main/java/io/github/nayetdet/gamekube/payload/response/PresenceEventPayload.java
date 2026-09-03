package io.github.nayetdet.gamekube.payload.response;

import io.github.nayetdet.gamekube.model.PresenceStatus;
import java.time.LocalDateTime;
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
public class PresenceEventPayload {

  private String username;
  private PresenceStatus status;
  private LocalDateTime lastSeenAt;
  private String currentGame;
}
