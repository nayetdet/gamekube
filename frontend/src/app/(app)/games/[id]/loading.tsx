import { Skeleton } from '@/components/ui/skeleton';

export default function GameDetailLoading() {
  return (
    <div role="status" aria-label="Carregando jogo" className="space-y-6">
      <span className="sr-only">Carregando jogo...</span>
      <Skeleton className="h-4 w-16" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative aspect-video w-full overflow-hidden bg-muted/40 sm:aspect-[21/9]">
          <Skeleton className="absolute inset-0 size-full rounded-none" />
          <div className="absolute inset-x-0 bottom-0 space-y-3 bg-gradient-to-t from-card/80 to-transparent p-6 sm:p-10">
            <Skeleton className="h-3 w-24 bg-foreground/10" />
            <Skeleton className="h-9 w-48 max-w-full bg-foreground/10 sm:h-12 sm:w-64" />
          </div>
        </div>
        <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="max-w-prose space-y-2.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
          <div className="space-y-4 rounded-xl border border-border bg-background p-5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
