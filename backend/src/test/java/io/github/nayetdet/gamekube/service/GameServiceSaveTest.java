package io.github.nayetdet.gamekube.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import io.github.nayetdet.gamekube.exception.GameInstanceActiveException;
import io.github.nayetdet.gamekube.exception.GameSaveNotFoundException;
import io.github.nayetdet.gamekube.game.Game;
import io.github.nayetdet.gamekube.game.GameInstanceLifecycleProvider;
import io.github.nayetdet.gamekube.game.GameInstanceProvider;
import io.github.nayetdet.gamekube.game.GameProvider;
import io.github.nayetdet.gamekube.mapper.GameMapper;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.repository.UserRepository;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

@ExtendWith(MockitoExtension.class)
class GameServiceSaveTest {

  @Mock private GameMapper gameMapper;
  @Mock private GameProvider gameProvider;
  @Mock private GameInstanceProvider gameInstanceProvider;
  @Mock private GameInstanceLifecycleProvider gameInstanceLifecycleProvider;
  @Mock private StorageService storageService;
  @Mock private UserRepository userRepository;

  @InjectMocks private GameService gameService;

  private UUID keycloakId;
  private User user;
  private Game game;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(gameService, "saveBucket", "saves");
    keycloakId = UUID.randomUUID();
    user = User.builder().keycloakId(keycloakId).username("Alice").build();
    user.setId(UUID.randomUUID());
    game = Game.builder().id("cavestory").build();

    Jwt jwt =
        Jwt.withTokenValue("token").header("alg", "none").subject(keycloakId.toString()).build();
    SecurityContextHolder.getContext()
        .setAuthentication(new JwtAuthenticationToken(jwt, List.of()));
  }

  @AfterEach
  void tearDown() {
    SecurityContextHolder.clearContext();
  }

  @Test
  void downloadSaveStreamsZipWhenObjectsExist() throws Exception {
    String prefix = "cavestory/" + user.getId() + "/";
    List<String> keys = List.of(prefix + "Profile.dat");
    when(gameProvider.find("cavestory")).thenReturn(game);
    when(userRepository.findByKeycloakId(keycloakId)).thenReturn(Optional.of(user));
    when(storageService.listKeys("saves", prefix)).thenReturn(keys);

    StreamingResponseBody body = gameService.downloadSave("cavestory");
    assertNotNull(body);

    ByteArrayOutputStream out = new ByteArrayOutputStream();
    body.writeTo(out);
    verify(storageService).writePrefixAsZip("saves", prefix, keys, out);
  }

  @Test
  void downloadSaveThrowsWhenNoObjectsExist() {
    String prefix = "cavestory/" + user.getId() + "/";
    when(gameProvider.find("cavestory")).thenReturn(game);
    when(userRepository.findByKeycloakId(keycloakId)).thenReturn(Optional.of(user));
    when(storageService.listKeys("saves", prefix)).thenReturn(List.of());

    assertThrows(GameSaveNotFoundException.class, () -> gameService.downloadSave("cavestory"));
  }

  @Test
  void deleteSaveThrowsConflictWhenInstanceIsActive() {
    when(gameProvider.find("cavestory")).thenReturn(game);
    when(userRepository.findByKeycloakId(keycloakId)).thenReturn(Optional.of(user));
    when(gameInstanceLifecycleProvider.findCurrentGameId("alice"))
        .thenReturn(Optional.of("cavestory"));

    assertThrows(GameInstanceActiveException.class, () -> gameService.deleteSave("cavestory"));
  }

  @Test
  void deleteSaveRemovesAllObjectsWhenInstanceIsInactive() {
    String prefix = "cavestory/" + user.getId() + "/";
    List<String> keys = List.of(prefix + "Profile.dat");
    when(gameProvider.find("cavestory")).thenReturn(game);
    when(userRepository.findByKeycloakId(keycloakId)).thenReturn(Optional.of(user));
    when(gameInstanceLifecycleProvider.findCurrentGameId("alice")).thenReturn(Optional.empty());
    when(storageService.listKeys("saves", prefix)).thenReturn(keys);

    gameService.deleteSave("cavestory");

    verify(storageService).deleteObjects("saves", keys);
  }
}
