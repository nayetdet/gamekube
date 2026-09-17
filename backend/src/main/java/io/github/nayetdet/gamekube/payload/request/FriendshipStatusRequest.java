package io.github.nayetdet.gamekube.payload.request;

import io.github.nayetdet.gamekube.enums.FriendshipStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendshipStatusRequest {

  @NotNull private FriendshipStatus status;
}
