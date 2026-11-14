package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserAvatarNotFoundException extends BaseException {

  private static final String DEFAULT_ERROR_MESSAGE = "User avatar not found";

  public UserAvatarNotFoundException() {
    super(DEFAULT_ERROR_MESSAGE);
  }
}

