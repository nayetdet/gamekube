package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class UserAvatarInvalidException extends BaseException {

  public UserAvatarInvalidException(String message) {
    super(message);
  }
}

