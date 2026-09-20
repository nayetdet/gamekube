package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class GameInvalidException extends BaseException {

  private static final String DEFAULT_ERROR_MESSAGE = "Invalid game manifest";

  public GameInvalidException() {
    super(DEFAULT_ERROR_MESSAGE);
  }

  public GameInvalidException(Throwable cause) {
    super(DEFAULT_ERROR_MESSAGE, cause);
  }
}
