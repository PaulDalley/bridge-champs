/**
 * Compass-first trainer UI: N/E/S/W + "You" labels, and stricter play-hand visibility defaults.
 *
 * **New puzzles (default):** set `trainerSpecVersion: 2`, or spread {@link TRAINER_PUZZLE_DEFAULTS_V2}
 * onto the object. Omitted `trainerSpecVersion` is treated as legacy (v1) so existing problems stay unchanged.
 *
 * **Overrides:** `trainerEngine: "compass"` still forces compass UI. `trainerEngine: "legacy"`
 * forces old-style labels even if `trainerSpecVersion >= 2`.
 *
 * **Play order (bridge):** Within a trick, play proceeds clockwise from the leader (`plays[0]`);
 * the next trick’s leader won the previous trick. See `CLOCKWISE` in `seatCompassMaps.js`.
 *
 * This module only imports `runnerStorageQuad` from `seatCompassMaps` (no LHO/RHO in this file).
 */

import { runnerStorageQuad } from "./seatCompassMaps";

export const TRAINER_ENGINE_COMPASS = "compass";

/** Explicit opt-out: old LHO/RHO/Dummy/Declarer style labels even on a v2-shaped puzzle. */
export const TRAINER_ENGINE_LEGACY = "legacy";

/** Puzzles without `trainerSpecVersion` behave as v1 (legacy labels). */
export const TRAINER_SPEC_VERSION_COMPASS_DEFAULT = 2;

/**
 * Spread onto new trainer puzzle objects: compass UI + future v2-only behavior.
 * Example: `{ id: "cp3-1", ...TRAINER_PUZZLE_DEFAULTS_V2, declarerCompass: "N", ... }`
 */
export const TRAINER_PUZZLE_DEFAULTS_V2 = Object.freeze({
  trainerSpecVersion: TRAINER_SPEC_VERSION_COMPASS_DEFAULT,
});

export function isCompassTrainerEngine(puzzle) {
  if (!puzzle) return false;
  if (puzzle.trainerEngine === TRAINER_ENGINE_LEGACY) return false;
  if (puzzle.trainerEngine === TRAINER_ENGINE_COMPASS) return true;
  const v = Number(puzzle.trainerSpecVersion);
  if (Number.isFinite(v) && v >= TRAINER_SPEC_VERSION_COMPASS_DEFAULT) return true;
  return false;
}

/** True when the puzzle defines at least one trick with a play. */
export function puzzleHasPlayInHand(puzzle) {
  const rounds = puzzle?.rounds;
  if (!Array.isArray(rounds) || !rounds.length) return false;
  return rounds.some((r) => Array.isArray(r?.plays) && r.plays.length > 0);
}

function compassLetterForStorageSeat(seat, declarerCompass) {
  const { storageIds, compassLetters } = runnerStorageQuad(declarerCompass);
  const i = storageIds.indexOf(seat);
  return i >= 0 ? compassLetters[i] : null;
}

const COMPASS_FULL_NAME = { N: "North", E: "East", S: "South", W: "West" };

/**
 * Display-only override for the "You (…)" seat label. Does not affect play or layout.
 * Accepts N/E/S/W or full compass names (any case); other non-empty strings are shown as-is.
 * @param {string|undefined|null} override
 * @returns {string|null}
 */
export function normalizeYouCompassLabelOverride(override) {
  if (override == null) return null;
  const s = String(override).trim();
  if (!s) return null;
  const one = s.length === 1 ? s.toUpperCase() : null;
  if (one && COMPASS_FULL_NAME[one]) return COMPASS_FULL_NAME[one];
  const key = s.toLowerCase();
  if (key === "north") return "North";
  if (key === "east") return "East";
  if (key === "south") return "South";
  if (key === "west") return "West";
  return s;
}

/**
 * @param {string} seat Runner storage seat id (same contract as the play runner)
 * @param {{ viewerSeat: string, declarerCompass: string, viewerCompassLabelOverride?: string }} ctx
 * @returns {string} "You (South)" etc., or a single compass letter (N/E/S/W)
 */
export function compassTrainerSeatLabel(seat, { viewerSeat, declarerCompass, viewerCompassLabelOverride }) {
  if (!seat) return "";
  if (seat === viewerSeat) {
    const forced = normalizeYouCompassLabelOverride(viewerCompassLabelOverride);
    if (forced) return `You (${forced})`;
    const letter = compassLetterForStorageSeat(viewerSeat, declarerCompass);
    const name = letter ? COMPASS_FULL_NAME[letter] || letter : "";
    return name ? `You (${name})` : "You";
  }
  const c = compassLetterForStorageSeat(seat, declarerCompass);
  return c || String(seat);
}
