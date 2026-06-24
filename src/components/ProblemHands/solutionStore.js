import { firebase } from "../../firebase/config";

// Recorded solution walkthroughs live in Firestore: problemSolutions/{problemId}
// = { play: [{seat, card}], messages: { "<cardIndex>": "<text>" }, videoUrl, updatedAt }.
// Public read; admin-only write (see firestore.rules).

const COLLECTION = "problemSolutions";
const db = () => firebase.firestore();

export async function loadSolution(problemId) {
  try {
    const snap = await db().collection(COLLECTION).doc(problemId).get();
    if (!snap.exists) return null;
    const data = snap.data() || {};
    return { play: data.play || [], messages: data.messages || {}, videoUrl: data.videoUrl || "" };
  } catch (e) {
    return null;
  }
}

export async function saveSolution(problemId, { play, messages, videoUrl }) {
  await db()
    .collection(COLLECTION)
    .doc(problemId)
    .set(
      {
        play: play || [],
        messages: messages || {},
        videoUrl: videoUrl || "",
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}
