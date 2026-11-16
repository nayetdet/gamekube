import { afterEach, expect, test } from 'bun:test';
import {
  formatDateTime,
  formatRelative,
  utcTimestamp,
} from '../../src/lib/format';

const realNow = Date.now;
afterEach(() => {
  Date.now = realNow;
});

test('shows the same instant in different time zones', () => {
  const timestamp = '2026-11-16T13:30:00.123456Z';
  expect(formatDateTime(timestamp, 'America/Fortaleza')).toBe(
    '16 nov 2026, 10:30',
  );
  expect(formatDateTime(timestamp, 'Asia/Tokyo')).toBe('16 nov 2026, 22:30');
});

test('relative times use the instant regardless of the offset', () => {
  Date.now = () => Date.parse('2026-11-16T13:35:00Z');
  expect(formatRelative('2026-11-16T13:30:00Z')).toBe('há 5 min');
  expect(formatRelative('2026-11-16T10:30:00-03:00')).toBe('há 5 min');
  expect(formatRelative('2026-11-16T13:30:00')).toBe('há 5 min');
});

test('invalid dates are handled without inventing a time', () => {
  expect(utcTimestamp('inválido')).toBeNull();
  expect(formatDateTime(null)).toBe('—');
  expect(formatRelative(null)).toBe('nunca');
});
