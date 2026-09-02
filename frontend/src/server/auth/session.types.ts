export type SessionUser = {
  subject: string;
  username: string;
  name: string | null;
  email: string | null;
  roles: string[];
};

export type Session = {
  user: SessionUser;
  accessToken: string;
  expiresAt: number;
};

export const ADMIN_ROLE = 'admin';

export function isAdmin(session: Session): boolean {
  return session.user.roles.includes(ADMIN_ROLE);
}

export const REFRESH_SKEW_MS = 60_000;

export function needsRefresh(session: Session, now = Date.now()): boolean {
  return session.expiresAt - now <= REFRESH_SKEW_MS;
}
