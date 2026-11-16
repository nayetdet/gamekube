import type { User } from '@/entities/user/user.entity';
import { LivePresence } from '@/components/presence/live-presence';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function PresenceCard({ user }: { user: User }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Presença ao vivo</CardTitle>
        <CardDescription>
          A presença acompanha sua conexão e suas sessões de jogo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LivePresence user={user} />
      </CardContent>
    </Card>
  );
}
