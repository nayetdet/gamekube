import type { Metadata } from 'next';
import { routes } from '@/config/routes';
import { friendshipService } from '@/services/friendship.service';
import { gameService } from '@/services/game.service';
import { getViewer } from '@/server/viewer';
import { ProfileHero } from '@/components/user/profile-hero';
import { ProfileAbout } from '@/components/user/profile-about';
import { ProfileStats } from '@/components/user/profile-stats';
import { RecentGames } from '@/components/user/recent-games';
import { displayName } from '@/entities/user/user.entity';

export const metadata: Metadata = { title: 'Perfil' };

export default async function ProfilePage() {
  const [{ user }, friends, received, games] = await Promise.all([
    getViewer(),
    friendshipService.listFriends(),
    friendshipService.listReceivedRequests(),
    gameService.list(),
  ]);
  const history = await gameService.playedBy(user.username);
  const stats = [
    { label: 'Amigos', value: friends.length, href: routes.friends },
    { label: 'Pedidos', value: received.length, href: routes.friendRequests },
  ];
  return (
    <div className="space-y-5">
      <ProfileHero user={user} editable />
      <div className="grid items-start gap-4 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
        <div className="space-y-4">
          <ProfileAbout user={user} />
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <ProfileStats stats={stats} />
          </div>
        </div>
        <div className="space-y-4">
          <RecentGames
            history={history}
            games={games}
            name={displayName(user)}
            own
          />
        </div>
      </div>
    </div>
  );
}
