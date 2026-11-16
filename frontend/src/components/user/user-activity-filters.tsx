import type { UserQuery } from '@/entities/user/user.query';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const dates = [
  { name: 'createdAfter', label: 'Cadastro a partir de' },
  { name: 'createdBefore', label: 'Cadastro até' },
  { name: 'lastSeenAtAfter', label: 'Última atividade a partir de' },
  { name: 'lastSeenAtBefore', label: 'Última atividade até' },
] as const;

export function UserActivityFilters({ query }: { query: UserQuery }) {
  return (
    <details>
      <summary className="cursor-pointer text-sm font-semibold">
        Filtrar presença e datas
      </summary>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="space-y-1.5">
          <Label htmlFor="status" className="text-xs">
            Presença
          </Label>
          <select
            id="status"
            name="status"
            defaultValue={query.status ?? ''}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Todos</option>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>
        {dates.map(({ name, label }) => (
          <div key={name} className="space-y-1.5">
            <Label htmlFor={name} className="text-xs">
              {label}
            </Label>
            <Input
              id={name}
              name={name}
              type="date"
              defaultValue={query[name] ?? ''}
            />
          </div>
        ))}
      </div>
    </details>
  );
}
