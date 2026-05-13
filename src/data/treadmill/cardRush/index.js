import { CARD_RUSH_SEED_PUZZLES } from "./seed";

/**
 * Single source of truth for the Card Rush puzzle pool. v1 is just the
 * hand-authored seed; future revisions can append puzzles from existing
 * trainer collections via an adapter layer added here.
 */
export const CARD_RUSH_ALL_PUZZLES = [...CARD_RUSH_SEED_PUZZLES];

/** Puzzles shown in normal random runs (draft / preview puzzles are excluded). */
export const CARD_RUSH_PUZZLE_POOL = CARD_RUSH_ALL_PUZZLES.filter((p) => p?.includeInPool !== false);

/** All suits in display order — alternating colours (♠ ♥ ♣ ♦) to match the
 *  existing Treadmill / Counting / Beginner trainer hands strips. */
export const SUIT_ORDER = ["S", "H", "C", "D"];

/** Rank ordering used both for display sorts and "is X higher than Y" checks. */
export const RANK_ORDER = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];

/** Returns the suit char of a card string. */
export function cardSuit(card) {
  return String(card || "").charAt(0);
}

/** Returns the rank char of a card string. */
export function cardRank(card) {
  return String(card || "").charAt(1);
}

/** Sorts cards descending within each suit; suits in S H D C order. */
export function sortHandForDisplay(cards) {
  const list = Array.isArray(cards) ? [...cards] : [];
  return list.sort((a, b) => {
    const sa = SUIT_ORDER.indexOf(cardSuit(a));
    const sb = SUIT_ORDER.indexOf(cardSuit(b));
    if (sa !== sb) return sa - sb;
    return RANK_ORDER.indexOf(cardRank(b)) - RANK_ORDER.indexOf(cardRank(a));
  });
}

/** Group sorted cards by suit, returning [{ suit, cards: [..] }, ...]. */
export function groupBySuit(cards) {
  const sorted = sortHandForDisplay(cards);
  const map = new Map();
  for (const c of sorted) {
    const s = cardSuit(c);
    if (!map.has(s)) map.set(s, []);
    map.get(s).push(c);
  }
  return SUIT_ORDER.map((s) => ({ suit: s, cards: map.get(s) || [] }));
}

/** Picks `n` puzzles at random (without replacement) from the pool. */
export function pickRandomPuzzles(n, source) {
  const pool = Array.isArray(source) ? source : CARD_RUSH_PUZZLE_POOL;
  if (n >= pool.length) {
    return shuffle(pool).slice(0, pool.length);
  }
  return shuffle(pool).slice(0, n);
}

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}
