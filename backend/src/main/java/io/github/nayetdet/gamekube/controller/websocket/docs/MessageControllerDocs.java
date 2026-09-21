package io.github.nayetdet.gamekube.controller.websocket.docs;

import io.github.nayetdet.gamekube.payload.websocket.command.MessageReadCommand;
import io.github.nayetdet.gamekube.payload.websocket.command.MessageSendCommand;
import io.github.nayetdet.gamekube.payload.websocket.event.MessageEvent;
import io.github.nayetdet.gamekube.payload.websocket.event.MessagesReadEvent;
import io.github.springwolf.bindings.stomp.annotations.StompAsyncOperationBinding;
import io.github.springwolf.core.asyncapi.annotations.AsyncMessage;
import io.github.springwolf.core.asyncapi.annotations.AsyncOperation;
import io.github.springwolf.core.asyncapi.annotations.AsyncPublisher;
import java.security.Principal;

public interface MessageControllerDocs {

  @AsyncPublisher(
      operation =
          @AsyncOperation(
              channelName = "/user/queue/messages",
              description =
                  "Emitted privately to the recipient and echoed to the sender after persistence. Both users receive the same canonical message representation, including its identifier, sender, recipient, status and timestamps.",
              message =
                  @AsyncMessage(
                      name = "MessageReceived",
                      title = "Message received",
                      description = "Canonical message delivered to a user's private queue.",
                      contentType = "application/json"),
              payloadType = MessageEvent.class))
  @StompAsyncOperationBinding
  MessageEvent send(Principal principal, MessageSendCommand command);

  @AsyncPublisher(
      operation =
          @AsyncOperation(
              channelName = "/user/queue/messages/read",
              description =
                  "Emitted privately to the original sender after one or more of their messages are marked as read. The event contains the reader username, the read timestamp and the number of messages updated.",
              message =
                  @AsyncMessage(
                      name = "MessagesRead",
                      title = "Messages read",
                      description = "Private notification that one or more messages were read.",
                      contentType = "application/json"),
              payloadType = MessagesReadEvent.class))
  @StompAsyncOperationBinding
  void markAsRead(Principal principal, MessageReadCommand request);
}
