import Link from 'next/link';
import {
  ChevronsUpDownIcon,
  LogOutIcon,
  Settings2Icon,
  UserRoundIcon,
} from 'lucide-react';
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
  compact?: boolean;
};

export function ViewerMenu({ viewer, role, compact = false }: ViewerMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Menu de ${displayName(viewer)}`}
        className={
          compact
            ? 'rounded-full transition-opacity hover:opacity-80'
            : 'flex w-full items-center gap-3 rounded-xl border border-border bg-card p-2.5 text-left transition-colors hover:bg-muted'
        }
      >
        <UserAvatar user={viewer} />
        {!compact && (
          <>
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
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side={compact ? 'bottom' : 'top'}
        className="w-56"
      >
        <DropdownMenuLabel className="text-sm font-normal text-muted-foreground">
          @{viewer.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={routes.profile}>
            <UserRoundIcon aria-hidden />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={routes.settings}>
            <Settings2Icon aria-hidden />
            Configurações
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
