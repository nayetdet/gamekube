package io.github.nayetdet.gamekube.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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
}
