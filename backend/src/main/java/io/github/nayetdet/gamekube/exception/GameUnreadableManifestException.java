package io.github.nayetdet.gamekube.exception;

public class GameUnreadableManifestException extends BaseException {

  private static final String MESSAGE = "Could not read game manifest";

  public GameUnreadableManifestException(Throwable cause) {
    super(MESSAGE, cause);
  }
}
