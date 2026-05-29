/**
 * Replace "What is a takeout double?" paragraph in beginner + complete guide bodies.
 * Usage: node scripts/replace-takeout-double-definition-paragraph.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPathCandidates = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
];
const keyPath = keyPathCandidates.find((p) => fs.existsSync(p));
if (!keyPath) throw new Error("No Firebase service account key found.");

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const OLD_VARIANTS = [
  `<p>A takeout double is a double that asks partner to choose a suit, rather than punishing the opponents. When you make one, you are saying: \u201cPartner, I have a reasonable hand and support for the suits we haven't yet bid. Please pick one and let's compete.\u201d</p><p>It usually happens after an opponent has opened the bidding. You \u201cdouble\u201d their suit, but you mean \u201ctake it out into another suit.\u201d</p>`,
  `<p>A takeout double is a double that asks partner to choose a suit, rather than punishing the opponents. When you make one, you are saying: “Partner, I have a reasonable hand and support for the suits we haven't yet bid. Please pick one and let's compete.”</p><p>It usually happens after an opponent has opened the bidding. You “double” their suit, but you mean “take it out into another suit.”</p>`,
];

const NEW_PARAGRAPH =
  "<p>A takeout double typically shows some strength, depending on the context. It also shows length in the other suits. It is typically a flexible hand, that is typically balanced'ish, ofteen 4432, 4441, 4333, or 5332. It is not typically a very distributional hand with 6 card suits, or two 5 card suits. Even one 5 card major is often reason to avoid the takeout double and rather bid naturally.</p>";

function replaceInHtml(html) {
  let out = html;
  let replaced = false;
  for (const old of OLD_VARIANTS) {
    if (out.includes(old)) {
      out = out.replace(old, NEW_PARAGRAPH);
      replaced = true;
    }
  }
  return { out, replaced };
}

async function patchBodyCollection(collectionName, bodyId) {
  const ref = db.collection(collectionName).doc(bodyId);
  const snap = await ref.get();
  if (!snap.exists) return { collectionName, bodyId, ok: false, reason: "missing" };

  const data = snap.data() || {};
  const text = data.text || data.body?.text || "";
  const { out, replaced } = replaceInHtml(text);
  if (!replaced) return { collectionName, bodyId, ok: false, reason: "pattern not found" };

  await ref.set(
    {
      text: out,
      body: { text: out },
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  return { collectionName, bodyId, ok: true };
}

async function main() {
  const beginnerSnap = await db
    .collection("beginnerBidding")
    .where("title", "==", "Takeout Doubles in Bridge: A Beginner's Guide to Asking Partner to Bid")
    .limit(1)
    .get();

  const guideSnap = await db
    .collection("bidding")
    .where("title", "==", "[Work in progress] Takeout Doubles in Bridge: Complete Guide")
    .limit(1)
    .get();

  const jobs = [];

  if (!beginnerSnap.empty) {
    jobs.push(patchBodyCollection("beginnerBiddingBody", beginnerSnap.docs[0].data().body));
  } else {
    console.warn("Beginner summary not found");
  }

  if (!guideSnap.empty) {
    jobs.push(patchBodyCollection("biddingBody", guideSnap.docs[0].data().body));
  } else {
    console.warn("Complete guide summary not found");
  }

  const results = await Promise.all(jobs);
  results.forEach((r) => console.log(JSON.stringify(r)));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
