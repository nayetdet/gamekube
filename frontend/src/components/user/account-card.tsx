import type { ReactNode } from 'react';
import type { User } from '@/entities/user/user.entity';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AccountFacts } from './account-facts';

export function AccountCard({
  user,
  children,
}: {
  user: User;
  children?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Conta</CardTitle>
        <CardDescription>
          Identificadores e atividade mantidos pelo servidor.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <AccountFacts user={user} />
        {children}
      </CardContent>
    </Card>
  );
}
