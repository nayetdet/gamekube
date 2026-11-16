package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.enums.FriendshipStatus;
import io.github.nayetdet.gamekube.payload.websocket.event.GamePresenceChangedEvent;
import io.github.nayetdet.gamekube.repository.FriendshipRepository;
import io.github.nayetdet.gamekube.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class PresenceNotifier {
  private final UserRepository users;
  private final FriendshipRepository friendships;
  private final SimpMessagingTemplate messaging;

  @EventListener
  @Transactional(readOnly = true)
  public void gameEnded(GamePresenceChangedEvent event) {
    changed(event.username());
  }

  @Transactional(readOnly = true)
  public void changed(String username) {
    try {
      users
          .findByUsername(username)
          .ifPresent(
              user -> {
                var pageable = PageRequest.of(0, 100);
                org.springframework.data.domain.Page<io.github.nayetdet.gamekube.model.Friendship>
                    page;
                do {
                  page =
                      friendships.findAllByUserIdAndStatus(
                          user.getId(), FriendshipStatus.ACCEPTED, pageable);
                  page.forEach(
                      friendship -> {
                        var other =
                            friendship.getRequester().getId().equals(user.getId())
                                ? friendship.getAddressee()
                                : friendship.getRequester();
                        messaging.convertAndSendToUser(
                            other.getUsername(), "/queue/presence", "changed");
                      });
                  pageable = pageable.next();
                } while (page.hasNext());
              });
    } catch (RuntimeException exception) {
      log.warn("Could not dispatch presence update", exception);
    }
  }
}
