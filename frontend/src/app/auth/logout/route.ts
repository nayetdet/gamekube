import { NextResponse } from 'next/server';
import { buildEndSessionUrl } from '@/server/auth/oidc-endpoints';
import { clearAuthCookies } from '@/server/auth/session-response';

export async function GET() {
  const response = NextResponse.redirect(buildEndSessionUrl());
  clearAuthCookies(response);
  return response;
}
