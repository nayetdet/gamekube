package io.github.nayetdet.gamekube.repository;

import io.github.nayetdet.gamekube.enums.FriendshipStatus;
import io.github.nayetdet.gamekube.model.Friendship;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {

  @Query(
      """
      SELECT f FROM Friendship f
      WHERE (f.requester.id = :u1 AND f.addressee.id = :u2)
         OR (f.requester.id = :u2 AND f.addressee.id = :u1)
      """)
  Optional<Friendship> findBetweenUsers(@Param("u1") UUID u1, @Param("u2") UUID u2);

  @Query(
      """
      SELECT f FROM Friendship f
      JOIN FETCH f.requester r
      JOIN FETCH f.addressee a
      WHERE f.status = :status
        AND (r.id = :userId OR a.id = :userId)
      """)
  List<Friendship> findAllByUserIdAndStatus(
      @Param("userId") UUID userId, @Param("status") FriendshipStatus status);

  @Query(
      """
      SELECT f FROM Friendship f
      JOIN FETCH f.requester
      JOIN FETCH f.addressee
      WHERE f.addressee.id = :addresseeId AND f.status = 'PENDING'
      """)
  List<Friendship> findPendingReceivedRequests(@Param("addresseeId") UUID addresseeId);

  @Query(
      """
      SELECT f FROM Friendship f
      JOIN FETCH f.requester
      JOIN FETCH f.addressee
      WHERE f.requester.id = :requesterId AND f.status = 'PENDING'
      """)
  List<Friendship> findPendingSentRequests(@Param("requesterId") UUID requesterId);
}
