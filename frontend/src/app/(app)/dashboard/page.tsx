import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import { friendshipService } from '@/services/friendship.service';
import { getViewer } from '@/server/viewer';
import { PageHeader } from '@/components/common/page-header';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { GreetingCard } from '@/components/dashboard/greeting-card';
import { OnlineFriends } from '@/components/dashboard/online-friends';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Visão geral' };

export default async function DashboardPage() {
  const [viewer, friends, received, sent] = await Promise.all([
    getViewer(),
    friendshipService.listFriends(),
    friendshipService.listReceivedRequests(),
    friendshipService.listSentRequests(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Visão geral"
        title="Seu lobby"
        description="Defina sua presença, veja quem está por perto e entre numa sessão."
        actions={
          <Button asChild className="gap-2 font-semibold">
            <Link href={routes.games}>
              Iniciar um jogo
              <ArrowRightIcon aria-hidden />
            </Link>
          </Button>
        }
      />

      <GreetingCard user={viewer.user} />

      <DashboardStats
        friends={friends}
        receivedCount={received.length}
        sentCount={sent.length}
      />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Online agora</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href={routes.friends}>Todos os amigos</Link>
          </Button>
        </div>
        <OnlineFriends friends={friends} />
      </section>
    </>
  );
}
