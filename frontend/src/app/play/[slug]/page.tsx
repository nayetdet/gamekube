import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { env } from '@/config/env';
import { routes } from '@/config/routes';
import { parseSessionUrl } from '@/entities/game/game.entity';
import { gameService } from '@/services/game.service';
import { LiveUpdates } from '@/components/realtime/live-updates';
import { requireSession } from '@/server/auth/dal';
import { GameStage } from '@/components/game/game-stage';

export async function generateMetadata(
  props: PageProps<'/play/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params;
  return { title: (await gameService.find(slug))?.name ?? 'Sessão' };
}

export default async function PlayPage(props: PageProps<'/play/[slug]'>) {
  await requireSession();

  const { slug } = await props.params;
  const game = await gameService.find(slug);
  if (!game) notFound();

  const { session } = await props.searchParams;
  const url = parseSessionUrl(session, env().GAME_SESSION_DOMAIN);
  if (!url) redirect(routes.games);

  return (
    <>
      <LiveUpdates gameId={game.id} />
      <GameStage url={url} title={game.name} ratio={4 / 3} gameId={game.id} />
    </>
  );
}
