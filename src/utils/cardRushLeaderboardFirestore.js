import { firebase } from "../firebase/config";

const COLLECTION = "cardRushScores";

/** Cap on rows shown in the Card Rush leaderboard widget. */
export const CARD_RUSH_LEADERBOARD_DISPLAY_LIMIT = 10;

/** Sanity bounds matching firestore.rules. */
export const CARD_RUSH_MIN_SCORE = 1;
export const CARD_RUSH_MAX_SCORE = 999;
export const CARD_RUSH_MIN_TIME_MS = 0;
/** Slightly above the 2-min run length to allow a small handler overshoot. */
export const CARD_RUSH_MAX_TIME_MS = 5 * 60 * 1000;

/** @typedef {{ alias: string; score: number; timeMs: number; uid: string }} CardRushLbEntry */

/** User-facing message for a failed leaderboard subscription. */
export function getCardRushLeaderboardErrorMessage(err) {
  if (!err) {
    return "Could not load the Card Rush leaderboard. Check your connection and try refreshing the page.";
  }
  const code = err.code || "";
  if (code === "permission-denied") {
    return "The Card Rush leaderboard could not load because access was denied. The site needs the latest security rules published to Firebase, then try refreshing.";
  }
  if (code === "failed-precondition") {
    return "The Card Rush leaderboard could not load. Try refreshing the page.";
  }
  return "Could not load the Card Rush leaderboard. Check your connection and try refreshing the page.";
}

/**
 * Live top scores in the 2-minute Card Rush mode (one personal best per signed-in
 * player). Sorts client-side by score DESC, then by timeMs ASC as a tiebreaker
 * (faster wins ties). Capped to CARD_RUSH_LEADERBOARD_DISPLAY_LIMIT.
 *
 * @param {(rows: CardRushLbEntry[], err: Error | null) => void} onNext
 * @returns {() => void} unsubscribe
 */
export function subscribeCardRushLeaderboard(onNext) {
  const db = firebase.firestore();
  return db.collection(COLLECTION).onSnapshot(
    (snap) => {
      const rows = [];
      snap.forEach((doc) => {
        const d = doc.data();
        const score = Number(d.score);
        const timeMs = Number(d.timeMs);
        if (!Number.isFinite(score) || score <= 0) return;
        rows.push({
          uid: doc.id,
          alias: String(d.alias ?? "Player").trim() || "Player",
          score,
          timeMs: Number.isFinite(timeMs) ? timeMs : 0,
        });
      });
      rows.sort((a, b) => (b.score - a.score) || (a.timeMs - b.timeMs));
      onNext(rows.slice(0, CARD_RUSH_LEADERBOARD_DISPLAY_LIMIT), null);
    },
    (err) => {
      onNext([], err);
    }
  );
}

/**
 * Saves a user's personal-best Card Rush score. Updates only when the new run
 * beats their stored value (higher score, or same score in faster time).
 *
 * @param {string} uid
 * @param {string} alias
 * @param {number} score   Number of puzzles correct in the run.
 * @param {number} timeMs  Total elapsed time of the run.
 * @returns {Promise<boolean>} resolves true if the personal best was updated.
 */
export function submitCardRushPersonalBest(uid, alias, score, timeMs) {
  if (
    !uid ||
    !Number.isFinite(score) ||
    score < CARD_RUSH_MIN_SCORE ||
    score > CARD_RUSH_MAX_SCORE ||
    !Number.isFinite(timeMs) ||
    timeMs < CARD_RUSH_MIN_TIME_MS ||
    timeMs > CARD_RUSH_MAX_TIME_MS
  ) {
    return Promise.reject(new Error("Invalid score"));
  }
  const trimmed = String(alias ?? "")
    .trim()
    .slice(0, 40);
  if (!trimmed) {
    return Promise.reject(new Error("Name required"));
  }
  const db = firebase.firestore();
  const ref = db.collection(COLLECTION).doc(uid);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists) {
      const prev = snap.data();
      const prevScore = Number.isFinite(prev.score) ? Number(prev.score) : -1;
      const prevTime = Number.isFinite(prev.timeMs) ? Number(prev.timeMs) : Infinity;
      const better = score > prevScore || (score === prevScore && timeMs < prevTime);
      if (!better) return false;
    }
    tx.set(
      ref,
      {
        alias: trimmed,
        score,
        timeMs,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  });
}
