package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class FriendshipNotFoundException extends BaseException {

  private static final String DEFAULT_ERROR_MESSAGE = "Friendship request or relation not found";

  public FriendshipNotFoundException() {
    super(DEFAULT_ERROR_MESSAGE);
  }
}
