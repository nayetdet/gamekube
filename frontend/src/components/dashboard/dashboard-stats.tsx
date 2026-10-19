import { Gamepad2, InboxIcon, SendIcon, UsersRound } from 'lucide-react';
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
        icon={UsersRound}
        label="Amigos"
        value={friends.length}
        hint={`${online.length} online agora`}
      />
      <StatTile
        icon={Gamepad2}
        label="Em jogo"
        value={playing.length}
        hint={playing[0]?.currentGame ?? 'Ninguém está jogando ainda'}
      />
      <StatTile
        icon={InboxIcon}
        label="Recebidos"
        value={receivedCount}
        hint="Pedidos aguardando você"
      />
      <StatTile
        icon={SendIcon}
        label="Enviados"
        value={sentCount}
        hint="Pedidos aguardando resposta"
      />
    </div>
  );
}
