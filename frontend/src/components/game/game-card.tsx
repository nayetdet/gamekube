import Image from 'next/image';
import { CalendarIcon } from 'lucide-react';
import type { GameDefinition } from '@/entities/game/game.entity';
import { GameLauncher } from './game-launcher';

export function GameCard({ game }: { game: GameDefinition }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-card ring-1 ring-border">
      <div className="grid sm:grid-cols-[16rem_1fr]">
        <div
          className={`relative min-h-40 bg-linear-to-br ${game.accent} sm:min-h-full`}
        >
          <Image
            src={game.cover}
            alt={`Arte de ${game.title}`}
            fill
            sizes="(min-width: 640px) 16rem, 100vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-4 p-6">
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold tracking-tight">
              {game.title}
            </h2>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <CalendarIcon className="size-3.5" aria-hidden />
              {game.year} · {game.studio}
            </p>
            <p className="max-w-prose text-sm text-muted-foreground">
              {game.blurb}
            </p>
          </div>

          <GameLauncher slug={game.slug} />
        </div>
      </div>
    </article>
  );
}
