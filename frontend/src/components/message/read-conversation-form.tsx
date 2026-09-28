'use client';

import { startTransition, useActionState, useEffect } from 'react';
import { CheckCheckIcon } from 'lucide-react';
import { idleState } from '@/server/actions/action-state';
import { markConversationReadAction } from '@/server/actions/message.actions';
import { FormAlert } from '@/components/common/form-alert';
import { SubmitButton } from '@/components/common/submit-button';

export function ReadConversationForm({
  username,
  unreadId,
}: {
  username: string;
  unreadId?: string;
}) {
  const [state, action] = useActionState(
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
  return (
    <div className="space-y-2">
      <form action={action}>
        <SubmitButton variant="outline" size="sm" pendingLabel="Marcando…">
          <CheckCheckIcon aria-hidden />
          Marcar como lidas
        </SubmitButton>
      </form>
      <FormAlert state={state} />
    </div>
  );
}
