/**
 * Compass-clockwise play order for the `playEngine: "compassClockwise"` path.
 * Ring matches CountingTrumpsTrainer CLOCKWISE / table convention: N → E → S → W → N.
 */

export const PLAY_ENGINE_COMPASS_CLOCKWISE = "compassClockwise";

export const COMPASS_CLOCKWISE_RING = ["N", "E", "S", "W"];

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
