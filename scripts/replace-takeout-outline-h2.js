/**
 * Promote outline section titles from h3 to h2 (main headings).
 * Usage: node scripts/replace-takeout-outline-h2.js
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

const OLD = `<h3>Takeout double on the 1 level - some specific things to know.</h3>
<p></p>

<h3>What to do if you want to penalty double but you are playing takeout doubles?</h3>
<p></p>

<h3>If they bid and raise a suit, always "takeout"</h3>
<p></p>

<h3>The 4 level and higher, often we leave in a "takeout" double.</h3>
<p></p>

<h3>After partner's takeout double - Cue bidding the enemy's suit</h3>
<p></p>

<h3>Double Double Double rule - 2 takeout doubles, 3rd double penalty.</h3>
<p></p>

<h3>Exceptions - when a double becomes penalty instead of takeout.</h3>
<p></p>

<h3>Double and secondary support for partner</h3>
<p></p>

<h3>Summary of common double mistakes.</h3>
<p></p>`;

const NEW = OLD.replace(/<h3>/g, "<h2>").replace(/<\/h3>/g, "</h2>");

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  if (!text.includes(OLD) && text.includes(NEW.slice(0, 40))) {
    console.log("Already h2.");
    return;
  }
  if (!text.includes(OLD)) throw new Error("Outline h3 block not found.");
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
