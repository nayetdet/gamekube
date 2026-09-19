package io.github.nayetdet.gamekube.exception;

public class EmptyManifestGameException extends BaseException {

  public EmptyManifestGameException() {
    super("Game manifest is empty");
  }
}
