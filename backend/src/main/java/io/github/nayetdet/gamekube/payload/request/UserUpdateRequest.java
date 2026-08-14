package io.github.nayetdet.gamekube.payload.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {

  @NotBlank
  @Size(min = 3, max = 50)
  @Schema(example = "string")
  private String username;

  @Size(max = 100)
  private String name;

  @Size(max = 1000)
  private String description;
}
