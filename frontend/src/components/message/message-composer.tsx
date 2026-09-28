'use client';

import { useActionState, useState } from 'react';
import { SendIcon } from 'lucide-react';
import { idleState } from '@/server/actions/action-state';
import { sendMessageAction } from '@/server/actions/message.actions';
import { FormAlert } from '@/components/common/form-alert';
import { SubmitButton } from '@/components/common/submit-button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function MessageComposer({ username }: { username: string }) {
  const [content, setContent] = useState('');
  const [state, action, pending] = useActionState(
    async (previous: typeof idleState, data: FormData) => {
      const next = await sendMessageAction(previous, data);
      if (next.status === 'success') setContent('');
      return next;
    },
    idleState,
  );
  return (
    <form
      action={action}
      className="space-y-3 rounded-xl bg-card p-4 ring-1 ring-border"
    >
      <input type="hidden" name="username" value={username} />
      <Label htmlFor="message-content">Mensagem para @{username}</Label>
      <Textarea
        id="message-content"
        name="content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        required
        maxLength={2000}
        rows={3}
        disabled={pending}
        aria-invalid={Boolean(state.fieldErrors?.content)}
        aria-describedby="message-feedback"
        placeholder="Combine a próxima partida…"
      />
      <div id="message-feedback">
        <FormAlert state={state} />
        {state.fieldErrors?.content?.map((error) => (
          <p key={error} className="text-sm text-destructive">
            {error}
          </p>
        ))}
      </div>
      <SubmitButton pendingLabel="Enviando…">
        <SendIcon aria-hidden />
        Enviar mensagem
      </SubmitButton>
    </form>
  );
}
