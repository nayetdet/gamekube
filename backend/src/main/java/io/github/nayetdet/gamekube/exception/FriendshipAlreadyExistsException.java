package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class FriendshipAlreadyExistsException extends BaseException {

  private static final String DEFAULT_ERROR_MESSAGE = "Friendship or request already exists";

  public FriendshipAlreadyExistsException() {
    super(DEFAULT_ERROR_MESSAGE);
  }

  public FriendshipAlreadyExistsException(String message) {
    super(message);
  }
}
