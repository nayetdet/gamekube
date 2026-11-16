import { gameService } from '@/services/game.service';
import { EndGameForm } from './end-game-form';
import Image from 'next/image';

export async function ActiveGame({ id }: { id: string }) {
  const game = await gameService.find(id);
  return (
    <section className="relative isolate flex min-h-28 flex-wrap items-center justify-between gap-4 overflow-hidden rounded-xl border border-border bg-card p-5 sm:px-6">
      {game && (
        <>
          <Image
            src={`/api/games/${encodeURIComponent(id)}/image`}
            alt=""
            fill
            unoptimized
            sizes="(min-width: 768px) 50vw, 100vw"
            className="-z-20 object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/95 via-black/85 to-black/60" />
        </>
      )}
      <div className={game ? 'text-white' : ''}>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-online">
          Sessão ativa
        </p>
        <h2 className="text-lg font-bold">{game?.name ?? id}</h2>
        <p
          className={
            game ? 'text-sm text-white/75' : 'text-sm text-muted-foreground'
          }
        >
          Encerre a sessão para iniciar outro jogo.
        </p>
      </div>
      <EndGameForm id={id} />
    </section>
  );
}
