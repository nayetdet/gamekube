import type { ReactNode } from 'react';

export function LoadingState({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div
      className="flex min-h-[45vh] items-center justify-center gap-3 text-slate-300"
      role="status"
    >
      <span className="size-5 animate-spin rounded-full border-2 border-cyan-200/30 border-t-cyan-200" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <section
      className="rounded-2xl border border-rose-300/20 bg-rose-300/10 p-6 text-rose-50"
      role="alert"
    >
      <h2 className="font-semibold">
        Não foi possível carregar estas informações
      </h2>
      <p className="mt-1 text-sm text-rose-100/80">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
        >
          Tentar novamente
        </button>
      )}
    </section>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-10 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </section>
  );
}

export function Feedback({
  type,
  children,
}: {
  type: 'success' | 'error' | 'info';
  children: ReactNode;
}) {
  const colors = {
    success: 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100',
    error: 'border-rose-300/20 bg-rose-300/10 text-rose-100',
    info: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100',
  };
  return (
    <p
      className={`rounded-xl border px-4 py-3 text-sm ${colors[type]}`}
      role={type === 'error' ? 'alert' : 'status'}
    >
      {children}
    </p>
  );
}
