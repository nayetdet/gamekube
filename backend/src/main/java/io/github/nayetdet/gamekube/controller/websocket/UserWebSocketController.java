package io.github.nayetdet.gamekube.controller.websocket;

import io.github.nayetdet.gamekube.exception.UserUnauthorizedException;
import io.github.nayetdet.gamekube.service.UserService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Controller
@RequiredArgsConstructor
public class UserWebSocketController {

  private final UserService userService;

  @MessageMapping("/user.heartbeat")
  public void markAsOnline(Principal principal, SimpMessageHeaderAccessor headers) {
    if (principal == null || headers.getSessionId() == null) {
      throw new UserUnauthorizedException();
    }

    userService.markAsOnline(principal.getName(), headers.getSessionId());
  }

  @EventListener
  public void markAsOffline(SessionDisconnectEvent event) {
    if (event.getUser() == null || event.getSessionId() == null) {
      return;
    }

    userService.markAsOffline(event.getUser().getName(), event.getSessionId());
  }
}
