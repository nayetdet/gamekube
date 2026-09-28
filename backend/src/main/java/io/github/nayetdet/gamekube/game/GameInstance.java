package io.github.nayetdet.gamekube.game;

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
public class GameInstance {

  private String gameId;
  private String username;
  private String name;
  private String host;
  private URI url;
}
