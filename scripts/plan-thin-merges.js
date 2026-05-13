/**
 * Read-only: for each manually-curated pair of thin beginner articles,
 * fetch both summary + body docs, classify which should be primary
 * (URL survives) vs secondary (URL gets canonical-redirected), and
 * print the proposed merged-article outline.
 *
 * Pair selection is judgment-based — don't auto-detect. The pairs below
 * were identified from the SEO audit cluster overlap analysis (each pair
 * shares a primary keyword and is significantly thin individually).
 *
 *   node scripts/plan-thin-merges.js --apply
 *
 * Output: docs/seo/thin-merges-plan-<YYYY-MM-DD>.md
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { extractBodyHtml } = require("./lib/body-field");

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
  console.error("Refusing to run without --apply (read-only flag).");
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

// Collection map: summary collection → body collection + path prefix.
const COLLECTION_INFO = {
  beginnerBidding: {
    body: "beginnerBiddingBody",
    pathPrefix: "/beginner/articles/bidding",
  },
  beginnerCardPlay: {
    body: "beginnerCardPlayBody",
    pathPrefix: "/beginner/articles/declarer",
  },
  beginnerDefence: {
    body: "beginnerDefenceBody",
    pathPrefix: "/beginner/articles/defence",
  },
};

// Manually-curated pair list. The IDs below are the BODY ids that appear
// in the article URL — the summary doc is looked up by querying for
// `body == bodyId` in the summary collection.
const PAIRS = [
  // Beginner Bidding
  {
    cluster: "1NT Opening basics",
    proposedMergedTitle: "Opening 1NT for Beginners: When to Open and When Not to",
    a: { collection: "beginnerBidding", bodyId: "0gF8pSxK8GB2bhguAqD3" }, // What it Promises
    b: { collection: "beginnerBidding", bodyId: "f4BeQ2lU5niFCt0ecmnv" }, // When Not to
  },
  {
    cluster: "Opening bids: shape decisions",
    proposedMergedTitle: "Opening Bids for Beginners: Balanced Hands and the 5-Card Major Rule",
    a: { collection: "beginnerBidding", bodyId: "tRq9HH7X05xnHb8Xk5vM" }, // Balanced Hands
    b: { collection: "beginnerBidding", bodyId: "LGe2nLZP7N7kjOW5TCL3" }, // 5-Card Major
  },
  {
    cluster: "Responder's first bid",
    proposedMergedTitle: "Responder's First Bid for Beginners: Raise, New Suit, or No-Trump",
    a: { collection: "beginnerBidding", bodyId: "rdpqzrboMvy6WBYmkUFT" }, // Raise Partner
    b: { collection: "beginnerBidding", bodyId: "CP4GjQyfwNbuvq2tNpl8" }, // New Suit / NT
  },
  {
    cluster: "Opener's rebid",
    proposedMergedTitle: "Opener's Rebid for Beginners: Choosing Suit, NT, or Strength",
    a: { collection: "beginnerBidding", bodyId: "5fUXLlFamO5mJ3toLQIu" }, // Min/Invite/Game
    b: { collection: "beginnerBidding", bodyId: "go3GF9ek5LqYpVIG5lUj" }, // 1NT or Second Suit
  },

  // Beginner Defence
  {
    cluster: "Direction of opening lead",
    proposedMergedTitle: "Opening Lead Direction for Beginners: Towards Weakness or Through Strength",
    a: { collection: "beginnerDefence", bodyId: "cz1pE4MdKTEAGpY7jPwf" }, // Through Strength
    b: { collection: "beginnerDefence", bodyId: "RLX0PHnm8aAxyoNXJwEp" }, // Towards Weakness
  },
  {
    cluster: "Third Hand High",
    proposedMergedTitle: "Third Hand High for Beginners: When to Play Your Best Card",
    a: { collection: "beginnerDefence", bodyId: "Y5xcpnE2hne3WbJph2JX" }, // Why Best Card
    b: { collection: "beginnerDefence", bodyId: "Aqr7mZBvcZqR0plKtB3Y" }, // When/Hold Up
  },
  {
    cluster: "Opening leads (NT vs trumps)",
    proposedMergedTitle: "Opening Leads for Beginners: Top of a Sequence and Longest Suit in No-Trump",
    a: { collection: "beginnerDefence", bodyId: "AjesFBfz7ew7gIXm0DLT" }, // Longest Suit NT
    b: { collection: "beginnerDefence", bodyId: "TiXM47rVH87RqmyCzQaU" }, // Top of Sequence
  },
  {
    cluster: "Second Hand Low",
    proposedMergedTitle: "Second Hand Low for Beginners: The Default and Its Exceptions",
    a: { collection: "beginnerDefence", bodyId: "NjEmZETCrS6FtvJyRp4O" }, // Why Low
    b: { collection: "beginnerDefence", bodyId: "icK5fldwl4EBZbqRV5Sm" }, // Exceptions
  },

  // Beginner Declarer
  {
    cluster: "Finesses",
    proposedMergedTitle: "Finesses for Beginners: Single, Double, and Leading Low Toward Honors",
    a: { collection: "beginnerCardPlay", bodyId: "3u1r8dH5sFpYnELlOM5l" }, // Finesse and Double
    b: { collection: "beginnerCardPlay", bodyId: "7nKvD5E5BYBrkAX1lmFS" }, // Low Towards Honors
  },
];

function stripHtml(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(html) {
  const t = stripHtml(html);
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

function extractH2H3(html) {
  const out = [];
  const re = /<(h2|h3)[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(String(html || "")))) {
    out.push({ tag: m[1].toLowerCase(), text: stripHtml(m[2]) });
  }
  return out;
}

async function fetchOne({ collection, bodyId }) {
  const cfg = COLLECTION_INFO[collection];
  if (!cfg) throw new Error(`Unknown collection ${collection}`);
  // Find the summary doc whose `body` field points at this body id.
  let summary = null;
  let summaryId = null;
  const querySnap = await db.collection(collection).where("body", "==", bodyId).get();
  if (!querySnap.empty) {
    const doc = querySnap.docs[0];
    summary = doc.data() || {};
    summaryId = doc.id;
  } else {
    // Fallback: maybe summaryId === bodyId (older articles).
    const direct = await db.collection(collection).doc(bodyId).get();
    if (direct.exists) {
      summary = direct.data() || {};
      summaryId = direct.id;
    }
  }
  if (!summary) {
    return { missing: true, bodyId, collection };
  }
  const bodySnap = await db.collection(cfg.body).doc(bodyId).get();
  const bodyData = bodySnap.exists ? bodySnap.data() || {} : {};
  const { html, shape } = extractBodyHtml(bodyData);
  return {
    collection,
    summaryId,
    bodyId,
    bodyCollection: cfg.body,
    pathPrefix: cfg.pathPrefix,
    title: summary.title || "",
    teaser: summary.teaser || "",
    primaryKeyword: summary.primaryKeyword || "",
    subcategory: summary.subcategory || "",
    isFree: summary.isFree === true,
    isHidden: summary.isHidden === true,
    bodyShape: shape,
    bodyHtml: html,
    wordCount: wordCount(html),
    chars: (html || "").length,
    headings: extractH2H3(html),
    url: `${cfg.pathPrefix}/${bodyId}`,
  };
}

// Inbound link counter — count occurrences of /<pathPrefix>/<bodyId> in
// every other body's html.
async function countInboundLinks({ url, bodyId, pathPrefix }, allBodyTexts) {
  const needles = [
    `${pathPrefix}/${bodyId}`,
    `https://bridgechampions.com${pathPrefix}/${bodyId}`,
  ];
  let count = 0;
  for (const html of allBodyTexts) {
    for (const n of needles) {
      // count non-overlapping occurrences
      let i = 0;
      while ((i = html.indexOf(n, i)) !== -1) {
        count++;
        i += n.length;
      }
    }
  }
  return count;
}

async function loadAllBodyTexts() {
  // Returns array of body html strings across all summary->body collections.
  const cols = [
    "cardPlayBody",
    "defenceBody",
    "biddingBody",
    "biddingAdvancedBody",
    "biddingBasicsBody",
    "countingBody",
    "beginnerCardPlayBody",
    "beginnerDefenceBody",
    "beginnerBiddingBody",
  ];
  const out = [];
  for (const col of cols) {
    const snap = await db.collection(col).get();
    for (const doc of snap.docs) {
      const data = doc.data() || {};
      const { html } = extractBodyHtml(data);
      if (html) out.push(html);
    }
  }
  return out;
}

function pickPrimary(a, b) {
  // Heuristics, in order:
  //   1. Higher inbound link count wins (preserves SEO equity).
  //   2. Otherwise, longer body wins.
  //   3. Otherwise, shorter title wins (likely more keyword-targeted).
  if (a.inbound !== b.inbound) return a.inbound > b.inbound ? a : b;
  if (a.wordCount !== b.wordCount) return a.wordCount > b.wordCount ? a : b;
  if (a.title.length !== b.title.length) return a.title.length < b.title.length ? a : b;
  return a;
}

async function run() {
  console.log("Loading every body html (for inbound-link counting)…");
  const allBodyTexts = await loadAllBodyTexts();
  console.log(`Loaded ${allBodyTexts.length} body docs.`);

  const today = new Date().toISOString().slice(0, 10);
  const reportPath = path.join(
    __dirname,
    "..",
    "docs",
    "seo",
    `thin-merges-plan-${today}.md`
  );

  const lines = [];
  lines.push(`# Thin-article merge plan — ${today}`);
  lines.push("");
  lines.push(
    "Read-only proposal. For each pair, the **primary** URL keeps its slug and absorbs both bodies under H2 sections; the **secondary** URL becomes a canonical-redirect stub (its summary gets `isHidden: true` and its body becomes a one-line 'this article moved →' pointer) so existing inbound links keep working but search engines consolidate ranking on the primary."
  );
  lines.push("");
  lines.push("Veto any pair before I apply by replying with the cluster name.");
  lines.push("");

  let totalBefore = 0;
  let totalAfter = 0;
  let pairIndex = 0;

  for (const pair of PAIRS) {
    pairIndex++;
    const a = await fetchOne(pair.a);
    const b = await fetchOne(pair.b);
    if (a.missing || b.missing) {
      lines.push(`## ${pairIndex}. ${pair.cluster}\n\nMissing summary doc — skipped.\n`);
      continue;
    }
    a.inbound = await countInboundLinks(a, allBodyTexts);
    b.inbound = await countInboundLinks(b, allBodyTexts);

    const primary = pickPrimary(a, b);
    const secondary = primary === a ? b : a;
    const mergedWords = a.wordCount + b.wordCount;
    totalBefore += a.wordCount + b.wordCount;
    totalAfter += mergedWords;

    lines.push(`## ${pairIndex}. ${pair.cluster}`);
    lines.push("");
    lines.push(`Proposed merged title: **${pair.proposedMergedTitle}**`);
    lines.push("");
    lines.push("| Role | URL | Title | Words | Chars | Inbound | Body shape |");
    lines.push("|---|---|---|---:|---:|---:|---|");
    lines.push(
      `| **PRIMARY (keeps URL)** | \`${primary.url}\` | ${primary.title} | ${primary.wordCount} | ${primary.chars} | ${primary.inbound} | ${primary.bodyShape} |`
    );
    lines.push(
      `| **SECONDARY (redirects)** | \`${secondary.url}\` | ${secondary.title} | ${secondary.wordCount} | ${secondary.chars} | ${secondary.inbound} | ${secondary.bodyShape} |`
    );
    lines.push("");
    lines.push(`After merge primary will hold ~${mergedWords} words.`);
    lines.push("");
    lines.push("**Primary outline (H2/H3):**");
    lines.push("");
    if (primary.headings.length === 0) lines.push("_(no headings)_");
    else
      for (const h of primary.headings) {
        lines.push(`- ${h.tag.toUpperCase()}: ${h.text}`);
      }
    lines.push("");
    lines.push("**Secondary outline (will be appended under primary):**");
    lines.push("");
    if (secondary.headings.length === 0) lines.push("_(no headings)_");
    else
      for (const h of secondary.headings) {
        lines.push(`- ${h.tag.toUpperCase()}: ${h.text}`);
      }
    lines.push("");
    lines.push("**Why this primary:** ");
    if (a.inbound !== b.inbound)
      lines.push(`- Higher inbound link count (${primary.inbound} vs ${secondary.inbound})`);
    else if (a.wordCount !== b.wordCount)
      lines.push(`- Longer body (${primary.wordCount}w vs ${secondary.wordCount}w)`);
    else
      lines.push(`- Shorter / more keyword-targeted title`);
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  lines.push(`## Summary`);
  lines.push("");
  lines.push(`- Pairs proposed: **${PAIRS.length}**`);
  lines.push(`- Articles affected: **${PAIRS.length * 2}** → **${PAIRS.length}** (one per pair)`);
  lines.push(`- Total word count of affected pages: **${totalBefore}** (unchanged after merge — same prose, fewer URLs)`);
  lines.push("");

  fs.writeFileSync(reportPath, lines.join("\n"), "utf8");
  console.log(
    `Wrote → ${path.relative(path.join(__dirname, ".."), reportPath)} (${PAIRS.length} pairs)`
  );
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error("Plan failed:", err);
    process.exit(1);
  }
);
