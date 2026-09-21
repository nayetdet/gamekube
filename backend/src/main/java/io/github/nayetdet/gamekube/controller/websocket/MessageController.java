package io.github.nayetdet.gamekube.controller.websocket;

import io.github.nayetdet.gamekube.controller.websocket.docs.MessageControllerDocs;
import io.github.nayetdet.gamekube.exception.UserUnauthorizedException;
import io.github.nayetdet.gamekube.payload.websocket.command.MessageReadCommand;
import io.github.nayetdet.gamekube.payload.websocket.command.MessageSendCommand;
import io.github.nayetdet.gamekube.payload.websocket.event.MessageEvent;
import io.github.nayetdet.gamekube.service.MessageService;
import io.github.springwolf.bindings.stomp.annotations.StompAsyncOperationBinding;
import jakarta.validation.Valid;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class MessageController implements MessageControllerDocs {

  private final MessageService messageService;

  @Override
  @MessageMapping("/message.send")
  @StompAsyncOperationBinding
  public MessageEvent send(Principal principal, @Payload @Valid MessageSendCommand command) {
    if (principal == null) {
      throw new UserUnauthorizedException();
    }

    return messageService.createEvent(
        principal.getName(), command.getRecipientUsername(), command.getContent());
  }

  @Override
  @MessageMapping("/message.read")
  @StompAsyncOperationBinding
  public void markAsRead(Principal principal, @Payload MessageReadCommand request) {
    if (principal == null) {
      throw new UserUnauthorizedException();
    }

    String senderUsername = request == null ? null : request.getSenderUsername();
    if (senderUsername != null && !senderUsername.isBlank()) {
      messageService.updateReadStatus(principal.getName(), senderUsername);
    }
  }
}
