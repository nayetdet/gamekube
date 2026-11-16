'use client';

import { useSyncExternalStore } from 'react';
import { formatDate, formatDateTime, utcTimestamp } from '@/lib/format';

const subscribe = () => () => {};
const getTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
const getServerTimeZone = () => 'UTC';

export function useLocalTimeZone() {
  return useSyncExternalStore(subscribe, getTimeZone, getServerTimeZone);
}

export function LocalTimestamp({
  value,
  dateOnly = false,
}: {
  value: string | null | undefined;
  dateOnly?: boolean;
}) {
  const timeZone = useLocalTimeZone();
  const timestamp = utcTimestamp(value);
  if (!timestamp) return <>—</>;
  return (
    <time dateTime={timestamp}>
      {dateOnly
        ? formatDate(timestamp, timeZone)
        : formatDateTime(timestamp, timeZone)}
    </time>
  );
}
