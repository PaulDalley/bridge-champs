/**
 * Add subsection heading under "Doubling with a strong hand and atypical shape".
 * Usage: node scripts/insert-takeout-1nt-penalty-heading.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error("Missing serviceAccountKey.json");

const CANONICAL_BODY_ID = "yt6au7gwYwPahTxQ4kd5";

const OLD = `<h2>Doubling with a strong hand and atypical shape</h2><p></p>

<h2>Summary of common double mistakes.</h2>`;

const NEW = `<h2>Doubling with a strong hand and atypical shape</h2><p></p>

<h3>In competition the opponents bid 1NT, double is typically penalty.</h3>
<p></p>

<h2>Summary of common double mistakes.</h2>`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  if (text.includes("In competition the opponents bid 1NT, double is typically penalty.")) {
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
