package io.github.nayetdet.gamekube.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class GameUnreadableManifestException extends BaseException {

  private static final String DEFAULT_ERROR_MESSAGE = "Game manifest could not be read";

  public GameUnreadableManifestException(Throwable cause) {
    super(DEFAULT_ERROR_MESSAGE, cause);
  }
}
