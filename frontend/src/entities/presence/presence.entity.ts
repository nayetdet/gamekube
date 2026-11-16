export const presenceStatuses = ['ONLINE', 'OFFLINE'] as const;

export type PresenceStatus = (typeof presenceStatuses)[number];

export type Presence = {
  status: PresenceStatus;
  lastSeenAt: string | null;
  currentGame: string | null;
};

export const presenceLabels: Record<PresenceStatus, string> = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
};

export function isOnline(status: PresenceStatus): boolean {
  return status === 'ONLINE';
}
