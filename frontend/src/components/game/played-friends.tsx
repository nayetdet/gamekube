'use client';

import { useState } from 'react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { displayName, type User } from '@/entities/user/user.entity';
import { UserAvatar } from '@/components/user/user-avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function PlayedFriends({ friends }: { friends: User[] }) {
  const [open, setOpen] = useState(false);
  if (friends.length === 0) return null;
  const remaining = friends.length - 3;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <span className="text-sm font-bold text-muted-foreground">
          Jogado por
        </span>
        <div className="flex -space-x-2">
          {friends.slice(0, 3).map((friend) => (
            <Link
              key={friend.id}
              href={routes.player(friend.username)}
              aria-label={`Ver perfil de ${displayName(friend)}`}
              className="rounded-full ring-2 ring-card transition-transform hover:z-10 hover:-translate-y-0.5 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <UserAvatar user={friend} size="sm" showPresence={false} />
            </Link>
          ))}
        </div>
        <DialogTrigger asChild>
          <button
            type="button"
            className="rounded-md text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            {remaining > 0
              ? `+${remaining} ${remaining === 1 ? 'pessoa' : 'pessoas'}`
              : 'Ver todos'}
          </button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Amigos que jogaram</DialogTitle>
          <DialogDescription>
            Seus amigos que já iniciaram este jogo.
          </DialogDescription>
        </DialogHeader>
        <ul className="max-h-[min(24rem,60vh)] space-y-1 overflow-y-auto">
          {friends.map((friend) => (
            <li key={friend.id}>
              <Link
                href={routes.player(friend.username)}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              >
                <UserAvatar user={friend} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">
                    {displayName(friend)}
                  </span>
                  <span className="block truncate text-sm text-muted-foreground">
                    @{friend.username}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
