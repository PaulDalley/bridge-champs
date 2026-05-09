/**
 * Set isFree: true on every category article summary + body document.
 * Matches the admin "Make this article free" behaviour in DisplayCategoryArticle.
 *
 * Usage:
 *   node scripts/set-all-articles-free.js                    # dry-run (counts only, no writes)
 *   node scripts/set-all-articles-free.js --apply            # perform updates
 *   node scripts/set-all-articles-free.js --apply --key "C:\path\key.json"
 *
 * Service account JSON resolution (first match wins):
 *   1) --key <path>
 *   2) env FIREBASE_SERVICE_ACCOUNT
 *   3) %USERPROFILE%\Downloads\firebase key.json
 *   4) %USERPROFILE%\Downloads\bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json
 *   5) serviceAccountKey.json in project root (fallback)
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const os = require("os");

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

const keyPath = resolveServiceAccountPath();
if (!keyPath || !fs.existsSync(keyPath)) {
  console.error(
    "No service account JSON found. Use --key <path>, set FIREBASE_SERVICE_ACCOUNT, " +
      "add serviceAccountKey.json to the project root, or place firebase key.json in Downloads."
  );
  process.exit(1);
}

const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(key) });
console.log("Using service account file:", keyPath);

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

/** [summaryCollection, bodyCollection] — same as src/firebase/config.js */
const PAIRS = [
  ["bidding", "biddingBody"],
  ["biddingBasics", "biddingBasicsBody"],
  ["biddingAdvanced", "biddingAdvancedBody"],
  ["cardPlay", "cardPlayBody"],
  ["cardPlayBasics", "cardPlayBasicsBody"],
  ["defence", "defenceBody"],
  ["defenceBasics", "defenceBasicsBody"],
  ["counting", "countingBody"],
];

const DRY_RUN = !process.argv.includes("--apply");

let updatedPairs = 0;
let skippedNoBody = 0;
let failed = 0;

/** Body first (Firestore read rules), then summary (list UI). */
async function updateSummaryAndBody(summaryRef, bodyRef) {
  const update = { isFree: true, freeUpdatedAt: FieldValue.serverTimestamp() };
  await bodyRef.update(update);
  await summaryRef.update(update);
}

async function processPair(summaryCol, bodyCol) {
  const snap = await db.collection(summaryCol).get();

  for (const doc of snap.docs) {
    const data = doc.data() || {};
    const bodyId = data.body;
    if (!bodyId || typeof bodyId !== "string") {
      skippedNoBody += 1;
      continue;
    }

    const bodyRef = db.collection(bodyCol).doc(bodyId);

    if (DRY_RUN) {
      const bodySnap = await bodyRef.get();
      if (!bodySnap.exists) {
        console.warn(`  [${summaryCol}] ${doc.id} -> missing ${bodyCol}/${bodyId}`);
        failed += 1;
        continue;
      }
      updatedPairs += 1;
      continue;
    }

    try {
      await updateSummaryAndBody(doc.ref, bodyRef);
      updatedPairs += 1;
    } catch (e) {
      console.warn(`  [${summaryCol}] ${doc.id} -> ${bodyCol}/${bodyId}: ${e.message}`);
      failed += 1;
    }
  }
}

async function processLegacyArticles() {
  const snap = await db.collection("articles").get();

  for (const doc of snap.docs) {
    const data = doc.data() || {};
    const bodyId = data.body;
    if (!bodyId || typeof bodyId !== "string") continue;

    const bodyRef = db.collection("article").doc(bodyId);

    if (DRY_RUN) {
      const bodySnap = await bodyRef.get();
      if (!bodySnap.exists) {
        console.warn(`  [articles] ${doc.id} -> missing article/${bodyId}`);
        failed += 1;
        continue;
      }
      updatedPairs += 1;
      continue;
    }

    try {
      await updateSummaryAndBody(doc.ref, bodyRef);
      updatedPairs += 1;
    } catch (e) {
      console.warn(`  [articles] ${doc.id}: ${e.message}`);
      failed += 1;
    }
  }
}

async function main() {
  console.log(DRY_RUN ? "DRY RUN (no writes). Pass --apply to update Firestore.\n" : "APPLYING updates…\n");

  for (const [summaryCol, bodyCol] of PAIRS) {
    console.log(`Processing ${summaryCol} / ${bodyCol}…`);
    await processPair(summaryCol, bodyCol);
  }

  console.log("Processing legacy articles / article…");
  await processLegacyArticles();

  console.log("\n---");
  console.log(`${DRY_RUN ? "Would update" : "Updated"} summary+body pairs: ${updatedPairs}`);
  console.log(`Skipped (summary missing body id): ${skippedNoBody}`);
  console.log(`Warnings / failures: ${failed}`);
  if (DRY_RUN) {
    console.log("\nRe-run with: node scripts/set-all-articles-free.js --apply");
  } else {
    console.log("\nDone. Spot-check article URLs in a private browser window.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
