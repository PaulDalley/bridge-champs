/**
 * Rewrite stored body-content hrefs so they point at canonical body IDs
 * instead of summary IDs.
 *
 * Background: the SEO audit found 36 articles whose internal links used the
 * SUMMARY document id rather than the BODY document id at the end of the URL.
 * The runtime resolver (categoryArticlesActions.matchBodyRefToSummaryRef)
 * papers over this for logged-in users, but every prerendered snapshot we
 * ship to Google contains the dirty href until the resolver re-renders.
 *
 * This script:
 *   1. Builds a (summaryId -> bodyId) map across every summary collection.
 *   2. Walks every body collection's `text`/`body` field looking for hrefs
 *      whose final path segment is a known SUMMARY id rather than a body id.
 *   3. Phase 1 (default, no --apply): writes a markdown report only.
 *   4. Phase 2 (--apply): writes a JSONL backup of every "before" body doc
 *      to docs/seo/href-cleanup-backup-<date>.jsonl, then patches Firestore
 *      with the rewritten body text.
 *
 * Usage:
 *   node scripts/clean-stored-hrefs.js --apply --confirm
 *   node scripts/clean-stored-hrefs.js --apply --confirm --key "C:\path\key.json"
 *
 * The DRY-RUN safety flag is `--apply`. To actually mutate Firestore you
 * must pass BOTH `--apply` (initialise) AND `--confirm` (perform writes).
 * With `--apply` alone, no Firestore writes occur — only the report.
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

const DRY_RUN_ONLY_FLAG = process.argv.includes("--apply");
const CONFIRM_WRITES = process.argv.includes("--confirm");

if (!DRY_RUN_ONLY_FLAG) {
  console.error("Refusing to run without --apply (safety flag).");
  process.exit(1);
}

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

const COLLECTIONS = [
  { summary: "cardPlay",         body: "cardPlayBody",         pathPrefix: "/declarer/articles" },
  { summary: "defence",          body: "defenceBody",          pathPrefix: "/defence/articles" },
  { summary: "bidding",          body: "biddingBody",          pathPrefix: "/bidding/advanced" },
  { summary: "biddingAdvanced",  body: "biddingAdvancedBody",  pathPrefix: "/bidding/advanced" },
  { summary: "biddingBasics",    body: "biddingBasicsBody",    pathPrefix: "/bidding/basics" },
  { summary: "counting",         body: "countingBody",         pathPrefix: "/counting/articles" },
  { summary: "beginnerCardPlay", body: "beginnerCardPlayBody", pathPrefix: "/beginner/articles/declarer" },
  { summary: "beginnerDefence",  body: "beginnerDefenceBody",  pathPrefix: "/beginner/articles/defence" },
  { summary: "beginnerBidding",  body: "beginnerBiddingBody",  pathPrefix: "/beginner/articles/bidding" },
];

function toStringSafe(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch (_) {
    return String(value);
  }
}

function extractBodyId(data) {
  const body = data && data.body;
  if (!body) return null;
  if (typeof body === "string") return body;
  if (typeof body.id === "string") return body.id;
  if (body._key && Array.isArray(body._key.path?.segments)) {
    const segs = body._key.path.segments;
    return segs[segs.length - 1] || null;
  }
  return null;
}

// Anchors we may need to rewrite. Path prefixes are intentionally ordered so
// that more-specific patterns (e.g. /beginner/articles/declarer) match before
// generic ones.
const PATH_PREFIXES_FOR_REWRITE = [
  "/beginner/articles/declarer",
  "/beginner/articles/defence",
  "/beginner/articles/bidding",
  "/declarer/articles",
  "/defence/articles",
  "/bidding/advanced",
  "/bidding/basics",
  "/counting/articles",
];

function buildHrefRegexes() {
  // Two regexes:
  //   - One for href values that match an article path (canonical hrefs).
  //   - Captures the prefix, the trailing id, and the suffix so we can rewrite
  //     just the id.
  const prefixGroup = PATH_PREFIXES_FOR_REWRITE.map((p) =>
    p.replace(/\//g, "\\/")
  ).join("|");
  // (prefix)/(id) where id is the article doc id (alnum, dash, underscore)
  // Optional suffix: trailing slash, hash, query.
  const articleHrefRe = new RegExp(
    `(href\\s*=\\s*["'])(?:https?:\\/\\/bridgechampions\\.com)?(${prefixGroup})\\/([A-Za-z0-9_-]+)([\\/#?][^"']*)?(["'])`,
    "gi"
  );
  return { articleHrefRe };
}

async function buildIdMaps() {
  // summaryIdToBody[summaryId] = { bodyId, collection summary name }
  const summaryIdToBody = new Map();
  // knownBodyIds: a Set of every body id in every body collection.
  const knownBodyIds = new Set();
  // bodyIdToCollection[bodyId] = { summary, body, pathPrefix }
  const bodyIdToCollection = new Map();

  for (const cfg of COLLECTIONS) {
    const summarySnap = await db.collection(cfg.summary).get();
    for (const doc of summarySnap.docs) {
      const bodyId = extractBodyId(doc.data() || {}) || doc.id;
      summaryIdToBody.set(doc.id, { bodyId, cfg });
    }
    const bodySnap = await db.collection(cfg.body).get();
    for (const doc of bodySnap.docs) {
      knownBodyIds.add(doc.id);
      bodyIdToCollection.set(doc.id, cfg);
    }
  }
  return { summaryIdToBody, knownBodyIds, bodyIdToCollection };
}

function rewriteHrefs({ html, summaryIdToBody, knownBodyIds, regexes }) {
  let totalMatches = 0;
  let rewrites = 0;
  const changes = []; // { from, to }
  const skipped = []; // { id, reason }

  const out = html.replace(
    regexes.articleHrefRe,
    (whole, hrefOpen, prefix, id, suffix = "", quoteClose) => {
      totalMatches++;
      if (knownBodyIds.has(id)) {
        // Already a canonical body id — leave alone.
        return whole;
      }
      const mapping = summaryIdToBody.get(id);
      if (!mapping) {
        skipped.push({
          id,
          prefix,
          reason: "id is neither a body id nor a known summary id",
        });
        return whole;
      }
      const targetBodyId = mapping.bodyId;
      if (!targetBodyId) {
        skipped.push({
          id,
          prefix,
          reason: "summary doc has no body reference",
        });
        return whole;
      }
      // For maximum consistency, also canonicalise the prefix to match the
      // body's actual collection. This protects against hrefs whose path was
      // wrong as well as id.
      const cfg = mapping.cfg;
      const correctPrefix = cfg.pathPrefix;
      const fromHref = `${prefix}/${id}${suffix || ""}`;
      const toHref = `${correctPrefix}/${targetBodyId}${suffix || ""}`;
      rewrites++;
      changes.push({ from: fromHref, to: toHref });
      return `${hrefOpen}${correctPrefix}/${targetBodyId}${suffix || ""}${quoteClose}`;
    }
  );

  return { out, totalMatches, rewrites, changes, skipped };
}

function writeReport({
  rows,
  totalDocsScanned,
  totalDocsChanged,
  totalHrefs,
  totalRewrites,
  totalSkipped,
  reportPath,
  appliedWrites,
}) {
  const lines = [];
  const today = new Date().toISOString().slice(0, 10);
  const header = appliedWrites
    ? `# Stored href cleanup — APPLIED ${today}`
    : `# Stored href cleanup — DRY RUN ${today}`;
  lines.push(header);
  lines.push("");
  lines.push(
    appliedWrites
      ? "**Firestore was modified.** A JSONL backup of every previous body text was written next to this file. To roll back, replay the backup."
      : "This is a dry run. No Firestore writes were performed. Re-run with `--apply --confirm` to mutate."
  );
  lines.push("");
  lines.push(`- Body docs scanned: **${totalDocsScanned}**`);
  lines.push(`- Body docs with hrefs needing rewrite: **${totalDocsChanged}**`);
  lines.push(`- Total article hrefs found (canonical + dirty): **${totalHrefs}**`);
  lines.push(`- Hrefs rewritten in this pass: **${totalRewrites}**`);
  lines.push(`- Hrefs skipped (unknown id): **${totalSkipped}**`);
  lines.push("");
  for (const row of rows) {
    if (!row.rewrites && !row.skipped.length) continue;
    lines.push(`## \`${row.collection.body}\` / \`${row.bodyId}\``);
    if (row.title) lines.push(`- Title: **${row.title}**`);
    lines.push(`- Hrefs in this doc: ${row.totalMatches}`);
    lines.push(`- Rewrites: ${row.rewrites}`);
    if (row.changes.length) {
      lines.push("");
      lines.push("| Before | After |");
      lines.push("|---|---|");
      for (const c of row.changes) {
        lines.push(`| \`${c.from}\` | \`${c.to}\` |`);
      }
    }
    if (row.skipped.length) {
      lines.push("");
      lines.push("### Skipped");
      lines.push("");
      lines.push("| ID | Prefix | Reason |");
      lines.push("|---|---|---|");
      for (const s of row.skipped) {
        lines.push(`| \`${s.id}\` | \`${s.prefix}\` | ${s.reason} |`);
      }
    }
    lines.push("");
  }
  fs.writeFileSync(reportPath, lines.join("\n"), "utf8");
}

async function run() {
  console.log("Reading Firestore…");
  const { summaryIdToBody, knownBodyIds, bodyIdToCollection } = await buildIdMaps();
  console.log(
    `Loaded ${summaryIdToBody.size} summary docs and ${knownBodyIds.size} body docs.`
  );

  const regexes = buildHrefRegexes();
  const today = new Date().toISOString().slice(0, 10);
  const outDir = path.join(__dirname, "..", "docs", "seo");
  fs.mkdirSync(outDir, { recursive: true });
  const reportPath = path.join(
    outDir,
    CONFIRM_WRITES
      ? `href-cleanup-applied-${today}.md`
      : `href-cleanup-dryrun-${today}.md`
  );
  const backupPath = path.join(outDir, `href-cleanup-backup-${today}.jsonl`);

  const rows = [];
  let totalDocsScanned = 0;
  let totalDocsChanged = 0;
  let totalHrefs = 0;
  let totalRewrites = 0;
  let totalSkipped = 0;

  for (const cfg of COLLECTIONS) {
    const summarySnap = await db.collection(cfg.summary).get();
    const summaryByBodyId = new Map();
    for (const doc of summarySnap.docs) {
      const data = doc.data() || {};
      const bodyId = extractBodyId(data) || doc.id;
      summaryByBodyId.set(bodyId, { id: doc.id, title: data.title || "" });
    }

    const bodySnap = await db.collection(cfg.body).get();
    for (const doc of bodySnap.docs) {
      totalDocsScanned++;
      const data = doc.data() || {};
      const { html, shape } = extractBodyHtml(data);
      if (!html) continue;
      const result = rewriteHrefs({
        html,
        summaryIdToBody,
        knownBodyIds,
        regexes,
      });
      totalHrefs += result.totalMatches;
      totalRewrites += result.rewrites;
      totalSkipped += result.skipped.length;
      if (result.rewrites > 0 || result.skipped.length > 0) {
        const meta = summaryByBodyId.get(doc.id) || {};
        rows.push({
          collection: cfg,
          bodyId: doc.id,
          title: meta.title || "",
          totalMatches: result.totalMatches,
          rewrites: result.rewrites,
          changes: result.changes,
          skipped: result.skipped,
        });
        if (result.rewrites > 0) {
          totalDocsChanged++;
          if (CONFIRM_WRITES) {
            // Append the BEFORE snapshot to the backup JSONL first.
            const backupRow = {
              when: new Date().toISOString(),
              collection: cfg.body,
              docId: doc.id,
              shape,
              originalText: html,
              changes: result.changes,
            };
            fs.appendFileSync(backupPath, JSON.stringify(backupRow) + "\n", "utf8");

            // Then write the new text back to the same field path the doc
            // originally used (preserves nested vs flat shape).
            const bodyUpdate = buildBodyUpdate(shape, result.out);
            await db
              .collection(cfg.body)
              .doc(doc.id)
              .update({
                ...bodyUpdate,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                hrefCleanupAt: new Date().toISOString(),
              });
            console.log(
              `WROTE ${cfg.body}/${doc.id} (${result.rewrites} hrefs rewritten, shape=${shape})`
            );
          }
        }
      }
    }
  }

  writeReport({
    rows,
    totalDocsScanned,
    totalDocsChanged,
    totalHrefs,
    totalRewrites,
    totalSkipped,
    reportPath,
    appliedWrites: CONFIRM_WRITES,
  });

  console.log("---");
  console.log(`Scanned ${totalDocsScanned} body docs across ${COLLECTIONS.length} collections.`);
  console.log(`Rewrites: ${totalRewrites} hrefs across ${totalDocsChanged} docs.`);
  console.log(`Skipped (unknown id): ${totalSkipped} hrefs.`);
  console.log(`Report → ${path.relative(path.join(__dirname, ".."), reportPath)}`);
  if (CONFIRM_WRITES) {
    console.log(`Backup → ${path.relative(path.join(__dirname, ".."), backupPath)}`);
  } else {
    console.log("No writes performed (add --confirm to mutate Firestore).");
  }
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error("Cleanup failed:", err);
    process.exit(1);
  }
);
