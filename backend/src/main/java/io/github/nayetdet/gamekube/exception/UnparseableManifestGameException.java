package io.github.nayetdet.gamekube.exception;

public class UnparseableManifestGameException extends BaseException {

  public UnparseableManifestGameException(Throwable cause) {
    super("Game manifest could not be parsed", cause);
  }
}
