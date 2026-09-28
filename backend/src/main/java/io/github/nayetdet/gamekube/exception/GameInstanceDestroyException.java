package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_GATEWAY)
public class GameInstanceDestroyException extends BaseException {

  private static final String MESSAGE = "Could not destroy game instance";

  public GameInstanceDestroyException(Throwable cause) {
    super(MESSAGE, cause);
  }
}
