'use client';

import { useCallback, useState, type FormEvent } from 'react';
import { ErrorState, LoadingState } from '@/components/ui/async-states';
import { Button } from '@/components/ui/button';
import { useAsyncResource } from '@/hooks/use-async-resource';
import { usersService } from '@/services/users-service';
import type { UserSearchQuery } from '@/types/payload/query/user-query';
import { UsersTable } from '@/features/users/users-table';

const initialQuery: UserSearchQuery = {
  pageNumber: 0,
  pageSize: 10,
  orderBy: 'username',
};

export default function UsersPage() {
  const [query, setQuery] = useState<UserSearchQuery>(initialQuery);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [createdAfter, setCreatedAfter] = useState('');
  const [createdBefore, setCreatedBefore] = useState('');
  const [orderBy, setOrderBy] =
    useState<UserSearchQuery['orderBy']>('username');
  const loadUsers = useCallback(() => usersService.search(query), [query]);
  const { data: page, error, loading, reload } = useAsyncResource(loadUsers);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery((current) => ({
      ...current,
      username: username.trim() || undefined,
      name: name.trim() || undefined,
      createdAfter: createdAfter || undefined,
      createdBefore: createdBefore || undefined,
      orderBy,
      pageNumber: 0,
    }));
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Administração
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Usuários
          </h1>
          <p className="mt-3 text-slate-300">
            Consulte e gerencie as contas cadastradas no GameKube.
          </p>
        </div>
      </div>
      <form
        onSubmit={search}
        className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-white/3 p-5 md:grid-cols-2 xl:grid-cols-[1fr_1fr_0.8fr_0.8fr_1fr_auto]"
      >
        <label className="grid gap-2 text-sm text-slate-300">
          Nome de usuário
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Buscar por usuário"
            className="rounded-lg border border-white/15 bg-slate-950/50 px-3 py-2.5 text-white outline-none focus:border-cyan-200/60"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Nome de exibição
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Buscar por nome"
            className="rounded-lg border border-white/15 bg-slate-950/50 px-3 py-2.5 text-white outline-none focus:border-cyan-200/60"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Criado a partir de
          <input
            type="date"
            value={createdAfter}
            onChange={(event) => setCreatedAfter(event.target.value)}
            className="rounded-lg border border-white/15 bg-slate-950/50 px-3 py-2.5 text-white outline-none focus:border-cyan-200/60"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Criado até
          <input
            type="date"
            value={createdBefore}
            onChange={(event) => setCreatedBefore(event.target.value)}
            className="rounded-lg border border-white/15 bg-slate-950/50 px-3 py-2.5 text-white outline-none focus:border-cyan-200/60"
          />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Ordenar por
          <select
            value={orderBy}
            onChange={(event) =>
              setOrderBy(event.target.value as UserSearchQuery['orderBy'])
            }
            className="rounded-lg border border-white/15 bg-slate-950/50 px-3 py-2.5 text-white outline-none focus:border-cyan-200/60"
          >
            <option value="username">Usuário (A–Z)</option>
            <option value="-username">Usuário (Z–A)</option>
            <option value="name">Nome (A–Z)</option>
            <option value="-name">Nome (Z–A)</option>
            <option value="-createdAt">Mais recentes</option>
            <option value="createdAt">Mais antigos</option>
          </select>
        </label>
        <div className="flex items-end">
          <Button type="submit" className="w-full">
            Buscar
          </Button>
        </div>
      </form>
      <div className="mt-6">
        {loading && <LoadingState label="Buscando usuários…" />}
        {error && (
          <ErrorState message={error.message} onRetry={() => void reload()} />
        )}
        {page && !loading && (
          <UsersTable
            page={page}
            onPrevious={() =>
              setQuery((current) => ({
                ...current,
                pageNumber: Math.max(0, (current.pageNumber ?? 0) - 1),
              }))
            }
            onNext={() =>
              setQuery((current) => ({
                ...current,
                pageNumber: (current.pageNumber ?? 0) + 1,
              }))
            }
          />
        )}
      </div>
    </main>
  );
}
