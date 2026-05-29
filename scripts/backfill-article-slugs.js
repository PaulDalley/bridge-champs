/**
 * Backfill short, human-readable `slug` fields on article summary docs.
 *
 * SAFE BY DEFAULT: this is a DRY RUN unless you pass --commit.
 * The slug is purely additive (a new field on the summary doc); existing
 * body-document-ID URLs keep working, so this write is reversible.
 *
 * Usage:
 *   node scripts/backfill-article-slugs.js                 # dry run, all collections
 *   node scripts/backfill-article-slugs.js --only bidding  # dry run, one summary collection
 *   node scripts/backfill-article-slugs.js --commit        # WRITE slugs (all collections)
 *   node scripts/backfill-article-slugs.js --commit --only bidding
 *   node scripts/backfill-article-slugs.js --regenerate    # also (re)slug docs that already have one
 *
 * Service account JSON (first match wins):
 *   --key <path> | env FIREBASE_SERVICE_ACCOUNT | ~/Downloads/firebase key.json |
 *   ~/Downloads/bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json | ./serviceAccountKey.json
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

// Summary collections that should receive slugs (mirrors the public, routed
// article collections used by the sitemap generator).
const SUMMARY_COLLECTIONS = [
  "cardPlay",
  "defence",
  "bidding",
  "biddingAdvanced",
  "biddingBasics",
  "counting",
  "beginnerCardPlay",
  "beginnerDefence",
  "beginnerBidding",
];

// Words dropped when shortening a title into a slug. Kept conservative so slugs
// still read sensibly.
const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "of", "to", "in", "on", "for", "with",
  "your", "you", "that", "this", "how", "what", "when", "why", "is", "are",
  "be", "at", "by", "from", "as", "it", "into", "about", "vs",
]);

const MAX_WORDS = 5;
const MAX_LEN = 60;

function baseSlugFromTitle(title) {
  const cleaned = String(title || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  if (!cleaned) return "";

  const allWords = cleaned.split(/\s+/).filter(Boolean);
  // Prefer meaningful (non-stopword) words, but keep order.
  const meaningful = allWords.filter((w) => !STOPWORDS.has(w));
  const source = meaningful.length >= 2 ? meaningful : allWords;

  let slug = source.slice(0, MAX_WORDS).join("-");
  if (slug.length > MAX_LEN) {
    slug = slug.slice(0, MAX_LEN).replace(/-+[^-]*$/, "");
  }
  return slug.replace(/^-+|-+$/g, "");
}

function isCommit() {
  return process.argv.includes("--commit");
}
function isRegenerate() {
  return process.argv.includes("--regenerate");
}

async function processCollection(db, collectionName, regenerate, existingSlugByDoc) {
  const snap = await db.collection(collectionName).get();
  const used = new Set();
  const rows = [];

  // Seed `used` with any slugs already present so we never collide with them.
  snap.docs.forEach((doc) => {
    const d = doc.data() || {};
    if (typeof d.slug === "string" && d.slug.trim()) {
      used.add(d.slug.trim());
      existingSlugByDoc[`${collectionName}/${doc.id}`] = d.slug.trim();
    }
  });

  for (const doc of snap.docs) {
    const d = doc.data() || {};
    const existing = typeof d.slug === "string" ? d.slug.trim() : "";

    if (existing && !regenerate) {
      rows.push({ id: doc.id, title: d.title || "", slug: existing, action: "keep" });
      continue;
    }

    const base = baseSlugFromTitle(d.title) || `article-${doc.id.slice(0, 6).toLowerCase()}`;

    // Ensure uniqueness within the collection. When regenerating an existing
    // doc, free up its current slug first so it can keep it if unchanged.
    if (existing) used.delete(existing);
    let candidate = base;
    let n = 2;
    while (used.has(candidate)) {
      candidate = `${base}-${n}`;
      n += 1;
    }
    used.add(candidate);

    rows.push({
      id: doc.id,
      title: d.title || "",
      slug: candidate,
      action: existing ? (existing === candidate ? "keep" : "update") : "set",
    });
  }

  return rows;
}

async function run() {
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

  const only = getArgValue("--only");
  const collections = only ? [only] : SUMMARY_COLLECTIONS;
  const commit = isCommit();
  const regenerate = isRegenerate();

  console.log(
    `Mode: ${commit ? "COMMIT (writing slugs)" : "DRY RUN (no writes)"}` +
      `${regenerate ? " | regenerate existing" : ""}`
  );
  console.log(`Collections: ${collections.join(", ")}\n`);

  let totalSet = 0;
  let totalUpdate = 0;
  let totalKeep = 0;
  const backupRecords = [];
  const existingSlugByDoc = {};

  for (const collectionName of collections) {
    let rows;
    try {
      rows = await processCollection(db, collectionName, regenerate, existingSlugByDoc);
    } catch (e) {
      console.error(`! Failed reading '${collectionName}': ${e.message}`);
      continue;
    }
    if (!rows.length) {
      console.log(`# ${collectionName}: (no docs)\n`);
      continue;
    }

    console.log(`# ${collectionName} (${rows.length} docs)`);
    rows.forEach((r) => {
      const tag = r.action === "set" ? "+" : r.action === "update" ? "~" : " ";
      console.log(`  ${tag} ${r.slug}   <-  ${r.title || "(no title)"}`);
    });
    console.log("");

    const toWrite = rows.filter((r) => r.action === "set" || r.action === "update");
    totalSet += rows.filter((r) => r.action === "set").length;
    totalUpdate += rows.filter((r) => r.action === "update").length;
    totalKeep += rows.filter((r) => r.action === "keep").length;

    if (commit && toWrite.length) {
      // Rollback safety net: record the prior state of every doc we touch
      // (including its previous slug, if any) so the change can be fully
      // reverted from this local file even without a DB backup.
      toWrite.forEach((r) => {
        const prev = rows.find((x) => x.id === r.id);
        backupRecords.push({
          collection: collectionName,
          id: r.id,
          previousSlug:
            prev && prev.action === "update"
              ? // existing slug was replaced; capture it from the live doc map
                existingSlugByDoc[`${collectionName}/${r.id}`] || null
              : null,
          newSlug: r.slug,
        });
      });

      const batchLimit = 400;
      for (let i = 0; i < toWrite.length; i += batchLimit) {
        const batch = db.batch();
        toWrite.slice(i, i + batchLimit).forEach((r) => {
          batch.update(db.collection(collectionName).doc(r.id), { slug: r.slug });
        });
        await batch.commit();
      }
      console.log(`  -> wrote ${toWrite.length} slugs to '${collectionName}'\n`);
    }
  }

  if (commit && backupRecords.length) {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.join(__dirname, "..", "docs", "slug-backfill-backups");
    fs.mkdirSync(backupDir, { recursive: true });
    const backupPath = path.join(backupDir, `slug-backfill-${stamp}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(backupRecords, null, 2), "utf8");
    console.log(`Rollback file written: ${backupPath}`);
    console.log(
      "To revert: for each record, restore previousSlug (or delete the slug field where previousSlug is null).\n"
    );
  }

  console.log(
    `Summary: ${totalSet} new, ${totalUpdate} changed, ${totalKeep} unchanged.` +
      (commit ? "" : "  (dry run — re-run with --commit to write)")
  );
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
