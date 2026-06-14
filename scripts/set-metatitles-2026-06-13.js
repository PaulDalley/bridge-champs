/**
 * Set metaTitle (the SEO <title> tag) on specific articles.
 *
 * Touches ONLY the metaTitle field — never the visible H1 (title), teaser,
 * or body. Logs current values first so the change is reversible.
 *
 * Dry-run by default; pass --apply to write.
 *   node scripts/set-metatitles-2026-06-13.js           (dry run / preview)
 *   node scripts/set-metatitles-2026-06-13.js --apply
 */
const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPathCandidates = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "firebase key.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
];
const keyPath = keyPathCandidates.find((p) => fs.existsSync(p));
if (!keyPath) throw new Error("No Firebase service account key found.");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const APPLY = process.argv.includes("--apply");

// Target each article by (summary collection, body doc id). metaTitle only.
const TARGETS = [
  {
    collection: "beginnerDefence",
    bodyId: "cAhJ5PNUpTTRFCp2y9gP",
    metaTitle: "Odd-Even Discards in Bridge: A Beginner's Guide",
  },
  {
    collection: "beginnerBidding",
    bodyId: "GXSCdpM63SxnAz9mUL6f",
    metaTitle: "Counting Combined Points in Bridge: Bid Game or Pass?",
  },
];

async function main() {
  for (const t of TARGETS) {
    const snap = await db
      .collection(t.collection)
      .where("body", "==", t.bodyId)
      .limit(1)
      .get();
    if (snap.empty) {
      console.log(`NOT FOUND: ${t.collection} body=${t.bodyId}`);
      continue;
    }
    const doc = snap.docs[0];
    const data = doc.data() || {};
    console.log("----");
    console.log(`collection : ${t.collection}  summaryId=${doc.id}  body=${t.bodyId}`);
    console.log(`H1 (title) : ${data.title}`);
    console.log(`metaTitle  : current = ${JSON.stringify(data.metaTitle || null)}`);
    console.log(`metaTitle  : new     = ${JSON.stringify(t.metaTitle)}`);
    if (APPLY) {
      await doc.ref.set(
        { metaTitle: t.metaTitle, updatedAt: FieldValue.serverTimestamp() },
        { merge: true }
      );
      console.log("APPLIED.");
    } else {
      console.log("(dry run — pass --apply to write)");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
