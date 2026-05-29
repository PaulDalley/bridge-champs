/**
 * Typical takeout hand: East opens 1H, South to act.
 * Usage: node scripts/update-takeout-typical-hand-auction.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error("Missing serviceAccountKey.json");

const CANONICAL_BODY_ID = "yt6au7gwYwPahTxQ4kd5";

const OLD =
  'South="*S-KQ102*H-4*D-A1084*C-K932" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="West" bidding="1♥/P/P/?"';

const NEW =
  'South="*S-KQ102*H-4*D-A1084*C-K932" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="East" bidding="_/1♥/?"';

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  if (text.includes(NEW)) {
    console.log("Already updated.");
    return;
  }
  if (!text.includes(OLD)) throw new Error("Target MakeBoard not found.");
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
