package io.github.nayetdet.gamekube.repository;

import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.query.UserQuery;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

  @Query(
      """
      SELECT u FROM User u
      WHERE (:#{#query.username} IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :#{#query.username}, '%')))
        AND (:#{#query.name} IS NULL OR LOWER(COALESCE(u.name, '')) LIKE LOWER(CONCAT('%', :#{#query.name}, '%')))
        AND (:#{#query.lastSeenAtAfter} IS NULL OR u.lastSeenAt >= :#{#query.lastSeenAtAfter.atStartOfDay()})
        AND (:#{#query.lastSeenAtBefore} IS NULL OR u.lastSeenAt < :#{#query.lastSeenAtBefore.plusDays(1).atStartOfDay()})
        AND (:#{#query.createdAfter} IS NULL OR u.createdAt >= :#{#query.createdAfter.atStartOfDay()})
        AND (:#{#query.createdBefore} IS NULL OR u.createdAt < :#{#query.createdBefore.plusDays(1).atStartOfDay()})
      """)
  Page<User> search(@Param("query") UserQuery query, Pageable pageable);

  Optional<User> findByUsername(String username);

  Optional<User> findByKeycloakId(UUID keycloakId);

  @Modifying
  @Query("UPDATE User u SET u.lastSeenAt = :lastSeenAt WHERE u.username = :username")
  void updateLastSeenAt(String username, LocalDateTime lastSeenAt);
}
