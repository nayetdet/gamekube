'use client';

import { useActionState } from 'react';
import { Trash2Icon } from 'lucide-react';
import { idleState } from '@/server/actions/action-state';
import { deleteAccountAction } from '@/server/actions/account.actions';
import { FormAlert } from '@/components/common/form-alert';
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

type DeleteAccountDialogProps = {
  username: string;
  label?: string;
};

export function DeleteAccountDialog({
  username,
  label = 'Excluir conta',
}: DeleteAccountDialogProps) {
  const [state, action] = useActionState(deleteAccountAction, idleState);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-2 font-semibold">
          <Trash2Icon aria-hidden />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir @{username}</DialogTitle>
          <DialogDescription>
            Isto apaga a conta, todas as amizades e o acesso ao GameKube. Não
            pode ser desfeito.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-4">
          <input type="hidden" name="username" value={username} />
          <FormField
            name="confirmation"
            label={`Digite "${username}" para confirmar`}
          >
            <Input
              id="confirmation"
              name="confirmation"
              autoComplete="off"
              required
            />
          </FormField>
          <FormAlert state={state} />
          <DialogFooter>
            <SubmitButton variant="destructive" pendingLabel="Excluindo…">
              Excluir permanentemente
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
