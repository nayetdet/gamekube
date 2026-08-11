package io.github.nayetdet.gamekube.payload.response;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponse(
    int status,
    String message,
    List<String> details,
    LocalDateTime timestamp
) {
    public ErrorResponse(int status, String message, List<String> details) {
        this(status, message, details, LocalDateTime.now());
    }

    public ErrorResponse(int status, String message) {
        this(status, message, List.of(), LocalDateTime.now());
    }
}
