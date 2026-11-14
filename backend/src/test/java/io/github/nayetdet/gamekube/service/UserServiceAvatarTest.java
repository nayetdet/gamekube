package io.github.nayetdet.gamekube.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import io.github.nayetdet.gamekube.exception.UserAvatarInvalidException;
import io.github.nayetdet.gamekube.exception.UserAvatarNotFoundException;
import io.github.nayetdet.gamekube.game.GameInstanceLifecycleProvider;
import io.github.nayetdet.gamekube.mapper.UserMapper;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.repository.UserRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class UserServiceAvatarTest {

  @Mock private GameInstanceLifecycleProvider gameInstanceLifecycleProvider;
  @Mock private KeycloakService keycloakService;
  @Mock private StorageService storageService;
  @Mock private UserMapper userMapper;
  @Mock private UserRepository userRepository;
  @Mock private StringRedisTemplate redisTemplate;

  @InjectMocks private UserService userService;

  private UUID keycloakId;
  private User user;

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(userService, "avatarBucket", "avatars");
    keycloakId = UUID.randomUUID();
    user = User.builder().keycloakId(keycloakId).username("alice").avatarKey("old-key.jpg").build();
    user.setId(UUID.randomUUID());

    Jwt jwt =
        Jwt.withTokenValue("token").header("alg", "none").subject(keycloakId.toString()).build();
    SecurityContextHolder.getContext().setAuthentication(new JwtAuthenticationToken(jwt));
  }

  @AfterEach
  void tearDown() {
    SecurityContextHolder.clearContext();
  }

  @Test
  void updateAvatarUploadsImageAndDeletesPreviousKey() {
    MockMultipartFile file =
        new MockMultipartFile("file", "avatar.png", "image/png", new byte[] {1, 2, 3});
    when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));

    userService.updateAvatar("alice", file);

    String expectedKey = user.getId() + ".png";
    verify(storageService).putObject("avatars", expectedKey, new byte[] {1, 2, 3}, "image/png");
    verify(storageService).deleteObject("avatars", "old-key.jpg");
    assertEquals(expectedKey, user.getAvatarKey());
    verify(userRepository).save(user);
  }

  @Test
  void updateAvatarRejectsUnsupportedMediaType() {
    MockMultipartFile file =
        new MockMultipartFile("file", "avatar.gif", "image/gif", new byte[] {1, 2, 3});
    when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));

    assertThrows(UserAvatarInvalidException.class, () -> userService.updateAvatar("alice", file));
  }

  @Test
  void getAvatarThrowsWhenUserHasNoAvatar() {
    user.setAvatarKey(null);
    when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));

    assertThrows(UserAvatarNotFoundException.class, () -> userService.getAvatar("alice"));
  }

  @Test
  void getAvatarReturnsStoredObject() {
    StorageService.StorageObject stored =
        new StorageService.StorageObject(new byte[] {9, 8}, "image/png");
    when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
    when(storageService.getObject("avatars", "old-key.jpg")).thenReturn(Optional.of(stored));

    StorageService.StorageObject result = userService.getAvatar("alice");

    assertEquals(stored, result);
    verify(storageService).getObject(eq("avatars"), any());
  }
}
