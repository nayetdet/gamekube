'use client';

import { useActionState, useState } from 'react';
import {
  presenceLabels,
  presenceStatuses,
  type PresenceStatus,
} from '@/entities/presence/presence.entity';
import { idleState } from '@/server/actions/action-state';
import { updatePresenceAction } from '@/server/actions/presence.actions';
import { useActionToast } from '@/hooks/use-action-toast';
import { SubmitButton } from '@/components/common/submit-button';
import { FormField } from '@/components/common/form-field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PresenceDot } from './presence-dot';

type PresenceFormProps = {
  status: PresenceStatus;
  currentGame: string | null;
};

export function PresenceForm({ status, currentGame }: PresenceFormProps) {
  const [state, action] = useActionState(updatePresenceAction, idleState);
  const [selected, setSelected] = useState<PresenceStatus>(status);
  useActionToast(state);

  return (
    <form
      action={action}
      className="grid items-start gap-4 sm:grid-cols-[11rem_1fr_auto]"
    >
      <FormField name="status" label="Visibilidade">
        <Select
          name="status"
          value={selected}
          onValueChange={(value) => setSelected(value as PresenceStatus)}
        >
          <SelectTrigger id="status" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {presenceStatuses.map((value) => (
              <SelectItem key={value} value={value}>
                <PresenceDot status={value} />
                {presenceLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        name="currentGame"
        label="Jogando"
        hint="Aparece ao lado do seu nome enquanto você está online."
        errors={state.fieldErrors?.currentGame}
      >
        <Input
          id="currentGame"
          name="currentGame"
          defaultValue={currentGame ?? ''}
          maxLength={100}
          disabled={selected === 'OFFLINE'}
          placeholder="Cave Story"
        />
      </FormField>

      <div className="space-y-2">
        <Label aria-hidden className="invisible hidden sm:block">
          Salvar
        </Label>
        <SubmitButton pendingLabel="Salvando…" className="w-full sm:w-auto">
          Salvar
        </SubmitButton>
      </div>
    </form>
  );
}
