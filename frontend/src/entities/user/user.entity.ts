import type { PresenceStatus } from '@/entities/presence/presence.entity';

export type User = {
  id: string;
  keycloakId: string;
  username: string;
  name: string | null;
  description: string | null;
  status: PresenceStatus;
  lastSeenAt: string | null;
  currentGame: string | null;
  createdAt: string;
  updatedAt: string;
};

export function displayName(user: Pick<User, 'name' | 'username'>): string {
  return user.name?.trim() || user.username;
}

export function userInitials(user: Pick<User, 'name' | 'username'>): string {
  const source = displayName(user);
  const [first = '', second = ''] = source.split(/[\s._-]+/).filter(Boolean);
  return (first.charAt(0) + (second.charAt(0) || '')).toUpperCase();
}
