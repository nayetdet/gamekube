import { WebSocketServer, type WebSocket } from 'ws';
import { state } from './state';

const connections = new Map<WebSocket, Map<string, string>>();
const broker = new WebSocketServer({ port: 3902, host: '127.0.0.1' });

broker.on('connection', (socket) => {
  const subscriptions = new Map<string, string>();
  connections.set(socket, subscriptions);
  socket.on('message', (raw) => {
    for (const frame of raw.toString().split('\0')) {
      const [head, body = ''] = frame.trimStart().split('\n\n');
      const [command, ...lines] = head.split('\n');
      const headers = Object.fromEntries(
        lines.map((line) => {
          const split = line.indexOf(':');
          return [line.slice(0, split), line.slice(split + 1)];
        }),
      );
      if (command === 'CONNECT') {
        if (headers.Authorization !== 'Bearer integration-token') {
          socket.close();
          return;
        }
        socket.send('CONNECTED\nversion:1.2\nheart-beat:0,0\n\n\0');
      }
      if (command === 'SUBSCRIBE')
        subscriptions.set(headers.destination, headers.id);
      if (command === 'SEND')
        state.heartbeats.push({ destination: headers.destination, body });
      if (command === 'DISCONNECT') socket.close();
    }
  });
  socket.on('close', () => {
    connections.delete(socket);
    state.closedConnections++;
  });
});

export function notify(destination: string, payload: unknown) {
  const body = JSON.stringify(payload);
  for (const [socket, subscriptions] of connections) {
    const id = subscriptions.get(destination);
    if (id)
      socket.send(
        `MESSAGE\nsubscription:${id}\nmessage-id:${crypto.randomUUID()}\ndestination:${destination}\ncontent-type:application/json\n\n${body}\0`,
      );
  }
}
