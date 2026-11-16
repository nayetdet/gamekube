package io.github.nayetdet.gamekube.repository;

import io.github.nayetdet.gamekube.enums.MessageStatus;
import io.github.nayetdet.gamekube.model.Message;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

  interface ConversationSummary {
    String getUsername();

    String getLastMessage();

    String getLastSenderUsername();

    long getUnreadCount();
  }

  @Query(
      value =
          """
      SELECT other.username AS "username", ranked.content AS "lastMessage",
             sender.username AS "lastSenderUsername", ranked.unread_count AS "unreadCount"
      FROM (
        SELECT m.*, CASE WHEN m.sender_id = :userId THEN m.recipient_id ELSE m.sender_id END AS other_id,
          ROW_NUMBER() OVER (PARTITION BY CASE WHEN m.sender_id = :userId THEN m.recipient_id ELSE m.sender_id END ORDER BY m.created_at DESC, m.id DESC) AS position,
          SUM(CASE WHEN m.recipient_id = :userId AND m.status <> 'READ' THEN 1 ELSE 0 END)
            OVER (PARTITION BY CASE WHEN m.sender_id = :userId THEN m.recipient_id ELSE m.sender_id END) AS unread_count
        FROM gamekube.messages m WHERE m.sender_id = :userId OR m.recipient_id = :userId
      ) ranked
      JOIN gamekube.users other ON other.id = ranked.other_id
      JOIN gamekube.users sender ON sender.id = ranked.sender_id
      WHERE ranked.position = 1
      ORDER BY ranked.created_at DESC, ranked.id DESC
      """,
      nativeQuery = true)
  List<ConversationSummary> findConversationSummaries(@Param("userId") UUID userId);

  @Query(
      value =
          """
          SELECT m FROM Message m
          JOIN FETCH m.sender
          JOIN FETCH m.recipient
          WHERE (m.sender.id = :u1 AND m.recipient.id = :u2)
             OR (m.sender.id = :u2 AND m.recipient.id = :u1)
          ORDER BY m.createdAt DESC
          """,
      countQuery =
          """
          SELECT COUNT(m) FROM Message m
          WHERE (m.sender.id = :u1 AND m.recipient.id = :u2)
             OR (m.sender.id = :u2 AND m.recipient.id = :u1)
          """)
  Page<Message> findConversation(@Param("u1") UUID u1, @Param("u2") UUID u2, Pageable pageable);

  @Query(
      """
      SELECT m FROM Message m
      WHERE m.sender.id = :senderId
        AND m.recipient.id = :recipientId
        AND m.status <> :status
      """)
  List<Message> findMessagesBySenderAndRecipientAndStatusNot(
      @Param("senderId") UUID senderId,
      @Param("recipientId") UUID recipientId,
      @Param("status") MessageStatus status);

  long countByRecipientIdAndStatusNot(UUID recipientId, MessageStatus status);
}
