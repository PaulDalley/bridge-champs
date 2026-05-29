/**
 * Insert "Takeout double on the 1 level" body under its h2 in the canonical guide.
 * Usage: node scripts/insert-takeout-one-level-section.js
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

const OLD = `<h2>Takeout double on the 1 level - some specific things to know.</h2>
<p></p>

<h2>What to do if you want to penalty double but you are playing takeout doubles?</h2>`;

const NEW = `<h2>Takeout double on the 1 level - some specific things to know.</h2>
<p>There are three auctions worth discussing with your partner.</p>
<ol>
<li>1♣ (1♠) X</li>
<li>1♣ (1♥) X</li>
<li>1♣ (1♦) X</li>
</ol>
<p>My strong suggestion for how to play them is as follows</p>
<p>1♣ (1♠) X Shows typically 4 hearts, but can sometimes be 3 hearts. It is not a traditional takeout double in the sense of showing the two unbid suits, to begin with it only shows the unbid major. So for example it could be 3424 shape.</p>
<p>A hand where it may be 3 hearts for example, x KQx KQ10x 108542. Double seems like the only logical bid. To me, passing there with so many points and good shape to bid (shortage in their suit) seems quite wrong.</p>
<p>1♣ (1♥) X The standard treatment is for this to show 4 spades. Importantly, again it does not show diamonds, so it is not a traditional takeout double in the sense of showing the unbid suits. In other words, at the one level, the purpose of the takeout double is mostly to show the unbid major(s)</p>
<p><strong>3.</strong> 1♣ (1♦) X should show exactly 4 cards in both majors. I've seen a lot of people use this with a more vague meaning and it leads to bad results and ambiguity. Don't use a takeout double unless you need it, rather just bid your suits. So with a 5 card major, bid it. With only 1 4 card major, bid it. Therefore, 1♣ (1♦) 1M - shows 4+ cards in that major.</p>
<p></p>

<h2>What to do if you want to penalty double but you are playing takeout doubles?</h2>`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  if (text.includes("There are three auctions worth discussing with your partner.")) {
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
