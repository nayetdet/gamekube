package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.enums.FriendshipStatus;
import io.github.nayetdet.gamekube.enums.MessageStatus;
import io.github.nayetdet.gamekube.exception.FriendshipRequiredException;
import io.github.nayetdet.gamekube.exception.MessageSelfReferenceException;
import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.mapper.MessageMapper;
import io.github.nayetdet.gamekube.model.Message;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.http.query.page.ApplicationPage;
import io.github.nayetdet.gamekube.payload.http.request.MessageRequest;
import io.github.nayetdet.gamekube.payload.http.response.MessageResponse;
import io.github.nayetdet.gamekube.payload.websocket.event.MessageEvent;
import io.github.nayetdet.gamekube.payload.websocket.event.MessagesReadEvent;
import io.github.nayetdet.gamekube.repository.FriendshipRepository;
import io.github.nayetdet.gamekube.repository.MessageRepository;
import io.github.nayetdet.gamekube.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageService {

  private final UserRepository userRepository;
  private final FriendshipRepository friendshipRepository;
  private final MessageRepository messageRepository;
  private final MessageMapper messageMapper;
  private final SimpMessagingTemplate messagingTemplate;

  @Transactional(readOnly = true)
  public ApplicationPage<MessageResponse> findConversation(
      String currentUsername, String friendUsername, Pageable pageable) {
    User currentUser =
        userRepository.findByUsername(currentUsername).orElseThrow(UserNotFoundException::new);

    User friend =
        userRepository.findByUsername(friendUsername).orElseThrow(UserNotFoundException::new);

    return new ApplicationPage<>(
        messageRepository
            .findConversation(currentUser.getId(), friend.getId(), pageable)
            .map(messageMapper::toResponse));
  }

  @Transactional
  public void updateReadStatus(String currentUsername, String senderUsername) {
    User recipient =
        userRepository.findByUsername(currentUsername).orElseThrow(UserNotFoundException::new);

    User sender =
        userRepository.findByUsername(senderUsername).orElseThrow(UserNotFoundException::new);

    List<Message> unreadMessages =
        messageRepository.findMessagesBySenderAndRecipientAndStatusNot(
            sender.getId(), recipient.getId(), MessageStatus.READ);

    if (!unreadMessages.isEmpty()) {
      LocalDateTime now = LocalDateTime.now();
      for (Message msg : unreadMessages) {
        msg.setStatus(MessageStatus.READ);
        msg.setReadAt(now);
      }

      messageRepository.saveAll(unreadMessages);
      messagingTemplate.convertAndSendToUser(
          sender.getUsername(),
          "/queue/messages/read",
          MessagesReadEvent.builder()
              .readerUsername(currentUsername)
              .readAt(now.toString())
              .count(unreadMessages.size())
              .build());
    }
  }

  @Transactional
  public MessageResponse create(
      String senderUsername, String recipientUsername, MessageRequest request) {
    return create(senderUsername, recipientUsername, request.getContent());
  }

  @Transactional
  public MessageResponse create(String senderUsername, String recipientUsername, String content) {
    User sender =
        userRepository.findByUsername(senderUsername).orElseThrow(UserNotFoundException::new);

    User recipient =
        userRepository.findByUsername(recipientUsername).orElseThrow(UserNotFoundException::new);

    if (sender.getId().equals(recipient.getId())) {
      throw new MessageSelfReferenceException();
    }

    friendshipRepository
        .findBetweenUsers(sender.getId(), recipient.getId())
        .filter(friendship -> friendship.getStatus() == FriendshipStatus.ACCEPTED)
        .orElseThrow(FriendshipRequiredException::new);

    MessageResponse response =
        messageMapper.toResponse(
            messageRepository.save(
                Message.builder()
                    .sender(sender)
                    .recipient(recipient)
                    .content(content)
                    .status(MessageStatus.SENT)
                    .build()));

    MessageEvent event =
        MessageEvent.from(
            response.getId(),
            response.getSenderUsername(),
            response.getRecipientUsername(),
            response.getContent(),
            response.getStatus(),
            response.getCreatedAt(),
            response.getReadAt());
    messagingTemplate.convertAndSendToUser(recipient.getUsername(), "/queue/messages", event);
    messagingTemplate.convertAndSendToUser(sender.getUsername(), "/queue/messages", event);

    log.info(
        "Message {} dispatched from {} to {}",
        response.getId(),
        senderUsername,
        recipient.getUsername());

    return response;
  }

  @Transactional
  public MessageEvent createEvent(String senderUsername, String recipientUsername, String content) {
    MessageResponse response = create(senderUsername, recipientUsername, content);
    return MessageEvent.from(
        response.getId(),
        response.getSenderUsername(),
        response.getRecipientUsername(),
        response.getContent(),
        response.getStatus(),
        response.getCreatedAt(),
        response.getReadAt());
  }

  @Transactional(readOnly = true)
  public long countUnread(String currentUsername) {
    User user =
        userRepository.findByUsername(currentUsername).orElseThrow(UserNotFoundException::new);
    return messageRepository.countByRecipientIdAndStatusNot(user.getId(), MessageStatus.READ);
  }
}
