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
  { loc: "/learn", changefreq: "daily", priority: "0.9" },
  { loc: "/learn/beginner", changefreq: "weekly", priority: "0.8" },
  { loc: "/declarer", changefreq: "daily", priority: "0.9" },
  { loc: "/defence", changefreq: "daily", priority: "0.9" },
  { loc: "/bidding", changefreq: "daily", priority: "0.9" },
  { loc: "/beginner", changefreq: "weekly", priority: "0.8" },
  { loc: "/declarer/articles", changefreq: "weekly", priority: "0.8" },
  { loc: "/defence/articles", changefreq: "weekly", priority: "0.8" },
  { loc: "/bidding/advanced", changefreq: "weekly", priority: "0.8" },
  { loc: "/bidding/basics", changefreq: "weekly", priority: "0.8" },
  { loc: "/counting/articles", changefreq: "weekly", priority: "0.7" },
  { loc: "/beginner/articles", changefreq: "weekly", priority: "0.8" },
  { loc: "/beginner/articles/declarer", changefreq: "weekly", priority: "0.8" },
  { loc: "/beginner/articles/defence", changefreq: "weekly", priority: "0.7" },
  { loc: "/beginner/articles/bidding", changefreq: "weekly", priority: "0.7" },
];

const DYNAMIC_COLLECTIONS = [
  { collection: "cardPlay", pathPrefix: "/declarer/articles", priority: "0.7" },
  { collection: "defence", pathPrefix: "/defence/articles", priority: "0.7" },
  { collection: "bidding", pathPrefix: "/bidding/advanced", priority: "0.7" },
  { collection: "biddingAdvanced", pathPrefix: "/bidding/advanced", priority: "0.7" },
  { collection: "biddingBasics", pathPrefix: "/bidding/basics", priority: "0.7" },
  { collection: "counting", pathPrefix: "/counting/articles", priority: "0.6" },
  { collection: "beginnerCardPlay", pathPrefix: "/beginner/articles/declarer", priority: "0.7" },
  { collection: "beginnerDefence", pathPrefix: "/beginner/articles/defence", priority: "0.6" },
  { collection: "beginnerBidding", pathPrefix: "/beginner/articles/bidding", priority: "0.6" },
];

async function getDynamicUrls() {
  const out = [];
  for (const cfg of DYNAMIC_COLLECTIONS) {
    const snap = await db.collection(cfg.collection).get();
    snap.forEach((doc) => {
      const data = doc.data() || {};
      const date = toDateValue(data.updatedAt) || toDateValue(data.createdAt) || new Date();
      out.push({
        loc: `${cfg.pathPrefix}/${doc.id}`,
        lastmod: toYmd(date),
        changefreq: "monthly",
        priority: cfg.priority,
      });
    });
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

async function run() {
  const dynamicUrls = await getDynamicUrls();
  const staticUrls = STATIC_URLS.map((u) => ({ ...u, lastmod: NOW_YMD }));
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
