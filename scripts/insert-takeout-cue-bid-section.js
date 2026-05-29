/**
 * Rename 1-level heading, insert cue-bid section under After partner's takeout double.
 * Usage: node scripts/insert-takeout-cue-bid-section.js
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

const HEADING_OLD = "Takeout double on the 1 level - some specific things to know.";
const HEADING_NEW =
  "Takeout double (negative double) on the 1 level - some specific things to know.";

const CUE_OLD = `<h2>After partner's takeout double - Cue bidding the enemy's suit</h2>
<p></p>

<h2>Double Double Double rule - 2 takeout doubles, 3rd double penalty.</h2>`;

const CUE_NEW = `<h2>After partner's takeout double - Cue bidding the enemy's suit</h2>
<p>The guidelines around this rule are, it is forcing to game or till a suit has been agreed and raised. So that is not strictly game forcing. Lets look at some examples to clarify what that means.</p>
<p>This is the type of bid you make when you don't have a clear alternative. The normal conditions are</p>
<ol class="browser-default">
<li>You are strong enough for game or at least to invite</li>
<li>You don't have a clear suit to play in (so no 5 card major)</li>
<li>You want to explore the possibility of a 4-4 major fit</li>
<li>Or you don't even have a 4 card major, but you are looking for a stopper.</li>
</ol>
<Callout type="rule"><h3>In summary</h3><p>Cue bid the opponent's suit with balanced looking hands, no 5 card major, and/or no stopper in their suit</p></Callout>
<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-KQ104*H-1082*D-AK104*C-Q2" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="West" bidding="_/1♥/X/P/?" /></p>
<p>What do we bid here? Some people might choose to bid 4♠, but remember the modern takeout double does not absolutely guarantee 4 cards in the other major (subject to partnership discussion -  my recommendation is that the first takeout double does not guarantee that, although contrast that with the heading above "Takeout double on the 1 level"</p>
<p>TBC</p>
<p></p>

<h2>Double Double Double rule - 2 takeout doubles, 3rd double penalty.</h2>`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  let text = (await ref.get()).data()?.text || "";

  if (!text.includes(HEADING_NEW)) {
    if (!text.includes(HEADING_OLD)) throw new Error("1-level heading not found.");
    text = text.replace(HEADING_OLD, HEADING_NEW);
    console.log("Renamed 1-level heading.");
  } else {
    console.log("1-level heading already renamed.");
  }

  if (!text.includes("The guidelines around this rule are, it is forcing to game")) {
    if (!text.includes(CUE_OLD)) throw new Error("Cue-bid target block not found.");
    text = text.replace(CUE_OLD, CUE_NEW);
    console.log("Inserted cue-bid section.");
  } else {
    console.log("Cue-bid section already present.");
  }

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
