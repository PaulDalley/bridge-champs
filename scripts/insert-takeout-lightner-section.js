/**
 * Insert body under "The Lightner double and other Lead directing doubles"
 * in the canonical takeout doubles guide.
 * Usage: node scripts/insert-takeout-lightner-section.js
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

const OLD = `<h2 id="the-lightner-double-and-other-lead-directing-doubles">The Lightner double and other Lead directing doubles</h2>
<p></p>



<h2 id="doubling-with-a-strong-hand-and-atypical-shape">Doubling with a strong hand and atypical shape</h2>`;

const NEW = `<h2 id="the-lightner-double-and-other-lead-directing-doubles">The Lightner double and other Lead directing doubles</h2>
<p>A modern bridge idea around doubling games and slams is as follows. When the opponents bid game or slam freely, we assume they are sensible and have likely chances to make it (so we are not talking about sacrifices). Therefore, there is no real place for the penalty double. A more useful and frequent usage of the double is to say that you want an unusual lead.</p>
<p>Take this example, Final of the National Open Teams Canberrra, 2026 4th Stanza, where the double was used to spectacular effect.</p>
<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-AKJ2*H-AJ854*D-63*C-64" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="West" bidding="P/P/1♦/1♥/1NT/P/3NT/X/P/P/P" /></p>
<p>The expert North (the partnership is a long standing one where these auctions had been discussed) worked out to lead a spade, the full hand was as follows.</p>
<p><MakeBoard boardType="full" position="full" North="*S-7643*H-92*D-75*C-K9732" East="*S-Q109*H-Q3*D-AKQ42*C-A108" South="*S-AKJ2*H-AJ854*D-63*C-64" West="*S-85*H-K1076*D-J1098*C-QJ5" vuln="Nil Vul" dealer="West" bidding="P/P/1♦/1♥/1NT/P/3NT/X/P/P/P" /></p>
<h3>Lightner</h3>
<p>The Lightner Double is a well known idea, it says to partner "I have a void, please try find it". The traditional wisdom is to basically just look at your longest suit, as that is most likely the void, and lead that. If the player bid a suit during the auction, it also asks NOT to lead that (as you almost certainly would've led that without the double - the double asks for an unusual lead).</p>
<p>For example</p>
<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-54*H-J97542*D-J103*C-42" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="East" bidding="_/_/1♠/P/3♠/P/4NT/P/5♠/P/6♠/P/P/X/P/P/P" /></p>
<p>You are on lead, a heart lead stands out. Partner intends to defeat the contract after ruffing the opening lead.</p>
<p>Example 2.</p>
<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-54*H-J97542*D-J103*C-42" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="East" bidding="_/_/1♠/P/3♠/4♣/4NT/P/5♠/P/6♠/P/P/X/P/P/P" /></p>
<p>Same idea, except without the double you surely would've led a club (partner's suit), the double is asking for an unusual lead, not a club lead!</p>
<p></p>

<h2 id="doubling-with-a-strong-hand-and-atypical-shape">Doubling with a strong hand and atypical shape</h2>`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  if (text.includes("A modern bridge idea around doubling games and slams is as follows.")) {
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
