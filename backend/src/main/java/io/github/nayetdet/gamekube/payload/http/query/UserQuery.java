package io.github.nayetdet.gamekube.payload.http.query;

import io.github.nayetdet.gamekube.enums.UserStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

@Getter
@Setter
public class UserQuery extends BaseQuery {

  public UserQuery() {
    super(
        Map.of(
            "id", "id",
            "username", "username",
            "name", "name",
            "lastSeenAt", "lastSeenAt",
            "createdAt", "createdAt",
            "updatedAt", "updatedAt"));
  }

  private String username;
  private String name;
  private UserStatus status;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private LocalDate lastSeenAtAfter;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private LocalDate lastSeenAtBefore;

  @Override
  @Schema(
      defaultValue = "id",
      allowableValues = {
        "id", "username", "name", "lastSeenAt", "createdAt", "updatedAt",
        "-id", "-username", "-name", "-lastSeenAt", "-createdAt", "-updatedAt"
      })
  public String getOrderBy() {
    return super.getOrderBy();
  }
}
