package io.github.nayetdet.gamekube.exception;

public abstract class BaseException extends RuntimeException {

  protected BaseException(String message) {
    super(message);
  }
}
