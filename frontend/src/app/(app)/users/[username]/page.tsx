import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import { displayName } from '@/entities/user/user.entity';
import { hasStatus } from '@/services/http/api-error';
import { userService } from '@/services/user.service';
import { requireAdminSession } from '@/server/auth/dal';
import { PageHeader } from '@/components/common/page-header';
import { PresenceBadge } from '@/components/presence/presence-badge';
import { AccountCard } from '@/components/user/account-card';
import { DangerCard } from '@/components/user/danger-card';
import { PresenceCard } from '@/components/user/presence-card';
import { ProfileCard } from '@/components/user/profile-card';
import { Button } from '@/components/ui/button';

export async function generateMetadata(
  props: PageProps<'/users/[username]'>,
): Promise<Metadata> {
  const { username } = await props.params;
  return { title: `@${username}` };
}

export default async function UserDetailPage(
  props: PageProps<'/users/[username]'>,
) {
  await requireAdminSession();
  const { username } = await props.params;

  const user = await userService.findByUsername(username).catch((error) => {
    if (hasStatus(error, 404)) notFound();
    throw error;
  });

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href={routes.users}>
          <ArrowLeftIcon aria-hidden />
          Voltar ao diretório
        </Link>
      </Button>

      <PageHeader
        eyebrow="Administração"
        title={displayName(user)}
        description={
          user.description ?? 'Este jogador ainda não escreveu uma bio.'
        }
        actions={
          <PresenceBadge status={user.status} currentGame={user.currentGame} />
        }
      />

      <PresenceCard username={user.username} />
      <AccountCard user={user} />
      <ProfileCard
        user={user}
        title="Editar jogador"
        description="Toque no lápis para editar um campo. As alterações são salvas no servidor e espelhadas no Keycloak."
      />
      <DangerCard
        username={user.username}
        label="Excluir jogador"
        description="Remove o jogador do GameKube e do realm."
      />
    </>
  );
}
