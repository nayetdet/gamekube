package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_GATEWAY)
public class KeycloakBadGatewayException extends BaseException {

  private static final String DEFAULT_ERROR_MESSAGE =
      "An unexpected error occurred while communicating with Keycloak";

  public KeycloakBadGatewayException() {
    super(DEFAULT_ERROR_MESSAGE);
  }
}
