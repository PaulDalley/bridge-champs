/**
 * Generate public/sitemap.xml from Firestore article collections + core routes.
 *
 * Usage:
 *   node scripts/generate-sitemap.js --apply
 *   node scripts/generate-sitemap.js --apply --key "C:\path\key.json"
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

function toDateValue(value) {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function toYmd(date) {
  return date.toISOString().slice(0, 10);
}

function escXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

if (!process.argv.includes("--apply")) {
  console.error("Refusing to run without --apply");
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
const NOW_YMD = toYmd(new Date());

const STATIC_URLS = [
  { loc: "/", changefreq: "daily", priority: "1.0" },
  { loc: "/about", changefreq: "monthly", priority: "0.7" },
  { loc: "/all-articles", changefreq: "weekly", priority: "0.6" },
  // Topic-hub browse. /learn is the landing; /learn/<category> are real category
  // landing pages served by the content app; each topic is its own hub page.
  // Keep these topic slugs in sync with content-app/lib/topicHubs.js (the LIVE
  // /learn hub source). Cross-check against the dynamic sitemap
  // content-app/app/sitemap.js — any topic hub it lists that's missing here is
  // absent from the public sitemap (that's how /learn/bidding/stayman slipped).
  { loc: "/learn", changefreq: "daily", priority: "0.9" },
  { loc: "/learn/bidding", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/declarer", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/defence", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/beginner", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/declarer/trumps", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/declarer/counting", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/declarer/planning", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/declarer/hand-types", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/declarer/setting-up-suits", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/declarer/entries", changefreq: "weekly", priority: "0.7" },
  { loc: "/learn/declarer/hold-up", changefreq: "weekly", priority: "0.7" },
  { loc: "/learn/defence/hand-types", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/defence/counting", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/defence/leads", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/defence/signals", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/defence/second-third-hand", changefreq: "weekly", priority: "0.7" },
  { loc: "/learn/defence/technique", changefreq: "weekly", priority: "0.7" },
  { loc: "/learn/bidding/constructive", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/bidding/competitive", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/bidding/conventions", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/bidding/hand-evaluation", changefreq: "weekly", priority: "0.8" },
  { loc: "/learn/bidding/vulnerability", changefreq: "weekly", priority: "0.8" },
  // Old hubs /beginner and /beginner/articles/{bidding,declarer,defence} (plus
  // the bare /bidding, /declarer, /defence) now 301-redirect to /learn — omitted
  // so Google isn't pointed at URLs that just redirect.
  // (Article DETAIL pages under those prefixes are still emitted dynamically.)
  // Treadmill hub + per-tool SEO landing pages. The /treadmill/practice/*
  // routes are intentionally noindex (interactive trainers with little crawlable
  // text) — the per-tool landing pages here carry the content and rank for the
  // tool's keywords, then funnel users into the trainer.
  { loc: "/treadmill", changefreq: "weekly", priority: "0.9" },
  { loc: "/treadmill/card-rush", changefreq: "weekly", priority: "0.8" },
];

// Post-cutover (2026-06-22): article detail pages live on the Next.js content app
// at /learn/<category>/<slug>. Emit those canonical URLs here so the public
// sitemap points Google straight at the live pages (not the legacy URLs, which
// now 301). Keep these prefixes in sync with content-app/lib/articles.js +
// scripts/gen-redirect-map.js. (The legacy prefixes still 301 via firebase.json.)
const DYNAMIC_COLLECTIONS = [
  {
    summary: "cardPlay",
    body: "cardPlayBody",
    pathPrefix: "/learn/declarer",
    priority: "0.7",
  },
  {
    summary: "defence",
    body: "defenceBody",
    pathPrefix: "/learn/defence",
    priority: "0.7",
  },
  {
    summary: "bidding",
    body: "biddingBody",
    pathPrefix: "/learn/bidding",
    priority: "0.7",
  },
  {
    summary: "biddingAdvanced",
    body: "biddingAdvancedBody",
    pathPrefix: "/learn/bidding",
    priority: "0.7",
  },
  {
    summary: "biddingBasics",
    body: "biddingBasicsBody",
    pathPrefix: "/learn/bidding",
    priority: "0.7",
  },
  {
    summary: "counting",
    body: "countingBody",
    pathPrefix: "/learn/declarer",
    priority: "0.6",
  },
  {
    summary: "beginnerCardPlay",
    body: "beginnerCardPlayBody",
    pathPrefix: "/learn/beginner",
    priority: "0.7",
  },
  {
    summary: "beginnerDefence",
    body: "beginnerDefenceBody",
    pathPrefix: "/learn/beginner",
    priority: "0.6",
  },
  {
    summary: "beginnerBidding",
    body: "beginnerBiddingBody",
    pathPrefix: "/learn/beginner",
    priority: "0.6",
  },
];

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

async function getDynamicUrls() {
  const out = [];
  let skippedNoBody = 0;
  let skippedMissingBody = 0;
  let skippedHidden = 0;
  for (const cfg of DYNAMIC_COLLECTIONS) {
    const summarySnap = await db.collection(cfg.summary).get();
    const docs = [...summarySnap.docs];
    for (const doc of docs) {
      const data = doc.data() || {};
      // Hidden drafts (admin-only previews) must NEVER end up in the sitemap.
      if (data.isHidden === true) {
        skippedHidden++;
        continue;
      }
      // Articles that redirect to a primary URL (post-merge) must also be
      // excluded — they exist only to bounce inbound traffic.
      if (typeof data.redirectTo === "string" && data.redirectTo.startsWith("/")) {
        skippedHidden++;
        continue;
      }
      const bodyId = extractBodyId(data) || doc.id;
      if (!bodyId) {
        skippedNoBody++;
        continue;
      }
      // Confirm the body document still exists (filters out ghost entries
      // where the summary points at a deleted body doc).
      const bodyDoc = await db.collection(cfg.body).doc(bodyId).get();
      if (!bodyDoc.exists) {
        skippedMissingBody++;
        continue;
      }
      const bodyData = bodyDoc.data() || {};
      const { html: bodyText } = extractBodyHtml(bodyData);
      if (!bodyText || bodyText.trim().length < 40) {
        skippedMissingBody++;
        continue;
      }
      const date =
        toDateValue(bodyData.updatedAt) ||
        toDateValue(data.updatedAt) ||
        toDateValue(bodyData.createdAt) ||
        toDateValue(data.createdAt) ||
        new Date();
      // Prefer the readable slug for the canonical sitemap URL; fall back to
      // the body doc id (which still resolves) when no slug is present.
      const slugOrId =
        typeof data.slug === "string" && data.slug.trim() ? data.slug.trim() : bodyId;
      out.push({
        loc: `${cfg.pathPrefix}/${slugOrId}`,
        lastmod: toYmd(date),
        changefreq: "monthly",
        priority: cfg.priority,
      });
    }
  }
  if (skippedNoBody || skippedMissingBody || skippedHidden) {
    console.log(
      `Skipped ${skippedNoBody} summary docs with no body ref, ${skippedMissingBody} with missing/empty body docs, and ${skippedHidden} hidden drafts.`
    );
  }
  return out;
}

function uniqueByLoc(urls) {
  const map = new Map();
  urls.forEach((u) => map.set(u.loc, u));
  return [...map.values()];
}

function toXml(urls) {
  const rows = urls
    .map((u) => {
      const loc = escXml(`${BASE}${u.loc}`);
      const lastmod = escXml(u.lastmod || NOW_YMD);
      const changefreq = escXml(u.changefreq || "weekly");
      const priority = escXml(u.priority || "0.7");
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows}
</urlset>
`;
}

// Reels (/tips watch pages) — SEO-public 30-second videos served by the content
// app. The reel list lives in content-app/lib/quickTips.js (ESM), so parse the
// slugs out rather than importing; new reels are picked up on the next regen.
function tipsUrls() {
  try {
    const src = fs.readFileSync(
      path.join(__dirname, "..", "content-app", "lib", "quickTips.js"),
      "utf8"
    );
    const slugs = [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
    if (!slugs.length) return [];
    return [
      { loc: "/tips", changefreq: "weekly", priority: "0.8" },
      ...slugs.map((s) => ({ loc: `/tips/${s}`, changefreq: "monthly", priority: "0.6" })),
    ];
  } catch (e) {
    console.warn("tips: could not read quickTips.js — skipping /tips URLs:", e.message);
    return [];
  }
}

async function run() {
  const dynamicUrls = await getDynamicUrls();
  const staticUrls = [...STATIC_URLS, ...tipsUrls()].map((u) => ({ ...u, lastmod: NOW_YMD }));
  const urls = uniqueByLoc([...staticUrls, ...dynamicUrls]).sort((a, b) =>
    a.loc.localeCompare(b.loc)
  );

  const xml = toXml(urls);
  const outputPath = path.join(__dirname, "..", "public", "sitemap.xml");
  fs.writeFileSync(outputPath, xml, "utf8");
  console.log(`Wrote ${urls.length} URLs to ${outputPath}`);
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed generating sitemap:", err.message);
    process.exit(1);
  });
