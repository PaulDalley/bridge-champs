/**
 * Insert body under "We already have a minor fit, should I double to try find a major fit?"
 * Usage: node scripts/insert-takeout-minor-fit-section.js
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

const MAKEBOARD_BASE =
  'boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="West"';

const MAKEBOARD_EX1 = `<p><MakeBoard ${MAKEBOARD_BASE} South="*S-KQ104*H-42*D-A43*C-K1083" bidding="_/1♥/2♣/2♥/?" /></p>`;

const MAKEBOARD_EX2 = `<p><MakeBoard ${MAKEBOARD_BASE} South="*S-10942*H-3*D-10432*C-KQ108" bidding="_/1♥/2♣/2♥/?" /></p>`;

const OLD = `<h2 id="we-already-have-a-minor-fit-should-i-double-to-try-find-a-major-fit">We already have a minor fit, should I double to try find a major fit?</h2>
<p></p>

<h2 id="the-lightner-double-and-other-lead-directing-doubles">The Lightner double and other Lead directing doubles</h2>`;

const NEW = `<h2 id="we-already-have-a-minor-fit-should-i-double-to-try-find-a-major-fit">We already have a minor fit, should I double to try find a major fit?</h2>
<p>There are several reasons that should sway you for or against further looking for a major fit, when you already know about a minor fit. They are as follows</p>
<ol class="browser-default">
<li>Does your side potentially have enough strength for game? If you gauge that your side may likely have enough points for game, we typically would want to play in our 4-4 major fit if we have one, rather than 5 of a minor. If, it is likely the opponents who have the majority of the points, it may be more effective to just raise partner's minor.</li>
</ol>
<Callout type="rule"><h3>In summary</h3><p>If you already have a minor fit, just raise it with a weakish hand, with a strong hand you may decide to search for a major fit.</p></Callout>
<p>Let's consider the same auction, with two different hands</p>
<p><strong>1.</strong></p>
${MAKEBOARD_EX1}
<p>Here it looks like your side has the majority of points and potentially have a 4♠ contract on, double seems like a good idea to indicate that you have 4 spades.</p>
<p><strong>2.</strong></p>
${MAKEBOARD_EX2}
<p>Here you do not have many points, and it is best to just communicate your big club fit, and reasonably useful hand. A bid of 4♣ as a preemptive / distributional raise sums your hand up nicely (showing the 4th card support is important), perhaps partner will bid 5♣ on the correct occasions. (If you had a bigger point count hand perhaps you could've started with 3<span class="red-suit">♥</span> cue bidding their suit).</p>
<p></p>

<h2 id="the-lightner-double-and-other-lead-directing-doubles">The Lightner double and other Lead directing doubles</h2>`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  if (text.includes("Let's consider the same auction, with two different hands")) {
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
