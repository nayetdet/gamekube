package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.model.PresenceStatus;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.request.UserPresenceRequest;
import io.github.nayetdet.gamekube.payload.response.UserPresenceResponse;
import io.github.nayetdet.gamekube.repository.UserRepository;
import io.github.nayetdet.gamekube.security.authorization.AuthorizationHelper;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserPresenceService {

  private final UserRepository userRepository;

  @Transactional
  public UserPresenceResponse updateSelfPresence(UserPresenceRequest request) {
    User user =
        userRepository
            .findByKeycloakId(AuthorizationHelper.getCurrentKeycloakId())
            .orElseThrow(UserNotFoundException::new);

    user.setStatus(request.getStatus());
    if (request.getStatus() == PresenceStatus.OFFLINE) {
      user.setLastSeenAt(LocalDateTime.now());
      user.setCurrentGame(null);
    } else {
      String game = request.getCurrentGame();
      user.setCurrentGame(game != null && !game.isBlank() ? game.trim() : null);
    }

    userRepository.save(user);

    return UserPresenceResponse.builder()
        .status(user.getStatus())
        .lastSeenAt(user.getLastSeenAt())
        .currentGame(user.getCurrentGame())
        .build();
  }

  @Transactional(readOnly = true)
  public UserPresenceResponse getPresenceByUsername(String username) {
    User user = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);

    return UserPresenceResponse.builder()
        .status(user.getStatus())
        .lastSeenAt(user.getLastSeenAt())
        .currentGame(user.getCurrentGame())
        .build();
  }
}
