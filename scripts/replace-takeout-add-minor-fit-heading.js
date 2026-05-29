/**
 * Add outline h2 after Double and secondary support for partner.
 * Usage: node scripts/replace-takeout-add-minor-fit-heading.js
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

const INSERT_AFTER = `<h2>Double and secondary support for partner</h2>
<p></p>`;

const NEW_HEADING = `<h2>We already have a minor fit, should I double to try find a major fit?</h2>
<p></p>

`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  const needle = NEW_HEADING.trim();
  if (text.includes(needle)) {
    console.log("Heading already present.");
    return;
  }
  if (!text.includes(INSERT_AFTER)) {
    throw new Error("Anchor not found (check h2/h3 for Double and secondary support).");
  }
  const out = text.replace(INSERT_AFTER, `${INSERT_AFTER}\n\n${NEW_HEADING}`);
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
