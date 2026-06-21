/**
 * Live SEO guard — fetch every article URL as Googlebot and flag anything that
 * stops Google indexing it: a generic SPA shell (no real title), a robots
 * `noindex`, or a canonical/redirect pointing at /membership or /login.
 *
 * This is the check that ends "randomly finding broken articles weeks later":
 * run it after a deploy (or on a schedule) and it tells you immediately if any
 * article is serving Google the wrong thing.
 *
 * Read-only HTTP, no credentials. Reads the LIVE sitemap by default so it
 * reflects exactly what Google sees.
 *
 *   node scripts/audit-live-articles.js
 *   node scripts/audit-live-articles.js --base https://bridgechampions.com
 *   node scripts/audit-live-articles.js --concurrency 8 --retry 1
 *
 * Exits non-zero (and prints a GitHub ::error:: annotation) if anything is
 * flagged, so it can gate / alert from CI.
 */
const https = require("https");

const arg = (f, d) => {
  const i = process.argv.indexOf(f);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d;
};
const BASE = arg("--base", "https://bridgechampions.com").replace(/\/$/, "");
const CONCURRENCY = Math.max(1, Number(arg("--concurrency", "8")));
const RETRY = Math.max(0, Number(arg("--retry", "1"))); // re-check a flagged URL once (CDN lag)
const GOOGLEBOT =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const ARTICLE_RE = [
  /^\/declarer\/articles\/[A-Za-z0-9_-]+$/,
  /^\/defence\/articles\/[A-Za-z0-9_-]+$/,
  /^\/bidding\/advanced\/[A-Za-z0-9_-]+$/,
  /^\/bidding\/basics\/[A-Za-z0-9_-]+$/,
  /^\/counting\/articles\/[A-Za-z0-9_-]+$/,
  /^\/beginner\/articles\/(declarer|defence|bidding)\/[A-Za-z0-9_-]+$/,
];
const isArticle = (p) => ARTICLE_RE.some((re) => re.test(p));

function get(url) {
  return new Promise((resolve) => {
    const req = https.get(
      url,
      { headers: { "User-Agent": GOOGLEBOT }, timeout: 20000 },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () =>
          resolve({ status: res.statusCode, headers: res.headers, body })
        );
      }
    );
    req.on("error", () => resolve({ status: 0, headers: {}, body: "" }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: 0, headers: {}, body: "" });
    });
  });
}

const titleOf = (html) => {
  const m = html.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : "";
};
const GENERIC = /bridge champions\s*[—-]\s*bridge lessons/i;

function classify(res) {
  if (!res.status) return "no response / timeout";
  if (res.status >= 400) return `HTTP ${res.status}`;
  const html = res.body || "";
  const title = titleOf(html);
  if (!title || GENERIC.test(title)) return `generic shell (title: "${title}")`;
  if (/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(html))
    return "robots noindex";
  const canon =
    (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
      [])[1] || "";
  if (/\/membership|\/login/.test(canon)) return `canonical -> ${canon}`;
  return null; // OK
}

async function check(path) {
  let issue = classify(await get(`${BASE}${path}`));
  for (let r = 0; issue && r < RETRY; r++) {
    await new Promise((res) => setTimeout(res, 1500));
    issue = classify(await get(`${BASE}${path}`));
  }
  return issue ? { path, issue } : null;
}

async function main() {
  console.log(`Fetching sitemap from ${BASE}/sitemap.xml …`);
  const sm = await get(`${BASE}/sitemap.xml`);
  const paths = [
    ...new Set(
      [...(sm.body || "").matchAll(/<loc>([^<]+)<\/loc>/g)]
        .map((m) => {
          try {
            return new URL(m[1]).pathname.replace(/\/$/, "") || "/";
          } catch (_) {
            return null;
          }
        })
        .filter(Boolean)
    ),
  ].filter(isArticle);

  if (!paths.length) {
    console.log("No article URLs found in sitemap. Nothing to check.");
    process.exit(0);
  }
  console.log(
    `Auditing ${paths.length} article URLs as Googlebot (concurrency ${CONCURRENCY})…\n`
  );

  const flagged = [];
  let i = 0;
  async function worker() {
    while (i < paths.length) {
      const verdict = await check(paths[i++]);
      if (verdict) flagged.push(verdict);
      process.stdout.write(verdict ? "x" : ".");
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, paths.length) }, worker)
  );
  console.log("\n");

  if (!flagged.length) {
    console.log(
      `OK — all ${paths.length} articles serve real content to Googlebot.`
    );
    process.exit(0);
  }
  flagged.sort((a, b) => a.path.localeCompare(b.path));
  console.log(`FLAGGED ${flagged.length}/${paths.length} article(s):`);
  flagged.forEach((f) => console.log(`  ${f.path}  —  ${f.issue}`));
  console.log(
    `::error::SEO guard: ${flagged.length} article(s) not indexable by Google (see log).`
  );
  process.exit(1);
}

main();
