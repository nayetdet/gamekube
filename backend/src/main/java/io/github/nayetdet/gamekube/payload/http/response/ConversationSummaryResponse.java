package io.github.nayetdet.gamekube.payload.http.response;

public record ConversationSummaryResponse(
    String username, String lastMessage, String lastSenderUsername, long unreadCount) {}
