package io.github.nayetdet.gamekube.exception;

public class UnreadableManifestGameException extends BaseException {

  public UnreadableManifestGameException(Throwable cause) {
    super("Game manifest could not be read", cause);
  }
}
