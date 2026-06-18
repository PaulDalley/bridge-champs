/**
 * Weekly Tournament — Firestore I/O.
 *
 * Collections (see docs/weekly-tournament-plan.md):
 *   tournaments/{weekId}                                  -> { seed, opensAt, closesAt }
 *   tournamentResults/{weekId}/entries/{uid}__{boardNo}   -> one player's board result
 *
 * NOTE: the live reads/writes here need the Firestore security rules from step 5 to
 * be deployed; until then they'll be denied in production.
 */
import { firebase } from "../../firebase/config";
import { hashStr, currentWeekId } from "./weeklyBoards";

const FUNCTIONS_BASE = "https://us-central1-bridgechampions.cloudfunctions.net";
const db = () => firebase.firestore();

/**
 * The current week's id + board seed, from the getWeeklyTournament function
 * (authoritative, server-revealed so boards can't be pre-studied). Falls back to a
 * local placeholder if the function isn't reachable, so the page still works.
 */
export async function getWeeklyTournament() {
  try {
    const r = await fetch(`${FUNCTIONS_BASE}/getWeeklyTournament`, { cache: "no-store" });
    if (r.ok) {
      const d = await r.json();
      if (d && typeof d.seed === "number" && d.weekId) return { weekId: String(d.weekId), seed: d.seed >>> 0 };
    }
  } catch {
    /* fall back below */
  }
  const weekId = currentWeekId();
  return { weekId, seed: hashStr(weekId) };
}
const entriesCol = (weekId) =>
  db().collection("tournamentResults").doc(weekId).collection("entries");

/**
 * The week's master seed.
 * PLACEHOLDER for the frontend foundation: deterministic from weekId, so boards are
 * stable during development — but therefore PRE-COMPUTABLE. Step 4 swaps this for a
 * callable Cloud Function (getWeeklyTournament) that reveals a server-random seed at
 * the Friday reset so boards can't be studied in advance.
 */
export async function getWeekSeed(weekId) {
  try {
    const doc = await db().collection("tournaments").doc(weekId).get();
    if (doc.exists && typeof doc.data().seed === "number") return doc.data().seed >>> 0;
  } catch {
    /* rules may deny until step 5 — fall back to the local placeholder */
  }
  return hashStr(weekId);
}

/** This player's entries for the week, as a map { [boardNo]: entry }. */
export async function loadMyEntries(weekId, uid) {
  const map = {};
  if (!uid) return map;
  const snap = await entriesCol(weekId).where("uid", "==", uid).get();
  snap.forEach((doc) => {
    const e = doc.data();
    map[e.boardNo] = e;
  });
  return map;
}

/** Every entry for the week (for the leaderboard). */
export async function loadAllEntries(weekId) {
  const arr = [];
  const snap = await entriesCol(weekId).get();
  snap.forEach((doc) => arr.push(doc.data()));
  return arr;
}

/** Record one finished board. One scored attempt: never overwrites an existing entry. */
export async function saveEntry(weekId, uid, displayName, boardNo, record) {
  const id = `${uid}__${boardNo}`;
  const c = record.contract;
  const entry = {
    uid,
    displayName: displayName || "Player",
    boardNo,
    passout: !!record.passout,
    rawScoreNS: Math.round(record.rawScoreNS || 0),
    declarer: record.declarer || null,
    declarerTricks: record.declarerTricks || 0,
    contract: c ? { level: c.level, strain: c.strain, doubled: c.doubled || 0 } : null,
    auction: record.auction || [],
    play: record.play || [],
    finishedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  await entriesCol(weekId).doc(id).set(entry, { merge: false });
  return entry;
}
