import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmailResetForm } from './email-reset-form';

export function EmailCard({ username }: { username: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>E-mail</CardTitle>
        <CardDescription>
          Enviamos um link de confirmação para a sua caixa de entrada atual
          antes de trocar o endereço.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EmailResetForm username={username} />
      </CardContent>
    </Card>
  );
}
