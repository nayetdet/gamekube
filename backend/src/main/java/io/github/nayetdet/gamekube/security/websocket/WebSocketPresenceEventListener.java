package io.github.nayetdet.gamekube.security.websocket;

import io.github.nayetdet.gamekube.service.presence.UserPresenceTracker;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketPresenceEventListener {

  private final UserPresenceTracker presenceTracker;

  @EventListener
  public void handleWebSocketConnectListener(SessionConnectedEvent event) {
    Principal principal = event.getUser();
    if (principal != null) {
      String username = principal.getName();
      String sessionId = SimpMessageHeaderAccessor.getSessionId(event.getMessage().getHeaders());
      presenceTracker.registerConnection(username, sessionId);
    }
  }

  @EventListener
  public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
    Principal principal = event.getUser();
    String sessionId = event.getSessionId();
    if (principal != null) {
      presenceTracker.unregisterConnection(principal.getName(), sessionId);
    }
  }
}
