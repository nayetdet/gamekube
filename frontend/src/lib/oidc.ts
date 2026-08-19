'use client';

const storageKey = 'gamekube.tokens';
const stateKey = 'gamekube.oidc.state';
const verifierKey = 'gamekube.oidc.verifier';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in: number;
}

interface JwtPayload {
  preferred_username?: string;
  name?: string;
  realm_access?: { roles?: string[] };
}

const keycloakUrl =
  process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? 'http://localhost:8080';
const realm = process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? 'gamekube';
const clientId =
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? 'frontend-client';
const issuer = `${keycloakUrl}/realms/${realm}`;

let cachedTokens: AuthTokens | null = null;
const subscribers = new Set<(tokens: AuthTokens | null) => void>();

function getStorage() {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
}

function base64Url(bytes: Uint8Array) {
  let value = '';
  bytes.forEach((byte) => {
    value += String.fromCharCode(byte);
  });
  return btoa(value)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function randomValue() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

async function challengeFor(verifier: string) {
  const data = new TextEncoder().encode(verifier);
  return base64Url(new Uint8Array(await crypto.subtle.digest('SHA-256', data)));
}

function redirectUri() {
  return `${window.location.origin}/auth/callback`;
}

function notify(tokens: AuthTokens | null) {
  subscribers.forEach((subscriber) => subscriber(tokens));
}

function persist(tokens: AuthTokens | null) {
  cachedTokens = tokens;
  const storage = getStorage();
  if (!storage) return;
  if (tokens) storage.setItem(storageKey, JSON.stringify(tokens));
  else storage.removeItem(storageKey);
  notify(tokens);
}

function parseTokenResponse(response: TokenResponse): AuthTokens {
  return {
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    idToken: response.id_token,
    expiresAt: Date.now() + Math.max(response.expires_in - 30, 0) * 1000,
  };
}

async function requestTokens(body: URLSearchParams) {
  const response = await fetch(`${issuer}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    throw new Error('Não foi possível concluir a autenticação com o Keycloak.');
  }

  return parseTokenResponse((await response.json()) as TokenResponse);
}

export function decodeJwt(token: string): JwtPayload {
  try {
    const payload = token.split('.')[1];
    if (!payload) return {};
    const normalized = payload.replaceAll('-', '+').replaceAll('_', '/');
    const decoded = decodeURIComponent(
      atob(normalized)
        .split('')
        .map(
          (character) =>
            `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`,
        )
        .join(''),
    );
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return {};
  }
}

export function getStoredTokens() {
  if (cachedTokens) return cachedTokens;
  const raw = getStorage()?.getItem(storageKey);
  if (!raw) return null;

  try {
    cachedTokens = JSON.parse(raw) as AuthTokens;
    return cachedTokens;
  } catch {
    getStorage()?.removeItem(storageKey);
    return null;
  }
}

export function subscribeToTokens(
  callback: (tokens: AuthTokens | null) => void,
) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

export async function beginLogin() {
  const state = randomValue();
  const verifier = randomValue();
  const storage = getStorage();
  storage?.setItem(stateKey, state);
  storage?.setItem(verifierKey, verifier);

  const query = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    scope: 'openid profile email',
    redirect_uri: redirectUri(),
    state,
    code_challenge: await challengeFor(verifier),
    code_challenge_method: 'S256',
  });

  // O fluxo OIDC precisa navegar para uma origem externa ao aplicativo Next.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = `${issuer}/protocol/openid-connect/auth?${query}`;
}

export async function completeLogin(code: string, state: string | null) {
  const storage = getStorage();
  const expectedState = storage?.getItem(stateKey);
  const verifier = storage?.getItem(verifierKey);

  if (!state || state !== expectedState || !verifier) {
    throw new Error(
      'A validação de segurança do login expirou. Tente novamente.',
    );
  }

  storage?.removeItem(stateKey);
  storage?.removeItem(verifierKey);
  const tokens = await requestTokens(
    new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: redirectUri(),
      code_verifier: verifier,
    }),
  );
  persist(tokens);
  return tokens;
}

export async function getValidAccessToken(forceRefresh = false) {
  const tokens = getStoredTokens();
  if (!tokens) return null;
  if (!forceRefresh && tokens.expiresAt > Date.now()) return tokens.accessToken;
  if (!tokens.refreshToken) {
    persist(null);
    return null;
  }

  try {
    const refreshed = await requestTokens(
      new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: clientId,
        refresh_token: tokens.refreshToken,
      }),
    );
    persist({
      ...refreshed,
      refreshToken: refreshed.refreshToken ?? tokens.refreshToken,
    });
    return refreshed.accessToken;
  } catch {
    persist(null);
    return null;
  }
}

export function clearTokens() {
  persist(null);
}

export function logout() {
  const idToken = getStoredTokens()?.idToken;
  clearTokens();
  const query = new URLSearchParams({
    post_logout_redirect_uri: `${window.location.origin}/`,
    client_id: clientId,
  });
  if (idToken) query.set('id_token_hint', idToken);
  // O logout é finalizado pelo endpoint externo do Keycloak.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = `${issuer}/protocol/openid-connect/logout?${query}`;
}
