package io.github.nayetdet.gamekube.controller;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.github.nayetdet.gamekube.exception.ResourceNotFoundException;
import io.github.nayetdet.gamekube.exception.UserAlreadyExistsException;
import io.github.nayetdet.gamekube.payload.request.UserCreateRequest;
import io.github.nayetdet.gamekube.payload.request.UserUpdateRequest;
import io.github.nayetdet.gamekube.payload.response.UserResponse;
import io.github.nayetdet.gamekube.service.UserService;

@SpringBootTest
class UserControllerTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private org.springframework.security.oauth2.jwt.JwtDecoder jwtDecoder;

    private UUID userId;
    private UserResponse sampleUserResponse;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
            .apply(springSecurity())
            .build();

        userId = UUID.randomUUID();
        sampleUserResponse = new UserResponse(
            userId,
            "sub-9999",
            "testuser",
            "testuser@gamekube.com",
            "Test",
            "User",
            true,
            null,
            null
        );
    }

    @Test
    void getUsers_WithoutToken_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/v1/users"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void getUsers_WithValidJwt_ReturnsOk() throws Exception {
        org.mockito.BDDMockito.given(userService.getAllUsers())
            .willReturn(List.of(sampleUserResponse));

        mockMvc.perform(get("/v1/users").with(jwt()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].username").value("testuser"))
            .andExpect(jsonPath("$[0].email").value("testuser@gamekube.com"));
    }

    @Test
    void createUser_WithValidJwt_ReturnsCreated() throws Exception {
        UserCreateRequest createRequest = new UserCreateRequest(
            "testuser",
            "testuser@gamekube.com",
            "Test",
            "User",
            "sub-9999"
        );

        org.mockito.BDDMockito.given(userService.createUser(org.mockito.ArgumentMatchers.any(UserCreateRequest.class)))
            .willReturn(sampleUserResponse);

        mockMvc.perform(post("/v1/users")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value(userId.toString()))
            .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void createUser_InvalidData_ReturnsBadRequest() throws Exception {
        UserCreateRequest invalidRequest = new UserCreateRequest("", "invalid-email", null, null, null);

        mockMvc.perform(post("/v1/users")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void createUser_Duplicate_ReturnsConflict() throws Exception {
        UserCreateRequest createRequest = new UserCreateRequest(
            "testuser",
            "testuser@gamekube.com",
            "Test",
            "User",
            null
        );

        org.mockito.BDDMockito.given(userService.createUser(org.mockito.ArgumentMatchers.any(UserCreateRequest.class)))
            .willThrow(new UserAlreadyExistsException("Já existe um usuário cadastrado com o e-mail: testuser@gamekube.com"));

        mockMvc.perform(post("/v1/users")
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    void getUserById_Found_ReturnsOk() throws Exception {
        org.mockito.BDDMockito.given(userService.getUserById(userId))
            .willReturn(sampleUserResponse);

        mockMvc.perform(get("/v1/users/{id}", userId).with(jwt()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(userId.toString()))
            .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void getUserById_NotFound_ReturnsNotFound() throws Exception {
        UUID nonExistentId = UUID.randomUUID();
        org.mockito.BDDMockito.given(userService.getUserById(nonExistentId))
            .willThrow(new ResourceNotFoundException("Usuário não encontrado com o ID: " + nonExistentId));

        mockMvc.perform(get("/v1/users/{id}", nonExistentId).with(jwt()))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void updateUser_Success_ReturnsOk() throws Exception {
        UserUpdateRequest updateRequest = new UserUpdateRequest("testuser", "testuser@gamekube.com", "Updated", "Name", true);

        org.mockito.BDDMockito.given(userService.updateUser(org.mockito.ArgumentMatchers.eq(userId), org.mockito.ArgumentMatchers.any(UserUpdateRequest.class)))
            .willReturn(sampleUserResponse);

        mockMvc.perform(put("/v1/users/{id}", userId)
                .with(jwt())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void deleteUser_Success_ReturnsNoContent() throws Exception {
        org.mockito.BDDMockito.doNothing().when(userService).deleteUser(userId);

        mockMvc.perform(delete("/v1/users/{id}", userId).with(jwt()))
            .andExpect(status().isNoContent());
    }
}
