/**
 * Generate per-article Open Graph share images.
 *
 * Walks build/ for prerendered article snapshots, reads the <title> from each,
 * renders a branded 1200x630 PNG via Puppeteer, and saves it to
 * build/og/<articleId>.png. Also writes build/og/default.png.
 *
 * Designed to run AFTER scripts/prerender.js so titles are already in the
 * snapshots (no Firestore read needed here).
 *
 * Usage:
 *   node scripts/generate-og-images.js [--concurrency 3] [--limit N]
 */

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const ROOT = path.join(__dirname, "..");
const BUILD_DIR = path.join(ROOT, "build");
const OG_DIR = path.join(BUILD_DIR, "og");

function getArgValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  if (!v || v.startsWith("-")) return fallback;
  return v;
}

const CONCURRENCY = Math.max(1, Number(getArgValue("--concurrency", "3")));
const LIMIT = Number(getArgValue("--limit", "0")) || 0;

// Patterns for routes that ARE articles (final path segment is the article ID).
const ARTICLE_ROUTE_PATTERNS = [
  /^\/declarer\/articles\/([A-Za-z0-9_-]+)$/,
  /^\/defence\/articles\/([A-Za-z0-9_-]+)$/,
  /^\/bidding\/advanced\/([A-Za-z0-9_-]+)$/,
  /^\/bidding\/basics\/([A-Za-z0-9_-]+)$/,
  /^\/counting\/articles\/([A-Za-z0-9_-]+)$/,
  /^\/beginner\/articles\/(?:declarer|defence|bidding)\/([A-Za-z0-9_-]+)$/,
];

function walkSnapshots() {
  const out = [];
  const stack = [BUILD_DIR];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (_) {
      continue;
    }
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name === "static" || ent.name === "og" || ent.name === "images") continue;
        stack.push(full);
      } else if (ent.isFile() && ent.name === "index.html") {
        const rel = "/" + path.relative(BUILD_DIR, dir).replace(/\\/g, "/");
        const routePath = rel === "/." ? "/" : rel;
        out.push({ file: full, routePath });
      }
    }
  }
  return out;
}

function classifyArticle(routePath) {
  for (const re of ARTICLE_ROUTE_PATTERNS) {
    const m = routePath.match(re);
    if (m) return { isArticle: true, articleId: m[1] };
  }
  return { isArticle: false };
}

function categoryLabelForRoute(routePath) {
  if (routePath.startsWith("/beginner/articles/bidding")) return "Beginner Bidding";
  if (routePath.startsWith("/beginner/articles/declarer")) return "Beginner Declarer";
  if (routePath.startsWith("/beginner/articles/defence")) return "Beginner Defence";
  if (routePath.startsWith("/bidding/")) return "Bidding";
  if (routePath.startsWith("/declarer/")) return "Declarer Play";
  if (routePath.startsWith("/defence/")) return "Defence";
  if (routePath.startsWith("/counting/")) return "Counting";
  return "Bridge Champions";
}

function extractTitle(html) {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  if (!m) return null;
  let title = m[1].trim();
  title = title.replace(/\s*[-|·\u2013\u2014]\s*Bridge Champions.*$/i, "").trim();
  return title || null;
}

// The page's og:image meta is the source of truth for the filename the live
// HTML references (keyed by body-doc id, e.g. "/og/<bodyId>.png"). Name the
// generated file to match it exactly, so meta and file never drift apart even
// when the page URL uses a slug. Returns e.g. "fTyD8kBfzLpBmkc8uGsl.png".
function extractOgImageName(html) {
  const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  if (!m) return null;
  const base = m[1].split("/").pop().split(/[?#]/)[0];
  return base && /\.png$/i.test(base) ? base : null;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildTemplateHtml(title, category) {
  const safeTitle = escapeHtml(title || "Bridge Champions");
  const safeCategory = escapeHtml(category || "Bridge Champions");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; width: 1200px; height: 630px; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Arial, sans-serif;
    background: linear-gradient(135deg, #0b3f30 0%, #0F4C3A 45%, #1f7a5e 100%);
    color: #ffffff;
    position: relative;
    overflow: hidden;
  }
  .stripe {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 110% -10%, rgba(255,255,255,0.12), transparent 50%),
      radial-gradient(ellipse at -10% 110%, rgba(0,0,0,0.25), transparent 50%);
  }
  .suits {
    position: absolute;
    top: 56px;
    right: 64px;
    display: flex;
    gap: 18px;
    font-size: 64px;
    line-height: 1;
    opacity: 0.55;
  }
  .suit-red { color: #ff8a8a; }
  .suit-white { color: #ffffff; }
  .container {
    position: relative;
    padding: 72px 72px 72px 72px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 700;
    font-size: 22px;
    color: rgba(255,255,255,0.78);
  }
  .title {
    font-weight: 800;
    color: #ffffff;
    font-size: 72px;
    line-height: 1.08;
    letter-spacing: -0.015em;
    max-width: 960px;
    text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  .title.long { font-size: 60px; }
  .title.xlong { font-size: 50px; }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .brand-mark {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: #ffffff;
    color: #0F4C3A;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 32px;
    letter-spacing: -0.02em;
  }
  .brand-name {
    font-weight: 800;
    font-size: 30px;
    letter-spacing: -0.01em;
  }
  .url {
    font-size: 22px;
    color: rgba(255,255,255,0.78);
    font-weight: 600;
  }
</style>
</head>
<body>
  <div class="stripe"></div>
  <div class="suits">
    <span class="suit-white">&#9824;</span>
    <span class="suit-red">&#9829;</span>
    <span class="suit-red">&#9830;</span>
    <span class="suit-white">&#9827;</span>
  </div>
  <div class="container">
    <div class="eyebrow">${safeCategory}</div>
    <div class="title" id="title">${safeTitle}</div>
    <div class="footer">
      <div class="brand">
        <div class="brand-mark">BC</div>
        <div class="brand-name">Bridge Champions</div>
      </div>
      <div class="url">bridgechampions.com</div>
    </div>
  </div>
  <script>
    var el = document.getElementById('title');
    var len = el.textContent.length;
    if (len > 80) el.classList.add('xlong');
    else if (len > 50) el.classList.add('long');
  </script>
</body>
</html>`;
}

async function renderOgImage(page, outFile, title, category) {
  const html = buildTemplateHtml(title, category);
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  // Give layout a tick to apply long/xlong classes.
  await page.evaluate(() => new Promise((r) => setTimeout(r, 50)));
  await page.screenshot({
    path: outFile,
    type: "png",
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
}

async function runQueue(items, worker) {
  let idx = 0;
  const results = { ok: 0, fail: 0, failed: [] };
  async function next() {
    while (idx < items.length) {
      const myIdx = idx++;
      const item = items[myIdx];
      const label = `[${myIdx + 1}/${items.length}] ${item.articleId} :: ${item.title.slice(0, 60)}`;
      try {
        await worker(item);
        results.ok++;
        console.log(`OK   ${label}`);
      } catch (err) {
        results.fail++;
        results.failed.push({ id: item.articleId, error: err.message });
        console.warn(`FAIL ${label} :: ${err.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => next()));
  return results;
}

async function run() {
  if (!fs.existsSync(BUILD_DIR)) {
    throw new Error(`No build/ at ${BUILD_DIR} — run \`npm run build\` first.`);
  }
  await fs.promises.mkdir(OG_DIR, { recursive: true });

  console.log("Scanning prerendered snapshots…");
  const snapshots = walkSnapshots();
  const articles = [];
  for (const snap of snapshots) {
    const cls = classifyArticle(snap.routePath);
    if (!cls.isArticle) continue;
    const html = fs.readFileSync(snap.file, "utf8");
    const title = extractTitle(html);
    if (!title) continue;
    // Match the live meta exactly; fall back to the route id only if the
    // snapshot somehow lacks an og:image (or points at default.png).
    const ogName = extractOgImageName(html);
    const outName =
      ogName && ogName.toLowerCase() !== "default.png" ? ogName : `${cls.articleId}.png`;
    articles.push({
      articleId: cls.articleId,
      outName,
      title,
      category: categoryLabelForRoute(snap.routePath),
    });
  }
  // Dedupe by output filename so each referenced /og/<id>.png is rendered once.
  const unique = new Map();
  for (const a of articles) {
    if (!unique.has(a.outName)) unique.set(a.outName, a);
  }
  let list = [...unique.values()];
  if (LIMIT) list = list.slice(0, LIMIT);
  console.log(`Found ${list.length} unique articles to render.`);

  console.log("Launching Chromium…");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  let results;
  try {
    const pages = await Promise.all(
      Array.from({ length: CONCURRENCY }, () => browser.newPage())
    );
    let pageIdx = 0;
    results = await runQueue(list, async (item) => {
      const myPage = pages[pageIdx++ % CONCURRENCY];
      const outFile = path.join(OG_DIR, item.outName);
      await renderOgImage(myPage, outFile, item.title, item.category);
    });

    const defaultPage = pages[0];
    await renderOgImage(
      defaultPage,
      path.join(OG_DIR, "default.png"),
      "Bridge lessons and practice for every level",
      "Bridge Champions"
    );
    console.log("OK   default.png");

    await Promise.all(pages.map((p) => p.close()));
  } finally {
    await browser.close();
  }

  console.log("---");
  console.log(`Done. ok=${results.ok} fail=${results.fail}`);
  if (results.failed.length) {
    fs.writeFileSync(
      path.join(BUILD_DIR, "og-image-failures.json"),
      JSON.stringify(results.failed, null, 2)
    );
  }
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error("OG image generation failed:", err);
    process.exit(1);
  }
);
