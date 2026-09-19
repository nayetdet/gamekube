package io.github.nayetdet.gamekube.exception;

public class DuplicateIdGameException extends BaseException {

  public DuplicateIdGameException() {
    super("Game ID is duplicated");
  }
}
