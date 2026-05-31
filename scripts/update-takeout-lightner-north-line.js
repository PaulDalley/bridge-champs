/**
 * Update Lightner section sentence to requested North wording.
 * Usage: node scripts/update-takeout-lightner-north-line.js
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

const CANONICAL_BODY_ID = "yt6au7gwYwPahTxQ4kd5";

const OLD =
  "The expert player on lead worked out to lead a spade, the full hand was as follows.";
const NEW =
  "The expert North (the partnership is a long standing one where these auctions had been discussed) worked out to lead a spade, the full hand was as follows.";

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";

  if (!text.includes(OLD)) {
    if (text.includes(NEW)) {
      console.log("Already updated.");
      return;
    }
    throw new Error("Target sentence not found in canonical body.");
  }

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
