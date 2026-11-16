import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const tones = {
  sky: 'bg-sky-100 text-sky-700 ring-sky-200 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/20',
  emerald:
    'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20',
  amber:
    'bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/20',
  coral:
    'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-400/20',
} as const;

type StatTileProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  tone?: keyof typeof tones;
};

export function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'sky',
}: StatTileProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl ring-1',
          tones[tone],
        )}
      >
        <Icon className="size-5" strokeWidth={1.8} aria-hidden />
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
