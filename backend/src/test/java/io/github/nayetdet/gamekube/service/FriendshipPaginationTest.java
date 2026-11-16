package io.github.nayetdet.gamekube.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import io.github.nayetdet.gamekube.enums.FriendshipStatus;
import io.github.nayetdet.gamekube.model.Friendship;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.http.response.UserResponse;
import io.github.nayetdet.gamekube.repository.FriendshipRepository;
import io.github.nayetdet.gamekube.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
class FriendshipPaginationTest {
  @Mock private UserRepository users;
  @Mock private FriendshipRepository friendships;
  @Mock private UserService userService;
  @InjectMocks private FriendshipService service;

  @Test
  void returnsRequestedPageAndTotalWithFriendAsCounterpart() {
    var viewer = new User();
    viewer.setId(UUID.randomUUID());
    var friend = new User();
    friend.setId(UUID.randomUUID());
    var friendship = Friendship.builder().requester(friend).addressee(viewer).build();
    var pageable = PageRequest.of(1, 12);
    var response = UserResponse.builder().username("friend").build();
    when(users.findByUsername("viewer")).thenReturn(Optional.of(viewer));
    when(friendships.findAllByUserIdAndStatus(viewer.getId(), FriendshipStatus.ACCEPTED, pageable))
        .thenReturn(new PageImpl<>(List.of(friendship), pageable, 25));
    when(userService.toPresenceResponse(friend)).thenReturn(response);

    var result = service.findAcceptedFriends("viewer", pageable);

    assertEquals(List.of(response), result.getContent());
    assertEquals(1, result.getPageable().getPageNumber());
    assertEquals(12, result.getPageable().getPageSize());
    assertEquals(25L, result.getPageable().getTotal());
    verify(userService).toPresenceResponse(friend);
  }

  @Test
  void capsRequestedPageSize() {
    var viewer = new User();
    viewer.setId(UUID.randomUUID());
    var capped = PageRequest.of(0, 100);
    when(users.findByUsername("viewer")).thenReturn(Optional.of(viewer));
    when(friendships.findAllByUserIdAndStatus(viewer.getId(), FriendshipStatus.ACCEPTED, capped))
        .thenReturn(new PageImpl<>(List.of(), capped, 0));

    var result = service.findAcceptedFriends("viewer", PageRequest.of(0, 500));

    assertEquals(100, result.getPageable().getPageSize());
    assertEquals(0L, result.getPageable().getTotal());
  }
}
