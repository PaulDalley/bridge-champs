/** Free-tier cap per Treadmill trainer per calendar day (local timezone). */
export const TREADMILL_FREE_DAILY_LIMIT = 4;

export const TREADMILL_TRAINER_HAND_SHAPE = "hand-shape";
export const TREADMILL_TRAINER_OPPONENT_SHAPE = "opponent-shape";
export const TREADMILL_TRAINER_BUILDING_BLOCKS = "building-blocks";

function localDateKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function storageKey(uid, trainerId) {
  return `treadmillDailyTry:v1:${uid}:${trainerId}:${localDateKey()}`;
}

export function getTreadmillDailyCount(uid, trainerId) {
  if (!uid || typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(storageKey(uid, trainerId));
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

/** Returns new total for the day after increment. */
export function incrementTreadmillDailyCount(uid, trainerId) {
  if (!uid || typeof window === "undefined") return 0;
  const next = getTreadmillDailyCount(uid, trainerId) + 1;
  try {
    window.localStorage.setItem(storageKey(uid, trainerId), String(next));
  } catch {
    /* ignore quota */
  }
  return next;
}

export function treadmillDailyLimitReached(uid, trainerId, unlimited) {
  if (!uid || unlimited) return false;
  return getTreadmillDailyCount(uid, trainerId) >= TREADMILL_FREE_DAILY_LIMIT;
}

export function treadmillFreeRoundsRemaining(uid, trainerId, unlimited) {
  if (unlimited || !uid) return Infinity;
  return Math.max(0, TREADMILL_FREE_DAILY_LIMIT - getTreadmillDailyCount(uid, trainerId));
}
