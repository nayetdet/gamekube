package io.github.nayetdet.gamekube.service;

import io.github.nayetdet.gamekube.enums.FriendshipStatus;
import io.github.nayetdet.gamekube.exception.UserNotFoundException;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.repository.FriendshipRepository;
import io.github.nayetdet.gamekube.repository.UserRepository;
import io.github.nayetdet.gamekube.security.AuthenticationHelper;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GameHistoryService {
  private final JdbcTemplate jdbc;
  private final UserRepository users;
  private final FriendshipRepository friendships;

  public record PlayedGame(String gameId, OffsetDateTime lastPlayedAt) {}

  public void record(String username, String gameId) {
    User user = users.findByUsername(username).orElseThrow(UserNotFoundException::new);
    jdbc.update(
        "INSERT INTO game_history (user_id, game_id, last_played_at) VALUES (?, ?, CURRENT_TIMESTAMP AT TIME ZONE 'UTC') ON CONFLICT (user_id, game_id) DO UPDATE SET last_played_at = EXCLUDED.last_played_at",
        user.getId(),
        gameId);
  }

  public List<PlayedGame> forFriend(String username) {
    User viewer =
        users
            .findByKeycloakId(AuthenticationHelper.getKeycloakId())
            .orElseThrow(UserNotFoundException::new);
    User target = users.findByUsername(username).orElseThrow(UserNotFoundException::new);
    if (!viewer.getId().equals(target.getId())
        && friendships
            .findBetweenUsers(viewer.getId(), target.getId())
            .filter(f -> f.getStatus() == FriendshipStatus.ACCEPTED)
            .isEmpty()) throw new UserNotFoundException();
    return jdbc.query(
        "SELECT game_id, last_played_at FROM game_history WHERE user_id = ? ORDER BY last_played_at DESC",
        (row, n) ->
            new PlayedGame(
                row.getString(1), row.getObject(2, LocalDateTime.class).atOffset(ZoneOffset.UTC)),
        target.getId());
  }

  public List<String> friendsForGame(String gameId) {
    User viewer =
        users
            .findByKeycloakId(AuthenticationHelper.getKeycloakId())
            .orElseThrow(UserNotFoundException::new);
    return jdbc.queryForList(
        "SELECT u.username FROM game_history h JOIN users u ON u.id = h.user_id JOIN friendships f ON ((f.requester_id = ? AND f.addressee_id = u.id) OR (f.addressee_id = ? AND f.requester_id = u.id)) WHERE f.status = 'ACCEPTED' AND h.game_id = ? ORDER BY h.last_played_at DESC",
        String.class,
        viewer.getId(),
        viewer.getId(),
        gameId);
  }
}
