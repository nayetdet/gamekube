import Form from 'next/form';
import { SearchIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import {
  userPageSizes,
  userSortFields,
  type UserQuery,
} from '@/entities/user/user.query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilterSelect } from './filter-select';

const sortLabels: Record<string, string> = {
  username: 'Nome de usuário',
  name: 'Nome de exibição',
  createdAt: 'Mais recentes',
  updatedAt: 'Atualizados recentemente',
  id: 'Identificador',
};

export function UserFilters({ query }: { query: UserQuery }) {
  return (
    <Form
      action={routes.users}
      className="grid items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-border sm:grid-cols-2 xl:grid-cols-[1fr_1fr_11rem_7rem_auto]"
    >
      <TextFilter
        name="username"
        label="Nome de usuário"
        defaultValue={query.username}
      />
      <TextFilter
        name="name"
        label="Nome de exibição"
        defaultValue={query.name}
      />

      <FilterSelect
        name="orderBy"
        label="Ordenar por"
        defaultValue={query.orderBy}
        options={userSortFields.map((field) => ({
          value: field,
          label: sortLabels[field] ?? field,
        }))}
      />

      <FilterSelect
        name="pageSize"
        label="Por página"
        defaultValue={String(query.pageSize)}
        options={userPageSizes.map((size) => ({
          value: String(size),
          label: String(size),
        }))}
      />

      <div className="space-y-1.5">
        <Label aria-hidden className="invisible hidden text-xs xl:block">
          Buscar
        </Label>
        <Button type="submit" className="w-full gap-2 font-semibold">
          <SearchIcon aria-hidden />
          Buscar
        </Button>
      </div>
    </Form>
  );
}

function TextFilter({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-xs font-semibold">
        {label}
      </Label>
      <Input id={name} name={name} defaultValue={defaultValue ?? ''} />
    </div>
  );
}
