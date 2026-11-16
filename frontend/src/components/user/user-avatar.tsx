import { defaultAvatar } from '@/config/site';
import { userInitials, type User } from '@/entities/user/user.entity';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const demoAvatars: Record<string, number> = {
  demo_bia: 1,
  demo_luna: 2,
  demo_rafa: 3,
  demo_caio: 4,
  demo_nina: 5,
  demo_leo: 6,
  demo_iris: 7,
  demo_joao: 8,
  demo_maya: 9,
  demo_theo: 10,
};

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
            : demoAvatars[user.username]
              ? `/demo-avatars/${demoAvatars[user.username]}.jpg`
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
