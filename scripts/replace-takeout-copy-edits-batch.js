/**
 * Batch copy edits for takeout doubles guide (canonical body + bcb-07).
 * Usage: node scripts/replace-takeout-copy-edits-batch.js
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
    old: `<p>Don't use doubles when you already have a fit with partner. Just raise to the appropriate level.</p>`,
    new: `<p>Don't use doubles when you already have a MAJOR fit with partner. Just raise to the appropriate level.</p><p>When you already have a minor fit, sometimes you use a takeout double to try look for a fit in the unbid major - bridge is usually all about the majors!</p>`,
  },
  {
    old: `<h2>How partner should respond (briefly)</h2>`,
    new: `<h2>How partner should respond</h2>`,
  },
  {
    old: "conveys the simple message",
    new: "conveys the message",
  },
  {
    old: "conveys the very simple message",
    new: "conveys the message",
  },
  {
    old: `<strong>opposite a takeout double, every level you jump shows a better hand, but is still not forcing.</strong></p>

<h2>Common takeout double mistakes</h2>`,
    new: `<strong>opposite a takeout double, every level you jump shows a better hand, but is still not forcing.</strong></p>

<h3>responding to a takeout double by cue bidding the opponent's suit</h3>
<p></p>

<h2>Common takeout double mistakes</h2>`,
  },
];

function applyAll(html) {
  let out = html;
  for (const { old, new: replacement } of REPLACEMENTS) {
    if (!out.includes(old)) {
      throw new Error(`Pattern not found: ${old.slice(0, 80)}…`);
    }
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
