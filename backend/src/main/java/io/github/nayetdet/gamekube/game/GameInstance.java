package io.github.nayetdet.gamekube.game;

import java.net.URI;
import java.util.UUID;
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
  private UUID userId;
  private String username;
  private String name;
  private String host;
  private URI url;
}
