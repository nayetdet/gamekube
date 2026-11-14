package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_GATEWAY)
public class StorageException extends BaseException {

  private static final String DEFAULT_ERROR_MESSAGE = "Failed to communicate with object storage";

  public StorageException(Throwable cause) {
    super(DEFAULT_ERROR_MESSAGE, cause);
  }
}

