package io.github.nayetdet.gamekube.service.presence;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import io.github.nayetdet.gamekube.model.PresenceStatus;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.response.PresenceEventPayload;
import io.github.nayetdet.gamekube.repository.UserRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@ExtendWith(MockitoExtension.class)
class UserPresenceTrackerTest {

  @Mock private UserRepository userRepository;
  @Mock private SimpMessagingTemplate messagingTemplate;

  private UserPresenceTracker presenceTracker;
  private User testUser;

  @BeforeEach
  void setUp() {
    presenceTracker = new UserPresenceTracker(userRepository, messagingTemplate);

    testUser = new User();
    testUser.setId(UUID.randomUUID());
    testUser.setUsername("rodrigo");
    testUser.setStatus(PresenceStatus.OFFLINE);
  }

  @Test
  @DisplayName("Should mark user ONLINE when first session connects and broadcast presence")
  void shouldMarkOnlineOnFirstConnection() {
    when(userRepository.findByUsername("rodrigo")).thenReturn(Optional.of(testUser));

    presenceTracker.registerConnection("rodrigo", "session-1");

    assertThat(presenceTracker.isUserOnline("rodrigo")).isTrue();
    assertThat(testUser.getStatus()).isEqualTo(PresenceStatus.ONLINE);
    verify(userRepository, times(1)).save(testUser);
    verify(messagingTemplate, times(1))
        .convertAndSend(eq("/topic/presence"), any(PresenceEventPayload.class));
  }

  @Test
  @DisplayName("Should remain ONLINE without duplicate broadcast when second session connects")
  void shouldNotDuplicateBroadcastOnSecondConnection() {
    when(userRepository.findByUsername("rodrigo")).thenReturn(Optional.of(testUser));

    presenceTracker.registerConnection("rodrigo", "session-1");
    presenceTracker.registerConnection("rodrigo", "session-2");

    assertThat(presenceTracker.isUserOnline("rodrigo")).isTrue();
    // Only 1 save and 1 broadcast from the initial transition
    verify(userRepository, times(1)).save(testUser);
    verify(messagingTemplate, times(1))
        .convertAndSend(eq("/topic/presence"), any(PresenceEventPayload.class));
  }

  @Test
  @DisplayName("Should remain ONLINE when one of multiple sessions disconnects")
  void shouldRemainOnlineWhenOneSessionDisconnects() {
    when(userRepository.findByUsername("rodrigo")).thenReturn(Optional.of(testUser));

    presenceTracker.registerConnection("rodrigo", "session-1");
    presenceTracker.registerConnection("rodrigo", "session-2");

    presenceTracker.unregisterConnection("rodrigo", "session-1");

    assertThat(presenceTracker.isUserOnline("rodrigo")).isTrue();
  }

  @Test
  @DisplayName("Should report user as offline when no active sessions exist")
  void shouldReportOfflineWhenNoSessions() {
    assertThat(presenceTracker.isUserOnline("unknown_user")).isFalse();
    verify(messagingTemplate, never()).convertAndSend(any(String.class), any(Object.class));
  }
}
