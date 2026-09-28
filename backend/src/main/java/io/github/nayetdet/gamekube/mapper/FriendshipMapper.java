package io.github.nayetdet.gamekube.mapper;

import io.github.nayetdet.gamekube.model.Friendship;
import io.github.nayetdet.gamekube.payload.http.response.FriendshipResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FriendshipMapper {

  private final UserMapper userMapper;

  public FriendshipResponse toResponse(Friendship friendship) {
    if (friendship == null) {
      return null;
    }

    return FriendshipResponse.builder()
        .id(friendship.getId())
        .requester(userMapper.toResponse(friendship.getRequester()))
        .addressee(userMapper.toResponse(friendship.getAddressee()))
        .status(friendship.getStatus())
        .createdAt(friendship.getCreatedAt())
        .updatedAt(friendship.getUpdatedAt())
        .build();
  }
}
