import type { User } from '@/entities/user/user.entity';

export const friendshipStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'] as const;

export type FriendshipStatus = (typeof friendshipStatuses)[number];

export type Friendship = {
  id: string;
  requester: User;
  addressee: User;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
};

export const friendshipStatusLabels: Record<FriendshipStatus, string> = {
  PENDING: 'Pendente',
  ACCEPTED: 'Aceito',
  REJECTED: 'Recusado',
};

export function counterpart(friendship: Friendship, selfId: string): User {
  return friendship.requester.id === selfId
    ? friendship.addressee
    : friendship.requester;
}
