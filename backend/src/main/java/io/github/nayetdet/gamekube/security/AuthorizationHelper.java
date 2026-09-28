package io.github.nayetdet.gamekube.security;

import io.github.nayetdet.gamekube.exception.UserModificationForbiddenException;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;
import lombok.experimental.UtilityClass;

@UtilityClass
public class AuthorizationHelper {

  public static void validateResourceAccess(
      UUID expectedKeycloakId, Supplier<? extends RuntimeException> supplier) {
    UUID keycloakId = AuthenticationHelper.getKeycloakId();
    List<String> jwtRoles = AuthenticationHelper.getJwtRoles();
    if (!expectedKeycloakId.equals(keycloakId) && !jwtRoles.contains("admin")) {
      throw supplier.get();
    }
  }

  public static void validateResourceAccess(UUID expectedKeycloakId) {
    validateResourceAccess(expectedKeycloakId, UserModificationForbiddenException::new);
  }
}
