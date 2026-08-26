package io.github.nayetdet.gamekube.payload.request;

import io.github.nayetdet.gamekube.model.PresenceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserPresenceRequest {

  @NotNull private PresenceStatus status;

  private String currentGame;
}
