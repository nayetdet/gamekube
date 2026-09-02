'use client';

import { useActionState } from 'react';
import { MailIcon } from 'lucide-react';
import { idleState } from '@/server/actions/action-state';
import { requestEmailResetAction } from '@/server/actions/user.actions';
import { useActionToast } from '@/hooks/use-action-toast';
import { SubmitButton } from '@/components/common/submit-button';

export function EmailResetForm({ username }: { username: string }) {
  const [state, action] = useActionState(requestEmailResetAction, idleState);
  useActionToast(state);

  return (
    <form action={action}>
      <input type="hidden" name="username" value={username} />
      <SubmitButton
        variant="outline"
        pendingLabel="Enviando…"
        className="font-semibold"
      >
        <MailIcon aria-hidden />
        Enviar link para alterar e-mail
      </SubmitButton>
    </form>
  );
}
