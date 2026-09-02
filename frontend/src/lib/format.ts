const MONTHS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

const ISO_PARTS = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/;

export function formatDateTime(value: string | null): string {
  const parts = value?.match(ISO_PARTS);
  if (!parts) return '—';
  const [, year, month, day, hours, minutes] = parts;
  const label = MONTHS[Number(month) - 1] ?? month;
  return `${Number(day)} ${label} ${year}, ${hours}:${minutes}`;
}

export function formatDate(value: string | null): string {
  const parts = value?.match(ISO_PARTS);
  if (!parts) return '—';
  const [, year, month, day] = parts;
  return `${Number(day)} ${MONTHS[Number(month) - 1] ?? month} ${year}`;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelative(value: string | null): string {
  if (!value) return 'nunca';
  const elapsed = Date.now() - Date.parse(value);
  if (Number.isNaN(elapsed)) return 'nunca';
  if (elapsed < MINUTE) return 'agora mesmo';
  if (elapsed < HOUR) return `há ${Math.floor(elapsed / MINUTE)} min`;
  if (elapsed < DAY) return `há ${Math.floor(elapsed / HOUR)} h`;
  if (elapsed < 30 * DAY) return `há ${Math.floor(elapsed / DAY)} d`;
  return `em ${formatDate(value)}`;
}

export function shortId(id: string): string {
  return id.split('-')[0] ?? id;
}
