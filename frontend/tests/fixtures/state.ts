import type { Message } from '../../src/entities/message/message.entity';

const timestamp = '2026-09-28T12:00:00';
export const viewer = {
  id: '00000000-0000-4000-8000-000000000001',
  keycloakId: '00000000-0000-4000-8000-000000000001',
  username: 'alice',
  name: 'Alice',
  description: '',
  status: 'ONLINE',
  createdAt: timestamp,
  updatedAt: timestamp,
};
export const friend = {
  ...viewer,
  id: '00000000-0000-4000-8000-000000000002',
  username: 'bob',
  name: 'Bob',
};
export const requester = {
  ...friend,
  id: '00000000-0000-4000-8000-000000000003',
  username: 'carol',
  name: 'Carol',
};
export const game = {
  id: 'doom',
  name: 'Doom',
  description: 'Enfrente monstros em Marte.',
  image: '/v1/games/doom/image',
};
export const incoming = (content: string): Message => ({
  id: crypto.randomUUID(),
  senderUsername: 'bob',
  recipientUsername: 'alice',
  content,
  status: 'SENT',
  createdAt: timestamp,
  readAt: null,
});
export const state = {
  messages: [] as Message[],
  requests: [] as { method: string; path: string; body: unknown }[],
  heartbeats: [] as { destination: string; body: string }[],
  friend: true,
  request: true,
  activeGame: false,
  failSend: false,
  name: 'Alice',
  closedConnections: 0,
};

export function reset() {
  state.messages = [incoming('Vamos jogar?')];
  state.requests = [];
  state.heartbeats = [];
  state.friend = true;
  state.request = true;
  state.activeGame = false;
  state.failSend = false;
  state.name = 'Alice';
  state.closedConnections = 0;
}
reset();
