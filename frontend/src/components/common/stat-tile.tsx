import type { LucideIcon } from 'lucide-react';

type StatTileProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
};

export function StatTile({ icon: Icon, label, value, hint }: StatTileProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <Icon className="size-4.5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-xl font-extrabold tabular-nums">{value}</p>
        {hint ? (
          <p className="truncate text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
