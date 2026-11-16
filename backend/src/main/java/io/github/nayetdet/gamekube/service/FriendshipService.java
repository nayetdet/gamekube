package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.enums.FriendshipStatus;
import io.github.nayetdet.gamekube.exception.FriendshipAlreadyExistsException;
import io.github.nayetdet.gamekube.exception.FriendshipNotFoundException;
import io.github.nayetdet.gamekube.exception.FriendshipNotPendingException;
import io.github.nayetdet.gamekube.exception.FriendshipSelfReferenceException;
import io.github.nayetdet.gamekube.exception.UserModificationForbiddenException;
import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.mapper.FriendshipMapper;
import io.github.nayetdet.gamekube.model.Friendship;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.http.query.page.ApplicationPage;
import io.github.nayetdet.gamekube.payload.http.request.FriendshipRequest;
import io.github.nayetdet.gamekube.payload.http.response.FriendshipResponse;
import io.github.nayetdet.gamekube.payload.http.response.UserResponse;
import io.github.nayetdet.gamekube.repository.FriendshipRepository;
import io.github.nayetdet.gamekube.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

@Service
@Slf4j
@RequiredArgsConstructor
public class FriendshipService {

  private final FriendshipRepository friendshipRepository;
  private final UserRepository userRepository;
  private final FriendshipMapper friendshipMapper;
  private final SimpMessagingTemplate messagingTemplate;
  private final UserService userService;

  private void notifyChange(String first, String second) {
    TransactionSynchronizationManager.registerSynchronization(
        new TransactionSynchronization() {
          @Override
          public void afterCommit() {
            try {
              messagingTemplate.convertAndSendToUser(first, "/queue/friendships", "changed");
              messagingTemplate.convertAndSendToUser(second, "/queue/friendships", "changed");
            } catch (RuntimeException exception) {
              log.warn("Could not dispatch friendship update", exception);
            }
          }
        });
  }

  @Transactional(readOnly = true)
  public ApplicationPage<UserResponse> findAcceptedFriends(
      String currentUsername, Pageable pageable) {
    User currentUser =
        userRepository.findByUsername(currentUsername).orElseThrow(UserNotFoundException::new);

    Page<Friendship> friendships =
        friendshipRepository.findAllByUserIdAndStatus(
            currentUser.getId(),
            FriendshipStatus.ACCEPTED,
            PageRequest.of(pageable.getPageNumber(), Math.min(pageable.getPageSize(), 100)));

    return new ApplicationPage<>(
        friendships.map(
            f -> {
              User friend =
                  f.getRequester().getId().equals(currentUser.getId())
                      ? f.getAddressee()
                      : f.getRequester();
              return userService.toPresenceResponse(friend);
            }));
  }

  @Transactional(readOnly = true)
  public List<FriendshipResponse> findPendingReceivedRequests(String currentUsername) {
    User currentUser =
        userRepository.findByUsername(currentUsername).orElseThrow(UserNotFoundException::new);

    return friendshipRepository.findPendingReceivedRequests(currentUser.getId()).stream()
        .map(friendshipMapper::toResponse)
        .toList();
  }

  @Transactional(readOnly = true)
  public List<FriendshipResponse> findPendingSentRequests(String currentUsername) {
    User currentUser =
        userRepository.findByUsername(currentUsername).orElseThrow(UserNotFoundException::new);

    return friendshipRepository.findPendingSentRequests(currentUser.getId()).stream()
        .map(friendshipMapper::toResponse)
        .toList();
  }

  @Transactional
  public FriendshipResponse create(String requesterUsername, FriendshipRequest payload) {
    User requester =
        userRepository.findByUsername(requesterUsername).orElseThrow(UserNotFoundException::new);

    User addressee =
        userRepository
            .findByUsername(payload.getAddresseeUsername())
            .orElseThrow(UserNotFoundException::new);

    if (requester.getId().equals(addressee.getId())) {
      throw new FriendshipSelfReferenceException();
    }

    Optional<Friendship> existingFriendship =
        friendshipRepository.findBetweenUsers(requester.getId(), addressee.getId());

    if (existingFriendship.isPresent()) {
      Friendship friendship = existingFriendship.get();
      if (friendship.getStatus() == FriendshipStatus.ACCEPTED) {
        throw new FriendshipAlreadyExistsException();
      }

      if (friendship.getStatus() == FriendshipStatus.PENDING) {
        throw new FriendshipAlreadyExistsException();
      }

      friendship.setRequester(requester);
      friendship.setAddressee(addressee);
      friendship.setStatus(FriendshipStatus.PENDING);
      notifyChange(requesterUsername, addressee.getUsername());
      return friendshipMapper.toResponse(friendshipRepository.save(friendship));
    }

    notifyChange(requesterUsername, addressee.getUsername());
    return friendshipMapper.toResponse(
        friendshipRepository.save(
            Friendship.builder()
                .requester(requester)
                .addressee(addressee)
                .status(FriendshipStatus.PENDING)
                .build()));
  }

  @Transactional
  public FriendshipResponse decide(String currentUsername, String friendUsername, boolean accept) {
    User currentUser =
        userRepository.findByUsername(currentUsername).orElseThrow(UserNotFoundException::new);

    User friend =
        userRepository.findByUsername(friendUsername).orElseThrow(UserNotFoundException::new);

    Friendship friendship =
        friendshipRepository
            .findBetweenUsers(currentUser.getId(), friend.getId())
            .orElseThrow(FriendshipNotFoundException::new);

    if (!friendship.getAddressee().getId().equals(currentUser.getId())) {
      throw new UserModificationForbiddenException();
    }

    if (friendship.getStatus() != FriendshipStatus.PENDING) {
      throw new FriendshipNotPendingException();
    }

    friendship.setStatus(accept ? FriendshipStatus.ACCEPTED : FriendshipStatus.REJECTED);
    notifyChange(currentUsername, friendUsername);
    return friendshipMapper.toResponse(friendshipRepository.save(friendship));
  }

  @Transactional
  public void delete(String currentUsername, String username) {
    User currentUser =
        userRepository.findByUsername(currentUsername).orElseThrow(UserNotFoundException::new);

    User targetUser =
        userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);

    Friendship friendship =
        friendshipRepository
            .findBetweenUsers(currentUser.getId(), targetUser.getId())
            .orElseThrow(FriendshipNotFoundException::new);

    friendshipRepository.delete(friendship);
    notifyChange(currentUsername, username);
  }
}
