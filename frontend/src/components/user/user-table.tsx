import { SearchXIcon } from 'lucide-react';
import type { User } from '@/entities/user/user.entity';
import { EmptyState } from '@/components/common/empty-state';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserTableRow } from './user-table-row';

const columns = ['Jogador', 'Presença', 'Visto por último', 'Entrou em', ''];

export function UserTable({ users }: { users: User[] }) {
  if (users.length === 0) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title="Nenhum jogador encontrado"
        description="Tente um trecho menor do nome de usuário, ou limpe os filtros."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={column || index}
                className={index === columns.length - 1 ? 'text-right' : ''}
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow key={user.id} user={user} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
