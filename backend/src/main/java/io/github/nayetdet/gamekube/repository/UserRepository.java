package io.github.nayetdet.gamekube.repository;

import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.query.UserQuery;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
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
        AND (:#{#query.createdAfter} IS NULL OR u.createdAt >= :#{#query.createdAfter.atStartOfDay()})
        AND (:#{#query.createdBefore} IS NULL OR u.createdAt < :#{#query.createdBefore.plusDays(1).atStartOfDay()})
      """)
  Page<User> search(@Param("query") UserQuery query, Pageable pageable);

  Optional<User> findByUsername(String username);

  Optional<User> findByKeycloakId(UUID keycloakId);
}
