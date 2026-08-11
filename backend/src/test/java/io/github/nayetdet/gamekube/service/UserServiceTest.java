package io.github.nayetdet.gamekube.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import io.github.nayetdet.gamekube.exception.ResourceNotFoundException;
import io.github.nayetdet.gamekube.exception.UserAlreadyExistsException;
import io.github.nayetdet.gamekube.model.User;
import io.github.nayetdet.gamekube.payload.request.UserCreateRequest;
import io.github.nayetdet.gamekube.payload.request.UserUpdateRequest;
import io.github.nayetdet.gamekube.payload.response.UserResponse;
import io.github.nayetdet.gamekube.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User sampleUser;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        sampleUser = User.builder()
            .id(userId)
            .username("johndoe")
            .email("john@example.com")
            .firstName("John")
            .lastName("Doe")
            .keycloakId("sub-12345")
            .active(true)
            .build();
    }

    @Test
    void createUser_Success() {
        UserCreateRequest request = new UserCreateRequest("johndoe", "john@example.com", "John", "Doe", "sub-12345");

        when(userRepository.existsByEmail(request.email())).thenReturn(false);
        when(userRepository.existsByUsername(request.username())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        UserResponse response = userService.createUser(request);

        assertNotNull(response);
        assertEquals("johndoe", response.username());
        assertEquals("john@example.com", response.email());
        assertEquals("sub-12345", response.keycloakId());
    }

    @Test
    void createUser_DuplicateEmail_ThrowsException() {
        UserCreateRequest request = new UserCreateRequest("johndoe", "john@example.com", "John", "Doe", null);

        when(userRepository.existsByEmail(request.email())).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> userService.createUser(request));
    }

    @Test
    void createUser_DuplicateUsername_ThrowsException() {
        UserCreateRequest request = new UserCreateRequest("johndoe", "john@example.com", "John", "Doe", null);

        when(userRepository.existsByEmail(request.email())).thenReturn(false);
        when(userRepository.existsByUsername(request.username())).thenReturn(true);

        assertThrows(UserAlreadyExistsException.class, () -> userService.createUser(request));
    }

    @Test
    void getUserById_Success() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(sampleUser));

        UserResponse response = userService.getUserById(userId);

        assertNotNull(response);
        assertEquals(userId, response.id());
    }

    @Test
    void getUserById_NotFound_ThrowsException() {
        UUID nonExistentId = UUID.randomUUID();
        when(userRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(nonExistentId));
    }

    @Test
    void getAllUsers_Success() {
        when(userRepository.findAll()).thenReturn(List.of(sampleUser));

        List<UserResponse> users = userService.getAllUsers();

        assertEquals(1, users.size());
        assertEquals("johndoe", users.get(0).username());
    }

    @Test
    void updateUser_Success() {
        UserUpdateRequest updateRequest = new UserUpdateRequest("johnupdated", "john.updated@example.com", "John", "Doe", true);

        when(userRepository.findById(userId)).thenReturn(Optional.of(sampleUser));
        when(userRepository.existsByEmailAndIdNot(updateRequest.email(), userId)).thenReturn(false);
        when(userRepository.existsByUsernameAndIdNot(updateRequest.username(), userId)).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = userService.updateUser(userId, updateRequest);

        assertNotNull(response);
        assertEquals("johnupdated", response.username());
        assertEquals("john.updated@example.com", response.email());
    }

    @Test
    void deleteUser_Success() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(sampleUser));
        doNothing().when(userRepository).delete(sampleUser);

        userService.deleteUser(userId);

        verify(userRepository).delete(sampleUser);
    }
}
