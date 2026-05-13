/**
 * Soft-delete ("kill") a small list of empty-stub articles.
 *
 * For each kill target:
 *   1. Set isHidden: true on the summary doc so it disappears from the
 *      sitemap, related articles, category list, and shows the
 *      "Article not available" page in DisplayCategoryArticle.
 *   2. Replace the body HTML with a minimal "this article was removed"
 *      stub (admins can still see what was there via the JSONL backup).
 *   3. Stamp killedAt + killReason on the summary for forensics.
 *
 * Backups: the prior summary AND prior body for every target are
 * appended to docs/seo/thin-kills-backup-<date>.jsonl BEFORE any write.
 *
 * Idempotent: re-running detects already-killed targets (isHidden &&
 * killedAt set) and skips them.
 *
 * Usage:
 *   node scripts/apply-thin-kills.js                       # refuses to run
 *   node scripts/apply-thin-kills.js --apply               # dry-run sanity
 *   node scripts/apply-thin-kills.js --apply --confirm     # actually write
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { extractBodyHtml, buildPreservingBodyUpdate } = require("./lib/body-field");

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

const APPLY = process.argv.includes("--apply");
const CONFIRM = process.argv.includes("--confirm");

if (!APPLY) {
  console.error("Refusing to run without --apply. Add --confirm to actually write.");
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

const COLLECTION_INFO = {
  cardPlay: { body: "cardPlayBody", pathPrefix: "/declarer/articles" },
  defence: { body: "defenceBody", pathPrefix: "/defence/articles" },
};

// Soft-deletes. The article URL still resolves but renders the
// "not available" placeholder, and the article is excluded from
// sitemap, related, and category lists.
const KILLS = [
  {
    collection: "cardPlay",
    bodyId: "YLW3xY7yanLHJluTBzQ6", // Understand Fourth-Highest Leads (32w)
    reason: "Empty stub never filled in. 32 words. Out-of-place title in declarer category.",
  },
  {
    collection: "defence",
    bodyId: "WDLoYpVimberYvKMA7iN", // Count Trumps in Defence (31w)
    reason: "Empty stub never filled in. 31 words.",
  },
  {
    collection: "defence",
    bodyId: "mMr7w3Alb8ORS8CPMWnE", // Danger Hand Awareness (237w)
    reason: "Underdeveloped, awkward title, low utility for learners.",
  },
];

const BACKUP_PATH = path.join(
  __dirname,
  "..",
  "docs",
  "seo",
  `thin-kills-backup-${new Date().toISOString().slice(0, 10)}.jsonl`
);

function appendBackupLine(obj) {
  fs.mkdirSync(path.dirname(BACKUP_PATH), { recursive: true });
  fs.appendFileSync(BACKUP_PATH, JSON.stringify(obj) + "\n");
}

function findSummaryDocByBodyId(collection, bodyId) {
  return db
    .collection(collection)
    .where("body", "==", bodyId)
    .get()
    .then(async (qs) => {
      if (!qs.empty) return qs.docs[0];
      const direct = await db.collection(collection).doc(bodyId).get();
      if (direct.exists) return direct;
      return null;
    });
}

async function fetchOne({ collection, bodyId }) {
  const cfg = COLLECTION_INFO[collection];
  const summaryDoc = await findSummaryDocByBodyId(collection, bodyId);
  if (!summaryDoc) return { missing: true, bodyId, collection };
  const summary = summaryDoc.data() || {};
  const bodySnap = await db.collection(cfg.body).doc(bodyId).get();
  const bodyData = bodySnap.exists ? bodySnap.data() || {} : {};
  const { html, shape } = extractBodyHtml(bodyData);
  return {
    collection,
    bodyCollection: cfg.body,
    pathPrefix: cfg.pathPrefix,
    summaryId: summaryDoc.id,
    bodyId,
    summary,
    bodyData,
    bodyHtml: html,
    bodyShape: shape,
    url: `${cfg.pathPrefix}/${bodyId}`,
  };
}

function buildKillStubHtml(originalTitle) {
  const safeTitle = String(originalTitle || "this article").replace(/</g, "&lt;");
  return [
    "<p>This article has been retired.</p>",
    `<p>The original page (\"${safeTitle}\") was a short stub that has been removed in favour of fuller articles in the same area. Please use the navigation to find the topic you were looking for.</p>`,
  ].join("\n");
}

async function processKill(target, idx) {
  const data = await fetchOne(target);
  if (!data || data.missing) {
    console.log(`[kill ${idx + 1}] MISSING: ${target.collection}/${target.bodyId}`);
    return { status: "missing", target };
  }

  const alreadyKilled =
    data.summary.isHidden === true && data.summary.killedAt != null;
  if (alreadyKilled) {
    console.log(`[kill ${idx + 1}] already killed → ${data.url}  (skip)`);
    return { status: "skipped", target, data };
  }

  console.log(
    `[kill ${idx + 1}] ${data.url}  (title: ${data.summary.title || "(none)"}, shape: ${data.bodyShape})`
  );

  if (!CONFIRM) {
    console.log(`  DRY RUN — would set isHidden:true, replace body with stub`);
    return { status: "dry-run", target, data };
  }

  // Backup BEFORE any write.
  appendBackupLine({
    type: "summary",
    collection: data.collection,
    docId: data.summaryId,
    timestamp: new Date().toISOString(),
    summary: data.summary,
  });
  appendBackupLine({
    type: "body",
    collection: data.bodyCollection,
    docId: data.bodyId,
    timestamp: new Date().toISOString(),
    body: data.bodyData,
  });

  // Update summary: hide, stamp kill reason.
  await db.collection(data.collection).doc(data.summaryId).update({
    isHidden: true,
    killedAt: new Date().toISOString(),
    killReason: target.reason || "Removed: thin/low-value content.",
    updatedAt: new Date().toISOString(),
  });

  // Replace body with stub, preserving whichever shape the doc was
  // already using (and mirroring to body.text if it was a double-shape).
  const stubHtml = buildKillStubHtml(data.summary.title);
  const update = buildPreservingBodyUpdate(data.bodyData, stubHtml);
  await db.collection(data.bodyCollection).doc(data.bodyId).set(update, { merge: true });

  console.log(`  KILLED → ${data.url}`);
  return { status: "applied", target, data };
}

(async () => {
  console.log("=== apply-thin-kills.js ===");
  console.log(`Mode: ${CONFIRM ? "WRITE (--confirm)" : "DRY RUN (no --confirm)"}`);
  console.log(`Backup file: ${BACKUP_PATH}\n`);

  const results = [];
  for (let i = 0; i < KILLS.length; i++) {
    const r = await processKill(KILLS[i], i);
    results.push(r);
    console.log("");
  }

  console.log("=== summary ===");
  const counts = results.reduce((m, r) => {
    m[r.status] = (m[r.status] || 0) + 1;
    return m;
  }, {});
  console.log(counts);

  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
