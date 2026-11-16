import {
  GamepadDirectionalIcon,
  UserRoundCheckIcon,
  UserRoundPlusIcon,
  UsersRoundIcon,
} from 'lucide-react';
import type { User } from '@/entities/user/user.entity';
import { StatTile } from '@/components/common/stat-tile';

type DashboardStatsProps = {
  friends: User[];
  receivedCount: number;
  sentCount: number;
};

export function DashboardStats({
  friends,
  receivedCount,
  sentCount,
}: DashboardStatsProps) {
  const online = friends.filter((friend) => friend.status === 'ONLINE');
  const playing = online.filter((friend) => friend.currentGame);

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile
        icon={UsersRoundIcon}
        tone="sky"
        label="Amigos"
        value={friends.length}
        hint={`${online.length} online agora`}
      />
      <StatTile
        icon={GamepadDirectionalIcon}
        tone="sky"
        label="Em jogo"
        value={playing.length}
        hint={playing[0]?.currentGame ?? 'Ninguém está jogando ainda'}
      />
      <StatTile
        icon={UserRoundPlusIcon}
        tone="sky"
        label="Recebidos"
        value={receivedCount}
        hint="Pedidos aguardando você"
      />
      <StatTile
        icon={UserRoundCheckIcon}
        tone="sky"
        label="Enviados"
        value={sentCount}
        hint="Pedidos aguardando resposta"
      />
    </div>
  );
}
