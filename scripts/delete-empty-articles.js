/**
 * Delete 8 empty stub articles from Firestore.
 * Usage: APPLY=1 node scripts/delete-empty-articles.js
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
if (!keyPath) {
  console.error("No Firebase service account key found.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const APPLY = process.env.APPLY === "1";

const ARTICLES_TO_DELETE = [
  { slug: "non-vulnerable-preempting-apply-maximum", collection: "bidding" },
  { slug: "bidding-conversation-share-information-efficiently", collection: "bidding" },
  { slug: "draw-trumps-purpose-avoid-autopilot", collection: "cardPlay" },
  { slug: "count-potential-losers-spot-hidden", collection: "cardPlay" },
  { slug: "finesse-double-finesse-create-extra", collection: "beginnerCardPlay" },
  { slug: "lead-towards-weakness-beginners-target", collection: "beginnerDefence" },
  { slug: "second-hand-low-beginners-exceptions", collection: "beginnerDefence" },
  { slug: "third-hand-high-beginners-win", collection: "beginnerDefence" },
];

async function deleteArticles() {
  console.log(`Deleting 8 empty article stubs (${APPLY ? "APPLY" : "DRY-RUN"})\n`);
  console.log("=".repeat(80));

  let deleted = 0;

  for (const article of ARTICLES_TO_DELETE) {
    // Find the summary doc
    const snap = await db
      .collection(article.collection)
      .where("slug", "==", article.slug)
      .limit(1)
      .get();

    if (snap.empty) {
      console.log(`⚠️  Not found: ${article.slug}`);
      continue;
    }

    const summaryDoc = snap.docs[0];
    const { title } = summaryDoc.data();

    if (APPLY) {
      await summaryDoc.ref.delete();
      console.log(`✓ Deleted: "${title}" (${article.slug})`);
      deleted++;
    } else {
      console.log(`[DRY-RUN] Would delete: "${title}" (${article.slug})`);
      deleted++;
    }
  }

  console.log("\n" + "=".repeat(80));
  if (APPLY) {
    console.log(`✓ Deleted ${deleted} articles from Firestore`);
    console.log("Next: regenerate sitemap with: node scripts/generate-sitemap.js --apply");
  } else {
    console.log(`[DRY-RUN] Would delete ${deleted} articles`);
    console.log("To apply: APPLY=1 node scripts/delete-empty-articles.js");
  }
}

deleteArticles().catch((err) => {
  console.error(err);
  process.exit(1);
});
