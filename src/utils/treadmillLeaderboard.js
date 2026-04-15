const STORAGE_KEY = "bridgechamps_treadmill_streak_top5_v1";

/** @typedef {{ alias: string; timeMs: number; at: string }} TreadmillLbEntry */

export function normalizeTreadmillAlias(raw) {
  const s = String(raw ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
  return s;
}

/** @returns {TreadmillLbEntry[]} */
export function loadTreadmillLeaderboard() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((e) => e && typeof e.alias === "string" && Number.isFinite(Number(e.timeMs)))
      .map((e) => ({
        alias: String(e.alias).trim(),
        timeMs: Number(e.timeMs),
        at: typeof e.at === "string" ? e.at : new Date().toISOString(),
      }));
  } catch {
    return [];
  }
}

/** @param {TreadmillLbEntry[]} entries */
function persistTreadmillLeaderboard(entries) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* ignore quota */
  }
}

/**
 * One entry per normalized alias (keeps best time only). Top 5 fastest.
 * @param {TreadmillLbEntry[]} current
 * @param {string} alias
 * @param {number} timeMs
 * @returns {TreadmillLbEntry[]}
 */
export function upsertTreadmillLeaderboard(current, alias, timeMs) {
  const trimmed = String(alias ?? "").trim();
  const key = normalizeTreadmillAlias(trimmed);
  if (!key || !Number.isFinite(timeMs) || timeMs < 0) return current;
  const list = Array.isArray(current) ? [...current] : [];
  const map = new Map();
  for (const e of list) {
    const k = normalizeTreadmillAlias(e.alias);
    if (!k) continue;
    const t = Number(e.timeMs);
    if (!map.has(k) || t < map.get(k).timeMs) {
      map.set(k, { alias: e.alias.trim(), timeMs: t, at: e.at });
    }
  }
  const mergedBest =
    !map.has(key) || timeMs < map.get(key).timeMs
      ? { alias: trimmed.slice(0, 40), timeMs, at: new Date().toISOString() }
      : map.get(key);
  map.set(key, mergedBest);
  const sorted = [...map.values()].sort((a, b) => a.timeMs - b.timeMs).slice(0, 5);
  persistTreadmillLeaderboard(sorted);
  return sorted;
}

export function formatTreadmillTimeShort(timeMs) {
  const s = timeMs / 1000;
  if (!Number.isFinite(s) || s < 0) return "—";
  return `${s.toFixed(2)} s`;
}
