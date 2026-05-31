/**
 * Fix Lightner example auction strings in canonical takeout guide.
 * Usage: node scripts/update-takeout-lightner-auctions.js
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
const FIRST_OLD = "bidding=\"1♠/P/3♠/P/4NT/P/5♠/P/6♠/P/P/X/P/P/P\"";
const FIRST_NEW = "bidding=\"_/_/1♠/P/3♠/P/4NT/P/5♠/P/6♠/P/P/X/P/P/P\"";
const SECOND_OLDER = "bidding=\"1♠/2♣/3♠/P/4NT/P/5♠/P/6♠/P/P/X/P/P/P\"";
const SECOND_OLD = "bidding=\"1♠/P/3♠/4♣/4NT/P/5♠/P/6♠/P/P/X/P/P/P\"";
const SECOND_NEW = "bidding=\"_/_/1♠/P/3♠/4♣/4NT/P/5♠/P/6♠/P/P/X/P/P/P\"";

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";

  let out = text;
  if (out.includes(FIRST_OLD)) out = out.replace(FIRST_OLD, FIRST_NEW);
  if (out.includes(SECOND_OLDER)) out = out.replace(SECOND_OLDER, SECOND_NEW);
  if (out.includes(SECOND_OLD)) out = out.replace(SECOND_OLD, SECOND_NEW);

  if (!out.includes(FIRST_NEW)) throw new Error("First Lightner auction string not found.");
  if (!out.includes(SECOND_NEW)) throw new Error("Second Lightner auction string not found.");

  if (out === text) {
    console.log("Already updated.");
    return;
  }

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
