/**
 * Insert body under "Double and secondary support for partner" in the canonical takeout doubles guide.
 * Usage: node scripts/insert-takeout-secondary-support-section.js
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

const OLD = `<h2 id="double-and-secondary-support-for-partner">Double and secondary support for partner</h2>
<p></p>

<h2 id="we-already-have-a-minor-fit-should-i-double-to-try-find-a-major-fit">We already have a minor fit, should I double to try find a major fit?</h2>`;

const NEW = `<h2 id="double-and-secondary-support-for-partner">Double and secondary support for partner</h2>
<p>The takeout double, as we know, typically shows a flexible hand with 2-3 possible suits. Sometimes this can be partner's suit, lets look at an example.</p>
<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-J9*H-542*D-K1043*C-KJ82" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="_/1♠/2♥/X/P/2♠/P/P/P" /></p>
<p>The takeout double made by south didn't have the typical heart shortage, but had enough points to compete and three possible suits to play in.</p>
<Callout type="rule"><h3>In summary</h3><p>Having doubleton support for partner's 5 card suit is a good feature when making a takeout double, but not always a requirement</p></Callout>
<p></p>

<h2 id="we-already-have-a-minor-fit-should-i-double-to-try-find-a-major-fit">We already have a minor fit, should I double to try find a major fit?</h2>`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  if (text.includes("didn't have the typical heart shortage")) {
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
