'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/providers';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const { status, login } = useAuth();
  useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard');
  }, [router, status]);
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,_#153e69,_transparent_45%),#07111f] px-5">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/40 p-8 shadow-2xl shadow-slate-950/40">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="grid size-9 place-items-center rounded-xl bg-cyan-300 text-slate-950">
            ▣
          </span>
          GameKube
        </Link>
        <p className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
          Bem-vindo
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Entre para continuar</h1>
        <p className="mt-3 leading-7 text-slate-300">
          Você será direcionado ao ambiente seguro de autenticação.
        </p>
        <Button
          type="button"
          onClick={() => void login()}
          className="mt-8 w-full"
        >
          Entrar com Keycloak
        </Button>
      </section>
    </main>
  );
}
