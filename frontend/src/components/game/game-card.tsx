import Image from 'next/image';
import Link from 'next/link';
import { routes } from '@/config/routes';
import type { GameDefinition } from '@/entities/game/game.entity';
import { GameLauncher } from './game-launcher';

export function GameCard({ game }: { game: GameDefinition }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-card ring-1 ring-border transition-shadow hover:shadow-lg hover:ring-primary/40 motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1">
      <Link
        href={routes.game(game.id)}
        aria-label={`Ver detalhes de ${game.name}`}
        className="relative block aspect-[4/3] bg-linear-to-br from-brand-500 to-brand-700 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
      >
        <Image
          src={`/api/games/${encodeURIComponent(game.id)}/image`}
          alt=""
          unoptimized
          fill
          sizes="(min-width: 1536px) 25vw, (min-width: 1280px) 33vw, (min-width: 480px) 50vw, 100vw"
          className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <h3 className="flex-1 text-lg font-extrabold tracking-tight">
          {game.name}
        </h3>
        <GameLauncher slug={game.id} />
      </div>
    </article>
  );
}
