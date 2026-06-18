/**
 * Weekly Tournament — pure logic: which week we're in, the 10 boards for a given
 * week seed, and Standard Butler IMP scoring. No React, no Firestore here.
 *
 * Boards are deterministic from a single master seed (revealed weekly by the
 * backend so they can't be pre-studied). Each board's deal is produced inside the
 * play table via dealHands(board.seed); here we only assign seed/dealer/vul.
 */

export const BOARD_COUNT = 10;

// Standard duplicate dealer (by board number) and the official 16-board
// vulnerability schedule. Vul strings match the play table: "" / "NS" / "EW" / "Both".
const DEALERS = ["N", "E", "S", "W"];
const VUL_SCHEDULE = [
  "", "NS", "EW", "Both", "NS", "EW", "Both", "", "EW", "Both", "", "NS", "Both", "", "NS", "EW",
];
export const boardDealer = (boardNo) => DEALERS[(boardNo - 1) % 4];
export const boardVul = (boardNo) => VUL_SCHEDULE[(boardNo - 1) % 16];

// ── deterministic seeds ────────────────────────────────────────────────────────
/** FNV-1a hash of a string -> uint32. */
export function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
/** Mix a master seed with a board index -> a uint32 deal seed. */
function mixSeed(masterSeed, i) {
  let h = (masterSeed ^ Math.imul(i ^ (i >>> 15), 2246822519)) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

/** The 10 boards for a week: [{ boardNo, seed, dealer, vul }]. */
export function weeklyBoards(masterSeed, count = BOARD_COUNT) {
  const boards = [];
  for (let i = 1; i <= count; i++) {
    boards.push({ boardNo: i, seed: mixSeed(masterSeed >>> 0, i), dealer: boardDealer(i), vul: boardVul(i) });
  }
  return boards;
}

// ── weekId (Friday 09:00 Australia/Sydney boundary) ────────────────────────────
function sydneyNowParts() {
  const f = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Australia/Sydney",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const p = {};
  for (const part of f.formatToParts(new Date())) p[part.type] = part.value;
  const dow = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday];
  return { y: +p.year, m: +p.month, d: +p.day, hour: +p.hour, dow };
}

/**
 * The current week id = ISO date (YYYY-MM-DD) of the most recent Friday 09:00 in
 * Sydney. DST is handled by Intl for the wall-clock; the date arithmetic is on the
 * calendar label so it isn't DST-sensitive.
 */
export function currentWeekId() {
  const { y, m, d, hour, dow } = sydneyNowParts();
  let back = (dow - 5 + 7) % 7; // days since the most recent Friday
  if (dow === 5 && hour < 9) back = 7; // before this Friday's 9am -> last Friday
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - back);
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${dt.getUTCFullYear()}-${mm}-${dd}`;
}

// ── Standard Butler IMP scoring ────────────────────────────────────────────────
// Upper bound of the point difference for each IMP value (index = IMPs).
const IMP_UPPER = [
  10, 40, 80, 120, 160, 210, 260, 310, 360, 420, 490, 590, 740, 890, 1090, 1290, 1490, 1740, 1990,
  2240, 2490, 2990, 3490, 3990,
];
function impFromAbs(diff) {
  for (let i = 0; i < IMP_UPPER.length; i++) if (diff <= IMP_UPPER[i]) return i;
  return 24;
}
/** Signed IMPs for a score difference (your raw NS score minus the datum). */
export function impDiff(scoreDiff) {
  const imp = impFromAbs(Math.abs(Math.round(scoreDiff)));
  return scoreDiff >= 0 ? imp : -imp;
}

/**
 * Butler leaderboard from raw entries. entries: [{ uid, displayName, boardNo, rawScoreNS }].
 * Datum per board = mean of all NS raw scores on that board (simple Butler).
 * Returns [{ uid, displayName, totalImps, boardsPlayed }] sorted best-first, plus the
 * per-(uid,board) IMPs map for detail views.
 */
export function computeLeaderboard(entries) {
  const byBoard = new Map();
  for (const e of entries) {
    if (!byBoard.has(e.boardNo)) byBoard.set(e.boardNo, []);
    byBoard.get(e.boardNo).push(e);
  }
  const datums = new Map();
  for (const [boardNo, list] of byBoard) {
    const mean = list.reduce((s, e) => s + (e.rawScoreNS || 0), 0) / list.length;
    datums.set(boardNo, mean);
  }
  const byUid = new Map();
  const impByUidBoard = {};
  for (const e of entries) {
    const imp = impDiff((e.rawScoreNS || 0) - datums.get(e.boardNo));
    impByUidBoard[`${e.uid}__${e.boardNo}`] = imp;
    if (!byUid.has(e.uid)) byUid.set(e.uid, { uid: e.uid, displayName: e.displayName || "Player", totalImps: 0, boardsPlayed: 0 });
    const agg = byUid.get(e.uid);
    agg.totalImps += imp;
    agg.boardsPlayed += 1;
  }
  const players = Array.from(byUid.values()).sort((a, b) => b.totalImps - a.totalImps);
  return { players, datums, impByUidBoard };
}
