import { NextResponse, type NextRequest } from 'next/server';
import { refreshTokens, toSession } from './oidc-tokens';
import { refreshCookie, sessionCookie } from './session-cookies';
import { seal, unseal } from './session-crypto';
import { attachSession } from './session-response';
import { needsRefresh, type Session } from './session.types';

type Resolved = { session: Session | null; response: NextResponse };

export async function resolveSession(request: NextRequest): Promise<Resolved> {
  const session = await unseal<Session>(
    request.cookies.get(sessionCookie)?.value,
  );

  if (!session) return { session: null, response: NextResponse.next() };
  if (!needsRefresh(session)) {
    return { session, response: NextResponse.next() };
  }

  const refreshToken = await unseal<{ token: string }>(
    request.cookies.get(refreshCookie)?.value,
  );
  const tokens = refreshToken && (await refreshTokens(refreshToken.token));
  const renewed = tokens && toSession(tokens);
  if (!tokens || !renewed)
    return { session: null, response: NextResponse.next() };

  request.cookies.set(sessionCookie, await seal(renewed, 60));
  const response = NextResponse.next({ request: { headers: request.headers } });
  await attachSession(response, renewed, tokens.refresh_token);
  return { session: renewed, response };
}
