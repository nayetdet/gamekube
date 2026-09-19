package io.github.nayetdet.gamekube.exception;

public class InvalidFilenameGameException extends BaseException {

  public InvalidFilenameGameException() {
    super("Game manifest filename is invalid");
  }
}
