package io.github.nayetdet.gamekube.payload.http.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendshipRequest {

  @NotBlank
  @Size(min = 3, max = 50)
  private String addresseeUsername;
}
