/**
 * Date helper utilities - all pure functions using YYYY-MM-DD strings.
 */

export function getTodayDateString() {
  const d = new Date();
  return formatLocalDate(d);
}

export function formatLocalDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDaysBetween(dateStrA, dateStrB) {
  const a = parseDateString(dateStrA);
  const b = parseDateString(dateStrB);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((b - a) / msPerDay);
}

export function addDays(dateStr, n) {
  const d = parseDateString(dateStr);
  d.setDate(d.getDate() + n);
  return formatLocalDate(d);
}

export function formatDateForDisplay(dateStr) {
  const d = parseDateString(dateStr);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function parseDateString(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}
