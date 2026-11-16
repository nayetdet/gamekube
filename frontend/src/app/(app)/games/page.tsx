import type { Metadata } from 'next';
import { Gamepad2Icon } from 'lucide-react';
import { gameService } from '@/services/game.service';
import { EmptyState } from '@/components/common/empty-state';
import { ActiveGame } from '@/components/game/active-game';
import { getViewer } from '@/server/viewer';
import { PageHeader } from '@/components/common/page-header';
import { GameCard } from '@/components/game/game-card';
import { GameSearch } from '@/components/game/game-search';

export const metadata: Metadata = { title: 'Jogos' };

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [allGames, { user }, params] = await Promise.all([
    gameService.list(),
    getViewer(),
    searchParams,
  ]);
  const query = typeof params.q === 'string' ? params.q.trim() : '';
  const games = allGames.filter((game) =>
    game.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  return (
    <>
      <PageHeader
        eyebrow="Jogar"
        title="Jogos"
        description="Escolha um título e o GameKube provisiona uma sessão privada para você no cluster."
      />
      {user.currentGame ? <ActiveGame id={user.currentGame} /> : null}
      <section aria-label="Catálogo de jogos" className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold">Todos os jogos</h2>
          <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
            {games.length}
          </span>
          <GameSearch
            defaultValue={query}
            className="w-full sm:ml-auto sm:w-72"
          />
        </div>
        {games.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Gamepad2Icon}
            title={query ? 'Nenhum jogo encontrado' : 'Nenhum jogo disponível'}
            description={
              query
                ? 'Tente buscar por outro nome.'
                : 'Volte mais tarde para conferir o catálogo.'
            }
          />
        )}
      </section>
    </>
  );
}
