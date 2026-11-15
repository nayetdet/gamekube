import { env } from '@/config/env';
import { getAccessToken } from '@/server/auth/dal';

export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> },
) {
  const { username } = await context.params;
  const response = await fetch(
    `${env().BACKEND_API_URL}/v1/users/${encodeURIComponent(username)}/avatar`,
    { cache: 'no-store', signal: AbortSignal.timeout(15000) },
  );
  if (!response.ok) return new Response(null, { status: response.status });
  return new Response(response.body, {
    headers: {
      'Content-Type':
        response.headers.get('Content-Type') ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ username: string }> },
) {
  const { username } = await context.params;
  const token = await getAccessToken();
  const form = await request.formData();
  const response = await fetch(
    `${env().BACKEND_API_URL}/v1/users/${encodeURIComponent(username)}/avatar`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
      signal: AbortSignal.timeout(15000),
    },
  );
  return new Response(null, { status: response.status });
}
