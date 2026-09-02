import Link from 'next/link';
import { ChevronsUpDownIcon, LogOutIcon, UserRoundIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import type { User } from '@/entities/user/user.entity';
import { displayName } from '@/entities/user/user.entity';
import { UserAvatar } from '@/components/user/user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ViewerMenuProps = {
  viewer: Pick<User, 'name' | 'username' | 'status'>;
  role: string;
};

export function ViewerMenu({ viewer, role }: ViewerMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-2.5 text-left transition-colors hover:bg-muted">
        <UserAvatar user={viewer} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">
            {displayName(viewer)}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {role}
          </span>
        </span>
        <ChevronsUpDownIcon
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-56">
        <DropdownMenuLabel className="font-mono text-xs">
          @{viewer.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={routes.profile}>
            <UserRoundIcon aria-hidden />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild variant="destructive">
          <a href={routes.authLogout}>
            <LogOutIcon aria-hidden />
            Sair
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
