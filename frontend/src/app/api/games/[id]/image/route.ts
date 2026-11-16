import { env } from '@/config/env';
import { gameIdSchema } from '@/entities/game/game.schema';

export async function GET(
  _request: Request,
  context: RouteContext<'/api/games/[id]/image'>,
) {
  const parsed = gameIdSchema.safeParse((await context.params).id);
  if (!parsed.success) return new Response(null, { status: 404 });
  const response = await fetch(
    `${env().BACKEND_API_URL}/v1/games/${encodeURIComponent(parsed.data)}/image`,
    {
      signal: AbortSignal.timeout(15_000),
    },
  );
  if (!response.ok) return new Response(null, { status: response.status });
  return new Response(response.body, {
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'image/jpeg',
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
