package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class GameInstanceActiveException extends BaseException {

  private static final String DEFAULT_ERROR_MESSAGE =
      "Cannot modify game save while game instance is active";

  public GameInstanceActiveException() {
    super(DEFAULT_ERROR_MESSAGE);
  }
}
