package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class MessageSelfReferenceException extends BaseException {

  private static final String DEFAULT_ERROR_MESSAGE = "A message cannot be sent to yourself";

  public MessageSelfReferenceException() {
    super(DEFAULT_ERROR_MESSAGE);
  }
}
