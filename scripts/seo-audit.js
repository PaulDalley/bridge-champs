/**
 * READ-ONLY SEO audit of every published article.
 *
 * Pulls summary + body documents from Firestore, measures content depth,
 * detects thin/orphan/lonely/cannibalising pages, and writes a markdown
 * audit sheet to docs/seo/article-audit-<YYYY-MM-DD>.md.
 *
 * This script writes ONLY to docs/seo/ — it does NOT mutate Firestore,
 * does NOT change article titles, and does NOT rewrite any content.
 *
 * Usage:
 *   node scripts/seo-audit.js --apply
 *   node scripts/seo-audit.js --apply --key "C:\path\key.json"
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

if (!process.argv.includes("--apply")) {
  console.error("Refusing to run without --apply (safety flag — script is still read-only).");
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

const BASE = "https://bridgechampions.com";

const COLLECTIONS = [
  { summary: "cardPlay",            body: "cardPlayBody",            pathPrefix: "/declarer/articles",        label: "Declarer (Learn)" },
  { summary: "defence",             body: "defenceBody",             pathPrefix: "/defence/articles",         label: "Defence (Learn)" },
  { summary: "bidding",             body: "biddingBody",             pathPrefix: "/bidding/advanced",         label: "Bidding (legacy)" },
  { summary: "biddingAdvanced",     body: "biddingAdvancedBody",     pathPrefix: "/bidding/advanced",         label: "Bidding Advanced" },
  { summary: "biddingBasics",       body: "biddingBasicsBody",       pathPrefix: "/bidding/basics",           label: "Bidding Basics" },
  { summary: "counting",            body: "countingBody",            pathPrefix: "/counting/articles",        label: "Counting" },
  { summary: "beginnerCardPlay",    body: "beginnerCardPlayBody",    pathPrefix: "/beginner/articles/declarer", label: "Beginner Declarer" },
  { summary: "beginnerDefence",     body: "beginnerDefenceBody",     pathPrefix: "/beginner/articles/defence",  label: "Beginner Defence" },
  { summary: "beginnerBidding",     body: "beginnerBiddingBody",     pathPrefix: "/beginner/articles/bidding",  label: "Beginner Bidding" },
];

function toDateValue(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
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

function toStringSafe(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch (_) {
    return String(value);
  }
}

function stripHtml(html) {
  if (!html) return "";
  return toStringSafe(html)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text) {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function countMatches(html, regex) {
  if (!html) return 0;
  const m = toStringSafe(html).match(regex);
  return m ? m.length : 0;
}

const TRAINER_RE =
  /\b(?:\/declarer\/practice|\/defence\/practice|\/bidding\/practice|\/counting\/practice|\/counting-trumps|practice\?difficulty=|trainer)\b/i;
const INTERNAL_LINK_RE = /href\s*=\s*["'](?:https?:\/\/bridgechampions\.com)?(\/[^"'#?]+)/gi;
const IMG_RE = /<img\b/gi;
const CARD_HOLDING_RE = /class\s*=\s*["'][^"']*(?:card-holding|playing-card|suit-row)/i;

const STOP_WORDS = new Set([
  "the","a","an","and","or","but","of","to","in","on","at","for","with","by",
  "is","are","was","were","be","been","being","this","that","these","those",
  "as","it","its","from","into","over","under","after","before","when","then",
  "you","your","we","our","i","me","my","they","their","them","he","she","his",
  "her","do","does","did","not","no","so","if","than","also","just","very","up",
  "down","out","about","one","two","three","four","five","six","seven","eight",
  "nine","ten","new","how","why","what","which","who","where","yes","let",
  "lets","using","use","used","there","here","s","t","re","ve","ll","d","m",
  "have","has","had","get","got","make","makes","made","take","takes","took",
  "find","finds","found","show","shows","showed","need","want","wanted",
  "more","most","less","least","much","many","some","any","all","each","every",
  "card","cards","hand","hands","play","plays","played","plays","trick","tricks",
  "suit","suits","bridge","article","articles","learn","guide",
  // Category words that shouldn't drive clustering
  "beginner","beginners","declarer","defence","bidding","counting","advanced",
  "basics","basic","rules","tips","tricks","simple","easy","quick","fast",
  "start","starting","first","early","late","good","better","best","right",
  "wrong","without","with","like",
  // Verbose article-cliche words
  "build","plan","keep","control","avoid","clear","read","accurate","accurately",
  "extra","early","habit","habit","habits","situations","situation","without",
  "before","after","when","why","what","how","step","steps","stepbystep",
]);

// Tokens that are so common in our title style they can't act as a cluster
// signal on their own (must combine with more-specific tokens).
const WEAK_CLUSTER_TOKENS = new Set([
  "trump","trumps","winners","winner","losers","loser","play","plays",
  "tricks","trick","auction","contract","contracts","partner","opener",
  "responder","hand","hands","cards","card",
]);

function topicTokens(title) {
  if (!title) return [];
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, " ")
    .split(/\s+/)
    .filter((t) => t && t.length > 2 && !STOP_WORDS.has(t));
}

function detectPaywallRiskLinks(bodyHtml, knownSummaryIds) {
  if (!bodyHtml || !knownSummaryIds || knownSummaryIds.size === 0) return 0;
  let count = 0;
  let m;
  const re =
    /href\s*=\s*["'](?:https?:\/\/bridgechampions\.com)?\/(?:declarer|defence|bidding(?:\/advanced|\/basics)?|counting|beginner\/articles\/(?:declarer|defence|bidding))\/articles?\/([A-Za-z0-9_-]+)/gi;
  const htmlStr = toStringSafe(bodyHtml);
  while ((m = re.exec(htmlStr)) !== null) {
    const id = m[1];
    if (knownSummaryIds.has(id)) count++;
  }
  return count;
}

async function collectAll() {
  const all = []; // each article record
  const summaryIds = new Set(); // for paywall-link detection
  const bodyIds = new Set();

  for (const cfg of COLLECTIONS) {
    const summarySnap = await db.collection(cfg.summary).get();
    for (const doc of summarySnap.docs) {
      const data = doc.data() || {};
      const bodyId = extractBodyId(data) || doc.id;
      summaryIds.add(doc.id);
      if (!bodyId) continue;

      const bodyDoc = await db.collection(cfg.body).doc(bodyId).get();
      const bodyData = bodyDoc.exists ? bodyDoc.data() || {} : {};
      const { html: bodyHtml } = extractBodyHtml(bodyData);
      const bodyExists = bodyDoc.exists && stripHtml(bodyHtml).length >= 40;

      bodyIds.add(bodyId);

      // Summary doc fields are FLAT (no metaData sub-object). The React
      // component reads title/teaser/primaryKeyword/seoSubtopic/ctaTarget
      // directly from the summary document.
      const title =
        (data.title && String(data.title).trim()) ||
        "(no title)";
      const teaser =
        (data.teaser && String(data.teaser).trim()) || "";
      const description = teaser; // teaser is what becomes the meta description
      const primaryKeyword =
        (data.primaryKeyword && String(data.primaryKeyword).trim()) || "";
      const seoSubtopic =
        (data.seoSubtopic && String(data.seoSubtopic).trim()) || "";
      const ctaTarget =
        (data.ctaTarget && String(data.ctaTarget).trim()) || "";
      const authorName =
        (data.authorName && String(data.authorName).trim()) || "";
      const isFree = data.isFree === true;
      const videoUrl =
        (data.videoUrl && String(data.videoUrl).trim()) || "";
      const difficulty =
        data.difficulty !== undefined && data.difficulty !== null
          ? String(data.difficulty)
          : "";

      const url = `${cfg.pathPrefix}/${bodyId}`;
      const updatedDate =
        toDateValue(bodyData.updatedAt) ||
        toDateValue(data.updatedAt) ||
        toDateValue(bodyData.createdAt) ||
        toDateValue(data.createdAt) ||
        null;
      const createdDate =
        toDateValue(bodyData.createdAt) ||
        toDateValue(data.createdAt) ||
        null;

      const plain = stripHtml(bodyHtml);
      const words = wordCount(plain);

      all.push({
        collectionSummary: cfg.summary,
        collectionBody: cfg.body,
        label: cfg.label,
        pathPrefix: cfg.pathPrefix,
        summaryId: doc.id,
        bodyId,
        url,
        title,
        teaser,
        description,
        primaryKeyword,
        seoSubtopic,
        ctaTarget,
        authorName,
        isFree,
        videoUrl,
        difficulty,
        words,
        bodyExists,
        bodyHtml,
        plainText: plain,
        updatedDate,
        createdDate,
        imgCount: countMatches(bodyHtml, IMG_RE),
        hasCardHoldingHtml: CARD_HOLDING_RE.test(toStringSafe(bodyHtml)),
        hasTrainerLink:
          TRAINER_RE.test(toStringSafe(bodyHtml)) ||
          (!!ctaTarget && TRAINER_RE.test(ctaTarget)),
        internalLinks: [],
        inboundCount: 0,
        topicTokens: topicTokens(title),
      });
    }
  }

  // Build internal-link map.
  const urlToIdx = new Map();
  all.forEach((a, i) => urlToIdx.set(a.url, i));
  for (const article of all) {
    const re = new RegExp(INTERNAL_LINK_RE.source, INTERNAL_LINK_RE.flags);
    let m;
    const seen = new Set();
    const htmlStr = toStringSafe(article.bodyHtml || "");
    while ((m = re.exec(htmlStr)) !== null) {
      let p = m[1];
      if (!p) continue;
      // Normalise trailing slashes.
      if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
      if (seen.has(p)) continue;
      seen.add(p);
      article.internalLinks.push(p);
    }
  }
  for (const article of all) {
    for (const link of article.internalLinks) {
      if (urlToIdx.has(link)) {
        const targetIdx = urlToIdx.get(link);
        all[targetIdx].inboundCount += 1;
      }
    }
  }

  // Paywall-risk = internal hrefs that point to summary IDs instead of body IDs.
  for (const article of all) {
    article.paywallRiskLinks = detectPaywallRiskLinks(
      article.bodyHtml,
      summaryIds
    );
  }

  return all;
}

function verdictFor(article, clusters) {
  const reasons = [];
  let verdict = "KEEP";

  if (!article.bodyExists) {
    return { verdict: "KILL", reasons: ["body missing or empty (ghost)"] };
  }
  if (article.words < 250) {
    verdict = "EXPAND";
    reasons.push(`very thin (${article.words} words)`);
  } else if (article.words < 600) {
    verdict = "EXPAND";
    reasons.push(`thin (${article.words} words)`);
  }
  if (!article.hasTrainerLink && !article.ctaTarget)
    reasons.push("no link or CTA to trainer");
  if (article.inboundCount === 0) reasons.push("orphan (no inbound links)");
  if (article.paywallRiskLinks > 0)
    reasons.push(
      `${article.paywallRiskLinks} link(s) point to summary IDs (paywall risk)`
    );
  if (!article.teaser) reasons.push("no teaser/meta description");
  if (!article.primaryKeyword) reasons.push("no primaryKeyword set");

  const titleLen = article.title.length;
  if (titleLen > 70) reasons.push(`title too long for SERP (${titleLen} chars)`);
  if (titleLen < 25 && article.title !== "(no title)")
    reasons.push(`title short (${titleLen} chars)`);

  if (clusters && clusters.byArticle) {
    const cluster = clusters.byArticle.get(article.url);
    if (cluster && cluster.members.length > 1) {
      const others = cluster.members.filter((u) => u !== article.url);
      reasons.push(
        `overlaps with ${others.length} other article(s) on "${cluster.label}"`
      );
      if (verdict === "KEEP") verdict = "REVIEW-CLUSTER";
    }
  }

  if (article.bodyExists && verdict === "KEEP" && reasons.length === 0) {
    return { verdict: "KEEP", reasons: ["healthy"] };
  }
  return { verdict, reasons };
}

function buildClusters(articles) {
  // Token-based clustering: a pair counts as overlapping only if they share
  // at least 2 STRONG tokens (i.e. not in WEAK_CLUSTER_TOKENS), OR 3+ tokens
  // total including weak ones. This keeps clusters topic-specific and avoids
  // a giant "everything that mentions trumps" bucket.
  const tokenIndex = new Map();
  for (const a of articles) {
    for (const t of a.topicTokens) {
      if (!tokenIndex.has(t)) tokenIndex.set(t, new Set());
      tokenIndex.get(t).add(a.url);
    }
  }
  const candidatePairs = new Map(); // pair-key -> shared tokens
  for (const [token, urls] of tokenIndex.entries()) {
    if (urls.size < 2 || urls.size > 25) continue; // huge token = too generic
    const arr = [...urls];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const key = arr[i] < arr[j] ? `${arr[i]}||${arr[j]}` : `${arr[j]}||${arr[i]}`;
        if (!candidatePairs.has(key)) candidatePairs.set(key, new Set());
        candidatePairs.get(key).add(token);
      }
    }
  }
  const parent = new Map();
  function find(x) {
    if (!parent.has(x)) parent.set(x, x);
    while (parent.get(x) !== x) {
      parent.set(x, parent.get(parent.get(x)));
      x = parent.get(x);
    }
    return x;
  }
  function union(a, b) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  }
  const sharedTokensByPair = new Map();
  for (const [key, tokens] of candidatePairs.entries()) {
    const strongTokens = [...tokens].filter((t) => !WEAK_CLUSTER_TOKENS.has(t));
    const isCluster = strongTokens.length >= 2 || tokens.size >= 3;
    if (isCluster) {
      const [a, b] = key.split("||");
      union(a, b);
      sharedTokensByPair.set(key, [...tokens]);
    }
  }
  const groups = new Map();
  for (const a of articles) {
    if (!parent.has(a.url)) continue;
    const root = find(a.url);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(a.url);
  }
  const clusters = [];
  const byArticle = new Map();
  for (const [root, members] of groups.entries()) {
    if (members.length < 2) continue;
    // Cluster label = most-shared token among members.
    const tokenCounts = new Map();
    for (const u of members) {
      const art = articles.find((a) => a.url === u);
      if (!art) continue;
      for (const t of art.topicTokens) {
        tokenCounts.set(t, (tokenCounts.get(t) || 0) + 1);
      }
    }
    // Prefer specific tokens (not in WEAK_CLUSTER_TOKENS) as the cluster label.
    const ranked = [...tokenCounts.entries()].sort((a, b) => b[1] - a[1]);
    const strong = ranked.filter(([t]) => !WEAK_CLUSTER_TOKENS.has(t));
    const label = (strong[0] || ranked[0] || ["topic"])[0];
    const cluster = { label, members };
    clusters.push(cluster);
    for (const u of members) byArticle.set(u, cluster);
  }
  return { clusters, byArticle };
}

function formatDate(d) {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

function renderMarkdown(articles, clusters) {
  const today = new Date().toISOString().slice(0, 10);
  const byCategory = new Map();
  for (const a of articles) {
    if (!byCategory.has(a.label)) byCategory.set(a.label, []);
    byCategory.get(a.label).push(a);
  }
  for (const arr of byCategory.values()) {
    arr.sort((a, b) => a.title.localeCompare(b.title));
  }

  const stats = {
    total: articles.length,
    ghosts: articles.filter((a) => !a.bodyExists).length,
    thin: articles.filter((a) => a.bodyExists && a.words < 600).length,
    veryThin: articles.filter((a) => a.bodyExists && a.words < 250).length,
    orphans: articles.filter((a) => a.bodyExists && a.inboundCount === 0).length,
    noTrainer: articles.filter(
      (a) => a.bodyExists && !a.hasTrainerLink && !a.ctaTarget
    ).length,
    paywallRisk: articles.filter((a) => a.paywallRiskLinks > 0).length,
    noMeta: articles.filter((a) => !a.teaser).length,
    noKeyword: articles.filter((a) => !a.primaryKeyword).length,
    free: articles.filter((a) => a.isFree).length,
    paid: articles.filter((a) => !a.isFree).length,
    healthy: 0,
  };

  const verdicts = new Map();
  for (const a of articles) {
    const v = verdictFor(a, clusters);
    verdicts.set(a.url, v);
    if (v.verdict === "KEEP" && v.reasons[0] === "healthy") stats.healthy++;
  }

  const lines = [];
  lines.push(`# Article SEO audit — ${today}`);
  lines.push("");
  lines.push(
    "**This file is auto-generated and read-only.** Nothing in Firestore was changed to produce it. " +
      "Each row is a recommendation; tick the action you want and we'll execute it together."
  );
  lines.push("");
  lines.push("## Sitewide stats");
  lines.push("");
  lines.push(`- Total articles indexed in collections: **${stats.total}**`);
  lines.push(`- Ghosts (body missing / empty): **${stats.ghosts}**`);
  lines.push(
    `- Thin (< 600 words, body present): **${stats.thin}** — of which very thin (< 250 words): **${stats.veryThin}**`
  );
  lines.push(`- Orphans (no inbound internal links): **${stats.orphans}**`);
  lines.push(`- Free / paid split: **${stats.free} free · ${stats.paid} paid**`);
  lines.push(
    `- No trainer link in body and no ctaTarget set: **${stats.noTrainer}**`
  );
  lines.push(
    `- Internal links that point to a SUMMARY id (paywall risk): **${stats.paywallRisk}**`
  );
  lines.push(`- Missing teaser (meta description): **${stats.noMeta}**`);
  lines.push(`- Missing primaryKeyword field: **${stats.noKeyword}**`);
  lines.push(`- Healthy with no flags: **${stats.healthy}**`);
  lines.push("");
  lines.push("## Verdict legend");
  lines.push("");
  lines.push(
    "- **KEEP** — looks healthy; leave alone.\n" +
      "- **REVIEW-CLUSTER** — overlaps with other article(s) on the same topic; decide which one is the canonical.\n" +
      "- **EXPAND** — useful topic but thin; needs more depth before it can rank.\n" +
      "- **MERGE** — same topic as a stronger article; recommend redirecting this URL into the stronger one.\n" +
      "- **RETITLE** — body is fine; the SERP title/description doesn't match what users actually search.\n" +
      "- **KILL** — empty / orphaned / superseded; recommend 301-redirect to nearest live article and drop from sitemap."
  );
  lines.push("");
  lines.push(
    "Tick boxes in the 'Action' column are left for you. Add an `x` between the brackets to mark your decision."
  );
  lines.push("");

  if (clusters.clusters.length > 0) {
    lines.push("## Topic clusters (overlapping articles)");
    lines.push("");
    lines.push(
      "Each group shares at least 2 meaningful keywords in the title. Decide which URL is canonical; merge or differentiate the others."
    );
    lines.push("");
    const sortedClusters = clusters.clusters
      .slice()
      .sort((a, b) => b.members.length - a.members.length);
    for (const cluster of sortedClusters) {
      lines.push(`### Cluster: \`${cluster.label}\` (${cluster.members.length} articles)`);
      lines.push("");
      lines.push("| URL | Title | Words | Updated |");
      lines.push("|---|---|---:|---|");
      for (const u of cluster.members) {
        const a = articles.find((x) => x.url === u);
        if (!a) continue;
        lines.push(
          `| \`${a.url}\` | ${escapeMd(a.title)} | ${a.words} | ${formatDate(a.updatedDate)} |`
        );
      }
      lines.push("");
    }
  }

  for (const [category, arr] of byCategory.entries()) {
    lines.push(`## ${category} (${arr.length})`);
    lines.push("");
    lines.push(
      "| Verdict | Title | Words | Inbound | Free? | Trainer? | Updated | URL | Flags | Action |"
    );
    lines.push("|---|---|---:|---:|:---:|:---:|---|---|---|---|");
    const sortOrder = { KILL: 0, "REVIEW-CLUSTER": 1, MERGE: 2, EXPAND: 3, RETITLE: 4, KEEP: 5 };
    const sorted = arr.slice().sort((x, y) => {
      const vx = verdicts.get(x.url)?.verdict || "KEEP";
      const vy = verdicts.get(y.url)?.verdict || "KEEP";
      const dv = (sortOrder[vx] ?? 9) - (sortOrder[vy] ?? 9);
      if (dv !== 0) return dv;
      return x.words - y.words;
    });
    for (const a of sorted) {
      const v = verdicts.get(a.url);
      const flags = v.reasons.join("; ");
      const action =
        "[ ] keep · [ ] retitle · [ ] expand · [ ] merge → ___ · [ ] kill";
      const trainerCell = a.hasTrainerLink ? "yes" : a.ctaTarget ? "cta" : "no";
      const freeCell = a.isFree ? "yes" : "no";
      lines.push(
        `| **${v.verdict}** | ${escapeMd(a.title)} | ${a.words} | ${a.inboundCount} | ${freeCell} | ${trainerCell} | ${formatDate(a.updatedDate)} | \`${a.url}\` | ${escapeMd(flags)} | ${action} |`
      );
    }
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push("## Suggested execution order");
  lines.push("");
  lines.push(
    "1. **KILL** rows first — clears noise, prevents Google indexing rot.\n" +
      "2. **REVIEW-CLUSTER** rows next — pick canonicals before writing anything new on the same topic.\n" +
      "3. **MERGE** rows after clusters are decided — easy 301s.\n" +
      "4. **RETITLE** rows — title/meta tweaks only, no body changes; biggest CTR/impressions wins per minute of work.\n" +
      "5. **EXPAND** rows — last, because each one is a content project. Prefer expanding pages that already have inbound links and traffic.\n" +
      "6. Only then start the new 50-pillar plan."
  );
  lines.push("");

  return lines.join("\n");
}

function escapeMd(text) {
  if (!text) return "";
  return String(text).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

async function run() {
  console.log("Reading Firestore…");
  const articles = await collectAll();
  console.log(`Collected ${articles.length} article rows.`);
  const clusters = buildClusters(articles);
  console.log(`Detected ${clusters.clusters.length} topic clusters.`);

  const today = new Date().toISOString().slice(0, 10);
  const outDir = path.join(__dirname, "..", "docs", "seo");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `article-audit-${today}.md`);
  const md = renderMarkdown(articles, clusters);
  fs.writeFileSync(outPath, md, "utf8");
  console.log(`Wrote audit → ${path.relative(path.join(__dirname, ".."), outPath)}`);
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error("Audit failed:", err);
    process.exit(1);
  }
);
