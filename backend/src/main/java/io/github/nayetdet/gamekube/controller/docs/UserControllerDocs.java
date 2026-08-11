package io.github.nayetdet.gamekube.controller.docs;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;

import io.github.nayetdet.gamekube.payload.request.UserCreateRequest;
import io.github.nayetdet.gamekube.payload.request.UserUpdateRequest;
import io.github.nayetdet.gamekube.payload.response.ErrorResponse;
import io.github.nayetdet.gamekube.payload.response.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Users", description = "Endpoints para gerenciamento de usuários")
@SecurityRequirement(name = "bearerAuth")
public interface UserControllerDocs {

    @Operation(
        summary = "Criar um novo usuário",
        responses = {
            @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso", content = @Content(schema = @Schema(implementation = UserResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dados de entrada inválidos", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Conflito de username ou email", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
        }
    )
    ResponseEntity<UserResponse> createUser(UserCreateRequest request);

    @Operation(
        summary = "Listar todos os usuários",
        responses = {
            @ApiResponse(responseCode = "200", description = "Lista de usuários retornada com sucesso")
        }
    )
    ResponseEntity<List<UserResponse>> getAllUsers();

    @Operation(
        summary = "Buscar usuário por ID",
        responses = {
            @ApiResponse(responseCode = "200", description = "Usuário encontrado com sucesso", content = @Content(schema = @Schema(implementation = UserResponse.class))),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
        }
    )
    ResponseEntity<UserResponse> getUserById(UUID id);

    @Operation(
        summary = "Atualizar usuário por ID",
        responses = {
            @ApiResponse(responseCode = "200", description = "Usuário atualizado com sucesso", content = @Content(schema = @Schema(implementation = UserResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dados de entrada inválidos", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Conflito de username ou email", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
        }
    )
    ResponseEntity<UserResponse> updateUser(UUID id, UserUpdateRequest request);

    @Operation(
        summary = "Excluir usuário por ID",
        responses = {
            @ApiResponse(responseCode = "204", description = "Usuário excluído com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
        }
    )
    ResponseEntity<Void> deleteUser(UUID id);
}
