package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.enums.FriendshipStatus;
import io.github.nayetdet.gamekube.exception.FriendshipAlreadyExistsException;
import io.github.nayetdet.gamekube.exception.FriendshipNotFoundException;
import io.github.nayetdet.gamekube.exception.FriendshipNotPendingException;
import io.github.nayetdet.gamekube.exception.FriendshipSelfReferenceException;
import io.github.nayetdet.gamekube.exception.UserModificationForbiddenException;
import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.mapper.FriendshipMapper;
import io.github.nayetdet.gamekube.mapper.UserMapper;
import io.github.nayetdet.gamekube.model.Friendship;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.request.FriendshipRequestPayload;
import io.github.nayetdet.gamekube.payload.response.FriendshipResponse;
import io.github.nayetdet.gamekube.payload.response.UserResponse;
import io.github.nayetdet.gamekube.repository.FriendshipRepository;
import io.github.nayetdet.gamekube.repository.UserRepository;
import io.github.nayetdet.gamekube.security.AuthenticationHelper;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FriendshipService {

  private final FriendshipRepository friendshipRepository;
  private final UserRepository userRepository;
  private final FriendshipMapper friendshipMapper;
  private final UserMapper userMapper;

  @Transactional(readOnly = true)
  public List<UserResponse> findAcceptedFriends() {
    User currentUser = getCurrentUser();
    List<Friendship> friendships =
        friendshipRepository.findAllByUserIdAndStatus(
            currentUser.getId(), FriendshipStatus.ACCEPTED);

    return friendships.stream()
        .map(
            f -> {
              User friend =
                  f.getRequester().getId().equals(currentUser.getId())
                      ? f.getAddressee()
                      : f.getRequester();
              return userMapper.toResponse(friend);
            })
        .toList();
  }

  @Transactional(readOnly = true)
  public List<FriendshipResponse> findPendingReceivedRequests() {
    User currentUser = getCurrentUser();
    return friendshipRepository.findPendingReceivedRequests(currentUser.getId()).stream()
        .map(friendshipMapper::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<FriendshipResponse> findPendingSentRequests() {
    User currentUser = getCurrentUser();
    return friendshipRepository.findPendingSentRequests(currentUser.getId()).stream()
        .map(friendshipMapper::toResponse)
        .toList();
  }

  @Transactional
  public FriendshipResponse create(FriendshipRequestPayload payload) {
    User requester = getCurrentUser();
    User addressee =
        userRepository
            .findByUsername(payload.getUsername())
            .orElseThrow(
                () -> new UserNotFoundException("User not found: " + payload.getUsername()));

    if (requester.getId().equals(addressee.getId())) {
      throw new FriendshipSelfReferenceException();
    }

    Optional<Friendship> existingFriendship =
        friendshipRepository.findBetweenUsers(requester.getId(), addressee.getId());

    if (existingFriendship.isPresent()) {
      Friendship friendship = existingFriendship.get();
      if (friendship.getStatus() == FriendshipStatus.ACCEPTED) {
        throw new FriendshipAlreadyExistsException("You are already friends with this user");
      }

      if (friendship.getStatus() == FriendshipStatus.PENDING) {
        throw new FriendshipAlreadyExistsException(
            "A friend request is already pending between you");
      }

      friendship.setRequester(requester);
      friendship.setAddressee(addressee);
      friendship.setStatus(FriendshipStatus.PENDING);
      return friendshipMapper.toResponse(friendshipRepository.save(friendship));
    }

    Friendship friendship = new Friendship();
    friendship.setRequester(requester);
    friendship.setAddressee(addressee);
    friendship.setStatus(FriendshipStatus.PENDING);
    return friendshipMapper.toResponse(friendshipRepository.save(friendship));
  }

  @Transactional
  public FriendshipResponse update(UUID requestId, FriendshipStatus status) {
    User currentUser = getCurrentUser();
    Friendship friendship =
        friendshipRepository.findById(requestId).orElseThrow(FriendshipNotFoundException::new);

    if (!friendship.getAddressee().getId().equals(currentUser.getId())) {
      throw new UserModificationForbiddenException();
    }

    if (friendship.getStatus() != FriendshipStatus.PENDING
        || (status != FriendshipStatus.ACCEPTED && status != FriendshipStatus.REJECTED)) {
      throw new FriendshipNotPendingException();
    }

    friendship.setStatus(status);
    return friendshipMapper.toResponse(friendshipRepository.save(friendship));
  }

  @Transactional
  public void delete(String username) {
    User currentUser = getCurrentUser();
    User targetUser =
        userRepository
            .findByUsername(username)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + username));

    Friendship friendship =
        friendshipRepository
            .findBetweenUsers(currentUser.getId(), targetUser.getId())
            .orElseThrow(FriendshipNotFoundException::new);

    friendshipRepository.delete(friendship);
  }

  private User getCurrentUser() {
    return userRepository
        .findByKeycloakId(AuthenticationHelper.getKeycloakId())
        .orElseThrow(UserNotFoundException::new);
  }
}
