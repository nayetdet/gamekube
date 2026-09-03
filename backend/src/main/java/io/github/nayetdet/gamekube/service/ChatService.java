package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.exception.FriendshipRequiredException;
import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.mapper.ChatMessageMapper;
import io.github.nayetdet.gamekube.model.ChatMessage;
import io.github.nayetdet.gamekube.model.ChatMessageStatus;
import io.github.nayetdet.gamekube.model.Friendship;
import io.github.nayetdet.gamekube.model.FriendshipStatus;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.query.page.ApplicationPage;
import io.github.nayetdet.gamekube.payload.request.ChatMessageRequest;
import io.github.nayetdet.gamekube.payload.response.ChatMessageResponse;
import io.github.nayetdet.gamekube.repository.ChatMessageRepository;
import io.github.nayetdet.gamekube.repository.FriendshipRepository;
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
  private final ChatMessageRepository chatMessageRepository;
  private final ChatMessageMapper chatMessageMapper;
  private final SimpMessagingTemplate messagingTemplate;

  @Transactional
  public ChatMessageResponse sendMessage(String senderUsername, ChatMessageRequest request) {
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

    ChatMessage message = new ChatMessage();
    message.setSender(sender);
    message.setRecipient(recipient);
    message.setContent(request.getContent());
    message.setStatus(ChatMessageStatus.SENT);

    ChatMessage savedMessage = chatMessageRepository.save(message);
    ChatMessageResponse response = chatMessageMapper.toResponse(savedMessage);

    // Deliver to recipient via private queue
    messagingTemplate.convertAndSendToUser(recipient.getUsername(), "/queue/messages", response);

    // Echo to sender so multiple devices/tabs of the sender remain in sync
    messagingTemplate.convertAndSendToUser(sender.getUsername(), "/queue/messages", response);

    log.info(
        "Chat message {} dispatched from {} to {}",
        savedMessage.getId(),
        senderUsername,
        recipient.getUsername());

    return response;
  }

  @Transactional(readOnly = true)
  public ApplicationPage<ChatMessageResponse> getConversation(
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
        chatMessageRepository
            .findConversation(currentUser.getId(), friend.getId(), pageable)
            .map(chatMessageMapper::toResponse));
  }

  @Transactional
  public void markConversationAsRead(String currentUsername, String senderUsername) {
    User recipient =
        userRepository
            .findByUsername(currentUsername)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + currentUsername));

    User sender =
        userRepository
            .findByUsername(senderUsername)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + senderUsername));

    List<ChatMessage> unreadMessages =
        chatMessageRepository.findMessagesBySenderAndRecipientAndStatusNot(
            sender.getId(), recipient.getId(), ChatMessageStatus.READ);

    if (!unreadMessages.isEmpty()) {
      LocalDateTime now = LocalDateTime.now();
      for (ChatMessage msg : unreadMessages) {
        msg.setStatus(ChatMessageStatus.READ);
        msg.setReadAt(now);
      }
      chatMessageRepository.saveAll(unreadMessages);

      // Notify sender that messages were read
      messagingTemplate.convertAndSendToUser(
          sender.getUsername(),
          "/queue/read-receipts",
          Map.of(
              "readerUsername", currentUsername,
              "readAt", now.toString(),
              "count", unreadMessages.size()));
    }
  }

  @Transactional(readOnly = true)
  public long getUnreadCount(String currentUsername) {
    User user =
        userRepository
            .findByUsername(currentUsername)
            .orElseThrow(() -> new UserNotFoundException("User not found: " + currentUsername));

    return chatMessageRepository.countByRecipientIdAndStatusNot(
        user.getId(), ChatMessageStatus.READ);
  }
}
