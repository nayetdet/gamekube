import type { User } from '@/entities/user/user.entity';
import { formatRelative } from '@/lib/format';
import type { ReactNode } from 'react';
import { LocalTimestamp } from '@/components/common/local-timestamp';

type Fact = { label: string; value: ReactNode; mono?: boolean };

export function AccountFacts({ user }: { user: User }) {
  const facts: Fact[] = [
    { label: 'ID do jogador', value: user.id, mono: true },
    { label: 'ID do Keycloak', value: user.keycloakId, mono: true },
    { label: 'Entrou em', value: <LocalTimestamp value={user.createdAt} /> },
    {
      label: 'Última atualização',
      value: <LocalTimestamp value={user.updatedAt} />,
    },
    { label: 'Visto por último', value: formatRelative(user.lastSeenAt) },
    { label: 'Jogando', value: user.currentGame ?? '—' },
  ];

  return (
    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {facts.map((fact) => (
        <div key={fact.label} className="min-w-0 space-y-0.5">
          <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {fact.label}
          </dt>
          <dd
            className={`truncate text-sm ${fact.mono ? 'font-mono text-xs' : ''}`}
          >
            {fact.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
