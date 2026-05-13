/**
 * Remove "Beginner" labelling that pollutes user-facing text:
 *
 *   1. Trailing "(Beginner Declarer)" / "(Beginner Defence)" / etc. on
 *      summary `title` and (if present) `pageTitle`. The articles already
 *      live under /beginner/articles/* so the URL identifies them; the
 *      suffix just made the H1, related-list, and read-next blocks read
 *      condescendingly.
 *   2. Same suffix at the end of the first <h1>/<h2> in the body HTML
 *      (the in-content title that some articles render).
 *   3. Inline phrasings in body HTML that singled out the reader as a
 *      "beginner" — e.g. "Core beginner example", "simple beginner view",
 *      "beginner mistakes", "clear beginner example".
 *
 * Also rewrites the "originally a separate beginner article" transition
 * line that the merge script left in place, to a neutral "originally a
 * separate article".
 *
 * Idempotent. Backs up every modified summary AND body to a JSONL file
 * before any write.
 *
 * Usage:
 *   node scripts/strip-beginner-labels.js                  # refuses
 *   node scripts/strip-beginner-labels.js --apply          # dry-run
 *   node scripts/strip-beginner-labels.js --apply --confirm
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

// All article collection pairs we will scan. We only modify text/HTML —
// IDs, slugs, paths, sitemap entries are untouched.
const COLLECTIONS = [
  ["beginnerBidding", "beginnerBiddingBody", "/beginner/articles/bidding"],
  ["beginnerCardPlay", "beginnerCardPlayBody", "/beginner/articles/declarer"],
  ["beginnerDefence", "beginnerDefenceBody", "/beginner/articles/defence"],
  ["beginnerCounting", "beginnerCountingBody", "/beginner/articles/counting"],
  ["bidding", "biddingBody", "/bidding/advanced"],
  ["biddingBasics", "biddingBasicsBody", "/bidding/basics"],
  ["cardPlay", "cardPlayBody", "/declarer/articles"],
  ["defence", "defenceBody", "/defence/articles"],
  ["counting", "countingBody", "/counting/articles"],
];

const BACKUP_PATH = path.join(
  __dirname,
  "..",
  "docs",
  "seo",
  `strip-beginner-labels-backup-${new Date().toISOString().slice(0, 10)}.jsonl`
);

function appendBackupLine(obj) {
  fs.mkdirSync(path.dirname(BACKUP_PATH), { recursive: true });
  fs.appendFileSync(BACKUP_PATH, JSON.stringify(obj) + "\n");
}

// "(Beginner Declarer)", "(Beginner Defence)", etc. — strict end-of-string
// match in plain text; a slightly looser variant is used in HTML where the
// suffix may be followed by closing tags.
const TITLE_SUFFIX_RE = /\s*[\(\[]\s*Beginner\s+(Declarer|Defence|Defense|Bidding|Counting|Card\s*Play)\s*[\)\]]\s*$/i;

function cleanTitleText(s) {
  if (typeof s !== "string") return s;
  let out = s;
  // strip multiple times in case it was double-appended
  while (TITLE_SUFFIX_RE.test(out)) out = out.replace(TITLE_SUFFIX_RE, "");
  return out.trim();
}

// Inline body phrase rewrites. These target obvious "speak down to the
// reader" phrasings without touching surrounding prose.
const BODY_REWRITES = [
  // Headings / labels
  { from: /\bCore\s+beginner\s+example\b/gi, to: "Example" },
  { from: /\bSimple\s+beginner\s+view\b/gi, to: "Simple view" },
  { from: /\bsimple\s+beginner\s+example\b/gi, to: "Simple example" },
  { from: /\bbasic\s+beginner\s+example\b/gi, to: "Basic example" },
  { from: /\bbeginner\s+example\b/gi, to: "Example" },
  { from: /\bbeginner\s+view\b/gi, to: "View" },
  { from: /\bbeginner\s+mistakes?\b/gi, to: "common mistakes" },
  { from: /\bcommon\s+beginner\s+mistakes?\b/gi, to: "common mistakes" },
  // Merge transition note we wrote earlier
  {
    from: /originally a separate beginner article on the same topic/gi,
    to: "originally a separate article on the same topic",
  },
  // Strip "(Beginner Declarer)" etc when it appears inline — e.g. in
  // backfill teasers or hand-written links — but leave URLs and
  // sluggy paths alone (they don't contain the suffix anyway).
  {
    from: /\s*\(\s*Beginner\s+(Declarer|Defence|Defense|Bidding|Counting|Card\s*Play)\s*\)/gi,
    to: "",
  },
];

// Strip the "(Beginner X)" suffix from the inner text of the FIRST h1
// or h2 in a body's HTML. Only touches the visible text inside the tag.
function stripSuffixFromFirstHeading(html) {
  if (!html) return html;
  let touched = false;
  const out = String(html).replace(
    /<(h1|h2)([^>]*)>([\s\S]*?)<\/\1>/i,
    (_m, tag, attrs, inner) => {
      const cleaned = cleanTitleText(stripTagsForTitleClean(inner));
      // We don't want to lose nested tags (e.g. <strong>), only trim the
      // suffix at the *end*. Use a regex that allows the suffix to be at
      // the very end of inner, possibly inside whitespace/closing tags.
      const stripped = inner.replace(
        /\s*[\(\[]\s*Beginner\s+(?:Declarer|Defence|Defense|Bidding|Counting|Card\s*Play)\s*[\)\]]\s*(?=(?:<\/[^>]+>\s*)*$)/i,
        ""
      );
      if (stripped !== inner) touched = true;
      return `<${tag}${attrs}>${stripped}</${tag}>`;
    }
  );
  return { html: out, touched };
}

function stripTagsForTitleClean(html) {
  return String(html).replace(/<[^>]+>/g, "").trim();
}

function applyBodyRewrites(html) {
  if (!html) return { html, touched: false, changes: [] };
  let out = String(html);
  const changes = [];
  for (const rule of BODY_REWRITES) {
    const before = out;
    out = out.replace(rule.from, rule.to);
    if (out !== before) {
      const matchCount = (before.match(rule.from) || []).length;
      changes.push({ from: rule.from.source, count: matchCount });
    }
  }
  return { html: out, touched: out !== html, changes };
}

async function processCollection(summaryName, bodyName, pathPrefix, stats) {
  const summarySnap = await db.collection(summaryName).get();
  for (const doc of summarySnap.docs) {
    stats.scanned++;
    const summary = doc.data() || {};
    const summaryUpdate = {};
    const newTitle = cleanTitleText(summary.title);
    if (typeof summary.title === "string" && newTitle !== summary.title) {
      summaryUpdate.title = newTitle;
    }
    if (typeof summary.pageTitle === "string") {
      const newPage = cleanTitleText(summary.pageTitle);
      if (newPage !== summary.pageTitle) summaryUpdate.pageTitle = newPage;
    }
    if (typeof summary.metaTitle === "string") {
      const newMeta = cleanTitleText(summary.metaTitle);
      if (newMeta !== summary.metaTitle) summaryUpdate.metaTitle = newMeta;
    }

    const bodyId =
      typeof summary.body === "string" && summary.body
        ? summary.body
        : summary.body && typeof summary.body.id === "string"
        ? summary.body.id
        : null;

    let bodyUpdate = null;
    let bodySnap = null;
    let bodyData = null;
    let oldHtml = "";
    let newHtml = "";
    let bodyChangeReport = [];
    if (bodyId) {
      bodySnap = await db.collection(bodyName).doc(bodyId).get();
      if (bodySnap.exists) {
        bodyData = bodySnap.data() || {};
        oldHtml = extractBodyHtml(bodyData).html || "";
        const headingRes = stripSuffixFromFirstHeading(oldHtml);
        const rewriteRes = applyBodyRewrites(headingRes.html);
        newHtml = rewriteRes.html;
        if (newHtml !== oldHtml) {
          bodyUpdate = buildPreservingBodyUpdate(bodyData, newHtml);
          bodyChangeReport = rewriteRes.changes;
          if (headingRes.touched) bodyChangeReport.unshift({ from: "first-heading suffix", count: 1 });
        }
      }
    }

    const willUpdateSummary = Object.keys(summaryUpdate).length > 0;
    const willUpdateBody = bodyUpdate != null;

    if (!willUpdateSummary && !willUpdateBody) continue;

    stats.updates++;
    const url = bodyId ? `${pathPrefix}/${bodyId}` : `${pathPrefix}/${doc.id}`;
    console.log(`[update] ${url}`);
    if (willUpdateSummary) {
      for (const k of Object.keys(summaryUpdate)) {
        console.log(`  summary.${k}: "${summary[k]}" → "${summaryUpdate[k]}"`);
      }
    }
    if (willUpdateBody) {
      const summary = bodyChangeReport
        .map((c) => `${c.from}×${c.count}`)
        .join(", ");
      console.log(`  body changes: ${summary}`);
    }

    if (!CONFIRM) continue;

    if (willUpdateSummary) {
      appendBackupLine({
        type: "summary",
        collection: summaryName,
        docId: doc.id,
        timestamp: new Date().toISOString(),
        summary,
      });
      summaryUpdate.updatedAt = new Date().toISOString();
      await db.collection(summaryName).doc(doc.id).update(summaryUpdate);
    }
    if (willUpdateBody) {
      appendBackupLine({
        type: "body",
        collection: bodyName,
        docId: bodyId,
        timestamp: new Date().toISOString(),
        body: bodyData,
      });
      await db.collection(bodyName).doc(bodyId).set(bodyUpdate, { merge: true });
    }
    stats.applied++;
  }
}

(async () => {
  console.log("=== strip-beginner-labels.js ===");
  console.log(`Mode: ${CONFIRM ? "WRITE (--confirm)" : "DRY RUN (no --confirm)"}`);
  console.log(`Backup file: ${BACKUP_PATH}\n`);

  const stats = { scanned: 0, updates: 0, applied: 0 };
  for (const [s, b, p] of COLLECTIONS) {
    console.log(`\n--- ${s} ---`);
    await processCollection(s, b, p, stats);
  }
  console.log("\n=== summary ===");
  console.log(stats);
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
