package io.github.nayetdet.gamekube.controller.websocket.docs;

import io.github.nayetdet.gamekube.payload.websocket.command.GameHeartbeatCommand;
import java.security.Principal;

public interface GameControllerDocs {

  void heartbeat(Principal principal, GameHeartbeatCommand request);
}
