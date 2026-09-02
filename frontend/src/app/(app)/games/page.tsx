import type { Metadata } from 'next';
import { gameCatalog } from '@/entities/game/game.entity';
import { PageHeader } from '@/components/common/page-header';
import { GameCard } from '@/components/game/game-card';

export const metadata: Metadata = { title: 'Jogos' };

export default function GamesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Jogar"
        title="Jogos"
        description="Escolha um título e o GameKube provisiona uma sessão privada para você no cluster."
      />

      <div className="space-y-5">
        {gameCatalog.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </>
  );
}
