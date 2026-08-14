package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class KeycloakConflictException extends BaseException {

  private static final String DEFAULT_ERROR_MESSAGE =
      "A user with the given email or username already exists";

  public KeycloakConflictException() {
    super(KeycloakConflictException.DEFAULT_ERROR_MESSAGE);
  }
}
