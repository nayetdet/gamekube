package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class FriendshipSelfReferenceException extends BaseException {

  private static final String DEFAULT_ERROR_MESSAGE = "A friendship cannot reference yourself";

  public FriendshipSelfReferenceException() {
    super(DEFAULT_ERROR_MESSAGE);
  }

  public FriendshipSelfReferenceException(String message) {
    super(message);
  }
}
