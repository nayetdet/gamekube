import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DeleteAccountDialog } from './delete-account-dialog';

type DangerCardProps = {
  username: string;
  description: string;
  label?: string;
};

export function DangerCard({ username, description, label }: DangerCardProps) {
  return (
    <Card className="ring-destructive/25">
      <CardHeader>
        <CardTitle className="text-destructive">Zona de perigo</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <DeleteAccountDialog username={username} label={label} />
      </CardContent>
    </Card>
  );
}
