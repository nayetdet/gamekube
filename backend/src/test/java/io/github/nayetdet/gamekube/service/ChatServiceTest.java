package io.github.nayetdet.gamekube.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import io.github.nayetdet.gamekube.exception.FriendshipRequiredException;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

  @Mock private UserRepository userRepository;
  @Mock private FriendshipRepository friendshipRepository;
  @Mock private ChatMessageRepository chatMessageRepository;
  @Spy private ChatMessageMapper chatMessageMapper;
  @Mock private SimpMessagingTemplate messagingTemplate;

  @InjectMocks private ChatService chatService;

  private User sender;
  private User recipient;
  private Friendship friendship;

  @BeforeEach
  void setUp() {
    sender = new User();
    sender.setId(UUID.randomUUID());
    sender.setUsername("alice");

    recipient = new User();
    recipient.setId(UUID.randomUUID());
    recipient.setUsername("bob");

    friendship = new Friendship();
    friendship.setId(UUID.randomUUID());
    friendship.setRequester(sender);
    friendship.setAddressee(recipient);
    friendship.setStatus(FriendshipStatus.ACCEPTED);
  }

  @Test
  @DisplayName("Should successfully send message to an accepted friend")
  void shouldSendMessageSuccessfully() {
    ChatMessageRequest request =
        ChatMessageRequest.builder().recipientUsername("bob").content("Hello Bob!").build();

    when(userRepository.findByUsername("alice")).thenReturn(Optional.of(sender));
    when(userRepository.findByUsername("bob")).thenReturn(Optional.of(recipient));
    when(friendshipRepository.findBetweenUsers(sender.getId(), recipient.getId()))
        .thenReturn(Optional.of(friendship));

    ChatMessage saved = new ChatMessage();
    saved.setId(UUID.randomUUID());
    saved.setSender(sender);
    saved.setRecipient(recipient);
    saved.setContent("Hello Bob!");
    saved.setStatus(ChatMessageStatus.SENT);

    when(chatMessageRepository.save(any(ChatMessage.class))).thenReturn(saved);

    ChatMessageResponse response = chatService.sendMessage("alice", request);

    assertThat(response).isNotNull();
    assertThat(response.getContent()).isEqualTo("Hello Bob!");
    assertThat(response.getSenderUsername()).isEqualTo("alice");
    assertThat(response.getRecipientUsername()).isEqualTo("bob");
    assertThat(response.getStatus()).isEqualTo(ChatMessageStatus.SENT);

    verify(messagingTemplate, times(1))
        .convertAndSendToUser(eq("bob"), eq("/queue/messages"), any(ChatMessageResponse.class));
    verify(messagingTemplate, times(1))
        .convertAndSendToUser(eq("alice"), eq("/queue/messages"), any(ChatMessageResponse.class));
  }

  @Test
  @DisplayName("Should throw IllegalArgumentException when sending message to self")
  void shouldThrowWhenSendingToSelf() {
    ChatMessageRequest request =
        ChatMessageRequest.builder().recipientUsername("alice").content("Note to self").build();

    when(userRepository.findByUsername("alice")).thenReturn(Optional.of(sender));

    assertThatThrownBy(() -> chatService.sendMessage("alice", request))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("Cannot send message to yourself");

    verify(chatMessageRepository, never()).save(any());
  }

  @Test
  @DisplayName("Should throw FriendshipRequiredException when users are not friends")
  void shouldThrowWhenNotFriends() {
    ChatMessageRequest request =
        ChatMessageRequest.builder().recipientUsername("bob").content("Hello stranger").build();

    when(userRepository.findByUsername("alice")).thenReturn(Optional.of(sender));
    when(userRepository.findByUsername("bob")).thenReturn(Optional.of(recipient));
    when(friendshipRepository.findBetweenUsers(sender.getId(), recipient.getId()))
        .thenReturn(Optional.empty());

    assertThatThrownBy(() -> chatService.sendMessage("alice", request))
        .isInstanceOf(FriendshipRequiredException.class);

    verify(chatMessageRepository, never()).save(any());
  }

  @Test
  @DisplayName("Should throw FriendshipRequiredException when friendship is still PENDING")
  void shouldThrowWhenFriendshipPending() {
    friendship.setStatus(FriendshipStatus.PENDING);

    ChatMessageRequest request =
        ChatMessageRequest.builder()
            .recipientUsername("bob")
            .content("Hello pending friend")
            .build();

    when(userRepository.findByUsername("alice")).thenReturn(Optional.of(sender));
    when(userRepository.findByUsername("bob")).thenReturn(Optional.of(recipient));
    when(friendshipRepository.findBetweenUsers(sender.getId(), recipient.getId()))
        .thenReturn(Optional.of(friendship));

    assertThatThrownBy(() -> chatService.sendMessage("alice", request))
        .isInstanceOf(FriendshipRequiredException.class);

    verify(chatMessageRepository, never()).save(any());
  }

  @Test
  @DisplayName("Should get paginated conversation history between friends")
  void shouldGetConversationHistory() {
    Pageable pageable = PageRequest.of(0, 10);

    ChatMessage msg = new ChatMessage();
    msg.setId(UUID.randomUUID());
    msg.setSender(sender);
    msg.setRecipient(recipient);
    msg.setContent("History test");
    msg.setStatus(ChatMessageStatus.SENT);

    Page<ChatMessage> page = new PageImpl<>(List.of(msg), pageable, 1);

    when(userRepository.findByUsername("alice")).thenReturn(Optional.of(sender));
    when(userRepository.findByUsername("bob")).thenReturn(Optional.of(recipient));
    when(chatMessageRepository.findConversation(sender.getId(), recipient.getId(), pageable))
        .thenReturn(page);

    ApplicationPage<ChatMessageResponse> result =
        chatService.getConversation("alice", "bob", pageable);

    assertThat(result.getContent()).hasSize(1);
    assertThat(result.getContent().get(0).getContent()).isEqualTo("History test");
  }

  @Test
  @DisplayName("Should mark unread messages as READ and notify sender")
  void shouldMarkConversationAsRead() {
    ChatMessage msg = new ChatMessage();
    msg.setId(UUID.randomUUID());
    msg.setSender(sender);
    msg.setRecipient(recipient);
    msg.setContent("Unread message");
    msg.setStatus(ChatMessageStatus.SENT);

    List<ChatMessage> unreadList = new ArrayList<>(List.of(msg));

    when(userRepository.findByUsername("bob")).thenReturn(Optional.of(recipient));
    when(userRepository.findByUsername("alice")).thenReturn(Optional.of(sender));
    when(chatMessageRepository.findMessagesBySenderAndRecipientAndStatusNot(
            sender.getId(), recipient.getId(), ChatMessageStatus.READ))
        .thenReturn(unreadList);

    chatService.markConversationAsRead("bob", "alice");

    assertThat(msg.getStatus()).isEqualTo(ChatMessageStatus.READ);
    assertThat(msg.getReadAt()).isNotNull();
    verify(chatMessageRepository, times(1)).saveAll(unreadList);
    verify(messagingTemplate, times(1))
        .convertAndSendToUser(eq("alice"), eq("/queue/read-receipts"), any());
  }
}
