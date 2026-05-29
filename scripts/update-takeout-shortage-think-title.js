/**
 * Extend Think About it title on shortage callout.
 * Usage: node scripts/update-takeout-shortage-think-title.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error("Missing serviceAccountKey.json");

const CANONICAL_BODY_ID = "yt6au7gwYwPahTxQ4kd5";

const OLD =
  "<h3>💡 Think about it</h3><p>When you have shortage in the opponent's suit and no clear natural bid";

const NEW =
  "<h3>💡 Think About it - Often double with shortage in the opponent's suit</h3><p>When you have shortage in the opponent's suit and no clear natural bid";

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  if (text.includes(NEW.slice(0, 40))) {
    console.log("Already updated.");
    return;
  }
  if (!text.includes(OLD)) throw new Error("Target not found.");
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
