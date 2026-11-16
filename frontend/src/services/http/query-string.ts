export type QueryValue = string | number | boolean | undefined | null;

export type QueryParams = Record<string, QueryValue>;

export function toQueryString(params: QueryParams = {}): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, String(value));
  }

  const serialized = search.toString();
  return serialized ? `?${serialized}` : '';
}
