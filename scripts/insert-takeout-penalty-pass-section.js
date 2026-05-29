/**
 * Insert body under "What to do if you want to penalty double..." in canonical guide.
 * Usage: node scripts/insert-takeout-penalty-pass-section.js
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

const OLD = `<h2>What to do if you want to penalty double but you are playing takeout doubles?</h2>
<p></p>

<h2>The support double</h2>`;

const NEW = `<h2>What to do if you want to penalty double but you are playing takeout doubles?</h2>
<p>So lets say you've been dealt a hand that you would love to penalty double with, for example, suppose the hand looks like this</p>
<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-AJ983*H-K103*D-A1042*C-3" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="West" bidding="1♣/2♠/?" /></p>
<p>You would love to penalty double 2♠, but double is takeout. The modern way to handle this is to pass(!) and rely on partner to make a takeout double. You can then pass partner's takeout double.</p>
<p>Why would partner make a takeout double?</p>
<ol class="browser-default">
<li>Partner will likely have 1 spade, and at most 2, so will have the right shape for a takeout double.</li>
<li>Partnerships have to be sensitive to this situation, we know that we aren't playing with penalty doubles, so we have to make sure to contribute a takeout double in such situations with shortage, even with a minimum point count hand. So for example say partner is 1345 with 11-12 points, its still normal to double.</li>
</ol>
<p><strong>Rule - If you have a pure penalty double hand, pass and rely on your partner reopening.</strong></p>
<h3>importance of tempo:</h3>
<p>Players need to be experienced in such situations, we cannot do a long hesitation and then pass. Pass needs to be in normal tempo, say less than 5 seconds. The rules of bridge are beyond the scope of this article, but basically the summary is that if you think for a long time and then pass, your partner cannot now double.</p>
<p>Suggestion: If you think for a long time, and have such a hand, you can't do the suggested pass anymore, rather bid NT.</p>
<p></p>

<h2>The support double</h2>`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  if (text.includes("So lets say you've been dealt a hand that you would love to penalty double")) {
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
