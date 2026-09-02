import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import { pageCount, pageRange, type PageMeta } from '@/entities/shared';
import type { UserQuery } from '@/entities/user/user.query';
import { toQueryString } from '@/services/http/query-string';
import { PageStep } from './page-step';

type UserPaginationProps = {
  meta: PageMeta;
  query: UserQuery;
};

export function UserPagination({ meta, query }: UserPaginationProps) {
  const total = pageCount(meta);
  const { from, to } = pageRange(meta);
  const href = (pageNumber: number) =>
    `${routes.users}${toQueryString({ ...query, pageNumber })}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground tabular-nums">
        {from}–{to} de {meta.total}
      </p>
      <div className="flex items-center gap-2">
        <PageStep
          href={meta.pageNumber > 0 ? href(meta.pageNumber - 1) : null}
          label="Anterior"
          icon={ChevronLeftIcon}
        />
        <span className="text-sm font-semibold tabular-nums">
          {meta.pageNumber + 1} / {Math.max(total, 1)}
        </span>
        <PageStep
          href={meta.pageNumber + 1 < total ? href(meta.pageNumber + 1) : null}
          label="Próxima"
          icon={ChevronRightIcon}
          trailingIcon
        />
      </div>
    </div>
  );
}
