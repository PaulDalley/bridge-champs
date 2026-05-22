/**
 * Retitle a small batch of live articles whose titles are >70 chars (SERP
 * truncation territory) or otherwise hurt CTR. Title/teaser/metaDescription
 * only — no body rewrites. Each entry is keyed by collection + doc id so we
 * update the exact article (publish-beginner-article.js upserts by title and
 * would create a duplicate, which is why we need this dedicated script).
 *
 * Also updates the first H2 in the body to mirror the new title, matching
 * the convention used by scripts/retitle-bidding-theme-articles.js.
 *
 * Usage:
 *   node scripts/retitle-cluster-cleanup-2026-05-17.js              # dry-run
 *   node scripts/retitle-cluster-cleanup-2026-05-17.js --apply      # confirm
 *
 * Service account JSON is resolved the same way as other scripts in this dir.
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { extractBodyHtml, buildBodyUpdate } = require("./lib/body-field");

function getArgValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return null;
  const v = process.argv[i + 1];
  if (!v || v.startsWith("-")) return null;
  return v;
}

function resolveServiceAccountPath() {
  const fromFlag = getArgValue("--key");
  if (fromFlag) return path.resolve(fromFlag);
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
  const downloadsSpaced = path.join(os.homedir(), "Downloads", "firebase key.json");
  if (fs.existsSync(downloadsSpaced)) return downloadsSpaced;
  const downloadsSdk = path.join(
    os.homedir(),
    "Downloads",
    "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"
  );
  if (fs.existsSync(downloadsSdk)) return downloadsSdk;
  const root = path.join(__dirname, "..", "serviceAccountKey.json");
  if (fs.existsSync(root)) return root;
  return null;
}

const COLLECTION_TO_BODY = {
  beginnerBidding: "beginnerBiddingBody",
  beginnerCardPlay: "beginnerCardPlayBody",
  beginnerDefence: "beginnerDefenceBody",
  cardPlay: "cardPlayBody",
  defence: "defenceBody",
  bidding: "biddingBody",
  biddingAdvanced: "biddingAdvancedBody",
  biddingBasics: "biddingBasicsBody",
};

// Each entry: { collection, docId, oldTitle (informational), newTitle,
// newTeaser (optional), newMetaDescription (optional), updateBodyH1 (default true) }.
// Length checks intentionally aim under 60 chars so Google won't truncate.
const RETITLES = [
  {
    collection: "bidding",
    docId: "At7zrVNseOY1Ymtn8uzZ",
    oldTitle:
      "How to find a major-suit fit after 1NT: Stayman, Smolen, Puppet & Texas (complete guide)",
    newTitle: "Find a Major Fit After 1NT: Stayman, Smolen, Puppet, Texas",
    newTeaser:
      "The complete guide to finding a major-suit fit after partner opens 1NT — Stayman, Smolen, Puppet, and Texas.",
    newMetaDescription:
      "Complete guide to finding a major-suit fit after 1NT in bridge: Stayman, Smolen, Puppet Stayman, and Texas transfers with practical examples.",
  },
  {
    collection: "bidding",
    docId: "q8Aw4XZIKKKV9RhHhPQ9",
    oldTitle: "Transfers After 1NT: When to Use Them and When to Choose Stayman Instead",
    newTitle: "1NT Transfers vs Stayman: When to Use Each",
    newTeaser:
      "When transfers beat Stayman after partner opens 1NT — and when Stayman is still the right choice.",
    newMetaDescription:
      "Learn when to use Jacoby transfers vs Stayman after partner's 1NT opening. Clear decision rules with practical examples.",
  },
  {
    collection: "bidding",
    docId: "cA7uXxJsTo1WfsouWBI8",
    oldTitle:
      "Bidding Basics: Build a Clear Auction Plan and Treat Bidding as a Conversation",
    newTitle: "Bidding Basics: Build a Clear Auction Plan",
    newTeaser:
      "Treat bidding as a conversation: how to build a clear auction plan that partner can follow.",
    newMetaDescription:
      "Build a clear bridge auction plan: practical bidding basics, partnership conversation, and avoiding misunderstanding.",
  },
  {
    collection: "beginnerDefence",
    docId: "gPn9Nu22z0FhbTm5gM12",
    oldTitle:
      "Opening Lead Direction for Beginners: Towards Weakness or Through Strength",
    newTitle: "Opening Lead Direction: Towards Weakness or Through Strength",
    newTeaser:
      "How to pick your opening lead direction in bridge — when to attack weakness and when to lead through strength.",
    newMetaDescription:
      "Learn opening lead direction in bridge: when to lead towards weakness, when to lead through strength, and how to read dummy.",
  },
  {
    collection: "beginnerDefence",
    docId: "6I6a1xX5RpPdea4b6JY5",
    oldTitle:
      "Opening Leads for Beginners: Top of a Sequence and Longest Suit in No-Trump",
    newTitle: "Opening Leads for Beginners: Top of Sequence and Longest Suit",
    newTeaser:
      "The two safest opening leads for beginners: top of a sequence and the longest suit in no-trump.",
    newMetaDescription:
      "Learn the two safest opening leads in bridge: top of a sequence and longest suit in no-trump, with examples.",
  },
];

const APPLY = process.argv.includes("--apply");

(async function main() {
  const keyPath = resolveServiceAccountPath();
  if (!keyPath || !fs.existsSync(keyPath)) {
    console.error(
      "No service account JSON found. Use --key <path>, set FIREBASE_SERVICE_ACCOUNT, " +
        "add serviceAccountKey.json to project root, or place firebase key.json in Downloads."
    );
    process.exit(1);
  }
  const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
  admin.initializeApp({ credential: admin.credential.cert(key) });
  const db = admin.firestore();
  const FieldValue = admin.firestore.FieldValue;

  console.log(`Mode: ${APPLY ? "APPLY" : "DRY-RUN"}\n`);
  let attempted = 0;
  let applied = 0;
  for (const entry of RETITLES) {
    attempted += 1;
    const { collection, docId, oldTitle, newTitle, newTeaser, newMetaDescription } = entry;
    const bodyCollection = COLLECTION_TO_BODY[collection];
    if (!bodyCollection) {
      console.error(`  ! unknown collection "${collection}" — skipping ${docId}`);
      continue;
    }
    const summaryRef = db.collection(collection).doc(docId);
    const summarySnap = await summaryRef.get();
    if (!summarySnap.exists) {
      console.error(`  ! ${collection}/${docId} not found — skipping`);
      continue;
    }
    const summary = summarySnap.data() || {};
    const currentTitle = String(summary.title || "");
    const titleMatches = currentTitle === oldTitle;
    const bodyId = summary.body;

    console.log(`- ${collection}/${docId}`);
    console.log(`    current title : ${currentTitle}`);
    console.log(`    new title     : ${newTitle}  (${newTitle.length} chars)`);
    if (!titleMatches) {
      console.log(
        `    (warning) current title differs from expected oldTitle — applying anyway in --apply mode`
      );
    }

    if (!APPLY) continue;

    const summaryUpdate = {
      title: newTitle,
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (newTeaser) summaryUpdate.teaser = newTeaser;
    if (newMetaDescription) summaryUpdate.metaDescription = newMetaDescription;

    const batch = db.batch();
    batch.set(summaryRef, summaryUpdate, { merge: true });

    if (bodyId) {
      const bodyRef = db.collection(bodyCollection).doc(bodyId);
      const bodySnap = await bodyRef.get();
      if (bodySnap.exists) {
        const bodyData = bodySnap.data() || {};
        const { html, shape } = extractBodyHtml(bodyData);
        if (html) {
          // Only rewrite the very first <h1> in the body — leave inner H2s
          // alone so authored section structure is preserved. Many articles
          // don't start with an <h1> at all (they let the page chrome render
          // the title), in which case we just leave the body as-is.
          const nextHtml = html.replace(/<h1>[\s\S]*?<\/h1>/i, `<h1>${newTitle}</h1>`);
          if (nextHtml !== html) {
            const partial = buildBodyUpdate(shape, nextHtml);
            batch.set(
              bodyRef,
              { ...partial, updatedAt: FieldValue.serverTimestamp() },
              { merge: true }
            );
          }
        }
      }
    }

    await batch.commit();
    applied += 1;
    console.log(`    applied.`);
  }

  console.log(
    `\nDone. Attempted ${attempted}, applied ${applied}. ${
      APPLY ? "Live in Firestore." : "Dry-run only — re-run with --apply to commit."
    }`
  );
})()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
