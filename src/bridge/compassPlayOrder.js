/**
 * Compass-clockwise play order for the `playEngine: "compassClockwise"` path.
 *
 * Ring matches {@link CLOCKWISE} in `seatCompassMaps.js`: **N → E → S → W → N**.
 * Each trick is led by one compass seat; the next three plays follow **clockwise** from that
 * leader (e.g. East leads → East, South, West, North). The leader of the next trick is whoever
 * won the previous trick — puzzle authoring expresses that by making the winner `plays[0]` on
 * the following trick.
 */

import { CLOCKWISE } from "./seatCompassMaps";

export const PLAY_ENGINE_COMPASS_CLOCKWISE = "compassClockwise";

export const COMPASS_CLOCKWISE_RING = CLOCKWISE;

export function nextClockwise(compass) {
  const i = COMPASS_CLOCKWISE_RING.indexOf(compass);
  if (i === -1) return compass;
  return COMPASS_CLOCKWISE_RING[(i + 1) % 4];
}

/**
 * After `leaderCompass` leads, the other three seats in clockwise order (follow suit rotation).
 */
export function followSeatsClockwiseFromLeader(leaderCompass) {
  const out = [];
  let c = nextClockwise(leaderCompass);
  for (let i = 0; i < 3; i++) {
    out.push(c);
    c = nextClockwise(c);
  }
  return out;
}
