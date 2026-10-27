import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

type FormFieldProps = {
  name: string;
  label: string;
  hint?: string;
  errors?: string[];
  children: ReactNode;
};

export function FormField({
  name,
  label,
  hint,
  errors,
  children,
}: FormFieldProps) {
  const errorId = `${name}-error`;

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="font-semibold">
        {label}
      </Label>
      <div>{children}</div>
      {hint && !errors?.length ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {errors?.length ? (
        <p id={errorId} className="text-xs font-medium text-destructive">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}
