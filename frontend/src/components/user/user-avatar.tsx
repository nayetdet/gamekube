import { defaultAvatar } from '@/config/site';
import { userInitials, type User } from '@/entities/user/user.entity';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type UserAvatarProps = {
  user: Pick<User, 'name' | 'username' | 'status'> &
    Partial<Pick<User, 'hasAvatar' | 'updatedAt'>>;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  showPresence?: boolean;
  className?: string;
};

export function UserAvatar({
  user,
  size = 'default',
  showPresence = true,
  className,
}: UserAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      <AvatarImage
        src={
          user.hasAvatar
            ? `/api/users/${encodeURIComponent(user.username)}/avatar?v=${encodeURIComponent(user.updatedAt ?? '')}`
            : defaultAvatar
        }
        alt=""
      />
      <AvatarFallback className="bg-brand-100 font-bold text-brand-700">
        {userInitials(user)}
      </AvatarFallback>
      {showPresence ? (
        <AvatarBadge
          className={cn(user.status === 'ONLINE' ? 'bg-online' : 'bg-offline')}
        />
      ) : null}
    </Avatar>
  );
}
