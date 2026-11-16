package io.github.nayetdet.gamekube.payload.http.response;

import com.fasterxml.jackson.annotation.JsonFormat;
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

  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'")
  private LocalDateTime createdAt;

  @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'")
  private LocalDateTime updatedAt;
}
