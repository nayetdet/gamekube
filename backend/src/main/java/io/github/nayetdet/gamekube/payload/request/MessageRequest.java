package io.github.nayetdet.gamekube.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {

  @Size(min = 3, max = 50)
  private String recipientUsername;

  @NotBlank
  @Size(max = 2000)
  private String content;
}
