// scripts/gsc-index-status.js
// Live Google Search Console index status for every sitemap URL.
//
// Run: node scripts/gsc-index-status.js
//
// Auth notes (learned the hard way):
//  - Needs ADC with the webmasters scope. One-time:
//      gcloud auth application-default login \
//        --scopes="https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/webmasters.readonly"
//  - ADC user-credential calls need a quota project + header:
//      gcloud auth application-default set-quota-project bridgechampions
//      (this script also sends x-goog-user-project)
//  - GOOGLE_APPLICATION_CREDENTIALS (the Firebase admin key) CANNOT mint a
//    webmasters token, so we strip it before asking gcloud for the token.
//  - DATA-ACCESSIBLE property is the URL-PREFIX one (https://bridgechampions.com/).
//    The sc-domain:bridgechampions.com property returns 403 for this account.
//  - The Sitemaps API "indexed" count is deprecated and always 0 — ignore it.
//    URL Inspection (below) is the source of truth.

const https = require("https");
const { execSync } = require("child_process");

const QP = "bridgechampions";
const SITE = "https://bridgechampions.com/";
const SITEMAP = "https://bridgechampions.com/sitemap.xml";
const CONCURRENCY = 6;
const INDEXED = /Submitted and indexed|Indexed, not submitted/i;

function token() {
  const env = { ...process.env };
  delete env.GOOGLE_APPLICATION_CREDENTIALS;
  return execSync("gcloud auth application-default print-access-token", { env }).toString().trim();
}
function inspect(tok, url) {
  const body = JSON.stringify({ inspectionUrl: url, siteUrl: SITE });
  return new Promise((resolve) => {
    const r = https.request(
      { hostname: "searchconsole.googleapis.com", path: "/v1/urlInspection/index:inspect", method: "POST",
        headers: { Authorization: `Bearer ${tok}`, "x-goog-user-project": QP, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } },
      (res) => { let b = ""; res.on("data", (c) => (b += c)); res.on("end", () => { try { resolve(JSON.parse(b)); } catch { resolve({}); } }); }
    );
    r.on("error", () => resolve({}));
    r.write(body); r.end();
  });
}
function getXml(url) { return new Promise((res) => { https.get(url, (r) => { let b = ""; r.on("data", (c) => (b += c)); r.on("end", () => res(b)); }); }); }

(async () => {
  const tok = token();
  const xml = await getXml(SITEMAP);
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const tally = {}, notIndexed = [], crawlDates = {};
  let i = 0;
  async function worker() {
    while (i < urls.length) {
      const url = urls[i++];
      const r = await inspect(tok, url);
      const x = (r.inspectionResult && r.inspectionResult.indexStatusResult) || {};
      const cov = r.error ? "ERR:" + (r.error.message || "").slice(0, 30) : x.coverageState || "unknown";
      tally[cov] = (tally[cov] || 0) + 1;
      if (x.lastCrawlTime) { const d = x.lastCrawlTime.slice(0, 10); crawlDates[d] = (crawlDates[d] || 0) + 1; }
      if (!INDEXED.test(cov)) notIndexed.push(url.replace("https://bridgechampions.com", "") + "  [" + cov + "]");
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  const idx = (tally["Submitted and indexed"] || 0) + (tally["Indexed, not submitted in sitemap"] || 0);
  console.log(`\n=== GSC index status — ${urls.length} sitemap URLs ===`);
  Object.entries(tally).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(3)}  ${k}`));
  console.log(`\n  INDEXED: ${idx} / ${urls.length}`);
  console.log("  crawl dates:", Object.entries(crawlDates).sort().map(([d, n]) => `${d}:${n}`).join("  "));
  console.log(`\n=== not-yet-indexed (${notIndexed.length}) ===`);
  notIndexed.sort().forEach((u) => console.log("  " + u));
})();
