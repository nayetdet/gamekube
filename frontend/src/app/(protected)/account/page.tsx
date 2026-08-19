'use client';

import { useCallback } from 'react';
import { ErrorState, LoadingState } from '@/components/ui/async-states';
import { formatDateTime } from '@/lib/format';
import { useAsyncResource } from '@/hooks/use-async-resource';
import { usersService } from '@/services/users-service';
import { UserActions } from '@/features/users/user-actions';
import { UserForm } from '@/features/users/user-form';

export default function AccountPage() {
  const loadUser = useCallback(() => usersService.getSelf(), []);
  const { data: user, error, loading, reload } = useAsyncResource(loadUser);

  if (loading) return <LoadingState label="Carregando seu perfil…" />;
  if (error)
    return (
      <main className="mx-auto max-w-4xl px-5 py-10">
        <ErrorState message={error.message} onRetry={() => void reload()} />
      </main>
    );
  if (!user) return null;

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
        Conta
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Meu perfil</h1>
      <p className="mt-3 text-slate-300">
        Atualize as informações públicas da sua conta e gerencie seu acesso.
      </p>
      <div className="mt-9 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        <section className="rounded-2xl border border-white/10 bg-slate-950/30 p-6 sm:p-8">
          <UserForm
            key={`${user.id}-${user.updatedAt}`}
            user={user}
            onSaved={() => reload()}
          />
        </section>
        <aside className="space-y-5">
          <section className="rounded-2xl border border-white/10 bg-white/3 p-5 text-sm">
            <h2 className="font-semibold text-slate-100">
              Informações da conta
            </h2>
            <dl className="mt-4 space-y-3 text-slate-400">
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-500">
                  Criada em
                </dt>
                <dd className="mt-1 text-slate-200">
                  {formatDateTime(user.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-slate-500">
                  Última atualização
                </dt>
                <dd className="mt-1 text-slate-200">
                  {formatDateTime(user.updatedAt)}
                </dd>
              </div>
            </dl>
          </section>
          <UserActions username={user.username} self />
        </aside>
      </div>
    </main>
  );
}
