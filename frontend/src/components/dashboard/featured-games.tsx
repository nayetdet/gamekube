'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Gamepad2Icon,
  UsersRoundIcon,
} from 'lucide-react';
import type { GameDefinition } from '@/entities/game/game.entity';
import { displayName, type User } from '@/entities/user/user.entity';
import { routes } from '@/config/routes';
import { UserAvatar } from '@/components/user/user-avatar';
import { InfiniteFriendList } from '@/components/friend/infinite-friend-list';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function FeaturedGames({
  games,
  friends,
}: {
  games: GameDefinition[];
  friends: User[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [friendsOpen, setFriendsOpen] = useState(false);
  useEffect(() => {
    if (
      games.length < 2 ||
      paused ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % games.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, [games.length, paused]);
  if (!games.length) return null;
  const game = games[index] ?? games[0];
  const online = friends.filter((friend) => friend.status === 'ONLINE');
  return (
    <section
      aria-label="Jogos em destaque"
      className="relative isolate min-h-svh overflow-hidden bg-zinc-950 text-white"
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
    >
      {games.map((item, position) => (
        <Image
          key={item.id}
          src={`/api/games/${encodeURIComponent(item.id)}/image`}
          alt=""
          fill
          unoptimized
          priority={position === 0}
          sizes="100vw"
          className={`-z-20 object-cover transition-opacity duration-700 motion-reduce:transition-none ${position === index ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/55 to-black/55" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-transparent to-black/40" />
      <div className="mx-auto flex min-h-svh max-w-[100rem] flex-col justify-end gap-10 px-6 pt-28 pb-12 transition-[padding] duration-300 motion-reduce:transition-none sm:px-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:pr-14 lg:pl-[var(--dashboard-sidebar-offset)] lg:pb-16">
        <div className="max-w-xl space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Gamepad2Icon className="size-3.5" /> Em destaque
          </span>
          {game.logoUrl ? (
            <div className="relative h-28 w-64 sm:h-40 sm:w-96">
              <Image
                src={game.id === 'doom' ? `${game.logoUrl}?v=2` : game.logoUrl}
                alt={game.name}
                fill
                unoptimized
                sizes="384px"
                className="object-contain object-left drop-shadow-xl"
              />
            </div>
          ) : (
            <h1 className="text-4xl font-extrabold sm:text-6xl">{game.name}</h1>
          )}
          <p className="line-clamp-4 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
            {game.description}
          </p>
          <Link
            href={routes.game(game.id)}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-white/85"
          >
            Ver jogo <ArrowRightIcon className="size-4" />
          </Link>
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() =>
                setIndex((index - 1 + games.length) % games.length)
              }
              aria-label="Jogo anterior"
              className="rounded-full border border-white/25 p-2 hover:bg-white/15"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <span className="text-xs font-semibold tabular-nums text-white/70">
              {index + 1} / {games.length}
            </span>
            <button
              type="button"
              onClick={() => setIndex((index + 1) % games.length)}
              aria-label="Próximo jogo"
              className="rounded-full border border-white/25 p-2 hover:bg-white/15"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        </div>
        <aside
          className="w-full max-w-sm space-y-5 lg:w-80 lg:shrink-0"
          aria-label="Jogos e amigos online"
        >
          <div className="rounded-xl border border-white/15 bg-black/55 p-3 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between px-2 pb-3 pt-1">
              <p className="text-xs font-bold uppercase tracking-widest text-white/65">
                Explore os jogos
              </p>
              <Link
                href={routes.games}
                className="text-xs font-semibold text-white/80 hover:text-white"
              >
                Ver todos
              </Link>
            </div>
            <div className="max-h-64 space-y-1 overflow-y-auto">
              {games.map((item, position) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(position)}
                  aria-pressed={position === index}
                  className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors ${position === index ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={`/api/games/${encodeURIComponent(item.id)}/image`}
                      alt=""
                      fill
                      unoptimized
                      sizes="56px"
                      className="object-cover"
                    />
                  </span>
                  <span className="min-w-0 truncate text-sm font-semibold">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/15 bg-black/55 p-4 shadow-xl backdrop-blur-md">
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/65">
                <UsersRoundIcon className="size-4" /> Online agora{' '}
                <span className="text-white">{online.length}</span>
              </p>
              <Dialog open={friendsOpen} onOpenChange={setFriendsOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-xs font-semibold text-white/80 hover:text-white"
                  >
                    Ver amigos
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Amigos online</DialogTitle>
                    <DialogDescription>
                      Veja quem está disponível para jogar agora.
                    </DialogDescription>
                  </DialogHeader>
                  {online.length ? (
                    friendsOpen && (
                      <InfiniteFriendList
                        friends={online}
                        showStatus
                        onSelect={() => setFriendsOpen(false)}
                      />
                    )
                  ) : (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      Nenhum amigo online agora.
                    </p>
                  )}
                </DialogContent>
              </Dialog>
            </div>
            {online.length ? (
              <div className="flex flex-wrap gap-2">
                {online.map((friend) => (
                  <Link
                    key={friend.id}
                    href={routes.player(friend.username)}
                    title={displayName(friend)}
                    aria-label={`Perfil de ${displayName(friend)}`}
                    className="rounded-full ring-2 ring-transparent transition-colors hover:ring-primary"
                  >
                    <UserAvatar user={friend} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/65">
                Nenhum amigo online agora.
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
