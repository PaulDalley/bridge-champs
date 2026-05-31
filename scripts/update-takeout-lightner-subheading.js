/**
 * Continue Lightner section with "Lightner" subheading and examples.
 * Usage: node scripts/update-takeout-lightner-subheading.js
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

const INSERT_BLOCK = `<h3>Lightner</h3>
<p>The Lightner Double is a well known idea, it says to partner "I have a void, please try find it". The traditional wisdom is to basically just look at your longest suit, as that is most likely the void, and lead that. If the player bid a suit during the auction, it also asks NOT to lead that (as you almost certainly would've led that without the double - the double asks for an unusual lead).</p>
<p>For example</p>
<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-54*H-J97542*D-J103*C-42" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="East" bidding="_/_/1♠/P/3♠/P/4NT/P/5♠/P/6♠/P/P/X/P/P/P" /></p>
<p>You are on lead, a heart lead stands out. Partner intends to defeat the contract after ruffing the opening lead.</p>
<p>Example 2.</p>
<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-54*H-J97542*D-J103*C-42" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="East" bidding="_/_/1♠/P/3♠/4♣/4NT/P/5♠/P/6♠/P/P/X/P/P/P" /></p>
<p>Same idea, except without the double you surely would've led a club (partner's suit), the double is asking for an unusual lead, not a club lead!</p>`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";

  if (text.includes("<h3>Lightner</h3>")) {
    console.log("Already updated.");
    return;
  }

  const lightnerStart = text.indexOf('<h2 id="the-lightner-double-and-other-lead-directing-doubles">');
  if (lightnerStart === -1) throw new Error("Lightner heading not found.");
  const nextHeading = text.indexOf('<h2 id="doubling-with-a-strong-hand-and-atypical-shape">', lightnerStart);
  if (nextHeading === -1) throw new Error("Next heading not found.");

  const before = text.slice(0, nextHeading);
  const after = text.slice(nextHeading);
  const out = prepareArticleStringForSave(`${before}${INSERT_BLOCK}\n<p></p>\n\n${after}`);

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
