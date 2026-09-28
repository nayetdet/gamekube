import { EncryptJWT } from 'jose';
import type { BrowserContext, APIRequestContext } from '@playwright/test';
import { testEnvironment } from './environment';

export async function signIn(context: BrowserContext, roles = ['admin']) {
  const key = new Uint8Array(
    await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(testEnvironment.SESSION_SECRET),
    ),
  );
  const token = await new EncryptJWT({
    user: {
      subject: '00000000-0000-4000-8000-000000000001',
      username: 'alice',
      name: 'Alice',
      email: 'alice@example.test',
      roles,
    },
    accessToken: 'integration-token',
    expiresAt: Date.now() + 600_000,
  })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('10m')
    .encrypt(key);
  await context.addCookies([
    {
      name: 'gk.session',
      value: token,
      url: testEnvironment.APP_URL,
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
}

export async function backendState(request: APIRequestContext) {
  return (
    await request.get(`${testEnvironment.BACKEND_API_URL}/__test/state`)
  ).json();
}

export async function control(
  request: APIRequestContext,
  path: string,
  data?: unknown,
) {
  return request.post(`${testEnvironment.BACKEND_API_URL}/__test/${path}`, {
    data,
  });
}
