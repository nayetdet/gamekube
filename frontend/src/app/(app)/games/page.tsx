import type { Metadata } from 'next';
import { Gamepad2Icon } from 'lucide-react';
import { gameService } from '@/services/game.service';
import { EmptyState } from '@/components/common/empty-state';
import { ActiveGame } from '@/components/game/active-game';
import { getViewer } from '@/server/viewer';
import { PageHeader } from '@/components/common/page-header';
import { GameCard } from '@/components/game/game-card';

export const metadata: Metadata = { title: 'Jogos' };

export default async function GamesPage() {
  const [games, { user }] = await Promise.all([
    gameService.list(),
    getViewer(),
  ]);
  return (
    <>
      <PageHeader
        eyebrow="Jogar"
        title="Jogos"
        description="Escolha um título e o GameKube provisiona uma sessão privada para você no cluster."
      />

      {user.currentGame ? <ActiveGame id={user.currentGame} /> : null}
      <div className="space-y-5">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
        {games.length === 0 ? (
          <EmptyState
            icon={Gamepad2Icon}
            title="Nenhum jogo disponível"
            description="Volte mais tarde para conferir o catálogo."
          />
        ) : null}
      </div>
    </>
  );
}
