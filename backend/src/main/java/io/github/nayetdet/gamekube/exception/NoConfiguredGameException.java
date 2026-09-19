package io.github.nayetdet.gamekube.exception;

public class NoConfiguredGameException extends BaseException {

  public NoConfiguredGameException() {
    super("No games are configured");
  }
}
