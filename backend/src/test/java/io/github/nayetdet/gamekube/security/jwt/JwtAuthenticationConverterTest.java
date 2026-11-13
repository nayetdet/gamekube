package io.github.nayetdet.gamekube.security.jwt;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;

import io.github.nayetdet.gamekube.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;

class JwtAuthenticationConverterTest {

  private final UserRepository userRepository = mock(UserRepository.class);
  private final JwtAuthenticationConverter converter =
      new JwtAuthenticationConverter(userRepository);

  @Test
  void rejectsTokenWithoutSubject() {
    Jwt jwt =
        Jwt.withTokenValue("token").header("alg", "none").issuer("https://issuer.example").build();

    assertThrows(InvalidBearerTokenException.class, () -> converter.convert(jwt));
    verifyNoInteractions(userRepository);
  }

  @Test
  void rejectsTokenWithNonUuidSubject() {
    Jwt jwt = Jwt.withTokenValue("token").header("alg", "none").subject("not-a-uuid").build();

    assertThrows(InvalidBearerTokenException.class, () -> converter.convert(jwt));
    verifyNoInteractions(userRepository);
  }
}
