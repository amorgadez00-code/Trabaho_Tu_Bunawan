const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// '2026-12-15' -> 'Dec 15'
export function shortDate(iso) {
  if (!iso) return '';
  const [, m, d] = String(iso).split('-');
  const mi = parseInt(m, 10) - 1;
  if (isNaN(mi) || !d) return String(iso);
  return `${MONTHS[mi]} ${parseInt(d, 10)}`;
}

// '2026-12-15' -> 'Closes in 28 days' / 'Closes today' / 'Closed'
export function closesIn(iso) {
  if (!iso) return '';
  const end = new Date(`${iso}T23:59:59`);
  if (isNaN(end.getTime())) return '';
  const days = Math.ceil((end.getTime() - Date.now()) / 86400000);
  if (days < 0) return 'Closed';
  if (days === 0) return 'Closes today';
  if (days === 1) return 'Closes tomorrow';
  return `Closes in ${days} days`;
}

// 'Juan Dela Cruz' -> 'JD'
export function initials(name = '') {
  const letters = name.trim().split(/\s+/).slice(0, 2).map((w) => (w[0] || '').toUpperCase()).join('');
  return letters || '?';
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
