import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/config/env';
import { routes } from '@/config/routes';
import { authorizationCookie } from '@/server/auth/session-cookies';
import { unseal } from '@/server/auth/session-crypto';
import { exchangeCode, toSession } from '@/server/auth/oidc-tokens';
import {
  attachSession,
  clearAuthCookies,
  type AuthorizationRequest,
} from '@/server/auth/session-response';

function failed(reason: string) {
  const url = new URL(routes.login, env().APP_URL);
  url.searchParams.set('error', reason);
  const response = NextResponse.redirect(url);
  clearAuthCookies(response);
  return response;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get('code');
  const state = params.get('state');

  const pending = await unseal<AuthorizationRequest>(
    request.cookies.get(authorizationCookie)?.value,
  );

  if (!code || !state || !pending || pending.state !== state) {
    return failed('invalid_request');
  }

  const tokens = await exchangeCode(code, pending.codeVerifier);
  const session = tokens && toSession(tokens);
  if (!tokens || !session) return failed('exchange_failed');

  const response = NextResponse.redirect(
    new URL(pending.redirectTo, env().APP_URL),
  );
  await attachSession(response, session, tokens.refresh_token);
  return response;
}
