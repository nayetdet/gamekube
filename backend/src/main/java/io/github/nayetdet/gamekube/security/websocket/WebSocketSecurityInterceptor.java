package io.github.nayetdet.gamekube.security.websocket;

import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.repository.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketSecurityInterceptor implements ChannelInterceptor {

  private final JwtDecoder jwtDecoder;
  private final UserRepository userRepository;

  @Override
  public Message<?> preSend(Message<?> message, MessageChannel channel) {
    StompHeaderAccessor accessor =
        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

    if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
      String authHeader = accessor.getFirstNativeHeader("Authorization");
      if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        String tokenHeader = accessor.getFirstNativeHeader("token");
        if (tokenHeader != null) {
          authHeader = tokenHeader.startsWith("Bearer ") ? tokenHeader : "Bearer " + tokenHeader;
        }
      }

      if (authHeader != null && authHeader.startsWith("Bearer ")) {
        String token = authHeader.substring(7).trim();
        try {
          Jwt jwt = jwtDecoder.decode(token);
          UUID keycloakId = UUID.fromString(jwt.getSubject());
          User user =
              userRepository
                  .findByKeycloakId(keycloakId)
                  .orElseThrow(
                      () ->
                          new UserNotFoundException(
                              "User not found for Keycloak ID: " + keycloakId));

          Map<String, List<String>> realmAccess = jwt.getClaim("realm_access");
          List<SimpleGrantedAuthority> authorities = List.of();
          if (realmAccess != null && realmAccess.containsKey("roles")) {
            authorities =
                realmAccess.get("roles").stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                    .toList();
          }

          JwtAuthenticationToken authentication =
              new JwtAuthenticationToken(jwt, authorities, user.getUsername());
          accessor.setUser(authentication);
          log.info("WebSocket user authenticated: {}", user.getUsername());
        } catch (JwtException e) {
          log.error(
              "Failed to authenticate WebSocket connection: Invalid JWT token - {}",
              e.getMessage());
          throw new IllegalArgumentException("Invalid JWT token", e);
        } catch (Exception e) {
          log.error("Failed to authenticate WebSocket connection: {}", e.getMessage());
          throw new IllegalArgumentException("Authentication failed", e);
        }
      } else {
        log.warn("WebSocket CONNECT attempted without Authorization header");
        throw new IllegalArgumentException("Missing Authorization header");
      }
    }

    return message;
  }
}
