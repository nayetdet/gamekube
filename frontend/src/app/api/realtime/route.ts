import { getSession } from '@/server/auth/dal';
import { gameIdSchema } from '@/entities/game/game.schema';
import { createEventStream } from '@/server/realtime/event-stream';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.expiresAt <= Date.now())
    return new Response(null, { status: 401 });
  const rawGameId = new URL(request.url).searchParams.get('gameId');
  const gameId =
    rawGameId === null ? undefined : gameIdSchema.safeParse(rawGameId);
  if (gameId && !gameId.success) return new Response(null, { status: 400 });
  return new Response(
    createEventStream(session, request.signal, gameId?.data),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'private, no-cache, no-store, no-transform',
        'X-Accel-Buffering': 'no',
      },
    },
  );
}
