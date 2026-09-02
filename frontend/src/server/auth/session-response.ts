import type { NextResponse } from 'next/server';
import { seal } from './session-crypto';
import type { Session } from './session.types';
import {
  allAuthCookies,
  authorizationCookie,
  AUTHORIZATION_TTL_SECONDS,
  cookieOptions,
  expiredCookieOptions,
  refreshCookie,
  sessionCookie,
  SESSION_TTL_SECONDS,
} from './session-cookies';

export type AuthorizationRequest = {
  state: string;
  codeVerifier: string;
  redirectTo: string;
};

export async function attachSession(
  response: NextResponse,
  session: Session,
  refreshToken: string,
): Promise<void> {
  const options = cookieOptions(SESSION_TTL_SECONDS);
  const sealed = await seal(session, SESSION_TTL_SECONDS);
  const sealedRefresh = await seal(
    { token: refreshToken },
    SESSION_TTL_SECONDS,
  );
  response.cookies.set(sessionCookie, sealed, options);
  response.cookies.set(refreshCookie, sealedRefresh, options);
  response.cookies.set(authorizationCookie, '', expiredCookieOptions);
}

export async function attachAuthorizationRequest(
  response: NextResponse,
  request: AuthorizationRequest,
): Promise<void> {
  response.cookies.set(
    authorizationCookie,
    await seal(request, AUTHORIZATION_TTL_SECONDS),
    cookieOptions(AUTHORIZATION_TTL_SECONDS),
  );
}

export function clearAuthCookies(response: NextResponse): void {
  for (const name of allAuthCookies) {
    response.cookies.set(name, '', expiredCookieOptions);
  }
}
