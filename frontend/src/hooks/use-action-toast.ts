'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { ActionState } from '@/server/actions/action-state';

export function useActionToast(state: ActionState): void {
  const lastShown = useRef<ActionState | null>(null);

  useEffect(() => {
    if (state.status === 'idle' || state === lastShown.current) return;
    lastShown.current = state;

    if (state.status === 'success') toast.success(state.message);
    else if (state.message) toast.error(state.message);
  }, [state]);
}
