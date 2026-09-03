package io.github.nayetdet.gamekube.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "chat_messages")
public class ChatMessage extends BaseModel {

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "sender_id", nullable = false)
  private User sender;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "recipient_id", nullable = false)
  private User recipient;

  @Column(length = 2000, nullable = false)
  private String content;

  @Enumerated(EnumType.STRING)
  @Column(length = 20, nullable = false)
  private ChatMessageStatus status = ChatMessageStatus.SENT;

  @Column(name = "read_at")
  private LocalDateTime readAt;
}
