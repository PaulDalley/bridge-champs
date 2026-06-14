// Lightweight "read article" tracking via localStorage. No backend, no account
// needed — just ticks so a user can see what they've worked through.

const KEY = "bc_read_articles";

export function getReadSet() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (_) {
    return new Set();
  }
}

export function isRead(to) {
  return getReadSet().has(to);
}

export function markRead(to) {
  try {
    const set = getReadSet();
    if (set.has(to)) return;
    set.add(to);
    localStorage.setItem(KEY, JSON.stringify([...set]));
    window.dispatchEvent(new Event("bc-read-articles-changed"));
  } catch (_) {}
}

export function toggleRead(to) {
  try {
    const set = getReadSet();
    if (set.has(to)) set.delete(to);
    else set.add(to);
    localStorage.setItem(KEY, JSON.stringify([...set]));
    window.dispatchEvent(new Event("bc-read-articles-changed"));
  } catch (_) {}
}
