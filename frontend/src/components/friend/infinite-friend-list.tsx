'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { routes } from '@/config/routes';
import type { Page } from '@/entities/shared/page.entity';
import { displayName, type User } from '@/entities/user/user.entity';
import { UserAvatar } from '@/components/user/user-avatar';

export function InfiniteFriendList({
  friends,
  showStatus = false,
  onSelect,
}: {
  friends: User[];
  showStatus?: boolean;
  onSelect?: () => void;
}) {
  const [loaded, setLoaded] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const controller = useRef<AbortController | null>(null);

  const loadMore = useCallback(async () => {
    if (inFlight.current || !hasMore) return;
    inFlight.current = true;
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`/api/friendships?page=${page}`, {
        signal: request.signal,
      });
      if (!response.ok) throw new Error('Não foi possível carregar os amigos.');
      const result: Page<User> = await response.json();
      setLoaded((previous) => [...previous, ...result.content]);
      setPage(page + 1);
      setHasMore(
        (result.pageable.pageNumber + 1) * result.pageable.pageSize <
          result.pageable.total && result.content.length > 0,
      );
    } catch {
      if (!request.signal.aborted) setError(true);
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [hasMore, page]);

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (!sentinel.current || !hasMore || loading || error) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadMore();
      },
      { root: scrollArea.current, rootMargin: '100px' },
    );
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [loadMore, hasMore, loading, error]);

  const eligible = new Map(friends.map((friend) => [friend.username, friend]));
  const visible = loaded.flatMap((friend) => {
    const current = eligible.get(friend.username);
    return current ? [current] : [];
  });

  return (
    <div ref={scrollArea} className="max-h-[min(24rem,60vh)] overflow-y-auto">
      <ul className="space-y-1">
        {visible.map((friend) => (
          <li key={friend.id}>
            <Link
              href={routes.player(friend.username)}
              onClick={onSelect}
              className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            >
              <UserAvatar user={friend} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {displayName(friend)}
                </span>
                <span className="block truncate text-sm text-muted-foreground">
                  @{friend.username}
                </span>
              </span>
              {showStatus && (
                <span className="text-xs font-medium text-online">
                  {friend.currentGame
                    ? `Jogando ${friend.currentGame}`
                    : 'Online'}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
      {loading && (
        <p
          role="status"
          className="py-3 text-center text-sm text-muted-foreground"
        >
          Carregando amigos...
        </p>
      )}
      {error && (
        <button
          type="button"
          onClick={() => void loadMore()}
          className="w-full py-3 text-sm text-primary hover:underline"
        >
          Não foi possível carregar. Tentar novamente
        </button>
      )}
      {!hasMore && visible.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Nenhum amigo encontrado.
        </p>
      )}
      {hasMore && <div ref={sentinel} aria-hidden="true" className="h-px" />}
    </div>
  );
}
