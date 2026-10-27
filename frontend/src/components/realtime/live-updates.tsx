'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function LiveUpdates({ gameId }: { gameId?: string }) {
  const router = useRouter();
  useEffect(() => {
    const source = new EventSource(
      `/api/realtime${gameId ? `?gameId=${encodeURIComponent(gameId)}` : ''}`,
    );
    let scheduled: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      if (document.visibilityState !== 'visible' || gameId || scheduled) return;
      scheduled = setTimeout(() => {
        scheduled = undefined;
        router.refresh();
      }, 300);
    };
    for (const event of ['connected', 'message', 'read'])
      source.addEventListener(event, refresh);
    document.addEventListener('visibilitychange', refresh);
    const interval = setInterval(refresh, 30_000);
    return () => {
      source.close();
      clearInterval(interval);
      clearTimeout(scheduled);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [gameId, router]);
  return null;
}
