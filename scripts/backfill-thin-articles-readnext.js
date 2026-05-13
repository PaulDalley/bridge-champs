/**
 * Backfill pass for thin articles — adds an in-body "Read next in this
 * series" block built from sibling articles' titles + teasers, in your
 * existing voice. No new prose is written. Idempotent (uses HTML markers
 * so re-running replaces the block, never duplicates it). Backs up every
 * original body before mutation.
 *
 *   - Body word-count is computed by stripping tags and counting words.
 *   - Articles already at >= MIN_WORD_THRESHOLD are skipped.
 *   - Hidden articles (isHidden: true) are skipped.
 *   - Siblings are ranked: same `subcategory` first, then same cluster
 *     by title-token overlap, then sort by ascending difficulty + artNo.
 *   - Inserts before the existing "Where to next" block if there is one;
 *     otherwise appends at the end.
 *
 * Usage:
 *   # Dry-run, beginner collections only, prints a per-article report.
 *   node scripts/backfill-thin-articles-readnext.js --collections beginner
 *
 *   # Apply changes for real (still scoped by --collections).
 *   node scripts/backfill-thin-articles-readnext.js --collections beginner --apply --confirm
 *
 *   # All thin articles across every category.
 *   node scripts/backfill-thin-articles-readnext.js --collections all
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { extractBodyHtml, buildPreservingBodyUpdate } = require("./lib/body-field");

const MIN_WORD_THRESHOLD = 600;
const SIBLINGS_TO_LINK = 4;

const ALL_COLLECTIONS = [
  // [summary collection, body collection, public path prefix, label]
  ["beginnerBidding", "beginnerBiddingBody", "/beginner/articles/bidding", "Beginner Bidding"],
  ["beginnerCardPlay", "beginnerCardPlayBody", "/beginner/articles/declarer", "Beginner Declarer"],
  ["beginnerDefence", "beginnerDefenceBody", "/beginner/articles/defence", "Beginner Defence"],
  ["beginnerCounting", "beginnerCountingBody", "/beginner/articles/counting", "Beginner Counting"],
  ["bidding", "biddingBody", "/bidding/advanced", "Bidding"],
  ["biddingBasics", "biddingBasicsBody", "/bidding/basics", "Bidding Basics"],
  ["cardPlay", "cardPlayBody", "/declarer/articles", "Declarer"],
  ["defence", "defenceBody", "/defence/articles", "Defence"],
  ["counting", "countingBody", "/counting/articles", "Counting"],
];

const BEGINNER_COLLECTION_NAMES = new Set([
  "beginnerBidding",
  "beginnerCardPlay",
  "beginnerDefence",
  "beginnerCounting",
]);

const READNEXT_OPEN_MARKER = "<!-- BACKFILL:read-next:v1 -->";
const READNEXT_CLOSE_MARKER = "<!-- /BACKFILL:read-next:v1 -->";

// CLI ---------------------------------------------------------------

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
const COLLECTIONS_ARG = getArgValue("--collections") || "beginner";

if (APPLY && !CONFIRM) {
  console.error(
    "Refusing to --apply without --confirm. Re-run with both flags after reviewing the dry-run output."
  );
  process.exit(1);
}

// Resolve which collections to scan.
const collectionsToScan = (() => {
  if (COLLECTIONS_ARG === "all") return ALL_COLLECTIONS;
  if (COLLECTIONS_ARG === "beginner")
    return ALL_COLLECTIONS.filter(([summary]) => BEGINNER_COLLECTION_NAMES.has(summary));
  // Comma-separated explicit list, e.g. "beginnerBidding,beginnerDefence"
  const wanted = COLLECTIONS_ARG.split(",").map((s) => s.trim()).filter(Boolean);
  const filtered = ALL_COLLECTIONS.filter(([summary]) => wanted.includes(summary));
  if (filtered.length === 0) {
    console.error(`Unknown --collections value: "${COLLECTIONS_ARG}".`);
    process.exit(1);
  }
  return filtered;
})();

// Firestore init ----------------------------------------------------

const keyPath = resolveServiceAccountPath();
if (!keyPath || !fs.existsSync(keyPath)) {
  console.error("No service account JSON found.");
  process.exit(1);
}
const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

// Helpers -----------------------------------------------------------

function toStringSafe(v) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return String(v);
}

function stripHtml(html) {
  return toStringSafe(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(html) {
  const text = stripHtml(html);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function htmlEscape(s) {
  return toStringSafe(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const STOP_TOKENS = new Set([
  "the","a","an","and","or","but","of","to","in","on","at","for","with","by",
  "is","are","was","were","be","been","being","this","that","these","those",
  "as","it","its","from","into","over","under","after","before","when","then",
  "you","your","we","our","i","me","my","they","their","them","he","she","his",
  "her","do","does","did","not","no","so","if","than","also","just","very","up",
  "down","out","about","one","two","three","four","five","six","seven","eight",
  "nine","ten","new","how","why","what","which","who","where","yes","let",
  "lets","using","use","used","there","here",
  "have","has","had","get","got","make","makes","made","take","takes","took",
  "find","finds","found","show","shows","showed","need","want","wanted",
  "more","most","less","least","much","many","some","any","all","each","every",
  "card","cards","hand","hands","play","plays","played","trick","tricks",
  "suit","suits","bridge","article","articles","learn","guide",
  "beginner","beginners","declarer","defence","bidding","counting","advanced",
  "basics","basic","rules","tips","start","starting","first","early","late",
  "good","better","best","right","wrong","plan","build","keep","control",
]);

function tokenise(s) {
  if (!s) return [];
  return toStringSafe(s)
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_TOKENS.has(t));
}

function pickSiblings({ allSummaries, currentBodyId, currentSummaryId, currentTitle, currentSubcat, limit }) {
  const myTokens = new Set(tokenise(currentTitle));
  const norm = (s) => toStringSafe(s).toLowerCase().trim();
  const targetSubcat = norm(currentSubcat);

  const scored = allSummaries
    .filter((a) => {
      if (!a) return false;
      if (a.summaryId === currentSummaryId) return false;
      if (a.bodyId === currentBodyId) return false;
      if (a.isHidden === true) return false;
      if (typeof a.redirectTo === "string" && a.redirectTo.startsWith("/")) return false;
      if (!a.title) return false;
      return true;
    })
    .map((a) => {
      const tokens = tokenise(a.title);
      let overlap = 0;
      for (const t of tokens) if (myTokens.has(t)) overlap++;
      const sameSub = targetSubcat && norm(a.subcategory) === targetSubcat ? 1 : 0;
      const diff = Number(a.difficulty || 1);
      const artNo = Number(a.articleNumber || 0);
      return { a, sameSub, overlap, diff, artNo };
    });

  scored.sort((x, y) => {
    if (y.sameSub !== x.sameSub) return y.sameSub - x.sameSub;
    if (y.overlap !== x.overlap) return y.overlap - x.overlap;
    if (x.diff !== y.diff) return x.diff - y.diff;
    if (x.artNo !== y.artNo) return x.artNo - y.artNo;
    return String(x.a.title).localeCompare(String(y.a.title));
  });

  return scored.slice(0, limit).map((s) => s.a);
}

function buildReadNextBlock({ siblings, pathPrefix }) {
  const items = siblings
    .map((s) => {
      const href = `${pathPrefix}/${s.bodyId}`;
      const teaser = toStringSafe(s.teaser).trim();
      const teaserHtml = teaser
        ? `<span class="readnext-teaser">${htmlEscape(
            teaser.length > 200 ? teaser.slice(0, 197) + "…" : teaser
          )}</span>`
        : "";
      return `  <li><a href="${htmlEscape(href)}"><strong>${htmlEscape(
        s.title
      )}</strong></a>${teaserHtml ? "<br/>" + teaserHtml : ""}</li>`;
    })
    .join("\n");

  return `${READNEXT_OPEN_MARKER}
<aside class="DisplayArticle-readNext" aria-label="Read next in this series">
<h3>Read next in this series</h3>
<ul>
${items}
</ul>
</aside>
${READNEXT_CLOSE_MARKER}`;
}

function applyReadNextBlock(originalHtml, blockHtml) {
  const html = toStringSafe(originalHtml);
  // Idempotent: if a previous backfill block exists, replace it.
  const open = html.indexOf(READNEXT_OPEN_MARKER);
  const close = html.indexOf(READNEXT_CLOSE_MARKER);
  if (open !== -1 && close !== -1 && close > open) {
    const before = html.slice(0, open);
    const after = html.slice(close + READNEXT_CLOSE_MARKER.length);
    return (before + blockHtml + after).trim();
  }

  // Otherwise, insert before any existing "<h3>Where to next</h3>" so the
  // hand-rolled "where to next" lists stay last; if none, append at end.
  const whereToNext = html.search(/<h3[^>]*>\s*Where to next\s*<\/h3>/i);
  if (whereToNext !== -1) {
    return (html.slice(0, whereToNext) + blockHtml + "\n" + html.slice(whereToNext)).trim();
  }
  return (html.trim() + "\n" + blockHtml).trim();
}

// Main --------------------------------------------------------------

async function loadAllSummariesForCollections(cfgs) {
  const out = {};
  for (const [summaryName] of cfgs) {
    const snap = await db.collection(summaryName).get();
    out[summaryName] = snap.docs.map((doc) => {
      const d = doc.data() || {};
      const bodyId =
        typeof d.body === "string" && d.body
          ? d.body
          : d.body && typeof d.body.id === "string"
          ? d.body.id
          : doc.id;
      return {
        summaryId: doc.id,
        bodyId,
        title: d.title || "",
        teaser: d.teaser || "",
        subcategory: d.subcategory || "",
        difficulty: d.difficulty,
        articleNumber: d.articleNumber,
        isHidden: d.isHidden === true,
        redirectTo: typeof d.redirectTo === "string" ? d.redirectTo : null,
      };
    });
  }
  return out;
}

async function run() {
  console.log(
    `Mode: ${APPLY ? "APPLY" : "DRY-RUN"} | scope: ${COLLECTIONS_ARG} | threshold: <${MIN_WORD_THRESHOLD} words`
  );
  console.log("");

  const summariesByCollection = await loadAllSummariesForCollections(collectionsToScan);

  const stats = {
    scanned: 0,
    thin: 0,
    skippedAlreadyHasBlock: 0,
    plannedUpdates: 0,
    appliedUpdates: 0,
    skippedNoSiblings: 0,
    skippedHidden: 0,
  };

  const reportLines = [];

  // For backups during apply mode.
  const today = new Date().toISOString().slice(0, 10);
  const backupPath = path.join(
    __dirname,
    "..",
    "docs",
    "seo",
    `backfill-readnext-backup-${today}.jsonl`
  );
  let backupStream = null;
  if (APPLY) {
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
    backupStream = fs.createWriteStream(backupPath, { flags: "a" });
  }

  for (const [summaryName, bodyName, pathPrefix, label] of collectionsToScan) {
    const summaries = summariesByCollection[summaryName] || [];
    reportLines.push(`\n## ${label} (${summaryName})`);
    for (const s of summaries) {
      stats.scanned++;
      if (s.isHidden) {
        stats.skippedHidden++;
        continue;
      }
      // Post-merge redirect stubs are intentionally tiny — never backfill them.
      if (typeof s.redirectTo === "string" && s.redirectTo.startsWith("/")) {
        stats.skippedHidden++;
        continue;
      }
      const bodyDoc = await db.collection(bodyName).doc(s.bodyId).get();
      if (!bodyDoc.exists) continue;
      const bodyData = bodyDoc.data() || {};
      const { html: originalHtml, shape: bodyShape } = extractBodyHtml(bodyData);
      const wc = wordCount(originalHtml);
      if (wc >= MIN_WORD_THRESHOLD) continue;
      stats.thin++;

      const siblings = pickSiblings({
        allSummaries: summaries,
        currentBodyId: s.bodyId,
        currentSummaryId: s.summaryId,
        currentTitle: s.title,
        currentSubcat: s.subcategory,
        limit: SIBLINGS_TO_LINK,
      });
      if (siblings.length === 0) {
        stats.skippedNoSiblings++;
        reportLines.push(
          `- SKIP (no siblings) — \`${pathPrefix}/${s.bodyId}\` "${s.title}" (${wc} words)`
        );
        continue;
      }

      const blockHtml = buildReadNextBlock({ siblings, pathPrefix });
      const updatedHtml = applyReadNextBlock(originalHtml, blockHtml);

      if (updatedHtml === originalHtml) {
        stats.skippedAlreadyHasBlock++;
        reportLines.push(
          `- KEEP (already current) — \`${pathPrefix}/${s.bodyId}\` "${s.title}" (${wc} words)`
        );
        continue;
      }

      const newWc = wordCount(updatedHtml);
      stats.plannedUpdates++;
      reportLines.push(
        `- UPDATE — \`${pathPrefix}/${s.bodyId}\` "${s.title}" — ${wc} → ${newWc} words; siblings: ${siblings
          .map((sib) => `"${sib.title}"`)
          .join(", ")}`
      );

      if (APPLY) {
        if (backupStream) {
          backupStream.write(
            JSON.stringify({
              ts: new Date().toISOString(),
              summaryCollection: summaryName,
              bodyCollection: bodyName,
              summaryId: s.summaryId,
              bodyId: s.bodyId,
              title: s.title,
              wordCountBefore: wc,
              bodyShape,
              originalHtml,
            }) + "\n"
          );
        }
        const bodyUpdate = buildPreservingBodyUpdate(bodyData, updatedHtml);
        await db
          .collection(bodyName)
          .doc(s.bodyId)
          .update({
            ...bodyUpdate,
            backfilledReadNextAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        stats.appliedUpdates++;
      }
    }
  }

  if (backupStream) {
    backupStream.end();
  }

  console.log("Stats:");
  console.log(JSON.stringify(stats, null, 2));
  console.log("");

  const reportFile = path.join(
    __dirname,
    "..",
    "docs",
    "seo",
    `backfill-readnext-${today}-${COLLECTIONS_ARG}.md`
  );
  fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  fs.writeFileSync(
    reportFile,
    `# Backfill report — read-next blocks (${today}, scope: ${COLLECTIONS_ARG})\n` +
      `Mode: ${APPLY ? "APPLIED" : "DRY-RUN"}\n` +
      `Threshold: <${MIN_WORD_THRESHOLD} words\n` +
      `\n` +
      "```json\n" +
      JSON.stringify(stats, null, 2) +
      "\n```\n" +
      reportLines.join("\n") +
      "\n",
    "utf8"
  );
  console.log(
    `Report → ${path.relative(path.join(__dirname, ".."), reportFile)}`
  );
  if (APPLY) {
    console.log(
      `Backup → ${path.relative(path.join(__dirname, ".."), backupPath)}`
    );
  }
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  }
);
