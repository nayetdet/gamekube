import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
      <span className="flex size-11 items-center justify-center rounded-2xl bg-slate-200/70 text-slate-600 ring-1 ring-slate-300/60 dark:bg-slate-400/10 dark:text-slate-300 dark:ring-slate-400/20">
        <Icon className="size-5" strokeWidth={1.8} aria-hidden />
      </span>
      <div className="space-y-1">
        <p className="font-bold">{title}</p>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
