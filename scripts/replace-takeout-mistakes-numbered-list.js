/**
 * Common mistakes: bullet list -> numbered list with updated copy.
 * Usage: node scripts/replace-takeout-mistakes-numbered-list.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPath = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
].find((p) => fs.existsSync(p));
if (!keyPath) throw new Error("No Firebase service account key found.");

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const OLD = `<h2>Common takeout double mistakes</h2><ul><li>Doubling because you don't know what else to do. Doubles need a shape and a plan.</li><li>Doubling with length in the opponents' suit. If you have 4+ of their suit, you don't want partner bidding — you want to defend.</li><li>Doubling when partner has already shown a suit you fit. Raise partner instead.</li><li>Doubling when you really should just pass.</li></ul>`;

const NEW = `<h2>Common takeout double mistakes</h2><ol><li>Doubling because you don't know what else to do. Doubles need a shape and a plan.</li><li>Doubling with length in the opponents' suit. Typically with 3-4 in their suit, its less attractive to double (there are exceptions, particularly when they have bid two suits, you can't expect to be short in both suits!)</li><li>Doubling when partner has already shown a suit you fit. Raise partner instead.</li><li>Doubling when you really should just pass.</li></ol>`;

async function patch(col, bodyId) {
  const ref = db.collection(col).doc(bodyId);
  const text = (await ref.get()).data()?.text || "";
  if (!text.includes(OLD)) return { col, bodyId, ok: false };
  const out = text.replace(OLD, NEW);
  await ref.set(
    { text: out, body: { text: out }, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  return { col, bodyId, ok: true };
}

async function main() {
  const b = await db
    .collection("beginnerBidding")
    .where("title", "==", "Takeout Doubles in Bridge: A Beginner's Guide to Asking Partner to Bid")
    .get();
  const g = await db
    .collection("bidding")
    .where("title", "==", "[Work in progress] Takeout Doubles in Bridge: Complete Guide")
    .get();
  console.log(await patch("beginnerBiddingBody", b.docs[0].data().body));
  console.log(await patch("biddingBody", g.docs[0].data().body));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
