import { NextResponse, type NextRequest } from 'next/server';
import { authRoutes, publicRoutes, routes } from '@/config/routes';
import { resolveSession } from '@/server/auth/proxy-session';
import { clearAuthCookies } from '@/server/auth/session-response';

function matches(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (matches(pathname, authRoutes)) return NextResponse.next();

  const { session, response } = await resolveSession(request);
  const isPublic = matches(pathname, publicRoutes);

  if (session && isPublic) {
    return NextResponse.redirect(new URL(routes.dashboard, request.nextUrl));
  }

  if (!session && !isPublic) {
    const target = new URL(routes.login, request.nextUrl);
    target.searchParams.set('redirectTo', `${pathname}${search}`);
    const redirect = NextResponse.redirect(target);
    clearAuthCookies(redirect);
    return redirect;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
