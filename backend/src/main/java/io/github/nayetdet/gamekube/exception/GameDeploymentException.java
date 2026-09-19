package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_GATEWAY)
public class GameDeploymentException extends BaseException {

  private static final String MESSAGE = "Could not deploy game resources";

  public GameDeploymentException(Throwable cause) {
    super(MESSAGE, cause);
  }
}
