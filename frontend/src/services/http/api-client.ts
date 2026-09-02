import 'server-only';
import { redirect } from 'next/navigation';
import { env } from '@/config/env';
import { routes } from '@/config/routes';
import { getAccessToken } from '@/server/auth/dal';
import { ApiError, readDetail } from './api-error';
import { toQueryString, type QueryParams } from './query-string';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  query?: QueryParams;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 15_000;

async function request(
  path: string,
  {
    method = 'GET',
    body,
    query,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  }: RequestOptions = {},
): Promise<Response> {
  const accessToken = await getAccessToken();
  const url = `${env().BACKEND_API_URL}${path}${toQueryString(query)}`;

  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(timeoutMs),
  }).catch((error: unknown) => {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiError(504, null);
    }
    throw error;
  });

  if (response.ok) return response;

  if (response.status === 401) redirect(routes.authLogout);

  throw new ApiError(response.status, readDetail(await safeJson(response)));
}

async function safeJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function apiJson<T>(
  path: string,
  options?: RequestOptions,
): Promise<T> {
  const response = await request(path, options);
  return (await response.json()) as T;
}

export async function apiVoid(
  path: string,
  options?: RequestOptions,
): Promise<void> {
  await request(path, options);
}
