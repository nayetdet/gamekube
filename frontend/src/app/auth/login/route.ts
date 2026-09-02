import { NextResponse, type NextRequest } from 'next/server';
import { routes } from '@/config/routes';
import { buildAuthorizationUrl } from '@/server/auth/oidc-endpoints';
import { deriveCodeChallenge, randomToken } from '@/server/auth/pkce';
import { attachAuthorizationRequest } from '@/server/auth/session-response';

export async function GET(request: NextRequest) {
  const state = randomToken();
  const codeVerifier = randomToken();
  const redirectTo = safeRedirect(
    request.nextUrl.searchParams.get('redirectTo'),
  );

  const response = NextResponse.redirect(
    buildAuthorizationUrl({
      state,
      codeChallenge: await deriveCodeChallenge(codeVerifier),
    }),
  );

  await attachAuthorizationRequest(response, {
    state,
    codeVerifier,
    redirectTo,
  });
  return response;
}

function safeRedirect(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return routes.dashboard;
  }
  return value;
}
