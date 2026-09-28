package io.github.nayetdet.gamekube.security.jwt;

import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.repository.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

  private final UserRepository userRepository;

  @Override
  public AbstractAuthenticationToken convert(Jwt source) {
    UUID keycloakId = UUID.fromString(source.getSubject());
    User user = userRepository.findByKeycloakId(keycloakId).orElseThrow(UserNotFoundException::new);
    Map<String, List<String>> realmAccess = source.getClaim("realm_access");
    List<SimpleGrantedAuthority> grantedAuthorities =
        realmAccess == null || realmAccess.get("roles") == null
            ? List.of()
            : realmAccess.get("roles").stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                .toList();

    return new JwtAuthenticationToken(source, grantedAuthorities, user.getUsername());
  }
}
