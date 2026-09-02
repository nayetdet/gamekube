'use client';

import { RotateCcwIcon, TriangleAlertIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ErrorPanelProps = {
  digest?: string;
  reset: () => void;
  className?: string;
};

export function ErrorPanel({ digest, reset, className }: ErrorPanelProps) {
  return (
    <div className={className}>
      <div className="mx-auto max-w-md space-y-4 text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <TriangleAlertIcon className="size-6" aria-hidden />
        </span>
        <h1 className="text-2xl font-extrabold">
          Algo não saiu como planejado
        </h1>
        <p className="text-sm text-muted-foreground">
          Não foi possível falar com o servidor, ou ele respondeu algo
          inesperado. Tentar de novo costuma resolver.
        </p>
        {digest ? (
          <p className="font-mono text-xs text-muted-foreground">{digest}</p>
        ) : null}
        <Button onClick={reset} className="gap-2 font-semibold">
          <RotateCcwIcon aria-hidden />
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}
