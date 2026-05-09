/**
 * Migrate counting article docs into declarer collections.
 *
 * Moves summary/body pairs from:
 *   counting + countingBody
 * to:
 *   cardPlay + cardPlayBody
 *
 * Usage:
 *   node scripts/migrate-counting-articles-to-declarer.js
 *   node scripts/migrate-counting-articles-to-declarer.js --apply
 *   node scripts/migrate-counting-articles-to-declarer.js --apply --key "C:\path\key.json"
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
const DRY_RUN = !process.argv.includes("--apply");

let migrated = 0;
let skipped = 0;
let failed = 0;

function shouldMigrateSummary(summaryData) {
  const contentType = String(summaryData?.contentType || "").toLowerCase();
  if (!contentType) return true; // regular article summaries usually have no contentType
  return contentType === "article";
}

async function migrateOne(summaryDoc) {
  const summary = summaryDoc.data() || {};
  const bodyId = summary.body;
  if (!bodyId || typeof bodyId !== "string") {
    skipped += 1;
    console.warn(`Skipping ${summaryDoc.id}: missing body id`);
    return;
  }

  if (!shouldMigrateSummary(summary)) {
    skipped += 1;
    console.log(`Skipping ${summaryDoc.id}: contentType=${summary.contentType}`);
    return;
  }

  const oldBodyRef = db.collection("countingBody").doc(bodyId);
  const newBodyRef = db.collection("cardPlayBody").doc(bodyId);
  const oldSummaryRef = summaryDoc.ref;
  const newSummaryRef = db.collection("cardPlay").doc(summaryDoc.id);

  const oldBodySnap = await oldBodyRef.get();
  if (!oldBodySnap.exists) {
    failed += 1;
    console.warn(`Failed ${summaryDoc.id}: missing countingBody/${bodyId}`);
    return;
  }

  const summaryPayload = {
    ...summary,
    category: "Declarer",
    migratedFrom: "counting",
    migratedAt: FieldValue.serverTimestamp(),
  };
  const bodyPayload = {
    ...oldBodySnap.data(),
    migratedFrom: "countingBody",
    migratedAt: FieldValue.serverTimestamp(),
  };

  if (DRY_RUN) {
    migrated += 1;
    return;
  }

  const batch = db.batch();
  batch.set(newSummaryRef, summaryPayload, { merge: true });
  batch.set(newBodyRef, bodyPayload, { merge: true });
  batch.delete(oldSummaryRef);
  batch.delete(oldBodyRef);

  try {
    await batch.commit();
    migrated += 1;
  } catch (err) {
    failed += 1;
    console.warn(`Failed ${summaryDoc.id}: ${err.message}`);
  }
}

async function main() {
  console.log(DRY_RUN ? "DRY RUN (no writes)." : "APPLYING migration...");
  const snap = await db.collection("counting").get();
  console.log(`Found counting summary docs: ${snap.size}`);

  for (const doc of snap.docs) {
    // eslint-disable-next-line no-await-in-loop
    await migrateOne(doc);
  }

  console.log("\n---");
  console.log(`${DRY_RUN ? "Would migrate" : "Migrated"}: ${migrated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  if (DRY_RUN) {
    console.log("\nRe-run with --apply to execute migration.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

