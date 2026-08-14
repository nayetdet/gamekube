package io.github.nayetdet.gamekube.payload.query;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDate;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;

@Getter
@Setter
public abstract class BaseQuery {

  private final Map<String, String> sortableFields;

  protected BaseQuery() {
    this(
        Map.of(
            "id", "id",
            "createdAt", "createdAt",
            "updatedAt", "updatedAt"));
  }

  protected BaseQuery(Map<String, String> sortableFields) {
    this.sortableFields = sortableFields;
  }

  @Min(0)
  @Schema(defaultValue = "0")
  private Integer pageNumber = 0;

  @Min(0)
  @Max(50)
  @Schema(defaultValue = "10")
  private Integer pageSize = 10;

  @Schema(
      defaultValue = "id",
      allowableValues = {"id", "createdAt", "updatedAt", "-id", "-createdAt", "-updatedAt"})
  private String orderBy = "id";

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private LocalDate createdBefore;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private LocalDate createdAfter;

  public Sort getSort() {
    Sort.Direction direction = orderBy.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
    String field = orderBy.replaceFirst("^-", "");
    return Sort.by(direction, sortableFields.getOrDefault(field, "id"));
  }

  public Pageable getPageable() {
    return PageRequest.of(pageNumber, pageSize, getSort());
  }
}
