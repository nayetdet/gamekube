import { isApiError } from '@/services/http/api-error';

export type StatusMessages = Partial<Record<number, string>>;

const GENERIC = 'Algo deu errado. Tente novamente.';

const byStatus: StatusMessages = {
  400: 'O servidor rejeitou essa requisição.',
  403: 'Você não tem permissão para fazer isso.',
  404: 'Não encontramos o que você procurava.',
  409: 'Isso conflita com algo que já existe.',
  500: 'O servidor encontrou um problema. Tente novamente.',
  502: 'O provedor de identidade está inacessível no momento.',
  504: 'O servidor demorou demais para responder.',
};

export function describeError(
  error: unknown,
  overrides: StatusMessages = {},
): string {
  if (!isApiError(error)) return GENERIC;
  return (
    overrides[error.status] ?? error.detail ?? byStatus[error.status] ?? GENERIC
  );
}
