import { cookies } from 'next/headers';
import { unseal } from './session-crypto';
import type { Session } from './session.types';
import { refreshCookie, sessionCookie } from './session-cookies';

type RefreshPayload = { token: string };

export async function readSession(): Promise<Session | null> {
  const store = await cookies();
  return unseal<Session>(store.get(sessionCookie)?.value);
}

export async function readRefreshToken(): Promise<string | null> {
  const store = await cookies();
  const payload = await unseal<RefreshPayload>(store.get(refreshCookie)?.value);
  return payload?.token ?? null;
}
