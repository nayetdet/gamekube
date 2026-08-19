import { CaveStoryLauncher } from '@/features/games/cave-story-launcher';

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
        Biblioteca
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Escolha sua próxima aventura
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-slate-300">
        Instâncias temporárias para jogar sem configuração manual. Seus jogos
        ficam disponíveis pelo endereço gerado para cada partida.
      </p>
      <div className="mt-10">
        <CaveStoryLauncher />
      </div>
    </main>
  );
}
