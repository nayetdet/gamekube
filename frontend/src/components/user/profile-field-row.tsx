import { PencilIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProfileField } from './profile-fields';
import { cn } from '@/lib/utils';

type ProfileFieldRowProps = {
  field: ProfileField;
  value: string;
  locked: boolean;
  onEdit: () => void;
};

export function ProfileFieldRow({
  field,
  value,
  locked,
  onEdit,
}: ProfileFieldRowProps) {
  return (
    <div className="flex items-start gap-4 py-4">
      <input type="hidden" name={field.name} value={value} />

      <div className="min-w-0 flex-1 space-y-1">
        <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {field.label}
        </dt>
        <dd
          className={cn(
            'text-sm wrap-anywhere whitespace-pre-line',
            field.mono && 'font-mono',
            !value && 'text-muted-foreground italic',
          )}
        >
          {value ? `${field.prefix ?? ''}${value}` : field.empty}
        </dd>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={locked}
        onClick={onEdit}
        aria-label={`Editar ${field.label.toLowerCase()}`}
        className="shrink-0 text-muted-foreground hover:text-brand-700"
      >
        <PencilIcon aria-hidden />
      </Button>
    </div>
  );
}
