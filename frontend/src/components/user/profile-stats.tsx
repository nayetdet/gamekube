import Link from 'next/link';
import { UsersRoundIcon, RadioIcon, UserPlusIcon } from 'lucide-react';

export type ProfileStat = {
  label: string;
  value: number;
  href: string;
};

const statIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Amigos: UsersRoundIcon,
  Online: RadioIcon,
  Pedidos: UserPlusIcon,
};

export function ProfileStats({ stats }: { stats: readonly ProfileStat[] }) {
  return (
    <div className="grid grid-cols-3 divide-x divide-border border-t bg-muted/20">
      {stats.map((stat) => {
        const Icon = statIcons[stat.label];

        return (
          <Link
            key={stat.label}
            href={stat.href}
            className="group flex flex-col items-center gap-1 py-4 transition-all duration-200 first:rounded-bl-xl last:rounded-br-xl hover:bg-muted/70"
          >
            <div className="flex items-center gap-1.5">
              {Icon ? (
                <Icon className="size-3.5 text-muted-foreground transition-transform duration-200 group-hover:scale-110 group-hover:text-primary" />
              ) : null}
              <span className="text-2xl font-extrabold tracking-tight tabular-nums transition-colors group-hover:text-primary">
                {stat.value}
              </span>
            </div>
            <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase transition-colors group-hover:text-foreground">
              {stat.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
