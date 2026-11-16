import type { ReactNode } from 'react';
import { PageHeader } from '@/components/common/page-header';

export default function MessagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <PageHeader
        title="Mensagens"
        description="Converse com seus amigos e combine a próxima partida."
      />
      {children}
    </div>
  );
}
