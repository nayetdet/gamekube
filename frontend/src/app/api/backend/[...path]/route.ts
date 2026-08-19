import { NextResponse } from 'next/server';

const apiBaseUrl = (
  process.env.GAMEKUBE_API_URL ?? 'http://localhost:8081'
).replace(/\/$/, '');

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(request: Request, context: RouteContext) {
  const { path } = await context.params;
  if (path[0] !== 'v1') {
    return NextResponse.json(
      { message: 'Rota não permitida.' },
      { status: 404 },
    );
  }

  const target = new URL(
    `${apiBaseUrl}/${path.map((segment) => encodeURIComponent(segment)).join('/')}`,
  );
  target.search = new URL(request.url).search;

  const headers = new Headers();
  const authorization = request.headers.get('authorization');
  const contentType = request.headers.get('content-type');
  if (authorization) headers.set('authorization', authorization);
  if (contentType) headers.set('content-type', contentType);
  headers.set('accept', request.headers.get('accept') ?? 'application/json');

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body:
        request.method === 'GET' || request.method === 'HEAD'
          ? undefined
          : await request.arrayBuffer(),
      cache: 'no-store',
    });
    const responseHeaders = new Headers();
    ['content-type', 'location', 'cache-control'].forEach((header) => {
      const value = response.headers.get(header);
      if (value) responseHeaders.set(header, value);
    });
    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json(
      { message: 'Não foi possível se comunicar com o backend GameKube.' },
      { status: 502 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
