import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, Gamepad2Icon } from 'lucide-react';
import { routes } from '@/config/routes';
import { gameIdSchema } from '@/entities/game/game.schema';
import { gameService } from '@/services/game.service';
import { GameLauncher } from '@/components/game/game-launcher';
import { SaveControls } from '@/components/game/save-controls';
import { GameVideo } from '@/components/game/game-video';
import { friendshipService } from '@/services/friendship.service';
import { PlayedFriends } from '@/components/game/played-friends';
import { BackLink } from '@/components/common/back-link';

type Props = { params: Promise<{ id: string }> };

async function getGame(params: Props['params']) {
  const id = gameIdSchema.safeParse((await params).id);
  if (!id.success) return undefined;
  return gameService.find(id.data);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = await getGame(params);
  return { title: game?.name ?? 'Jogo' };
}

export default async function GamePage({ params }: Props) {
  const game = await getGame(params);
  if (!game) notFound();
  const [friendNames, friends] = await Promise.all([
    gameService.friendsWhoPlayed(game.id),
    friendshipService.listFriends(),
  ]);
  const playedFriends = friendNames.flatMap((name) => {
    const friend = friends.find((item) => item.username === name);
    return friend ? [friend] : [];
  });

  return (
    <div className="space-y-6">
      <BackLink
        fallback={routes.games}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" aria-hidden /> Voltar
      </BackLink>
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative aspect-video w-full bg-muted sm:aspect-[21/9]">
          <Image
            src={`/api/games/${encodeURIComponent(game.id)}/image`}
            alt={`Capa de ${game.name}`}
            fill
            priority
            unoptimized
            sizes="(min-width: 1200px) 1152px, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/75">
              <Gamepad2Icon className="size-4" aria-hidden /> GameKube
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              {game.name}
            </h1>
          </div>
        </div>
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-3">
            <h2 className="text-xl font-bold">Sobre este jogo</h2>
            <p className="max-w-prose whitespace-pre-line leading-relaxed text-muted-foreground">
              {game.description}
            </p>
            <PlayedFriends friends={playedFriends} />
          </div>
          <div className="space-y-4 rounded-xl border border-border bg-background p-5">
            <p className="font-semibold">Pronto para jogar?</p>
            <GameLauncher slug={game.id} />
            {game.hasSave && <SaveControls id={game.id} />}
          </div>
        </div>
        <GameVideo url={game.videoUrl} name={game.name} />
      </section>
    </div>
  );
}
