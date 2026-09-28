'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { SubmitButton } from '@/components/common/submit-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ProfileField } from './profile-fields';
import { cn } from '@/lib/utils';

type ProfileFieldEditorProps = {
  field: ProfileField;
  value: string;
  errors?: string[];
  onCancel: () => void;
};

export function ProfileFieldEditor({
  field,
  value,
  errors,
  onCancel,
}: ProfileFieldEditorProps) {
  const [draft, setDraft] = useState(value);
  const { pending } = useFormStatus();
  const hintId = `${field.name}-hint`;
  const invalid = Boolean(errors?.length);

  const control = {
    id: field.name,
    name: field.name,
    value: draft,
    onChange: (event: { target: { value: string } }) =>
      setDraft(event.target.value),
    autoFocus: true,
    minLength: field.minLength,
    maxLength: field.maxLength,
    required: field.required,
    'aria-invalid': invalid || undefined,
    'aria-describedby': hintId,
  };

  return (
    <div className="space-y-2 py-4">
      <Label
        htmlFor={field.name}
        className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
      >
        {field.label}
      </Label>

      {field.multiline ? (
        <Textarea {...control} rows={4} />
      ) : (
        <Input {...control} className={cn(field.mono && 'font-mono')} />
      )}

      <p
        id={hintId}
        className={cn(
          'text-xs',
          invalid ? 'font-medium text-destructive' : 'text-muted-foreground',
        )}
      >
        {errors?.[0] ?? field.hint}
      </p>

      <div className="flex items-center gap-2 pt-1">
        <SubmitButton size="sm" pendingLabel="Salvando…">
          Salvar
        </SubmitButton>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={pending}
          onClick={onCancel}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
