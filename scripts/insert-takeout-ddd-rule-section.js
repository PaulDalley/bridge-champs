/**
 * Insert Double Double Double rule section body.
 * Usage: node scripts/insert-takeout-ddd-rule-section.js
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

const OLD = `<h2>Double Double Double rule - 2 takeout doubles, 3rd double penalty.</h2>
<p></p>

<h2>Exceptions - when a double becomes penalty instead of takeout.</h2>`;

const NEW = `<h2>Double Double Double rule - 2 takeout doubles, 3rd double penalty.</h2>
<p>This is a normal guideline that expert partnerships are using, the idea is that we have sufficiently catered for the "takeout" type of hand with two doubles, if we keep going with a third double, its now suggesting penalty. Often it will be that both players are reasonably balanced and reasonably strong combined, so defending is sensible.</p>
<p>What if players weren't reasonably balanced? - They might have made a bid of a suit rather than 3 doubles.</p>
<p>This should still be tempered by the idea that when the opponents bid and raise a suit, doubles are never strictly penalty (in this sense of having a big stack of the opponent's trumps). So even the third double in such context more so promises extra strength and insistence on staying in the auction, rather than a lot of the enemy's suit - in other words, it's still takeout but often will just be left in.</p>
<p>For example</p>
<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-102*H-K103*D-AK42*C-K1042" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="West" bidding="_/1♠/X/2♠/X/3♠/P/P/X" /></p>
<p>This is the type of auction where we can often expect 3♠ X to be left in, it is not strictly penalty at all, its just telling partner that we have enough force to probably beat this.</p>
<p>Another example where the opponents do not have a fit.</p>
<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-K1042*H-A10*D-1042*C-AQ94" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="West" bidding="_/1♣/X/1♥/X/2♣/P/P/X" /></p>
<p>The third double is made with the expectation that partner will often leave it in, so a requirement is to have at least some decent clubs.</p>
<p></p>

<h2>Exceptions - when a double becomes penalty instead of takeout.</h2>`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  if (text.includes("This is a normal guideline that expert partnerships are using")) {
    console.log("Already inserted.");
    return;
  }
  if (!text.includes(OLD)) throw new Error("Target block not found in canonical body.");
  const out = prepareArticleStringForSave(text.replace(OLD, NEW));
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
