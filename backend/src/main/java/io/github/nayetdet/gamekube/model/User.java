package io.github.nayetdet.gamekube.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends BaseModel {

  @Column(name = "keycloak_id", unique = true, nullable = false)
  private UUID keycloakId;

  @Column(length = 50, unique = true, nullable = false)
  private String username;

  @Column(length = 100)
  private String name;

  @Column(length = 1000)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(length = 20, nullable = false)
  private PresenceStatus status = PresenceStatus.OFFLINE;

  @Column(name = "last_seen_at")
  private LocalDateTime lastSeenAt;

  @Column(name = "current_game", length = 100)
  private String currentGame;
}
