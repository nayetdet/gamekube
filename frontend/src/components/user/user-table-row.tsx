import Link from 'next/link';
import { ChevronRightIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import type { User } from '@/entities/user/user.entity';
import { formatDate, formatRelative } from '@/lib/format';
import { PresenceBadge } from '@/components/presence/presence-badge';
import { UserIdentity } from '@/components/user/user-identity';
import { TableCell, TableRow } from '@/components/ui/table';

export function UserTableRow({ user }: { user: User }) {
  return (
    <TableRow>
      <TableCell className="py-3">
        <UserIdentity user={user} size="sm" />
      </TableCell>
      <TableCell>
        <PresenceBadge status={user.status} currentGame={user.currentGame} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatRelative(user.lastSeenAt)}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDate(user.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <Link
          href={routes.user(user.username)}
          className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline"
        >
          Abrir
          <ChevronRightIcon className="size-3.5" aria-hidden />
        </Link>
      </TableCell>
    </TableRow>
  );
}
