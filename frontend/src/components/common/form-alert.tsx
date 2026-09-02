import { CircleAlertIcon, CircleCheckIcon } from 'lucide-react';
import type { ActionState } from '@/server/actions/action-state';
import { cn } from '@/lib/utils';

export function FormAlert({ state }: { state: ActionState }) {
  if (state.status === 'idle' || !state.message) return null;

  const isError = state.status === 'error';
  const Icon = isError ? CircleAlertIcon : CircleCheckIcon;

  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-2 rounded-lg px-3 py-2 text-sm font-medium',
        isError
          ? 'bg-destructive/8 text-destructive'
          : 'bg-online/10 text-online',
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      {state.message}
    </p>
  );
}
