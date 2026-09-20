package io.github.nayetdet.gamekube.controller.websocket;

import io.github.nayetdet.gamekube.exception.UserUnauthorizedException;
import io.github.nayetdet.gamekube.service.PresenceService;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class PresenceWebSocketController {

  private final PresenceService presenceService;

  @MessageMapping("/presence.heartbeat")
  public void heartbeat(Principal principal, SimpMessageHeaderAccessor headers) {
    if (principal == null || headers.getSessionId() == null) {
      throw new UserUnauthorizedException();
    }

    presenceService.heartbeat(principal.getName(), headers.getSessionId());
  }
}
