import { env } from '@/config/env';
import { routes } from '@/config/routes';

const OIDC_BASE = 'protocol/openid-connect';

function issuerUrl(path: string): string {
  return `${env().KEYCLOAK_ISSUER_URL.replace(/\/$/, '')}/${OIDC_BASE}/${path}`;
}

export const oidcEndpoints = {
  authorization: () => issuerUrl('auth'),
  token: () => issuerUrl('token'),
  endSession: () => issuerUrl('logout'),
};

export function callbackUrl(): string {
  return new URL(routes.authCallback, env().APP_URL).toString();
}

export function buildAuthorizationUrl(input: {
  state: string;
  codeChallenge: string;
}): string {
  const url = new URL(oidcEndpoints.authorization());
  url.searchParams.set('client_id', env().KEYCLOAK_CLIENT_ID);
  url.searchParams.set('redirect_uri', callbackUrl());
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid profile email');
  url.searchParams.set('state', input.state);
  url.searchParams.set('code_challenge', input.codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  return url.toString();
}

export function buildEndSessionUrl(): string {
  const url = new URL(oidcEndpoints.endSession());
  url.searchParams.set('client_id', env().KEYCLOAK_CLIENT_ID);
  url.searchParams.set(
    'post_logout_redirect_uri',
    new URL(routes.login, env().APP_URL).toString(),
  );
  return url.toString();
}
