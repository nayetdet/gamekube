package io.github.nayetdet.gamekube.service.presence;

import io.github.nayetdet.gamekube.model.PresenceStatus;
import io.github.nayetdet.gamekube.payload.response.PresenceEventPayload;
import io.github.nayetdet.gamekube.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class UserPresenceTracker {

  private final UserRepository userRepository;
  @Lazy private final SimpMessagingTemplate messagingTemplate;

  private final Map<String, Set<String>> userSessions = new ConcurrentHashMap<>();
  private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

  @Transactional
  public void registerConnection(String username, String sessionId) {
    if (username == null || sessionId == null) {
      return;
    }

    Set<String> sessions =
        userSessions.computeIfAbsent(username, k -> ConcurrentHashMap.newKeySet());
    boolean wasOffline = sessions.isEmpty();
    sessions.add(sessionId);

    log.info(
        "User {} connected session {}. Total active sessions: {}",
        username,
        sessionId,
        sessions.size());

    if (wasOffline) {
      userRepository
          .findByUsername(username)
          .ifPresent(
              user -> {
                user.setStatus(PresenceStatus.ONLINE);
                userRepository.save(user);

                broadcastPresence(username, PresenceStatus.ONLINE, null, user.getCurrentGame());
              });
    }
  }

  public void unregisterConnection(String username, String sessionId) {
    if (username == null || sessionId == null) {
      return;
    }

    Set<String> sessions = userSessions.get(username);
    if (sessions != null) {
      sessions.remove(sessionId);
      log.info(
          "User {} disconnected session {}. Remaining sessions: {}",
          username,
          sessionId,
          sessions.size());

      if (sessions.isEmpty()) {
        // Debounce: wait 3 seconds before marking offline to handle quick page refreshes
        scheduler.schedule(() -> checkAndMarkOffline(username), 3, TimeUnit.SECONDS);
      }
    }
  }

  private void checkAndMarkOffline(String username) {
    Set<String> sessions = userSessions.get(username);
    if (sessions == null || sessions.isEmpty()) {
      userSessions.remove(username);
      userRepository
          .findByUsername(username)
          .ifPresent(
              user -> {
                LocalDateTime lastSeen = LocalDateTime.now();
                user.setStatus(PresenceStatus.OFFLINE);
                user.setLastSeenAt(lastSeen);
                user.setCurrentGame(null);
                userRepository.save(user);

                log.info("User {} is now OFFLINE", username);
                broadcastPresence(username, PresenceStatus.OFFLINE, lastSeen, null);
              });
    }
  }

  public boolean isUserOnline(String username) {
    Set<String> sessions = userSessions.get(username);
    return sessions != null && !sessions.isEmpty();
  }

  private void broadcastPresence(
      String username, PresenceStatus status, LocalDateTime lastSeenAt, String currentGame) {
    try {
      PresenceEventPayload payload =
          PresenceEventPayload.builder()
              .username(username)
              .status(status)
              .lastSeenAt(lastSeenAt)
              .currentGame(currentGame)
              .build();

      messagingTemplate.convertAndSend("/topic/presence", payload);
    } catch (Exception e) {
      log.error("Failed to broadcast presence update for {}: {}", username, e.getMessage());
    }
  }
}
