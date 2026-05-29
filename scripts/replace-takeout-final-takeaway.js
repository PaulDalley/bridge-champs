/**
 * Replace Final takeaway closing paragraph in beginner + complete guide.
 * Usage: node scripts/replace-takeout-final-takeaway.js
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

const OLD =
  "The takeout double is one of the most valuable bidding tools in modern bridge. The pattern is simple: shortage in their suit, support for the others, enough strength to handle partner's response, and no better bid available. Get this right and you'll find good contracts that your opponents thought they had to themselves.";

const NEW =
  "The takeout double is one of the most valuable bidding tools in modern bridge. The typical pattern is simple: shortage in their suit, support for the others, enough strength to handle partner's response, and no better bid available. Get this right and you'll find your side landing in better contracts more consistently.";

async function patch(collectionName, bodyId) {
  const ref = db.collection(collectionName).doc(bodyId);
  const snap = await ref.get();
  if (!snap.exists) return { collectionName, bodyId, ok: false, reason: "missing" };
  const text = snap.data().text || snap.data().body?.text || "";
  if (!text.includes(OLD)) return { collectionName, bodyId, ok: false, reason: "pattern not found" };
  const out = text.replace(OLD, NEW);
  await ref.set(
    { text: out, body: { text: out }, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  return { collectionName, bodyId, ok: true };
}

async function main() {
  const beginnerSnap = await db
    .collection("beginnerBidding")
    .where("title", "==", "Takeout Doubles in Bridge: A Beginner's Guide to Asking Partner to Bid")
    .limit(1)
    .get();
  const guideSnap = await db
    .collection("bidding")
    .where("title", "==", "[Work in progress] Takeout Doubles in Bridge: Complete Guide")
    .limit(1)
    .get();

  const results = await Promise.all([
    patch("beginnerBiddingBody", beginnerSnap.docs[0].data().body),
    patch("biddingBody", guideSnap.docs[0].data().body),
  ]);
  results.forEach((r) => console.log(JSON.stringify(r)));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
