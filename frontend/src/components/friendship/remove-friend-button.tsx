'use client';

import { useActionState, useState } from 'react';
import { UserMinusIcon } from 'lucide-react';
import { idleState, type ActionState } from '@/server/actions/action-state';
import { removeFriendAction } from '@/server/actions/friendship.actions';
import { useActionToast } from '@/hooks/use-action-toast';
import { SubmitButton } from '@/components/common/submit-button';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function RemoveFriendButton({ username }: { username: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    async (previous: ActionState, formData: FormData) => {
      const next = await removeFriendAction(previous, formData);
      if (next.status === 'success') setOpen(false);
      return next;
    },
    idleState,
  );
  useActionToast(state);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Remover ${username} dos seus amigos`}
        >
          <UserMinusIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover @{username}?</AlertDialogTitle>
          <AlertDialogDescription>
            Vocês dois somem da lista um do outro. Qualquer um pode enviar um
            novo pedido depois.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={action}>
          <input type="hidden" name="username" value={username} />
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Manter</AlertDialogCancel>
            <SubmitButton variant="destructive" pendingLabel="Removendo…">
              Remover
            </SubmitButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
