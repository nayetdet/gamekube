import { env } from '@/config/env';

export const sessionCookie = 'gk.session';
export const refreshCookie = 'gk.refresh';
export const authorizationCookie = 'gk.authorization';

export const SESSION_TTL_SECONDS = 8 * 60 * 60;
export const AUTHORIZATION_TTL_SECONDS = 10 * 60;

type CookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: 'lax';
  path: string;
  maxAge: number;
};

export function cookieOptions(maxAge: number): CookieOptions {
  return {
    httpOnly: true,
    secure: new URL(env().APP_URL).protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge,
  };
}

export const expiredCookieOptions = { ...cookieOptions(0), maxAge: 0 };

export const allAuthCookies = [
  sessionCookie,
  refreshCookie,
  authorizationCookie,
] as const;
