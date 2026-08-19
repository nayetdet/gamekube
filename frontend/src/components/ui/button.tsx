import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

const variants: Record<Variant, string> = {
  primary:
    'bg-cyan-300 text-slate-950 hover:bg-cyan-200 disabled:bg-cyan-200/50',
  secondary:
    'border border-white/15 bg-white/5 text-white hover:bg-white/10 disabled:bg-white/5',
  danger:
    'bg-rose-400 text-slate-950 hover:bg-rose-300 disabled:bg-rose-300/50',
};

export function Button({
  className = '',
  children,
  variant = 'primary',
  loading = false,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-200/60 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
      )}
      {children}
    </button>
  );
}
