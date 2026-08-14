package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class KeycloakNotFoundException extends BaseException {

  private static final String DEFAULT_ERROR_MESSAGE = "Keycloak User not found";

  public KeycloakNotFoundException() {
    super(DEFAULT_ERROR_MESSAGE);
  }
}
