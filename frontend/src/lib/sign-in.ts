import { routes } from '@/config/routes';

type Param = string | string[] | undefined;

function first(value: Param): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function signInHref(redirectTo: Param): string {
  const target = first(redirectTo);
  if (!target || !target.startsWith('/') || target.startsWith('//')) {
    return routes.authLogin;
  }
  return `${routes.authLogin}?redirectTo=${encodeURIComponent(target)}`;
}

const messages: Record<string, string> = {
  invalid_request:
    'Esse link de acesso expirou antes de ser usado. Tente novamente.',
  exchange_failed:
    'O Keycloak recusou o acesso. Verifique se sua conta está habilitada.',
};

export function signInError(value: Param): string | null {
  const code = first(value);
  return code ? (messages[code] ?? 'Falha no acesso. Tente novamente.') : null;
}
