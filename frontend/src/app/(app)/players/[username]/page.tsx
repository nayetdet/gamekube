import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, MessageCircleIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import { displayName } from '@/entities/user/user.entity';
import { friendshipService } from '@/services/friendship.service';
import { gameService } from '@/services/game.service';
import { Button } from '@/components/ui/button';
import { BackLink } from '@/components/common/back-link';
import { ProfileHero } from '@/components/user/profile-hero';
import { ProfileAbout } from '@/components/user/profile-about';
import { RecentGames } from '@/components/user/recent-games';

export default async function PlayerPage({
  params,
}: PageProps<'/players/[username]'>) {
  const { username } = await params;
  const friends = await friendshipService.listFriends();
  const player = friends.find((friend) => friend.username === username);
  if (!player) notFound();
  const [history, games] = await Promise.all([
    gameService.playedBy(username),
    gameService.list(),
  ]);
  return (
    <div className="space-y-5">
      <BackLink
        fallback={routes.friends}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" aria-hidden /> Voltar
      </BackLink>
      <ProfileHero
        user={player}
        action={
          <Button asChild>
            <Link href={routes.conversation(player.username)}>
              <MessageCircleIcon aria-hidden /> Conversar
            </Link>
          </Button>
        }
      />
      <div className="grid items-start gap-4 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
        <ProfileAbout user={player} />
        <RecentGames
          history={history}
          games={games}
          name={displayName(player)}
        />
      </div>
    </div>
  );
}
