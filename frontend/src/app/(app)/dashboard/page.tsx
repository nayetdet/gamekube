import type { Metadata } from 'next';
import { friendshipService } from '@/services/friendship.service';
import { gameService } from '@/services/game.service';
import { FeaturedGames } from '@/components/dashboard/featured-games';

export const metadata: Metadata = { title: 'Visão geral' };

export default async function DashboardPage() {
  const [friends, games] = await Promise.all([
    friendshipService.listFriends(),
    gameService.list(),
  ]);
  return <FeaturedGames games={games} friends={friends} />;
}
