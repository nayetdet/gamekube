package io.github.nayetdet.gamekube.security.messaging;

import io.github.nayetdet.gamekube.security.jwt.JwtAuthenticationConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StompAuthenticationInterceptor implements ChannelInterceptor {

  private final JwtDecoder jwtDecoder;
  private final JwtAuthenticationConverter jwtAuthenticationConverter;

  @Override
  public Message<?> preSend(Message<?> message, MessageChannel channel) {
    StompHeaderAccessor accessor =
        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

    if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
      String token = extractToken(accessor);
      if (token == null) {
        throw new IllegalArgumentException("Missing Authorization header");
      }

      try {
        Jwt jwt = jwtDecoder.decode(token);
        AbstractAuthenticationToken authentication = jwtAuthenticationConverter.convert(jwt);
        accessor.setUser(authentication);
      } catch (JwtException e) {
        throw new IllegalArgumentException("Invalid JWT token", e);
      }
    }

    return message;
  }

  private String extractToken(StompHeaderAccessor accessor) {
    String authorization = accessor.getFirstNativeHeader("Authorization");
    if (authorization != null && authorization.startsWith("Bearer ")) {
      return authorization.substring(7).trim();
    }

    String token = accessor.getFirstNativeHeader("token");
    if (token == null || token.isBlank()) {
      return null;
    }

    return token.startsWith("Bearer ") ? token.substring(7).trim() : token;
  }
}
