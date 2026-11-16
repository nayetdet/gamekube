import Image from 'next/image';
import Link from 'next/link';
import { Gamepad2Icon } from 'lucide-react';
import type { GameDefinition } from '@/entities/game/game.entity';
import { routes } from '@/config/routes';
import { formatRelative } from '@/lib/format';

type PlayedGame = { gameId: string; lastPlayedAt: string };

export function RecentGames({
  history,
  games,
  name,
  own = false,
}: {
  history: PlayedGame[];
  games: GameDefinition[];
  name: string;
  own?: boolean;
}) {
  const played = history.flatMap((entry) => {
    const game = games.find((item) => item.id === entry.gameId);
    return game ? [{ ...entry, game }] : [];
  });
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6">
      <div>
        <h2 className="text-lg font-bold">Jogos recentes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {own
            ? 'Os jogos que você já iniciou.'
            : `Jogos que ${name} já iniciou.`}
        </p>
      </div>
      {played.length ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {played.map(({ game, lastPlayedAt }) => (
            <li key={game.id}>
              <Link
                href={routes.game(game.id)}
                className="group flex items-center gap-4 rounded-lg border border-border bg-background/60 p-3 transition-colors hover:border-primary/40 hover:bg-muted/50"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={`/api/games/${encodeURIComponent(game.id)}/image`}
                    alt=""
                    fill
                    unoptimized
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold group-hover:text-primary">
                    {game.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Jogou {formatRelative(lastPlayedAt)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          <Gamepad2Icon className="mx-auto mb-2 size-6" aria-hidden />
          Nenhum jogo registrado ainda.
        </div>
      )}
    </section>
  );
}
