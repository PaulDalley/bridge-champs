/**
 * Insert body under "The support double" in the canonical takeout doubles guide.
 * Usage: node scripts/insert-takeout-support-double-section.js
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

const MAKEBOARD_BASE =
  'boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-K102*H-A93*D-J104*C-A1083" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="South"';

const MAKEBOARD_EX1 = `<p><MakeBoard ${MAKEBOARD_BASE} bidding="_/1♣/P/1♠/2♦/?" /></p>`;

const MAKEBOARD_EX2 = `<p><MakeBoard ${MAKEBOARD_BASE} bidding="_/1♣/P/1♥/2♠/?" /></p>`;

const OLD = `<h2>The support double</h2>
<p></p>

<h2>If they bid and raise a suit, always "takeout"</h2>`;

const NEW = `<h2>The support double</h2>
<p>This is a double that has the following characteristics</p>
<ol class="browser-default">
<li>It is a double made by the opener</li>
<li>It shows exactly 3 card support for partner</li>
<li>It is made on the 1 or 2 level (partner's suit needs to be biddable on the 2 level)</li>
<li>Two obvious condiitons - you are able to double, so there is a bid on  your right. And your partner made a bid of a suit- you are able to support something!</li>
</ol>
<p>It is fairly straight forward when you get the hang of it, here are some examples</p>
<p><strong>Example 1. - the simple support double</strong></p>
${MAKEBOARD_EX1}
<p>Here you can double, to show 3 spades. If you had 4, you would simply bid 2♠.</p>
<p>Note: Some partnerships play it as compulsory to support double, others play it shows a decent or good opening hand. Discuss with your partner.</p>
<p><strong>Example 2. can't bid the suit on the 2 level</strong></p>
${MAKEBOARD_EX2}
<p>Same hand, but different example, this time your partner bid hearts. One of the conditions of a support double is that the suit is available to bid on the 2 level. In this context you are forcing up to the 3 level.</p>
<Callout type="rule"><h3>💡 THink about it:</h3><p>a 4-3 fit on the 3 level, when partner may only have 6 points, isn't that asking for trouble?</p></Callout>
<p></p>

<h2>If they bid and raise a suit, always "takeout"</h2>`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  if (text.includes("Example 1. - the simple support double")) {
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
