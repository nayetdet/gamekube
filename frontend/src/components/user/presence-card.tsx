import { Suspense } from 'react';
import {
  LivePresence,
  LivePresenceSkeleton,
} from '@/components/presence/live-presence';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function PresenceCard({ username }: { username: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Presença ao vivo</CardTitle>
        <CardDescription>
          Lida direto do endpoint de presença a cada requisição.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<LivePresenceSkeleton />}>
          <LivePresence username={username} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
