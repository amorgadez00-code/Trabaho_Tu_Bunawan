// Small date helpers for 'YYYY-MM-DD' strings.
// Everything uses UTC so the device time zone can never shift a date by one day.

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// '2026-12-25' -> Date (UTC), or null when it is not a real calendar date (like 2026-02-31)
export function parseIso(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  const real = date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d;
  return real ? date : null;
}

export function toIso(date) {
  return date.toISOString().slice(0, 10);
}

export function isWeekend(iso) {
  const d = parseIso(iso);
  return !!d && (d.getUTCDay() === 0 || d.getUTCDay() === 6);
}

// '2026-12-20' -> 'Sunday'
export function weekdayName(iso) {
  const d = parseIso(iso);
  return d ? DAYS[d.getUTCDay()] : '';
}

export function addDays(iso, n) {
  const d = parseIso(iso);
  if (!d) return iso;
  d.setUTCDate(d.getUTCDate() + n);
  return toIso(d);
}
