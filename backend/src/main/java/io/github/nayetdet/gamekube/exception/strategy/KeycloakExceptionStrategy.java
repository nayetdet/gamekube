package io.github.nayetdet.gamekube.exception.strategy;

import io.github.nayetdet.gamekube.exception.KeycloakBadGatewayException;
import io.github.nayetdet.gamekube.exception.KeycloakBadRequestException;
import io.github.nayetdet.gamekube.exception.KeycloakConflictException;
import io.github.nayetdet.gamekube.exception.KeycloakForbiddenException;
import io.github.nayetdet.gamekube.exception.KeycloakNotFoundException;
import java.util.function.Supplier;
import org.apache.http.HttpStatus;

public enum KeycloakExceptionStrategy {
  BAD_REQUEST(HttpStatus.SC_BAD_REQUEST, KeycloakBadRequestException::new),
  FORBIDDEN(HttpStatus.SC_FORBIDDEN, KeycloakForbiddenException::new),
  NOT_FOUND(HttpStatus.SC_NOT_FOUND, KeycloakNotFoundException::new),
  CONFLICT(HttpStatus.SC_CONFLICT, KeycloakConflictException::new);

  private final int statusCode;
  private final Supplier<RuntimeException> supplier;

  KeycloakExceptionStrategy(int statusCode, Supplier<RuntimeException> supplier) {
    this.statusCode = statusCode;
    this.supplier = supplier;
  }

  public static RuntimeException of(int statusCode) {
    for (var strategy : values()) {
      if (strategy.statusCode == statusCode) {
        return strategy.supplier.get();
      }
    }

    return new KeycloakBadGatewayException();
  }
}
