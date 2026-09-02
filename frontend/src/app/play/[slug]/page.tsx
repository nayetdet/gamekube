import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { env } from '@/config/env';
import { routes } from '@/config/routes';
import { findGame, parseSessionUrl } from '@/entities/game/game.entity';
import { requireSession } from '@/server/auth/dal';
import { GameStage } from '@/components/game/game-stage';

export async function generateMetadata(
  props: PageProps<'/play/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params;
  return { title: findGame(slug)?.title ?? 'Sessão' };
}

export default async function PlayPage(props: PageProps<'/play/[slug]'>) {
  await requireSession();

  const { slug } = await props.params;
  const game = findGame(slug);
  if (!game) notFound();

  const { session } = await props.searchParams;
  const url = parseSessionUrl(session, env().GAME_SESSION_DOMAIN);
  if (!url) redirect(routes.games);

  return <GameStage url={url} title={game.title} ratio={game.ratio} />;
}
