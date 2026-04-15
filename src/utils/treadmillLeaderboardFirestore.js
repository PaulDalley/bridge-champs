import { firebase } from "../firebase/config";
import { TREADMILL_LEADERBOARD_DISPLAY_LIMIT } from "./treadmillLeaderboard";

const COLLECTION = "treadmillStreakScores";

/** @typedef {{ alias: string; timeMs: number; uid: string }} GlobalTreadmillLbEntry */

/** User-visible message for failed leaderboard subscription. */
export function getLeaderboardSubscribeErrorMessage(err) {
  if (!err) {
    return "Could not load the leaderboard. Check your connection and try refreshing the page.";
  }
  const code = err.code || "";
  if (code === "permission-denied") {
    return "The leaderboard could not load because access was denied. The site needs the latest security rules published to Firebase, then try refreshing.";
  }
  if (code === "failed-precondition") {
    return "The leaderboard could not load. Try refreshing the page.";
  }
  return "Could not load the leaderboard. Check your connection and try refreshing the page.";
}

/**
 * Live fastest times (one best per signed-in player), capped for display. Unsubscribe returned on unmount.
 * Listens to the whole collection and sorts client-side so we do not require a composite index
 * for orderBy + limit (which often fails until an index is created in the console).
 * @param {(rows: GlobalTreadmillLbEntry[], err: Error | null) => void} onNext
 * @returns {() => void}
 */
export function subscribeGlobalTreadmillLeaderboard(onNext) {
  const db = firebase.firestore();
  return db.collection(COLLECTION).onSnapshot(
    (snap) => {
      const rows = [];
      snap.forEach((doc) => {
        const d = doc.data();
        const timeMs = Number(d.timeMs);
        if (!Number.isFinite(timeMs)) return;
        rows.push({
          uid: doc.id,
          alias: String(d.alias ?? "Player").trim() || "Player",
          timeMs,
        });
      });
      rows.sort((a, b) => a.timeMs - b.timeMs);
      onNext(rows.slice(0, TREADMILL_LEADERBOARD_DISPLAY_LIMIT), null);
    },
    (err) => {
      onNext([], err);
    }
  );
}

/**
 * Saves this user's personal best if the run beats their stored time (or first entry).
 * @param {string} uid
 * @param {string} alias
 * @param {number} timeMs
 * @returns {Promise<void>}
 */
export function submitTreadmillPersonalBest(uid, alias, timeMs) {
  if (!uid || !Number.isFinite(timeMs) || timeMs < 0) {
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
    const prev =
      snap.exists && typeof snap.data().timeMs === "number" ? snap.data().timeMs : Infinity;
    if (timeMs >= prev) {
      return;
    }
    tx.set(
      ref,
      {
        alias: trimmed,
        timeMs,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });
}
