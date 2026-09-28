'use client';

import { useActionState, useState } from 'react';
import { UserPlusIcon } from 'lucide-react';
import { idleState, type ActionState } from '@/server/actions/action-state';
import { sendFriendRequestAction } from '@/server/actions/friendship.actions';
import { useActionToast } from '@/hooks/use-action-toast';
import { FormField } from '@/components/common/form-field';
import { SubmitButton } from '@/components/common/submit-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function AddFriendDialog() {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(
    async (previous: ActionState, formData: FormData) => {
      const next = await sendFriendRequestAction(previous, formData);
      if (next.status === 'success') setOpen(false);
      return next;
    },
    idleState,
  );
  useActionToast(state);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 font-semibold">
          <UserPlusIcon aria-hidden />
          Adicionar amigo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar pedido de amizade</DialogTitle>
          <DialogDescription>
            Os jogadores são encontrados pelo nome de usuário exato — o mesmo
            que usam para entrar.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <FormField
            name="username"
            label="Nome de usuário"
            errors={state.fieldErrors?.username}
          >
            <Input
              id="username"
              name="username"
              autoComplete="off"
              placeholder="quote"
              minLength={3}
              maxLength={50}
              required
            />
          </FormField>
          <DialogFooter>
            <SubmitButton pendingLabel="Enviando…">Enviar pedido</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
