import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { routes } from '@/config/routes';
import { readSession } from './session-store';
import { isAdmin, type Session } from './session.types';

export const getSession = cache(readSession);

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(routes.login);
  return session;
}

export async function requireAdminSession(): Promise<Session> {
  const session = await requireSession();
  if (!isAdmin(session)) redirect(routes.dashboard);
  return session;
}

export async function getAccessToken(): Promise<string> {
  const session = await requireSession();
  return session.accessToken;
}

export async function getViewer(): Promise<Session['user'] | null> {
  const session = await getSession();
  return session?.user ?? null;
}
