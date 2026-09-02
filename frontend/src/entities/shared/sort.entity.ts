export type SortDirection = 'asc' | 'desc';

export type Sort<TField extends string> = {
  field: TField;
  direction: SortDirection;
};

export function parseSort<TField extends string>(
  raw: string | undefined,
  fields: readonly TField[],
  fallback: TField,
): Sort<TField> {
  const direction: SortDirection = raw?.startsWith('-') ? 'desc' : 'asc';
  const field = raw?.replace(/^-/, '') as TField | undefined;
  return {
    field: field && fields.includes(field) ? field : fallback,
    direction,
  };
}

export function serializeSort<TField extends string>(sort: Sort<TField>) {
  return sort.direction === 'desc' ? `-${sort.field}` : sort.field;
}

export function toggleDirection(direction: SortDirection): SortDirection {
  return direction === 'asc' ? 'desc' : 'asc';
}
