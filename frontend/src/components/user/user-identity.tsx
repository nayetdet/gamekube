import { displayName, type User } from '@/entities/user/user.entity';
import { UserAvatar } from './user-avatar';
import { cn } from '@/lib/utils';

type UserIdentityProps = {
  user: Pick<User, 'name' | 'username' | 'status'>;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
};

export function UserIdentity({
  user,
  size = 'default',
  className,
}: UserIdentityProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <UserAvatar user={user} size={size} />
      <div className="min-w-0">
        <p className="truncate font-semibold">{displayName(user)}</p>
        <p className="truncate font-mono text-xs text-muted-foreground">
          @{user.username}
        </p>
      </div>
    </div>
  );
}
