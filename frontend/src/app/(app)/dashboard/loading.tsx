import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Carregando jogos em destaque"
      className="flex min-h-svh items-end bg-background px-6 pb-16 sm:px-10 lg:pr-14 lg:pl-[var(--dashboard-sidebar-offset)]"
    >
      <span className="sr-only">Carregando jogos em destaque...</span>
      <div className="w-full max-w-md space-y-5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-24 w-64 max-w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
