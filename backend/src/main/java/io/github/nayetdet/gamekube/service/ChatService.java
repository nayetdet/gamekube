package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.enums.FriendshipStatus;
import io.github.nayetdet.gamekube.enums.MessageStatus;
import io.github.nayetdet.gamekube.exception.FriendshipRequiredException;
import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.mapper.MessageMapper;
import io.github.nayetdet.gamekube.model.Friendship;
import io.github.nayetdet.gamekube.model.Message;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.query.page.ApplicationPage;
import io.github.nayetdet.gamekube.payload.request.MessageRequest;
import io.github.nayetdet.gamekube.payload.response.MessageResponse;
import io.github.nayetdet.gamekube.repository.FriendshipRepository;
import io.github.nayetdet.gamekube.repository.MessageRepository;
import io.github.nayetdet.gamekube.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

  private final UserRepository userRepository;
  private final FriendshipRepository friendshipRepository;
  private final MessageRepository messageRepository;
  private final MessageMapper messageMapper;
  private final SimpMessagingTemplate messagingTemplate;

  @Transactional(readOnly = true)
  public ApplicationPage<MessageResponse> findConversation(
      String currentUsername, String friendUsername, Pageable pageable) {
    User currentUser =
        userRepository
            .findByUsername(currentUsername)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + currentUsername));

    User friend =
        userRepository
            .findByUsername(friendUsername)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + friendUsername));

    return new ApplicationPage<>(
        messageRepository
            .findConversation(currentUser.getId(), friend.getId(), pageable)
            .map(messageMapper::toResponse));
  }

  @Transactional
  public void updateReadStatus(String currentUsername, String senderUsername) {
    User recipient =
        userRepository
            .findByUsername(currentUsername)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + currentUsername));

    User sender =
        userRepository
            .findByUsername(senderUsername)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + senderUsername));

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
          "/queue/read-receipts",
          Map.of(
              "readerUsername", currentUsername,
              "readAt", now.toString(),
              "count", unreadMessages.size()));
    }
  }

  @Transactional
  public MessageResponse create(String senderUsername, MessageRequest request) {
    User sender =
        userRepository
            .findByUsername(senderUsername)
            .orElseThrow(() -> new UserNotFoundException("Sender not found: " + senderUsername));

    User recipient =
        userRepository
            .findByUsername(request.getRecipientUsername())
            .orElseThrow(
                () ->
                    new UserNotFoundException(
                        "Recipient not found: " + request.getRecipientUsername()));

    if (sender.getId().equals(recipient.getId())) {
      throw new IllegalArgumentException("Cannot send message to yourself");
    }

    Friendship friendship =
        friendshipRepository
            .findBetweenUsers(sender.getId(), recipient.getId())
            .orElseThrow(
                () -> new FriendshipRequiredException("You can only message accepted friends"));

    if (friendship.getStatus() != FriendshipStatus.ACCEPTED) {
      throw new FriendshipRequiredException("You can only message accepted friends");
    }

    Message message = new Message();
    message.setSender(sender);
    message.setRecipient(recipient);
    message.setContent(request.getContent());
    message.setStatus(MessageStatus.SENT);

    Message savedMessage = messageRepository.save(message);
    MessageResponse response = messageMapper.toResponse(savedMessage);

    messagingTemplate.convertAndSendToUser(recipient.getUsername(), "/queue/messages", response);
    messagingTemplate.convertAndSendToUser(sender.getUsername(), "/queue/messages", response);

    log.info(
        "Chat message {} dispatched from {} to {}",
        savedMessage.getId(),
        senderUsername,
        recipient.getUsername());

    return response;
  }

  @Transactional(readOnly = true)
  public long countUnread(String currentUsername) {
    User user =
        userRepository
            .findByUsername(currentUsername)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + currentUsername));

    return messageRepository.countByRecipientIdAndStatusNot(user.getId(), MessageStatus.READ);
  }
}
