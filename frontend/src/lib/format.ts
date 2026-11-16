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

export function utcTimestamp(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)
    ? value
    : `${value}Z`;
  return Number.isNaN(Date.parse(normalized)) ? null : normalized;
}

function partsFor(value: string | null | undefined, timeZone: string) {
  const timestamp = utcTimestamp(value);
  if (!timestamp) return null;
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(timestamp));
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

export function formatDateTime(
  value: string | null | undefined,
  timeZone = 'UTC',
): string {
  const parts = partsFor(value, timeZone);
  if (!parts) return '—';
  return `${Number(parts.day)} ${MONTHS[Number(parts.month) - 1]} ${parts.year}, ${parts.hour}:${parts.minute}`;
}

export function formatDate(
  value: string | null | undefined,
  timeZone = 'UTC',
): string {
  const parts = partsFor(value, timeZone);
  if (!parts) return '—';
  return `${Number(parts.day)} ${MONTHS[Number(parts.month) - 1]} ${parts.year}`;
}

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelative(value: string | null | undefined): string {
  const timestamp = utcTimestamp(value);
  if (!timestamp) return 'nunca';
  const elapsed = Date.now() - Date.parse(timestamp);
  if (elapsed < MINUTE) return 'agora mesmo';
  if (elapsed < HOUR) return `há ${Math.floor(elapsed / MINUTE)} min`;
  if (elapsed < DAY) return `há ${Math.floor(elapsed / HOUR)} h`;
  if (elapsed < 30 * DAY) return `há ${Math.floor(elapsed / DAY)} d`;
  if (elapsed < 365 * DAY) {
    const months = Math.floor(elapsed / (30 * DAY));
    return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
  }
  const years = Math.floor(elapsed / (365 * DAY));
  return `há ${years} ${years === 1 ? 'ano' : 'anos'}`;
}

export function shortId(id: string): string {
  return id.split('-')[0] ?? id;
}
