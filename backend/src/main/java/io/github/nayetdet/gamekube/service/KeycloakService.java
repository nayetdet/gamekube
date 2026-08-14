package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.exception.strategy.KeycloakExceptionStrategy;
import io.github.nayetdet.gamekube.payload.request.UserUpdateRequest;
import jakarta.ws.rs.WebApplicationException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class KeycloakService {

  private final UsersResource usersResource;

  public void updateEmail(UUID keycloakId) {
    try {
      usersResource.get(keycloakId.toString()).executeActionsEmail(List.of("UPDATE_EMAIL"));
    } catch (WebApplicationException e) {
      log.error(e.getMessage());
      throw KeycloakExceptionStrategy.of(e.getResponse().getStatus());
    }
  }

  public void update(UUID keycloakId, UserUpdateRequest request) {
    try {
      UserRepresentation userRepresentation = new UserRepresentation();
      userRepresentation.setUsername(request.getUsername());
      usersResource.get(keycloakId.toString()).update(userRepresentation);
    } catch (WebApplicationException e) {
      log.error(e.getMessage());
      throw KeycloakExceptionStrategy.of(e.getResponse().getStatus());
    }
  }

  public void delete(UUID keycloakId) {
    try {
      usersResource.get(keycloakId.toString()).remove();
    } catch (WebApplicationException e) {
      log.error(e.getMessage());
      throw KeycloakExceptionStrategy.of(e.getResponse().getStatus());
    }
  }
}
