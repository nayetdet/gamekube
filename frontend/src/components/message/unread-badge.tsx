export function UnreadBadge({
  count,
  label,
}: {
  count: number;
  label?: string;
}) {
  if (count <= 0) return null;
  return (
    <span
      className="inline-flex min-h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[11px] font-bold leading-none text-white"
      aria-label={
        label
          ? `${count} ${label}${count === 1 ? '' : 's'}`
          : `${count} ${count === 1 ? 'mensagem não lida' : 'mensagens não lidas'}`
      }
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
