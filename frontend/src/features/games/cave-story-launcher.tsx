'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Feedback } from '@/components/ui/async-states';
import { gamesService } from '@/services/games-service';

export function CaveStoryLauncher() {
  const [loading, setLoading] = useState(false);
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startGame() {
    setLoading(true);
    setError(null);
    setGameUrl(null);
    try {
      const game = await gamesService.createCaveStory();
      setGameUrl(game.url);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Não foi possível iniciar o jogo.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-cyan-200/15 bg-slate-950/45 shadow-2xl shadow-cyan-950/30">
      <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Experiência disponível
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Cave Story
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-slate-300">
            Crie uma instância exclusiva do clássico de aventura. O GameKube
            prepara a infraestrutura e entrega um endereço seguro assim que ela
            estiver pronta.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={() => void startGame()}
              loading={loading}
            >
              Iniciar nova partida
            </Button>
            <span className="text-xs text-slate-500">
              O preparo pode levar até dois minutos.
            </span>
          </div>
          <div className="mt-5 space-y-3" aria-live="polite">
            {loading && (
              <Feedback type="info">
                Preparando sua instância de Cave Story…
              </Feedback>
            )}
            {error && <Feedback type="error">{error}</Feedback>}
            {gameUrl && (
              <Feedback type="success">
                Sua partida está pronta.{' '}
                <a
                  href={gameUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline underline-offset-2"
                >
                  Abrir Cave Story em uma nova aba
                </a>
                .
              </Feedback>
            )}
          </div>
        </div>
        <div className="relative min-h-60 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,#1d4d6a,#0b1c38_48%,#301d57)] p-6">
          <div className="absolute inset-x-0 top-0 h-px bg-cyan-100/50" />
          <div className="grid h-full place-items-center">
            <div className="text-center">
              <div className="mx-auto grid size-24 place-items-center rounded-3xl border border-cyan-100/25 bg-slate-950/30 text-5xl shadow-xl">
                ✦
              </div>
              <p className="mt-5 font-mono text-sm tracking-[0.3em] text-cyan-100">
                CAVE STORY
              </p>
              <p className="mt-2 text-xs text-slate-300">
                Pronto para uma nova jornada
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
