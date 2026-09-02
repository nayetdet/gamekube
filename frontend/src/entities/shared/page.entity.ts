export type PageMeta = {
  pageNumber: number;
  pageSize: number;
  total: number;
};

export type Page<T> = {
  content: T[];
  pageable: PageMeta;
};

export function pageCount({ pageSize, total }: PageMeta): number {
  if (pageSize <= 0) return 0;
  return Math.ceil(total / pageSize);
}

export function pageRange({ pageNumber, pageSize, total }: PageMeta) {
  const from = total === 0 ? 0 : pageNumber * pageSize + 1;
  const to = Math.min((pageNumber + 1) * pageSize, total);
  return { from, to };
}
