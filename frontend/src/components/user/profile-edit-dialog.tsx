'use client';

import { useActionState, useState } from 'react';
import { PencilIcon } from 'lucide-react';
import type { User } from '@/entities/user/user.entity';
import { idleState, type ActionState } from '@/server/actions/action-state';
import { updateUserAction } from '@/server/actions/user.actions';
import { useActionToast } from '@/hooks/use-action-toast';
import { FormAlert } from '@/components/common/form-alert';
import { FormField } from '@/components/common/form-field';
import { SubmitButton } from '@/components/common/submit-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function ProfileEditDialog({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(
    async (previous: ActionState, data: FormData) => {
      const next = await updateUserAction(previous, data);
      if (next.status === 'success') setOpen(false);
      return next;
    },
    idleState,
  );
  useActionToast(state);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Editar perfil">
          <PencilIcon className="size-4" aria-hidden />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Atualize como você aparece para os outros jogadores.
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="space-y-5 pt-2">
          <input type="hidden" name="currentUsername" value={user.username} />
          <FormField
            name="name"
            label="Nome de exibição"
            errors={state.fieldErrors?.name}
          >
            <Input
              id="name"
              name="name"
              defaultValue={user.name ?? ''}
              maxLength={100}
              placeholder="Como devemos chamar você?"
              className="h-11 bg-muted/50 px-3"
            />
          </FormField>
          <FormField
            name="username"
            label="Nome de usuário"
            hint="Esse nome também é usado para entrar na conta."
            errors={state.fieldErrors?.username}
          >
            <Input
              id="username"
              name="username"
              defaultValue={user.username}
              required
              minLength={3}
              maxLength={50}
              autoComplete="username"
              className="h-11 bg-muted/50 px-3"
            />
          </FormField>
          <FormField
            name="description"
            label="Bio"
            errors={state.fieldErrors?.description}
          >
            <Textarea
              id="description"
              name="description"
              defaultValue={user.description ?? ''}
              maxLength={1000}
              rows={4}
              placeholder="Conte um pouco sobre você e seus jogos favoritos."
              className="min-h-24 resize-y bg-muted/50 px-3 py-2.5"
            />
          </FormField>
          {state.status === 'error' && <FormAlert state={state} />}
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <SubmitButton pendingLabel="Salvando…">
              Salvar alterações
            </SubmitButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
