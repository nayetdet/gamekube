package io.github.nayetdet.gamekube.controller.websocket;

import io.github.nayetdet.gamekube.controller.websocket.docs.GameWebSocketControllerDocs;
import io.github.nayetdet.gamekube.exception.UserUnauthorizedException;
import io.github.nayetdet.gamekube.payload.websocket.command.GameHeartbeatCommand;
import io.github.nayetdet.gamekube.service.GameService;
import jakarta.validation.Valid;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class GameWebSocketController implements GameWebSocketControllerDocs {

  private final GameService gameService;

  @Override
  @MessageMapping("/game.heartbeat")
  public void heartbeat(Principal principal, @Payload @Valid GameHeartbeatCommand request) {
    if (principal == null) {
      throw new UserUnauthorizedException();
    }

    gameService.heartbeat(request.getGameId(), principal.getName());
  }
}
