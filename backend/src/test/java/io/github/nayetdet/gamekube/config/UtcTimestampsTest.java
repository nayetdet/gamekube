package io.github.nayetdet.gamekube.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import io.github.nayetdet.gamekube.enums.UserStatus;
import io.github.nayetdet.gamekube.payload.http.response.FriendshipResponse;
import io.github.nayetdet.gamekube.payload.http.response.MessageResponse;
import io.github.nayetdet.gamekube.payload.http.response.UserResponse;
import io.github.nayetdet.gamekube.payload.websocket.event.MessageEvent;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.TimeZone;
import org.junit.jupiter.api.Test;
import tools.jackson.databind.json.JsonMapper;

class UtcTimestampsTest {
  @Test
  void auditingUsesUtcEvenWhenServerUsesAnotherTimeZone() {
    TimeZone previous = TimeZone.getDefault();
    try {
      TimeZone.setDefault(TimeZone.getTimeZone("America/Fortaleza"));
      LocalDateTime now =
          (LocalDateTime) new JpaAuditingConfig().utcDateTimeProvider().getNow().orElseThrow();
      long difference =
          Math.abs(java.time.Duration.between(now, LocalDateTime.now(ZoneOffset.UTC)).toSeconds());
      assertTrue(difference < 2);
    } finally {
      TimeZone.setDefault(previous);
    }
  }

  @Test
  void responsesAndRealtimeEventsMarkUtcTimestamps() {
    var mapper = JsonMapper.builder().build();
    var time = LocalDateTime.of(2026, 11, 16, 13, 30, 28, 123456000);
    var expected = "2026-11-16T13:30:28.123456Z";
    var message = MessageResponse.builder().createdAt(time).readAt(time).build();
    var friendship = FriendshipResponse.builder().createdAt(time).updatedAt(time).build();
    var user =
        UserResponse.builder()
            .createdAt(time)
            .updatedAt(time)
            .lastSeenAt(time)
            .status(UserStatus.OFFLINE)
            .build();
    var event = MessageEvent.builder().createdAt(time).readAt(time).build();
    assertEquals(
        expected, mapper.readTree(mapper.writeValueAsString(message)).get("createdAt").asString());
    assertEquals(
        expected, mapper.readTree(mapper.writeValueAsString(message)).get("readAt").asString());
    assertEquals(
        expected,
        mapper.readTree(mapper.writeValueAsString(friendship)).get("createdAt").asString());
    assertEquals(
        expected, mapper.readTree(mapper.writeValueAsString(user)).get("createdAt").asString());
    assertEquals(
        expected, mapper.readTree(mapper.writeValueAsString(user)).get("lastSeenAt").asString());
    assertEquals(
        expected, mapper.readTree(mapper.writeValueAsString(event)).get("createdAt").asString());
  }
}
