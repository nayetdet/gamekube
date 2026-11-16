import { decodeJwt } from 'jose';
import { env } from '@/config/env';
import type { Session, SessionUser } from './session.types';
import { callbackUrl, oidcEndpoints } from './oidc-endpoints';

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

type AccessTokenClaims = {
  sub?: string;
  preferred_username?: string;
  name?: string;
  email?: string;
  realm_access?: { roles?: string[] };
};

async function post(body: URLSearchParams): Promise<TokenResponse | null> {
  const response = await fetch(oidcEndpoints.token(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });
  return response.ok ? ((await response.json()) as TokenResponse) : null;
}

export function exchangeCode(code: string, codeVerifier: string) {
  return post(
    new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: env().KEYCLOAK_CLIENT_ID,
      redirect_uri: callbackUrl(),
      code,
      code_verifier: codeVerifier,
    }),
  );
}

export function refreshTokens(refreshToken: string) {
  return post(
    new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: env().KEYCLOAK_CLIENT_ID,
      refresh_token: refreshToken,
    }),
  );
}

function readUser(accessToken: string): SessionUser | null {
  const claims = decodeJwt<AccessTokenClaims>(accessToken);
  if (!claims.sub || !claims.preferred_username) return null;
  return {
    subject: claims.sub,
    username: claims.preferred_username,
    name: claims.name ?? null,
    email: claims.email ?? null,
    roles: claims.realm_access?.roles ?? [],
  };
}

export function toSession(tokens: TokenResponse): Session | null {
  const user = readUser(tokens.access_token);
  if (!user) return null;
  return {
    user,
    accessToken: tokens.access_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  };
}
