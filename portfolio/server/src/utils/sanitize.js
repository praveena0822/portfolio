// Strips HTML tags and control characters from user-submitted text.
// React escapes output by default; this adds defence in depth for stored content and emails.
export function stripHtml(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function deepStrip(input) {
  if (typeof input === 'string') return stripHtml(input);
  if (Array.isArray(input)) return input.map(deepStrip);
  if (input && typeof input === 'object') {
    return Object.fromEntries(Object.entries(input).map(([k, v]) => [k, deepStrip(v)]));
  }
  return input;
}
