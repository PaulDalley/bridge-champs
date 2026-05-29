/**
 * Batch content edits for takeout double articles (beginner + complete guide).
 * Usage: node scripts/replace-takeout-batch-edits.js
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

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const REPLACEMENTS = [
  {
    old: `<p>A takeout double typically shows some strength, depending on the context. It also shows length in the other suits. It is typically a flexible hand, that is typically balanced'ish, ofteen 4432, 4441, 4333, or 5332. It is not typically a very distributional hand with 6 card suits, or two 5 card suits. Even one 5 card major is often reason to avoid the takeout double and rather bid naturally.</p>`,
    new: `<p>A takeout double typically shows some strength, depending on the context. It also shows length in the other suits. It is typically a flexible hand, that is typically balanced'ish, ofteen 4432, 4441, 4333, or 5332.</p><p>It is not typically a very distributional hand with 6 card suits, or two 5 card suits. Even one 5 card major is often reason to avoid the takeout double and rather bid naturally.</p>`,
  },
  {
    old: `<p>This is just terminology, they mostly mean the same thing. Don't get caught up in the terminology.</p>`,
    new: `<p>This is just terminology, they mostly mean the same thing. Don't get caught up in the terminology. Perhaps some people associate the negative double with responder to an opening bid, and the takeout double when your side makes a takeout double over the opponent's opening bid. Anyway, typically these days we just say takeout double as an umbrella term.</p>`,
  },
  {
    old: `<p>Don't overuse a double when you have a simple bid of your own. When in doubt, bid your longest suit — don't double.</p>`,
    new: `<p>Don't overuse a double when you have a simple bid of your own. When in doubt, bid your longest suit, especially when you have a 5+ card major — normally bid naturally rather than double.</p>`,
  },
  {
    old: `<p>Don't use doubles when you already have a fit with partner. Just raise to the appropriate level. Doubles are exploring tools — if the search is over, use a different bid.</p>`,
    new: `<p>Don't use doubles when you already have a fit with partner. Just raise to the appropriate level.</p>`,
  },
  {
    old: `<p>0, 1 or 2 cards in their suit is the classic takeout-double shape. With a shortage, often you do not want to be defending their contract — you want to compete and find your own.</p>`,
    new: `<p>0, 1 or 2 cards in their suit is the classic takeout-double shape. The less you have in their suit, the less effective your hand will typically be on defence, and the more effective your hand will be if your side declares, so basically a double reason to get in there and compete with a takeout double.</p>`,
  },
  {
    old: `<ul><li>bid their longest unbid suit, even with very few points,</li><li>jump in a suit with a stronger hand,</li><li>pass only if they can punish opponents with great trumps in the doubled suit (rare).</li></ul>`,
    new: `<ul><li>bid their longest unbid suit, even with very few points,</li><li>jump in a suit with a stronger hand,</li><li>pass only if they can punish opponents with great trumps in the doubled suit (rare).</li><li>Cue bid the opponent's suit, with strength but no 5+ card major. More on this later.</li></ul>`,
  },
  {
    old: `<h2>Common takeout double mistakes</h2><ul><li>Doubling because you don't know what else to do. Doubles need a shape and a plan.</li><li>Doubling with length in the opponents' suit. If you have 4+ of their suit, you don't want partner bidding — you want to defend.</li><li>Doubling when partner has already shown a suit you fit. Raise partner instead.</li><li>Doubling when you really should just pass.</li></ul>`,
    new: `<h2>Common takeout double mistakes</h2><ol><li>Doubling because you don't know what else to do. Doubles need a shape and a plan.</li><li>Doubling with length in the opponents' suit. Typically with 3-4 in their suit, its less attractive to double (there are exceptions, particularly when they have bid two suits, you can't expect to be short in both suits!)</li><li>Doubling when partner has already shown a suit you fit. Raise partner instead.</li><li>Doubling when you really should just pass.</li></ol>`,
  },
];

function applyAll(html) {
  let out = html;
  const applied = [];
  const missed = [];
  for (const { old, new: replacement } of REPLACEMENTS) {
    if (out.includes(old)) {
      out = out.replace(old, replacement);
      applied.push(old.slice(0, 48) + "…");
    } else {
      missed.push(old.slice(0, 48) + "…");
    }
  }
  return { out, applied, missed };
}

async function patchBody(collectionName, bodyId, html) {
  await db
    .collection(collectionName)
    .doc(bodyId)
    .set(
      {
        text: html,
        body: { text: html },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
}

async function main() {
  const bcb07Path = path.join(__dirname, "..", "docs", "article-payloads", "bcb-07-takeout-doubles.json");
  const bcb07 = JSON.parse(fs.readFileSync(bcb07Path, "utf8"));
  const { out, applied, missed } = applyAll(bcb07.bodyHtml);
  bcb07.bodyHtml = out;
  fs.writeFileSync(bcb07Path, `${JSON.stringify(bcb07, null, 2)}\n`, "utf8");
  console.log("bcb-07 applied:", applied.length, "missed:", missed.length);
  if (missed.length) console.warn("Missed in payload:", missed);

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

  for (const [label, snap, col] of [
    ["beginner", beginnerSnap, "beginnerBiddingBody"],
    ["guide", guideSnap, "biddingBody"],
  ]) {
    if (snap.empty) {
      console.warn(`${label}: summary not found`);
      continue;
    }
    const bodyId = snap.docs[0].data().body;
    const text = (await db.collection(col).doc(bodyId).get()).data()?.text || "";
    const result = applyAll(text);
    if (result.missed.length) {
      console.warn(`${label} missed:`, result.missed);
    }
    await patchBody(col, bodyId, result.out);
    console.log(JSON.stringify({ label, bodyId, applied: result.applied.length, ok: result.missed.length === 0 }));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
