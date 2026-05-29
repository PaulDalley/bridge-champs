/**
 * Add support double + Lightner outline headings.
 * Usage: node scripts/replace-takeout-add-outline-headings.js
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

const INSERTIONS = [
  {
    before: `<h2>If they bid and raise a suit, always "takeout"</h2>`,
    block: `<h2>The support double</h2>
<p></p>

`,
  },
  {
    after: `<h2>We already have a minor fit, should I double to try find a major fit?</h2>
<p></p>

`,
    block: `<h2>The Lightner double and other Lead directing doubles</h2>
<p></p>

`,
  },
];

function apply(html) {
  let out = html;
  for (const { before, after, block } of INSERTIONS) {
    if (before) {
      if (out.includes(block.trim())) continue;
      if (!out.includes(before)) throw new Error(`Anchor not found: ${before.slice(0, 50)}`);
      out = out.replace(before, block + before);
    }
    if (after) {
      if (out.includes("The Lightner double and other Lead directing doubles")) continue;
      if (!out.includes(after)) throw new Error(`Anchor not found: after`);
      out = out.replace(after, after + block);
    }
  }
  return out;
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  const out = apply(text);
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
