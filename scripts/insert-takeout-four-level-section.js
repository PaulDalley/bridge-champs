/**
 * Insert 4-level section + spelling-only fixes across canonical takeout guide.
 * Usage: node scripts/insert-takeout-four-level-section.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error("Missing serviceAccountKey.json");

const CANONICAL_BODY_ID = "yt6au7gwYwPahTxQ4kd5";

const iterativelyReplace = (string, suit) => {
  let oldString = string;
  let newString = "";
  let indexOf = oldString.indexOf(suit);
  while (indexOf !== -1) {
    newString += oldString.slice(0, indexOf);
    oldString = oldString.slice(indexOf + 1);
    if (oldString.slice(0, 7) !== "</span>" && oldString[0] !== "/" && oldString[0] !== '"') {
      newString += `<span class="red-suit">${suit}</span>`;
    } else {
      newString += suit;
    }
    indexOf = oldString.indexOf(suit);
  }
  if (newString === "") return oldString;
  return newString + oldString;
};

const prepareArticleStringForSave = (html) => {
  const parts = html.split(/(<MakeBoard[^>]*\/>)/);
  return parts
    .map((p) => (p.includes("MakeBoard") ? p : iterativelyReplace(iterativelyReplace(p, "♥"), "♦")))
    .join("");
};

const FOUR_LEVEL_OLD = `<h2>The 4 level and higher, often we leave in a "takeout" double.</h2>
<p></p>

<h2>After partner's takeout double - Cue bidding the enemy's suit</h2>`;

const FOUR_LEVEL_NEW = `<h2>The 4 level and higher, often we leave in a "takeout" double.</h2>
<p>In the majority of cases we leave in the double on the 4 level, rather than try to make our own contract on the 5 level, for example</p>
<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-2*H-KQ102*D-AJ43*C-K942" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="West" bidding="_/1♠/X/4♠/X/P/?" /></p>
<p>This double by partner does not show a stack of spades, it shows a good hand. The opponent's likely have a 9-10 card fit. Partner is saying, I have a good hand, we can bid on if you like, or we can defend.</p>
<blockquote><p>When the opponents have a fit, we do not double to show a stack of the opponent's trumps</p></blockquote>
<p>What type of hand would take the double out rather than play 4SX? Hands with voids in spades are good candidates. Any hand that looks somewhat normal is reasonable to pass, if our first double already just about summed up our hand, its sensible to pass 4SX.</p>
<p></p>

<h2>After partner's takeout double - Cue bidding the enemy's suit</h2>`;

/** Spelling-only replacements (clear typos; preserve author wording and style). */
const SPELLING_FIXES = [
  ["dealth", "dealt"],
  ["condiitons", "conditions"],
  ["oeffen", "often"],
  ["ooften", "often"],
  ["peanlty", "penalty"],
  ["Whent hey", "When they"],
  ["THink about it", "Think about it"],
  ["The opponent's likely have", "The opponents likely have"],
];

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

function applySpellingFixes(text) {
  let out = text;
  for (const [from, to] of SPELLING_FIXES) {
    if (from === to) continue;
    out = out.split(from).join(to);
  }
  return out;
}

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  let text = (await ref.get()).data()?.text || "";

  if (!text.includes("In the majority of cases we leave in the double on the 4 level")) {
    if (!text.includes(FOUR_LEVEL_OLD)) throw new Error("4-level target block not found.");
    text = text.replace(FOUR_LEVEL_OLD, FOUR_LEVEL_NEW);
    console.log("Inserted 4-level section.");
  } else {
    console.log("4-level section already present.");
  }

  const beforeSpell = text;
  text = applySpellingFixes(text);
  if (text !== beforeSpell) console.log("Applied spelling fixes.");

  const out = prepareArticleStringForSave(text);
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
