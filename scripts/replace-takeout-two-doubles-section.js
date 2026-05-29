/**
 * Replace "The two doubles I recommend" section in beginner + complete guide bodies.
 * Usage: node scripts/replace-takeout-two-doubles-section.js
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
  `<h2>The two doubles I recommend</h2><p>My recommended starting point for most partnerships is to have two doubles that are takeout \u2014 both ask partner to bid:</p><ol><li><strong>The classic takeout double</strong> \u2014 made over an opponent's opening bid.</li><li><strong>The negative double</strong> \u2014 this is another name for the takeout double. It's best not to get too caught up on terminology. The main takeaway: most doubles on the 3-level or below are for takeout.</li></ol><p>As the opponents get higher \u2014 moving to the 4-level or above \u2014 contracts become more difficult to make, and doubles tend towards penalty. If you are a new partnership, a reasonable rule to make is: on the 3-level or below, doubles are for takeout. On the 4-level or higher, they become penalty.</p><p>Advanced partnerships have more involved rules that take more partnership experience and development. A clear and predictable starting point is more useful than worrying about the absolute best meaning for the bid.</p><p>Whether you call the double takeout or negative, they share the same idea: they ask partner to bid, not to defend.</p>`,
  `<h2>The two doubles I recommend</h2><p>My recommended starting point for most partnerships is to have two doubles that are takeout — both ask partner to bid:</p><ol><li><strong>The classic takeout double</strong> — made over an opponent's opening bid.</li><li><strong>The negative double</strong> — this is another name for the takeout double. It's best not to get too caught up on terminology. The main takeaway: most doubles on the 3-level or below are for takeout.</li></ol><p>As the opponents get higher — moving to the 4-level or above — contracts become more difficult to make, and doubles tend towards penalty. If you are a new partnership, a reasonable rule to make is: on the 3-level or below, doubles are for takeout. On the 4-level or higher, they become penalty.</p><p>Advanced partnerships have more involved rules that take more partnership experience and development. A clear and predictable starting point is more useful than worrying about the absolute best meaning for the bid.</p><p>Whether you call the double takeout or negative, they share the same idea: they ask partner to bid, not to defend.</p>`,
];

const NEW_SECTION =
  "<h2>The takeout Double and the Negative double</h2><p>This is just terminology, they mostly mean the same thing. Don't get caught up in the terminology.</p>";

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
