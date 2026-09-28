package io.github.nayetdet.gamekube.payload.http.response;

import io.github.nayetdet.gamekube.enums.FriendshipStatus;
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
public class FriendshipResponse {

  private UUID id;
  private UserResponse requester;
  private UserResponse addressee;
  private FriendshipStatus status;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
