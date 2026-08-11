package io.github.nayetdet.gamekube.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserCreateRequest(
    @NotBlank(message = "Username é obrigatório")
    @Size(min = 3, max = 50, message = "Username deve ter entre 3 e 50 caracteres")
    String username,

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    String email,

    String firstName,

    String lastName,

    String keycloakId
) {
}
