/**
 * Final-publish step for the major-fit-after-1NT pillar.
 *
 *  - Removes the leftover "[STUB] " prefixes from the two H2 headings.
 *  - Renames the "Memory hook" heading to "Keep it simple" to match the
 *    rewritten content.
 *  - Flips isHidden: false so the article goes public on the next deploy.
 *
 * Usage: node scripts/publish-pillar-final.js --apply
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

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
  if (process.env.FIREBASE_SERVICE_ACCOUNT)
    return path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT);
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

if (!process.argv.includes("--apply")) {
  console.error("Refusing to run without --apply.");
  process.exit(1);
}

const keyPath = resolveServiceAccountPath();
if (!keyPath || !fs.existsSync(keyPath)) {
  console.error("No service account JSON found.");
  process.exit(1);
}
const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const SUMMARY_ID = "At7zrVNseOY1Ymtn8uzZ";
const BODY_ID = "Czs8FCV33GJN6Jtchw8o";

async function run() {
  const bodyRef = db.collection("biddingBody").doc(BODY_ID);
  const summaryRef = db.collection("bidding").doc(SUMMARY_ID);

  const bodySnap = await bodyRef.get();
  if (!bodySnap.exists) {
    throw new Error(`Body doc not found: biddingBody/${BODY_ID}`);
  }
  const bodyData = bodySnap.data() || {};
  const original = String(bodyData.text || bodyData.body || "");

  // Backup before mutating.
  const backupDir = path.join(__dirname, "..", "docs", "seo");
  fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(
    backupDir,
    `pillar-major-fit-after-1nt-pre-publish-${new Date().toISOString().slice(0, 10)}.html`
  );
  fs.writeFileSync(backupPath, original, "utf8");
  console.log(`Backed up original body -> ${path.relative(path.join(__dirname, ".."), backupPath)}`);

  let updated = original;

  // Heading 1: clean the "[STUB] " prefix off "When NOT to look for ...".
  updated = updated.replace(
    /<h2>\[STUB\]\s*When NOT to look for a major fit at all<\/h2>/i,
    "<h2>When not to look for a major fit at all</h2>"
  );

  // Heading 2: rename "[STUB] Memory hook: the four-question script" to "Keep it simple"
  // to match the rewritten content.
  updated = updated.replace(
    /<h2>\[STUB\]\s*Memory hook: the four-question script<\/h2>/i,
    "<h2>Keep it simple</h2>"
  );

  // Defensive: any other lingering [STUB] markers we missed should be reported.
  const stillStubbed = (updated.match(/\[STUB\]/g) || []).length;
  if (stillStubbed > 0) {
    console.warn(
      `WARNING: ${stillStubbed} [STUB] marker(s) still present after the rewrite. Aborting publish step so they are not shown to readers.`
    );
    process.exit(1);
  }

  if (updated === original) {
    console.warn("No textual changes were applied. Headings may already be clean. Continuing to publish step.");
  } else {
    await bodyRef.set(
      {
        text: updated,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    console.log("Body updated: stub markers cleaned.");
  }

  await summaryRef.set(
    {
      isHidden: false,
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  console.log("Summary updated: isHidden -> false (article is now public).");
  console.log("");
  console.log(`Live URL: https://bridgechampions.com/bidding/advanced/${BODY_ID}`);
  console.log(
    "It will appear in the sitemap and be prerendered on the next deploy (push any commit, or trigger the workflow manually)."
  );
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error("Publish failed:", err);
    process.exit(1);
  }
);
