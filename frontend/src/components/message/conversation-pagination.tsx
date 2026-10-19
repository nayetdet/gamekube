import Link from 'next/link';
import { routes } from '@/config/routes';
import { pageCount, type PageMeta } from '@/entities/shared/page.entity';
import { Button } from '@/components/ui/button';

export function ConversationPagination({
  meta,
  username,
}: {
  meta: PageMeta;
  username: string;
}) {
  const total = pageCount(meta);
  if (total <= 1) return null;
  const href = (page: number) =>
    `${routes.conversation(username)}?page=${page}`;
  return (
    <nav
      aria-label="Páginas da conversa"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      {meta.pageNumber + 1 < total ? (
        <Button asChild variant="outline">
          <Link href={href(meta.pageNumber + 1)}>Mensagens anteriores</Link>
        </Button>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground">
        {meta.pageNumber + 1} / {total}
      </span>
      {meta.pageNumber > 0 ? (
        <Button asChild variant="outline">
          <Link href={href(meta.pageNumber - 1)}>Mais recentes</Link>
        </Button>
      ) : (
        <span />
      )}
    </nav>
  );
}
