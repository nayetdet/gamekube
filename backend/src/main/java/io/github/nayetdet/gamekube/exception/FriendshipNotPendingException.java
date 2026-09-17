package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class FriendshipNotPendingException extends BaseException {

  private static final String DEFAULT_ERROR_MESSAGE = "Friendship request is not pending";

  public FriendshipNotPendingException() {
    super(DEFAULT_ERROR_MESSAGE);
  }

  public FriendshipNotPendingException(String message) {
    super(message);
  }
}
