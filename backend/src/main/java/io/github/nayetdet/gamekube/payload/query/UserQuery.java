package io.github.nayetdet.gamekube.payload.query;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserQuery extends BaseQuery {

  public UserQuery() {
    super(
        Map.of(
            "id", "id",
            "username", "username",
            "name", "name",
            "createdAt", "createdAt",
            "updatedAt", "updatedAt"));
  }

  private String username;
  private String name;

  @Override
  @Schema(
      defaultValue = "id",
      allowableValues = {"id", "username", "name", "createdAt", "updatedAt"})
  public String getOrderBy() {
    return super.getOrderBy();
  }
}
