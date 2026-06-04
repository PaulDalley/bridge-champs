/**
 * Replace bullet-list typical hand with MakeBoard diagram in beginner + complete guide.
 * Usage: node scripts/replace-takeout-typical-hand-diagram.js
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
  `<h2>A typical takeout double hand</h2><p>Imagine the auction starts with 1 heart on your right, and you hold:</p><ul><li>4 spades</li><li>1 heart (shortage in their suit)</li><li>4 diamonds</li><li>4 clubs</li><li>12 points</li></ul><p>Singleton heart, four cards in each of the three unbid suits, decent points, no clear suit to bid on your own. This is a textbook takeout double.</p>`,
];

const NEW_SECTION = `<h2>A typical takeout double hand</h2><p>Imagine the auction starts with 1 heart on your right, and you hold:</p><p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-KQ102*H-4*D-A1084*C-K932" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="East" bidding="_/_/1♥/P/P/?" /></p><p>Singleton heart, four cards in each of the three unbid suits, decent points, no clear suit to bid on your own. This is a textbook takeout double.</p>`;

function replaceInHtml(html) {
  let out = html;
  let replaced = false;
  for (const old of OLD_VARIANTS) {
    if (out.includes(old)) {
      out = out.replace(old, NEW_SECTION);
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
  const bcb07Path = path.join(__dirname, "..", "docs", "article-payloads", "bcb-07-takeout-doubles.json");
  const bcb07 = JSON.parse(fs.readFileSync(bcb07Path, "utf8"));
  const { out, replaced } = replaceInHtml(bcb07.bodyHtml);
  if (replaced) {
    bcb07.bodyHtml = out;
    fs.writeFileSync(bcb07Path, `${JSON.stringify(bcb07, null, 2)}\n`, "utf8");
    console.log("Updated bcb-07-takeout-doubles.json");
  }

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
  }
  if (!guideSnap.empty) {
    jobs.push(patchBodyCollection("biddingBody", guideSnap.docs[0].data().body));
  }

  const results = await Promise.all(jobs);
  results.forEach((r) => console.log(JSON.stringify(r)));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
