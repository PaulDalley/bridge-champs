import { firebase } from "../firebase/config";

const COLLECTION = "treadmillStreakScores";

/** @typedef {{ alias: string; timeMs: number; uid: string }} GlobalTreadmillLbEntry */

/**
 * Live top 5 fastest times (one best per signed-in player). Unsubscribe returned on unmount.
 * @param {(rows: GlobalTreadmillLbEntry[], err: Error | null) => void} onNext
 * @returns {() => void}
 */
export function subscribeGlobalTreadmillLeaderboard(onNext) {
  const db = firebase.firestore();
  return db
    .collection(COLLECTION)
    .orderBy("timeMs", "asc")
    .limit(5)
    .onSnapshot(
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
        onNext(rows, null);
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
