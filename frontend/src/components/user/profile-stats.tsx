import Link from 'next/link';

export type ProfileStat = {
  label: string;
  value: number;
  href: string;
};

export function ProfileStats({ stats }: { stats: readonly ProfileStat[] }) {
  return (
    <div className="grid grid-cols-3 divide-x divide-border border-t">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          href={stat.href}
          className="flex flex-col items-center gap-0.5 py-4 transition-colors first:rounded-bl-xl last:rounded-br-xl hover:bg-muted/60"
        >
          <span className="text-2xl font-extrabold tabular-nums">
            {stat.value}
          </span>
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {stat.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
