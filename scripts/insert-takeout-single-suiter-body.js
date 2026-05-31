/**
 * Insert body copy + example board under the new
 * "Doubling with a single suiter weak hand..." heading in the canonical
 * takeout doubles guide.
 *
 * Usage: node scripts/insert-takeout-single-suiter-body.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error("Missing serviceAccountKey.json");

const CANONICAL_BODY_ID = "yt6au7gwYwPahTxQ4kd5";
const NEW_HEADING_ID = "doubling-with-a-single-suiter-weak-hand";

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

const HEADING_HTML = `<h2 id="${NEW_HEADING_ID}">Doubling with a single suiter weak hand (an exception to the normal rules)</h2>`;

const BODY_HTML = `
<p>There is a very widely adopted rule in bridge that <a href="#TODO-responders-first-bid-forcing">"Responder's first bid (of a new suit) is forcing"</a>. Sometimes as responder you find yourself with a nice suit to bid, but not enough points to force the bidding up. In this situation, a double then bidding a suit shows a weak hand (with a strong hand just bid the suit immediately, as it is forcing). A regular example</p>
<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-AQ10432*H-542*D-1043*C-2" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="1♣/2♦/?" /></p>
<p>You would love to bid 2♠, but that is forcing since "responder's first bid is forcing". 2♠ might be your best contract. It is in this context that we double and then bid spades communicating to partner "I wasn't strong enough to do a natural and forcing bid the first time, I have a weaker hand".</p>`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  let text = (await ref.get()).data()?.text || "";

  if (text.includes("There is a very widely adopted rule in bridge that")) {
    console.log("Body already inserted. Nothing to do.");
    return;
  }
  if (!text.includes(HEADING_HTML)) {
    throw new Error("New heading not found in canonical body. Run insert-takeout-single-suiter-heading.js first.");
  }

  const out = prepareArticleStringForSave(text.replace(HEADING_HTML, `${HEADING_HTML}${BODY_HTML}`));
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
