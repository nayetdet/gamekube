import { createServer } from 'node:http';
import { notify } from './broker';
import {
  state,
  reset,
  viewer,
  friend,
  requester,
  game,
  incoming,
} from './state';

createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');
  const path = url.pathname;
  const method = request.method ?? 'GET';
  let raw = '';
  for await (const chunk of request) raw += chunk;
  const body =
    raw && !request.headers['content-type']?.startsWith('multipart/form-data')
      ? JSON.parse(raw)
      : null;
  const json = (payload: unknown, status = 200) => {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(payload));
  };
  const empty = () => {
    response.writeHead(204);
    response.end();
  };
  const page = (
    content: unknown[],
    pageNumber = 0,
    pageSize = 50,
    total = content.length,
  ) => ({ content, pageable: { pageNumber, pageSize, total } });
  if (path === '/__test/health') return json({ ready: true });
  if (path === '/__test/reset') {
    reset();
    return empty();
  }
  if (path === '/__test/state') return json(state);
  if (path === '/__test/seed') {
    state.messages = Array.from({ length: 51 }, (_, i) =>
      incoming(`Histórico ${i}`),
    );
    return empty();
  }
  if (path === '/__test/seed-friends') {
    state.extraFriends = 14;
    return empty();
  }
  if (path === '/__test/fail-send') {
    state.failSend = true;
    return empty();
  }
  if (path === '/__test/friendship-event') {
    state.request = Boolean(body.pending);
    notify('/user/queue/friendships', 'changed');
    return empty();
  }
  if (path === '/__test/presence') {
    state.friendStatus = body.status;
    state.friendGame = body.game ?? null;
    notify('/user/queue/presence', 'changed');
    return empty();
  }
  if (path === '/__test/message') {
    const message = incoming(body.content);
    state.messages.unshift(message);
    notify('/user/queue/messages', message);
    return json(message);
  }
  if (path === '/__test/read') {
    for (const message of state.messages)
      if (message.senderUsername === 'alice') {
        message.status = 'READ';
        message.readAt = '2026-09-28T12:01:00';
      }
    notify('/user/queue/messages/read', { readerUsername: 'bob' });
    return empty();
  }
  state.requests.push({ method, path: `${path}${url.search}`, body });
  if (
    !path.endsWith('/image') &&
    !(method === 'GET' && path.endsWith('/avatar')) &&
    request.headers.authorization !== 'Bearer integration-token'
  )
    return json({ detail: 'Unauthorized' }, 401);
  if (path === '/v1/games' && method === 'GET') return json([game]);
  if (path === '/v1/games/doom' && method === 'GET') return json(game);
  if (path === '/v1/games/doom/friends' && method === 'GET') return json([]);
  if (path === '/v1/games/doom/image') {
    response.writeHead(200, { 'Content-Type': 'image/png' });
    return response.end(
      Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jN1sAAAAASUVORK5CYII=',
        'base64',
      ),
    );
  }
  if (path === '/v1/games/doom/instance') {
    if (method === 'POST') {
      if (state.activeGame) return json({ detail: 'Already active' }, 409);
      state.activeGame = true;
      return json({ url: 'http://doom.gamekube.localhost' }, 201);
    }
    if (method === 'DELETE') {
      state.activeGame = false;
      return empty();
    }
  }
  if (path === '/v1/users/me')
    return json({
      ...viewer,
      name: state.name,
      hasAvatar: state.hasAvatar,
      ...(state.activeGame ? { currentGame: 'doom' } : {}),
    });
  if (path === '/v1/users/alice/avatar' && method === 'PUT') {
    if (
      !request.headers['content-type']?.startsWith('multipart/form-data') ||
      !raw.includes('image/gif')
    )
      return json({ detail: 'Invalid upload' }, 400);
    state.hasAvatar = true;
    return empty();
  }
  if (path === '/v1/users/alice/avatar' && method === 'GET') {
    if (!state.hasAvatar) return json({ detail: 'Not found' }, 404);
    response.writeHead(200, { 'Content-Type': 'image/gif' });
    return response.end(
      Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64'),
    );
  }
  if (path === '/v1/users' && method === 'GET')
    return json(
      page(
        [viewer, friend],
        Number(url.searchParams.get('pageNumber') ?? 0),
        Number(url.searchParams.get('pageSize') ?? 10),
      ),
    );
  if (path === '/v1/users/alice' && method === 'GET') return json(viewer);
  if (path === '/v1/users/alice/games' && method === 'GET') return json([]);
  if (path === '/v1/users/bob/games' && method === 'GET') return json([]);
  if (path === '/v1/users/alice' && method === 'PUT') {
    state.name = body.name;
    return empty();
  }
  if (path === '/v1/users/alice' && method === 'DELETE') return empty();
  if (path === '/v1/users/alice/email' && method === 'PATCH') return empty();
  if (path === '/v1/friendships' && method === 'GET') {
    const friends = state.friend
      ? [
          {
            ...friend,
            status: state.friendStatus,
            currentGame: state.friendGame,
          },
        ]
      : [];
    friends.push(
      ...Array.from({ length: state.extraFriends }, (_, i) => ({
        ...friend,
        id: `extra-${i}`,
        username: `extra${i}`,
        name: `Amigo ${String(i).padStart(2, '0')}`,
        status: 'ONLINE' as const,
        currentGame: null,
      })),
    );
    const pageNumber = Number(url.searchParams.get('page') ?? 0);
    const pageSize = Number(url.searchParams.get('size') ?? 8);
    return json(
      page(
        friends.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize),
        pageNumber,
        pageSize,
        friends.length,
      ),
    );
  }
  if (path === '/v1/friendships' && method === 'POST') {
    if (!body.addresseeUsername || body.username)
      return json({ detail: 'Invalid friendship request' }, 400);
    return json(
      {
        id: crypto.randomUUID(),
        requester: viewer,
        addressee: requester,
        status: 'PENDING',
        createdAt: viewer.createdAt,
        updatedAt: viewer.updatedAt,
      },
      201,
    );
  }
  if (path === '/v1/friendships/requests/received')
    return json(
      state.request
        ? [
            {
              id: crypto.randomUUID(),
              requester,
              addressee: viewer,
              status: 'PENDING',
              createdAt: viewer.createdAt,
              updatedAt: viewer.updatedAt,
            },
          ]
        : [],
    );
  if (path === '/v1/friendships/requests/sent') return json([]);
  if (
    /^\/v1\/friendships\/carol\/(accept|reject)$/.test(path) &&
    method === 'PATCH'
  ) {
    state.request = false;
    return json({ status: path.endsWith('accept') ? 'ACCEPTED' : 'REJECTED' });
  }
  if (path === '/v1/friendships/bob' && method === 'DELETE') {
    state.friend = false;
    return empty();
  }
  if (path === '/v1/messages/unread/count')
    return json({
      unreadCount: state.messages.filter(
        (message) =>
          message.recipientUsername === 'alice' && message.status !== 'READ',
      ).length,
    });
  if (path === '/v1/messages/conversations' && method === 'GET') {
    const latest = state.messages[0];
    return json(
      latest
        ? [
            {
              username: 'bob',
              lastMessage: latest.content,
              lastSenderUsername: latest.senderUsername,
              unreadCount: state.messages.filter(
                (message) =>
                  message.recipientUsername === 'alice' &&
                  message.status !== 'READ',
              ).length,
            },
          ]
        : [],
    );
  }
  if (path === '/v1/messages/bob') {
    if (method === 'GET') {
      const number = Number(url.searchParams.get('page') ?? 0);
      return json(
        page(
          state.messages.slice(number * 50, (number + 1) * 50),
          number,
          50,
          state.messages.length,
        ),
      );
    }
    if (method === 'POST') {
      if (state.failSend) return json({ detail: 'Unavailable' }, 503);
      if (!state.friend) return json({ detail: 'Friendship required' }, 403);
      const message = {
        ...incoming(body.content),
        senderUsername: 'alice',
        recipientUsername: 'bob',
      };
      state.messages.unshift(message);
      notify('/user/queue/messages', message);
      return json(message, 201);
    }
    if (method === 'PATCH') {
      for (const message of state.messages)
        if (message.recipientUsername === 'alice') {
          message.status = 'READ';
          message.readAt = '2026-09-28T12:01:00';
        }
      return empty();
    }
  }
  return json({ detail: `Unexpected endpoint: ${method} ${path}` }, 404);
}).listen(3901, '127.0.0.1');
