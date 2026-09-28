import { gameService } from '@/services/game.service';
import { EndGameForm } from './end-game-form';

export async function ActiveGame({ id }: { id: string }) {
  const game = await gameService.find(id);
  return (
    <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-card p-4 ring-1 ring-border">
      <div>
        <h2 className="font-bold">Sessão ativa: {game?.name ?? id}</h2>
        <p className="text-sm text-muted-foreground">
          Encerre a sessão para iniciar outro jogo.
        </p>
      </div>
      <EndGameForm id={id} />
    </section>
  );
}
