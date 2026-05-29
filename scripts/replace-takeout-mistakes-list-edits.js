/**
 * Common mistakes list copy edits.
 * Usage: node scripts/replace-takeout-mistakes-list-edits.js
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
const BCB07 = path.join(__dirname, "..", "docs", "article-payloads", "bcb-07-takeout-doubles.json");

const REPLACEMENTS = [
  {
    old: "Doubling because you don't know what else to do. Doubles need a shape and a plan.",
    new: "Doubling because you don't know what else to do.",
  },
  {
    old: "Doubling when partner has already shown a suit you fit. Raise partner instead.",
    new: "Doubling when you have a major suit fit already.",
  },
];

function applyAll(html) {
  let out = html;
  for (const { old, new: replacement } of REPLACEMENTS) {
    if (!out.includes(old)) throw new Error(`Not found: ${old}`);
    out = out.split(old).join(replacement);
  }
  return out;
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const bcb = JSON.parse(fs.readFileSync(BCB07, "utf8"));
  bcb.bodyHtml = applyAll(bcb.bodyHtml);
  fs.writeFileSync(BCB07, JSON.stringify(bcb, null, 2) + "\n", "utf8");
  console.log("Updated", BCB07);

  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  const out = applyAll(text);
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
