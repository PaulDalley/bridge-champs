/**
 * Add top index + h2 anchors to canonical takeout doubles guide.
 * Usage: node scripts/add-takeout-index-and-anchors.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error("Missing serviceAccountKey.json");

const CANONICAL_BODY_ID = "yt6au7gwYwPahTxQ4kd5";

const HEADING_TO_ID = {
  "Why doubles have two meanings": "why-doubles-have-two-meanings",
  "What is a takeout double?": "what-is-a-takeout-double",
  "The takeout Double and the Negative double":
    "the-takeout-double-and-the-negative-double",
  "When to use a takeout double": "when-to-use-a-takeout-double",
  "A typical takeout double hand": "a-typical-takeout-double-hand",
  "How partner should respond": "how-partner-should-respond",
  "Common takeout double mistakes": "common-takeout-double-mistakes",
  "Takeout double (negative double) on the 1 level - some specific things to know.":
    "takeout-double-negative-double-on-the-1-level",
  "What to do if you want to penalty double but you are playing takeout doubles?":
    "what-to-do-if-you-want-to-penalty-double",
  "The support double": "the-support-double",
  'If they bid and raise a suit, always "takeout"':
    "if-they-bid-and-raise-a-suit-always-takeout",
  'The 4 level and higher, often we leave in a "takeout" double.':
    "the-4-level-and-higher-often-we-leave-in-a-takeout-double",
  "After partner's takeout double - Cue bidding the enemy's suit":
    "after-partners-takeout-double-cue-bidding-the-enemys-suit",
  "Double Double Double rule - 2 takeout doubles, 3rd double penalty.":
    "double-double-double-rule-third-double-penalty",
  "Exceptions - when a double becomes penalty instead of takeout.":
    "exceptions-when-a-double-becomes-penalty-instead-of-takeout",
  "Double and secondary support for partner":
    "double-and-secondary-support-for-partner",
  "We already have a minor fit, should I double to try find a major fit?":
    "we-already-have-a-minor-fit-should-i-double-to-try-find-a-major-fit",
  "The Lightner double and other Lead directing doubles":
    "the-lightner-double-and-other-lead-directing-doubles",
  "Doubling with a strong hand and atypical shape":
    "doubling-with-a-strong-hand-and-atypical-shape",
  "Summary of common double mistakes.":
    "summary-of-common-double-mistakes",
};

const INDEX_ORDER = [
  "Why doubles have two meanings",
  "What is a takeout double?",
  "The takeout Double and the Negative double",
  "When to use a takeout double",
  "A typical takeout double hand",
  "How partner should respond",
  "Common takeout double mistakes",
  "Takeout double (negative double) on the 1 level - some specific things to know.",
  "What to do if you want to penalty double but you are playing takeout doubles?",
  "The support double",
  'If they bid and raise a suit, always "takeout"',
  'The 4 level and higher, often we leave in a "takeout" double.',
  "After partner's takeout double - Cue bidding the enemy's suit",
  "Double Double Double rule - 2 takeout doubles, 3rd double penalty.",
  "Exceptions - when a double becomes penalty instead of takeout.",
  "Double and secondary support for partner",
  "We already have a minor fit, should I double to try find a major fit?",
  "The Lightner double and other Lead directing doubles",
  "Doubling with a strong hand and atypical shape",
  "Summary of common double mistakes.",
];

const buildIndexHtml = () => {
  const links = INDEX_ORDER.map((heading) => {
    const id = HEADING_TO_ID[heading];
    return `<li><a href="#${id}">${heading}</a></li>`;
  }).join("");

  return `<Callout type="checklist"><h3>On this page</h3><ul>${links}</ul></Callout>`;
};

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  let text = (await ref.get()).data()?.text || "";

  for (const [heading, id] of Object.entries(HEADING_TO_ID)) {
    const withId = `<h2 id="${id}">${heading}</h2>`;
    const plain = `<h2>${heading}</h2>`;
    if (text.includes(withId)) continue;
    if (!text.includes(plain)) {
      throw new Error(`Heading not found: ${heading}`);
    }
    text = text.replace(plain, withId);
  }

  if (!text.includes(`<h3>On this page</h3>`)) {
    const firstHeading = `<h2 id="${HEADING_TO_ID["Why doubles have two meanings"]}">Why doubles have two meanings</h2>`;
    if (!text.includes(firstHeading)) {
      throw new Error("First heading with id not found for index insertion.");
    }
    text = text.replace(firstHeading, `${buildIndexHtml()}${firstHeading}`);
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

