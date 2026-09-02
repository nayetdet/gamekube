import type { Metadata } from 'next';
import { userQuerySchema } from '@/entities/user/user.query';
import { userService } from '@/services/user.service';
import { requireAdminSession } from '@/server/auth/dal';
import { PageHeader } from '@/components/common/page-header';
import { UserFilters } from '@/components/user/user-filters';
import { UserPagination } from '@/components/user/user-pagination';
import { UserTable } from '@/components/user/user-table';

export const metadata: Metadata = { title: 'Diretório' };

export default async function UsersPage(props: PageProps<'/users'>) {
  await requireAdminSession();

  const query = userQuerySchema.parse(await props.searchParams);
  const page = await userService.search(query);

  return (
    <>
      <PageHeader
        eyebrow="Administração"
        title="Diretório de jogadores"
        description="Todas as contas cadastradas no realm, com sua presença ao vivo."
      />
      <UserFilters query={query} />
      <UserTable users={page.content} />
      <UserPagination meta={page.pageable} query={query} />
    </>
  );
}
