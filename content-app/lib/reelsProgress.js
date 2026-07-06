// Persistent, all-time Reels progress — resume position + "already watched" state,
// stored browser-side. This is SEPARATE from `bc_tips_meter` (TipWatch): that key is
// the per-CALENDAR-DAY free-view gate and resets nightly. This one survives across
// days so we can (a) show which reels a viewer has already watched and (b) resume a
// reel from where they left off. Read-only-safe: never throws, SSR-guarded.
const KEY = 'bc_reels_progress';
const DONE_RATIO = 0.9; // watched >= 90% of a reel counts as "watched"

// { items: { [slug]: { t, dur, done } }, last: <slug|null> }
//   t    = last playback position in seconds (0 once finished, so a re-watch is fresh)
//   dur  = video duration in seconds (for the progress bar %)
//   done = watched to the end at least once
//   last = the most recently opened reel (drives "Continue watching")
function read() {
  if (typeof window === 'undefined') return { items: {}, last: null };
  try {
    const p = JSON.parse(localStorage.getItem(KEY) || '{}');
    return { items: (p && p.items) || {}, last: (p && p.last) || null };
  } catch (_) {
    return { items: {}, last: null };
  }
}

function write(p) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch (_) {}
}

export function getReelProgress(slug) {
  const it = read().items[slug];
  return it ? { t: it.t || 0, dur: it.dur || 0, done: !!it.done } : { t: 0, dur: 0, done: false };
}

export function isReelWatched(slug) {
  return getReelProgress(slug).done;
}

// Percent watched (0–100) for a progress bar: 100 once finished, else t/dur.
export function reelPercent(slug) {
  const { t, dur, done } = getReelProgress(slug);
  if (done) return 100;
  if (!dur || !t) return 0;
  return Math.max(0, Math.min(100, Math.round((t / dur) * 100)));
}

// Persist the current position (call while playing, on pause, and on leave). Once a
// reel passes DONE_RATIO it's marked watched and its resume point is zeroed so the
// next open starts it over rather than at the final second.
export function saveReelPosition(slug, t, dur) {
  if (!slug) return;
  const p = read();
  const prev = p.items[slug] || {};
  const duration = Math.floor(dur || prev.dur || 0);
  const done = !!prev.done || (duration > 0 && t / duration >= DONE_RATIO);
  p.items[slug] = { t: done ? 0 : Math.max(0, Math.floor(t || 0)), dur: duration, done };
  p.last = slug;
  write(p);
}

export function markReelWatched(slug, dur) {
  if (!slug) return;
  const p = read();
  const prev = p.items[slug] || {};
  p.items[slug] = { t: 0, dur: Math.floor(dur || prev.dur || 0), done: true };
  p.last = slug;
  write(p);
}

export function setLastReel(slug) {
  if (!slug) return;
  const p = read();
  p.last = slug;
  write(p);
}

// Which reel the single homepage tile should open:
//   1) the "last" reel if it's part-watched and unfinished (true resume),
//   2) otherwise the first reel not yet watched,
//   3) otherwise the first reel (everything watched → offer a re-watch).
export function resolveResume(list) {
  const p = read();
  if (p.last) {
    const i = list.findIndex((x) => x.slug === p.last);
    const it = p.items[p.last];
    if (i !== -1 && it && !it.done && (it.t || 0) > 0) {
      return { index: i, resuming: true, seconds: it.t };
    }
  }
  const firstUnwatched = list.findIndex((x) => !(p.items[x.slug] && p.items[x.slug].done));
  if (firstUnwatched !== -1) return { index: firstUnwatched, resuming: false, seconds: 0 };
  return { index: 0, resuming: false, seconds: 0 };
}

export function watchedCountAllTime(list) {
  const p = read();
  return list.reduce((n, x) => n + (p.items[x.slug] && p.items[x.slug].done ? 1 : 0), 0);
}
