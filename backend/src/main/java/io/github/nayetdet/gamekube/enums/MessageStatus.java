package io.github.nayetdet.gamekube.enums;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Lifecycle state of a message.")
public enum MessageStatus {
  SENT,
  DELIVERED,
  READ
}
