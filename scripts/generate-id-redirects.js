/**
 * Generate server-side 301 redirects from old body-ID article URLs to the new
 * readable slug URLs, and write them into firebase.json (hosting.redirects).
 *
 * Why: the in-app JS redirect already sends old links to the slug URL, but a
 * true server 301 is what Google prefers for consolidating ranking signals
 * after a URL change. Hosting evaluates redirects before SPA rewrites.
 *
 * SAFE: dry-run by default (prints the redirect list, writes nothing).
 * Pass --apply to update firebase.json.
 *
 * Usage:
 *   node scripts/generate-id-redirects.js               # dry run
 *   node scripts/generate-id-redirects.js --apply       # write firebase.json
 *   node scripts/generate-id-redirects.js --apply --key "C:\path\key.json"
 *
 * Re-run after publishing new articles (same cadence as sitemap regen).
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

// Same summary collections + public path prefixes as the sitemap generator.
const COLLECTIONS = [
  { summary: "cardPlay", pathPrefix: "/declarer/articles" },
  { summary: "defence", pathPrefix: "/defence/articles" },
  { summary: "bidding", pathPrefix: "/bidding/advanced" },
  { summary: "biddingAdvanced", pathPrefix: "/bidding/advanced" },
  { summary: "biddingBasics", pathPrefix: "/bidding/basics" },
  { summary: "counting", pathPrefix: "/counting/articles" },
  { summary: "beginnerCardPlay", pathPrefix: "/beginner/articles/declarer" },
  { summary: "beginnerDefence", pathPrefix: "/beginner/articles/defence" },
  { summary: "beginnerBidding", pathPrefix: "/beginner/articles/bidding" },
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

async function buildRedirects(db) {
  const redirects = [];
  const seenSources = new Set();
  for (const cfg of COLLECTIONS) {
    const snap = await db.collection(cfg.summary).get();
    for (const doc of snap.docs) {
      const data = doc.data() || {};
      const slug = typeof data.slug === "string" ? data.slug.trim() : "";
      const bodyId = extractBodyId(data);
      if (!slug || !bodyId || slug === bodyId) continue;

      // Old indexed URL -> new readable slug URL.
      const source = `${cfg.pathPrefix}/${bodyId}`;
      const destination = `${cfg.pathPrefix}/${slug}`;
      if (seenSources.has(source)) continue;
      seenSources.add(source);
      redirects.push({ source, destination, type: 301 });
    }
  }
  // Stable order for clean diffs.
  redirects.sort((a, b) => a.source.localeCompare(b.source));
  return redirects;
}

async function run() {
  const keyPath = resolveServiceAccountPath();
  if (!keyPath || !fs.existsSync(keyPath)) {
    console.error("No service account JSON found. Use --key <path> or set FIREBASE_SERVICE_ACCOUNT.");
    process.exit(1);
  }
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
  });
  const db = admin.firestore();

  const redirects = await buildRedirects(db);
  console.log(`Built ${redirects.length} id->slug 301 redirects.`);
  redirects.slice(0, 8).forEach((r) => console.log(`  ${r.source}  ->  ${r.destination}`));
  if (redirects.length > 8) console.log(`  …and ${redirects.length - 8} more`);

  if (!process.argv.includes("--apply")) {
    console.log("\nDry run — re-run with --apply to write firebase.json.");
    process.exit(0);
  }

  const firebaseJsonPath = path.join(__dirname, "..", "firebase.json");
  const config = JSON.parse(fs.readFileSync(firebaseJsonPath, "utf8"));
  if (!config.hosting) throw new Error("firebase.json has no hosting block.");
  config.hosting.redirects = redirects;
  fs.writeFileSync(firebaseJsonPath, JSON.stringify(config, null, 2) + "\n", "utf8");
  console.log(`\nWrote ${redirects.length} redirects to firebase.json (hosting.redirects).`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
