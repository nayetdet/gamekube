import { Skeleton } from '@/components/ui/skeleton';

export function PageSkeleton({
  rows = 4,
  variant = 'list',
}: {
  rows?: number;
  variant?: 'list' | 'grid';
}) {
  return (
    <div
      role="status"
      aria-label="Carregando conteúdo"
      className="mx-auto w-full max-w-7xl space-y-5 px-4 py-3 sm:px-6"
    >
      <span className="sr-only">Carregando conteúdo...</span>
      <div className="space-y-2">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-3 w-72 max-w-full" />
      </div>
      <div
        className={
          variant === 'grid'
            ? 'grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
            : 'space-y-3'
        }
      >
        {Array.from({ length: rows }, (_, index) =>
          variant === 'grid' ? (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-border bg-card"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          ) : (
            <div
              key={index}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
            >
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
