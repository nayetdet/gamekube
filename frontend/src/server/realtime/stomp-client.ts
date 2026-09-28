import 'server-only';
import { Client } from '@stomp/stompjs';
import WebSocket from 'ws';
import { env } from '@/config/env';

export function createStompClient(accessToken: string) {
  const url = new URL(
    env().BACKEND_WEBSOCKET_URL ?? '/ws',
    env().BACKEND_API_URL,
  );
  url.protocol =
    url.protocol === 'https:' || url.protocol === 'wss:' ? 'wss:' : 'ws:';
  return new Client({
    webSocketFactory: () =>
      new WebSocket(url, ['v12.stomp', 'v11.stomp', 'v10.stomp']),
    connectHeaders: { Authorization: `Bearer ${accessToken}` },
    connectionTimeout: 10_000,
    reconnectDelay: 5000,
    heartbeatIncoming: 0,
    heartbeatOutgoing: 10_000,
  });
}
