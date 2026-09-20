package io.github.nayetdet.gamekube.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChatReadRequest {

  @NotBlank private String senderUsername;
}
