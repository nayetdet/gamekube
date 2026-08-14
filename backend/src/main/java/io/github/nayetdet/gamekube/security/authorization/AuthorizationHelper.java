package io.github.nayetdet.gamekube.security.authorization;

import io.github.nayetdet.gamekube.exception.UserModificationForbiddenException;
import io.github.nayetdet.gamekube.exception.UserUnauthorizedException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Supplier;
import lombok.experimental.UtilityClass;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

@UtilityClass
public class AuthorizationHelper {

  public static void validateResourceAccess(
      UUID expectedKeycloakId, Supplier<? extends RuntimeException> supplier) {
    Jwt jwt = getJwt();
    List<String> jwtRoles = getJwtRoles(jwt);
    if (!expectedKeycloakId.equals(UUID.fromString(jwt.getSubject()))
        && !jwtRoles.contains("admin")) {
      throw supplier.get();
    }
  }

  public static void validateResourceAccess(UUID expectedKeycloakId) {
    validateResourceAccess(expectedKeycloakId, UserModificationForbiddenException::new);
  }

  public static UUID getCurrentKeycloakId() {
    return UUID.fromString(getJwt().getSubject());
  }

  private static Jwt getJwt() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null
        || !authentication.isAuthenticated()
        || !(authentication.getCredentials() instanceof Jwt)) {
      throw new UserUnauthorizedException();
    }

    return (Jwt) authentication.getCredentials();
  }

  private static List<String> getJwtRoles(Jwt jwt) {
    Map<String, List<String>> realmAccess = jwt.getClaim("realm_access");
    return realmAccess.get("roles");
  }
}
