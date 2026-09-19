package io.github.nayetdet.gamekube.game;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GameSpec implements Serializable {

  private static final long serialVersionUID = 1L;

  private String id;
  private String name;
  private String description;
  private List<Map<String, Object>> specs;
}
