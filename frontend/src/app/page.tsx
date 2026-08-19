'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/providers';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { status, login } = useAuth();
  return (
    <main className="flex min-h-screen items-center overflow-hidden bg-[radial-gradient(circle_at_78%_20%,#175987_0,transparent_22%),radial-gradient(circle_at_12%_85%,#4c2d77_0,transparent_25%),linear-gradient(135deg,#07111f,#0b1930)] px-5 py-12 text-slate-100 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section>
          <div className="flex items-center gap-3 font-semibold">
            <span className="grid size-10 place-items-center rounded-xl bg-cyan-300 text-xl text-slate-950">
              ▣
            </span>
            GameKube
          </div>
          <p className="mt-14 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
            Jogos sob demanda
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">
            Sua próxima aventura começa em segundos.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Inicie experiências de jogo isoladas, prontas para jogar e
            acessíveis por um link seguro.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            {status === 'authenticated' ? (
              <Link
                href="/dashboard"
                className="inline-flex min-h-11 items-center rounded-lg bg-cyan-300 px-5 text-sm font-semibold text-slate-950 hover:bg-cyan-200"
              >
                Abrir biblioteca
              </Link>
            ) : (
              <Button type="button" onClick={() => void login()}>
                Entrar para jogar
              </Button>
            )}
            <a
              href="#como-funciona"
              className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-5 text-sm font-semibold hover:bg-white/5"
            >
              Como funciona
            </a>
          </div>
        </section>
        <section id="como-funciona" className="grid gap-4">
          <div className="rounded-2xl border border-cyan-200/15 bg-cyan-200/[0.07] p-6">
            <span className="text-2xl">01</span>
            <h2 className="mt-5 text-xl font-semibold">Autentique-se</h2>
            <p className="mt-2 leading-6 text-slate-300">
              Acesse com sua conta protegida pelo Keycloak.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/4 p-6">
            <span className="text-2xl">02</span>
            <h2 className="mt-5 text-xl font-semibold">Escolha um jogo</h2>
            <p className="mt-2 leading-6 text-slate-300">
              Solicite uma instância para sua sessão de jogo.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/4 p-6">
            <span className="text-2xl">03</span>
            <h2 className="mt-5 text-xl font-semibold">Jogue</h2>
            <p className="mt-2 leading-6 text-slate-300">
              Abra o endereço gerado assim que a instância estiver pronta.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
