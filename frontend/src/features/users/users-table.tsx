'use client';

import Link from 'next/link';
import { EmptyState } from '@/components/ui/async-states';
import { formatDateTime } from '@/lib/format';
import type { PageResponse } from '@/types/utils/page';
import type { UserResponse } from '@/types/payload/response/user-response';

export function UsersTable({
  page,
  onPrevious,
  onNext,
}: {
  page: PageResponse<UserResponse>;
  onPrevious: () => void;
  onNext: () => void;
}) {
  if (page.content.length === 0) {
    return (
      <EmptyState
        title="Nenhum usuário encontrado"
        description="Ajuste os filtros de busca ou crie usuários pelo fluxo de registro do Keycloak."
      />
    );
  }

  const currentPage = page.pageable.pageNumber + 1;
  const totalPages = Math.max(
    1,
    Math.ceil(page.pageable.total / page.pageable.pageSize),
  );
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/30">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/3 text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-5 py-4 font-medium">Usuário</th>
              <th className="px-5 py-4 font-medium">Nome</th>
              <th className="px-5 py-4 font-medium">Criado em</th>
              <th className="px-5 py-4">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {page.content.map((user) => (
              <tr key={user.id} className="transition hover:bg-white/3">
                <td className="px-5 py-4 font-medium text-slate-100">
                  {user.username}
                </td>
                <td className="px-5 py-4 text-slate-300">{user.name || '—'}</td>
                <td className="px-5 py-4 text-slate-400">
                  {formatDateTime(user.createdAt)}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/users/${encodeURIComponent(user.username)}`}
                    className="font-medium text-cyan-200 hover:text-cyan-100"
                  >
                    Gerenciar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 text-sm text-slate-400">
        <span>
          {page.pageable.total}{' '}
          {page.pageable.total === 1
            ? 'usuário encontrado'
            : 'usuários encontrados'}{' '}
          · Página {currentPage} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={page.pageable.pageNumber === 0}
            className="rounded-lg border border-white/15 px-3 py-2 text-slate-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={currentPage >= totalPages}
            className="rounded-lg border border-white/15 px-3 py-2 text-slate-200 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
