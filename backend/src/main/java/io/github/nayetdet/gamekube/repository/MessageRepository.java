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
