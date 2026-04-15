/**
 * Compass primitives and table geometry (N/E/S/W only in public geometry APIs).
 *
 * `buildSeatCompassMaps` exists only for the existing play runner’s frozen JSON/React
 * seat ids — new UI code should prefer `compassTable` + `runnerStorageQuad` patterns.
 */

/**
 * Compass ring order: **clockwise** is N → E → S → W → N (same order as bidding rotation).
 *
 * **Trick play:** Within each trick, the four plays always proceed clockwise starting from
 * whoever **leads** that trick (`plays[0]` in puzzle data). Examples: East leads → E, S, W, N;
 * South leads → S, W, N, E. Who leads trick 1 is set by the deal / auction; who leads later
 * tricks is whoever **won the previous trick** (authoring should put the winner first in the
 * next trick’s `plays` array). The engine normalizes each trick into this clockwise order.
 */
export const CLOCKWISE = ["N", "E", "S", "W"];

export function partnerCompass(seat) {
  const i = CLOCKWISE.indexOf(seat);
  return i === -1 ? "S" : CLOCKWISE[(i + 2) % 4];
}

/** One step counter-clockwise on the compass ring. */
export function compassCCW(seat) {
  const i = CLOCKWISE.indexOf(seat);
  return i === -1 ? "W" : CLOCKWISE[(i + 3) % 4];
}

/** One step clockwise on the compass ring. */
export function compassCW(seat) {
  const i = CLOCKWISE.indexOf(seat);
  return i === -1 ? "E" : CLOCKWISE[(i + 1) % 4];
}

/** @deprecated Use compassCCW — kept for call sites that still import the old name. */
export function lhoCompass(seat) {
  return compassCCW(seat);
}

/** @deprecated Use compassCW — kept for call sites that still import the old name. */
export function rhoCompass(seat) {
  return compassCW(seat);
}

/**
 * Who sits where in compass letters for this declarer (app screen convention:
 * N/S declarer ⇒ west screen = West, east screen = East).
 */
export function compassTable(declarerCompass) {
  const declarer = declarerCompass;
  const dummy = partnerCompass(declarerCompass);
  let defenderWest;
  let defenderEast;
  if (declarerCompass === "N" || declarerCompass === "S") {
    defenderWest = "W";
    defenderEast = "E";
  } else {
    defenderWest = compassCCW(declarerCompass);
    defenderEast = compassCW(declarerCompass);
  }
  return { declarer, dummy, defenderWest, defenderEast };
}

/**
 * Parallel arrays linking frozen runner storage ids to compass letters.
 * Only `seatCompassMaps.js` should spell the storage ids.
 */
export function runnerStorageQuad(declarerCompass) {
  const t = compassTable(declarerCompass);
  const STORAGE_IDS = ["DECLARER", "DUMMY", "LHO", "RHO"];
  const letters = [t.declarer, t.dummy, t.defenderWest, t.defenderEast];
  return { storageIds: STORAGE_IDS, compassLetters: letters };
}

/**
 * Map frozen runner storage ids to compass for the given declarer compass.
 */
export function buildSeatCompassMaps(declarerCompass) {
  const t = compassTable(declarerCompass);
  const seatToCompass = {
    DECLARER: t.declarer,
    DUMMY: t.dummy,
    LHO: t.defenderWest,
    RHO: t.defenderEast,
  };
  const compassToSeat = Object.entries(seatToCompass).reduce((acc, [seat, compass]) => {
    acc[compass] = seat;
    return acc;
  }, {});
  return { seatToCompass, compassToSeat };
}
