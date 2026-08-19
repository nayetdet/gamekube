'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { completeLogin } from '@/lib/oidc';
import { Button } from '@/components/ui/button';

export function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const code = searchParams.get('code');
  const callbackError =
    searchParams.get('error_description') ??
    searchParams.get('error') ??
    (!code ? 'O provedor não retornou um código de autenticação.' : null);

  useEffect(() => {
    if (!code || callbackError) return;
    void completeLogin(code, searchParams.get('state'))
      .then(() => router.replace('/dashboard'))
      .catch((reason: unknown) =>
        setError(
          reason instanceof Error
            ? reason.message
            : 'Não foi possível concluir seu login.',
        ),
      );
  }, [callbackError, code, router, searchParams]);

  const displayedError = callbackError ?? error;

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-5 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-white/4 p-8 text-center">
        {displayedError ? (
          <>
            <p className="text-sm font-semibold text-rose-200">
              Falha na autenticação
            </p>
            <h1 className="mt-3 text-2xl font-semibold">
              Não foi possível entrar
            </h1>
            <p className="mt-3 text-slate-300">{displayedError}</p>
            <Link href="/login" className="mt-7 inline-flex">
              <Button type="button">Tentar novamente</Button>
            </Link>
          </>
        ) : (
          <>
            <span className="mx-auto block size-7 animate-spin rounded-full border-2 border-cyan-100/30 border-t-cyan-100" />
            <h1 className="mt-5 text-xl font-semibold">
              Concluindo sua autenticação
            </h1>
            <p className="mt-2 text-slate-400">Aguarde um instante…</p>
          </>
        )}
      </section>
    </main>
  );
}
