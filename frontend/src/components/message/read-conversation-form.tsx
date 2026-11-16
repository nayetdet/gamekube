'use client';

import { startTransition, useActionState, useEffect } from 'react';
import { idleState } from '@/server/actions/action-state';
import { markConversationReadAction } from '@/server/actions/message.actions';

export function ReadConversationForm({
  username,
  unreadId,
}: {
  username: string;
  unreadId?: string;
}) {
  const [, action] = useActionState(
    () => markConversationReadAction(username),
    idleState,
  );
  useEffect(() => {
    if (!unreadId) return;
    const read = () => {
      if (document.visibilityState === 'visible')
        startTransition(() => action());
    };
    read();
    document.addEventListener('visibilitychange', read);
    return () => document.removeEventListener('visibilitychange', read);
  }, [username, unreadId, action]);
  return null;
}
