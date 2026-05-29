/**
 * Insert "think about it" callout after shortage / takeout double paragraph.
 * Usage: node scripts/insert-takeout-shortage-think-callout.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error("Missing serviceAccountKey.json");

const CANONICAL_BODY_ID = "yt6au7gwYwPahTxQ4kd5";

const MARKER =
  "so basically a double reason to get in there and compete with a takeout double.</p>";

const CALLOUT = `<Callout type="rule"><h3>💡 Think About it - Often double with shortage in the opponent's suit</h3><p>When you have shortage in the opponent's suit and no clear natural bid (no long suit to show), you should always think about the possibility of a takeout double. It is often the responsibility of the player with shortage in their suit to make the first takeout double.</p></Callout>`;

const OLD = `${MARKER}<h2>A typical takeout double hand</h2>`;

const NEW = `${MARKER}${CALLOUT}<h2>A typical takeout double hand</h2>`;

const ALREADY =
  "It is often the responsibility of the player with shortage in their suit to make the first takeout double";

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  if (text.includes(ALREADY)) {
    console.log("Already inserted.");
    return;
  }
  if (!text.includes(OLD)) throw new Error("Target block not found in canonical body.");
  const out = text.replace(OLD, NEW);
  await ref.set(
    { text: out, body: { text: out }, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  console.log("Updated biddingBody/" + CANONICAL_BODY_ID);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
