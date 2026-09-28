import Image from 'next/image';
import type { GameDefinition } from '@/entities/game/game.entity';
import { GameLauncher } from './game-launcher';

export function GameCard({ game }: { game: GameDefinition }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-card ring-1 ring-border">
      <div className="grid sm:grid-cols-[16rem_1fr]">
        <div className="relative min-h-40 bg-linear-to-br from-brand-500 to-brand-700 sm:min-h-full">
          <Image
            src={`/api/games/${encodeURIComponent(game.id)}/image`}
            alt={`Arte de ${game.name}`}
            unoptimized
            fill
            sizes="(min-width: 640px) 16rem, 100vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-4 p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold tracking-tight">
              {game.name}
            </h2>
            <p className="max-w-prose text-sm text-muted-foreground">
              {game.description}
            </p>
          </div>

          <GameLauncher slug={game.id} />
        </div>
      </div>
    </article>
  );
}
