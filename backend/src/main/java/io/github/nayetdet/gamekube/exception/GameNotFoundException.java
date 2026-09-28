package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class GameNotFoundException extends BaseException {

  private static final String MESSAGE = "Game manifest not found";

  public GameNotFoundException() {
    super(MESSAGE);
  }
}
