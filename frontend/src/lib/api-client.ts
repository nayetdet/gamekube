'use client';

import { ApiError } from '@/lib/api-error';
import { getValidAccessToken } from '@/lib/oidc';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

function messageFor(status: number, payload: unknown) {
  if (payload && typeof payload === 'object') {
    const maybeMessage =
      (payload as { message?: unknown; detail?: unknown }).message ??
      (payload as { detail?: unknown }).detail;
    if (typeof maybeMessage === 'string') return maybeMessage;
  }

  const messages: Record<number, string> = {
    400: 'Verifique os dados enviados e tente novamente.',
    401: 'Sua sessão expirou. Entre novamente para continuar.',
    403: 'Você não tem permissão para realizar esta ação.',
    404: 'O recurso solicitado não foi encontrado.',
    409: 'Já existe um registro com esses dados.',
  };
  return messages[status] ?? 'Não foi possível concluir a solicitação.';
}

async function parseBody(response: Response) {
  if (response.status === 204) return undefined;
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) return response.text();
  return response.json() as Promise<unknown>;
}

async function performRequest<T>(
  path: string,
  options: RequestOptions,
  retryOnUnauthorized: boolean,
): Promise<T> {
  const token = await getValidAccessToken();
  if (!token)
    throw new ApiError(
      401,
      'Sua sessão expirou. Entre novamente para continuar.',
    );

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Accept', 'application/json');
  let body: BodyInit | undefined;

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(options.body);
  }

  const response = await fetch(`/api/backend${path}`, {
    ...options,
    headers,
    body,
    cache: 'no-store',
  });
  const payload = await parseBody(response);

  if (response.status === 401 && retryOnUnauthorized) {
    await getValidAccessToken(true);
    return performRequest<T>(path, options, false);
  }
  if (!response.ok)
    throw new ApiError(response.status, messageFor(response.status, payload));
  return payload as T;
}

export const apiClient = {
  get<T>(path: string) {
    return performRequest<T>(path, { method: 'GET' }, true);
  },
  post<T>(path: string, body?: unknown) {
    return performRequest<T>(path, { method: 'POST', body }, true);
  },
  put<T>(path: string, body: unknown) {
    return performRequest<T>(path, { method: 'PUT', body }, true);
  },
  delete<T>(path: string) {
    return performRequest<T>(path, { method: 'DELETE' }, true);
  },
};
