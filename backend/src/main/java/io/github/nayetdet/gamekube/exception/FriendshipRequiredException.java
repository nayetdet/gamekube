package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class FriendshipRequiredException extends BaseException {

  private static final String DEFAULT_ERROR_MESSAGE = "Users must be friends to chat";

  public FriendshipRequiredException() {
    super(DEFAULT_ERROR_MESSAGE);
  }
}
