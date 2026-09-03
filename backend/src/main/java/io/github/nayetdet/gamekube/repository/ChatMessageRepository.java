package io.github.nayetdet.gamekube.repository;

import io.github.nayetdet.gamekube.model.ChatMessage;
import io.github.nayetdet.gamekube.model.ChatMessageStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {

  @Query(
      value =
          """
          SELECT m FROM ChatMessage m
          JOIN FETCH m.sender
          JOIN FETCH m.recipient
          WHERE (m.sender.id = :u1 AND m.recipient.id = :u2)
             OR (m.sender.id = :u2 AND m.recipient.id = :u1)
          ORDER BY m.createdAt DESC
          """,
      countQuery =
          """
          SELECT COUNT(m) FROM ChatMessage m
          WHERE (m.sender.id = :u1 AND m.recipient.id = :u2)
             OR (m.sender.id = :u2 AND m.recipient.id = :u1)
          """)
  Page<ChatMessage> findConversation(@Param("u1") UUID u1, @Param("u2") UUID u2, Pageable pageable);

  @Query(
      """
      SELECT m FROM ChatMessage m
      WHERE m.sender.id = :senderId
        AND m.recipient.id = :recipientId
        AND m.status <> :status
      """)
  List<ChatMessage> findMessagesBySenderAndRecipientAndStatusNot(
      @Param("senderId") UUID senderId,
      @Param("recipientId") UUID recipientId,
      @Param("status") ChatMessageStatus status);

  long countByRecipientIdAndStatusNot(UUID recipientId, ChatMessageStatus status);
}
