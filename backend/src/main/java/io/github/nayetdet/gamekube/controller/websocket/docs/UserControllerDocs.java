package io.github.nayetdet.gamekube.controller.websocket.docs;

import io.github.nayetdet.gamekube.payload.websocket.command.UserHeartbeatCommand;
import java.security.Principal;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;

public interface UserControllerDocs {

  void markAsOnline(
      Principal principal, UserHeartbeatCommand request, SimpMessageHeaderAccessor headers);
}
