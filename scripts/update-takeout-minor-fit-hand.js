/**
 * Fix example 2 hand in minor fit section (remove extra club).
 * Usage: node scripts/update-takeout-minor-fit-hand.js
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

const OLD = "*S-10942*H-3*D-10432*C-KQ1084";
const NEW = "*S-10942*H-3*D-10432*C-KQ108";

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
    throw new Error("Target hand not found in canonical body.");
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
