import 'server-only';
import { cache } from 'react';
import { unstable_rethrow } from 'next/navigation';
import type { User } from '@/entities/user/user.entity';
import { hasStatus } from '@/services/http/api-error';
import { userService } from '@/services/user.service';
import { requireSession } from '@/server/auth/dal';
import { ADMIN_ROLE, type Session } from '@/server/auth/session.types';

export type Viewer = {
  session: Session;
  user: User;
  isAdmin: boolean;
};

function fromClaims(session: Session): User {
  const now = new Date().toISOString();
  return {
    id: session.user.subject,
    keycloakId: session.user.subject,
    username: session.user.username,
    name: session.user.name,
    description: null,
    status: 'OFFLINE',
    lastSeenAt: null,
    currentGame: null,
    createdAt: now,
    updatedAt: now,
  };
}

export const getViewer = cache(async (): Promise<Viewer> => {
  const session = await requireSession();
  const isAdmin = session.user.roles.includes(ADMIN_ROLE);

  try {
    return { session, user: await userService.findSelf(), isAdmin };
  } catch (error) {
    unstable_rethrow(error);
    if (hasStatus(error, 404)) {
      return { session, user: fromClaims(session), isAdmin };
    }
    throw error;
  }
});

export function viewerRole(viewer: Viewer): string {
  return viewer.isAdmin ? 'Administrador' : 'Jogador';
}
