const TITLES = new Set(['dr', 'dr.', 'prof', 'prof.', 'mr', 'mr.', 'mrs', 'mrs.', 'ms', 'ms.']);

export function initials(name = '') {
  const parts = name.split(/\s+/).filter((p) => p && !TITLES.has(p.toLowerCase()));
  const letters = parts.map((p) => p[0]).filter((c) => /\p{L}/u.test(c));
  if (letters.length === 0) return '?';
  return (letters.length > 2 ? [letters[0], letters[letters.length - 1]] : letters).join('').toUpperCase();
}

export function groupBy(items, keyFn) {
  const map = new Map();
  items.forEach((item) => {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  });
  return [...map.entries()];
}

// Only http(s) links are rendered as hrefs.
export function safeHref(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url) ? url : '';
}

export function listToText(arr, sep) {
  return (arr || []).join(sep === ',' ? ', ' : '\n');
}

export function textToList(text, sep) {
  return String(text || '')
    .split(sep === ',' ? /\s*,\s*/ : /\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}
