/**
 * Insert a new <h2> heading ("Doubling with a single suiter weak hand ...")
 * immediately before the "What to do if you want to penalty double..." heading
 * in the canonical takeout doubles guide, and add a matching entry to the
 * "On this page" index so the contents list stays consistent.
 *
 * Usage: node scripts/insert-takeout-single-suiter-heading.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error("Missing serviceAccountKey.json");

const CANONICAL_BODY_ID = "yt6au7gwYwPahTxQ4kd5";

const NEW_HEADING_TEXT =
  "Doubling with a single suiter weak hand (an exception to the normal rules)";
const NEW_HEADING_ID = "doubling-with-a-single-suiter-weak-hand";

const PENALTY_ID = "what-to-do-if-you-want-to-penalty-double";
const PENALTY_TEXT =
  "What to do if you want to penalty double but you are playing takeout doubles?";

const NEW_HEADING_HTML = `<h2 id="${NEW_HEADING_ID}">${NEW_HEADING_TEXT}</h2>`;
const NEW_INDEX_HTML = `<li><a href="#${NEW_HEADING_ID}">${NEW_HEADING_TEXT}</a></li>`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  let text = (await ref.get()).data()?.text || "";

  if (text.includes(NEW_HEADING_HTML)) {
    console.log("Heading already present. Nothing to do.");
    return;
  }

  // Insert the heading before the penalty-double heading (with or without id).
  const penaltyWithId = `<h2 id="${PENALTY_ID}">${PENALTY_TEXT}</h2>`;
  const penaltyPlain = `<h2>${PENALTY_TEXT}</h2>`;
  if (text.includes(penaltyWithId)) {
    text = text.replace(penaltyWithId, `${NEW_HEADING_HTML}\n${penaltyWithId}`);
  } else if (text.includes(penaltyPlain)) {
    text = text.replace(penaltyPlain, `${NEW_HEADING_HTML}\n${penaltyPlain}`);
  } else {
    throw new Error("Penalty-double heading not found in canonical body.");
  }

  // Add a matching "On this page" index entry just before the penalty entry.
  const penaltyIndex = `<li><a href="#${PENALTY_ID}">${PENALTY_TEXT}</a></li>`;
  if (text.includes(penaltyIndex) && !text.includes(NEW_INDEX_HTML)) {
    text = text.replace(penaltyIndex, `${NEW_INDEX_HTML}${penaltyIndex}`);
  }

  await ref.set(
    { text, body: { text }, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  console.log("Updated biddingBody/" + CANONICAL_BODY_ID);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
