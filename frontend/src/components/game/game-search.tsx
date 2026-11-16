'use client';

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon } from 'lucide-react';
import { routes } from '@/config/routes';

export function GameSearch({
  className,
  defaultValue,
}: {
  className?: string;
  defaultValue?: string;
}) {
  return (
    <Suspense
      fallback={
        <SearchForm className={className} defaultValue={defaultValue} />
      }
    >
      <LiveGameSearch className={className} defaultValue={defaultValue} />
    </Suspense>
  );
}

function LiveGameSearch({
  className,
  defaultValue,
}: {
  className?: string;
  defaultValue?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const query = pathname === routes.games ? (searchParams.get('q') ?? '') : '';

  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current)
      inputRef.current.value = query;
  }, [query]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function search(value: string) {
    const trimmed = value.trim();
    const url = trimmed
      ? `${routes.games}?${new URLSearchParams({ q: trimmed })}`
      : routes.games;
    if (pathname === routes.games) router.replace(url, { scroll: false });
    else if (trimmed) router.push(url);
  }

  return (
    <SearchForm
      className={className}
      defaultValue={defaultValue ?? query}
      inputRef={inputRef}
      onChange={(value) => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => search(value), 350);
      }}
      onSearch={(value) => {
        if (timer.current) clearTimeout(timer.current);
        search(value);
      }}
    />
  );
}

function SearchForm({
  className,
  defaultValue,
  inputRef,
  onChange,
  onSearch,
}: {
  className?: string;
  defaultValue?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
}) {
  return (
    <form
      action={routes.games}
      role="search"
      className={className}
      onSubmit={
        onSearch
          ? (event) => {
              event.preventDefault();
              onSearch(
                new FormData(event.currentTarget).get('q')?.toString() ?? '',
              );
            }
          : undefined
      }
    >
      <div className="flex h-10 items-center rounded-full border border-border bg-muted/70 pl-3 focus-within:ring-2 focus-within:ring-ring">
        <input
          type="search"
          name="q"
          ref={inputRef}
          onChange={(event) => onChange?.(event.currentTarget.value)}
          defaultValue={defaultValue}
          aria-label="Pesquisar jogos"
          placeholder="Pesquisar jogos"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Buscar jogos"
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <SearchIcon className="size-4" aria-hidden />
        </button>
      </div>
    </form>
  );
}
