import type { Metadata } from 'next';
import { routes } from '@/config/routes';
import { friendshipService } from '@/services/friendship.service';
import { getViewer } from '@/server/viewer';
import { PageHeader } from '@/components/common/page-header';
import { DangerCard } from '@/components/user/danger-card';
import { EmailCard } from '@/components/user/email-card';
import { ProfileCard } from '@/components/user/profile-card';
import { ProfileHero } from '@/components/user/profile-hero';

export const metadata: Metadata = { title: 'Perfil' };

export default async function ProfilePage() {
  const [{ user }, friends, received] = await Promise.all([
    getViewer(),
    friendshipService.listFriends(),
    friendshipService.listReceivedRequests(),
  ]);

  const stats = [
    { label: 'Amigos', value: friends.length, href: routes.friends },
    {
      label: 'Online',
      value: friends.filter((friend) => friend.status === 'ONLINE').length,
      href: routes.friends,
    },
    {
      label: 'Pedidos',
      value: received.length,
      href: routes.friendRequests,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Conta"
        title="Seu perfil"
        description="É isto que outros jogadores veem quando encontram você."
      />

      <ProfileHero user={user} stats={stats} />

      <ProfileCard
        user={user}
        title="Detalhes públicos"
        description="Toque no lápis ao lado de um campo para editá-lo. Trocar o nome de usuário também muda como você entra na sua conta."
      />

      <EmailCard username={user.username} />

      <DangerCard
        username={user.username}
        description="Excluir sua conta faz logout e não pode ser desfeito."
      />
    </>
  );
}
