/**
 * Insert Exceptions (penalty vs takeout) section body.
 * Usage: node scripts/insert-takeout-exceptions-section.js
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

const OLD = `<h2>Exceptions - when a double becomes penalty instead of takeout.</h2>
<p></p>

<h2>Double and secondary support for partner</h2>`;

const NEW = `<h2>Exceptions - when a double becomes penalty instead of takeout.</h2>
<Callout type="mistake"><h3>Warning</h3><p>these are some "standard" ideas, but always best to have a partnership discussion about it if possible).</p></Callout>
<p>This auction conveys a typical penalty double case:</p>
<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-*H-*D-*C-" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♣/1♠/P/1NT/P/2♠/X" /></p>
<p>In that auction ask yourself this question, why didn't south double 1♠? If south did not have a takeout double of 1♠, it seems impossible to now have a takeout double of 2♠. In such situations, it is normal for that to be a penalty double</p>
<p>But lets change things slightly and see how it makes a big difference</p>
<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-1042*H-3*D-KQ1032*C-J104" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♣/1♠/P/2♥/P/P/X" /></p>
<p>This has changed because its possible that south didn't want to double 1♠ because of lack of hearts, but now wants to double showing both minors.</p>
<Callout type="rule"><h3>In summary</h3><p>If a player had the chance to make a takeout double earlier showing the same suits, then the double later is penalty (see example 1). If however the number of suits has reduced, it becomes takeout - The reason a takeout double wasn't made earlier was because the player didn't have all three suits.</p></Callout>
<p></p>

<h2>Double and secondary support for partner</h2>`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  if (text.includes("why didn't south double 1")) {
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
