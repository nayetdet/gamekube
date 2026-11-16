import { env } from '@/config/env';
import { gameIdSchema } from '@/entities/game/game.schema';
import { getAccessToken } from '@/server/auth/dal';

async function forward(
  method: 'GET' | 'DELETE',
  context: { params: Promise<{ id: string }> },
) {
  const parsed = gameIdSchema.safeParse((await context.params).id);
  if (!parsed.success) return new Response(null, { status: 404 });
  const token = await getAccessToken();
  const response = await fetch(
    `${env().BACKEND_API_URL}/v1/games/${encodeURIComponent(parsed.data)}/save`,
    {
      method,
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(30000),
    },
  );
  if (!response.ok) return new Response(null, { status: response.status });
  if (method === 'DELETE') return new Response(null, { status: 204 });
  return new Response(response.body, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${parsed.data}-save.zip"`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
export function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return forward('GET', context);
}
export function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return forward('DELETE', context);
}
