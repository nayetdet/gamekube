package io.github.nayetdet.gamekube.payload.response;

import java.net.URI;
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
public class GameInstanceResponse {

  private String name;
  private String host;
  private URI url;
}
