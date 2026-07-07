/**
 * URL-integrity guardrail. Catches the two classes of slip that have bitten us:
 *   1. A firebase.json redirect whose SOURCE is still referenced somewhere Google
 *      reads — the public sitemap, or a topic-hub slug (how /learn/bidding/stayman
 *      briefly shipped as both a hub and a redirect).
 *   2. Drift between the two topicHubs.js copies (CLAUDE.md: keep them in sync),
 *      and between the hub slugs in scripts/generate-sitemap.js and the live hub
 *      source content-app/lib/topicHubs.js.
 *
 * Read-only. Exits 1 on any failure so it can run in CI / npm run audit:urls.
 * Run: node scripts/audit-url-integrity.js
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

let failures = 0;
const fail = (msg) => { failures++; console.log("  FAIL  " + msg); };
const ok = (msg) => console.log("  ok    " + msg);

// ---------- inputs ----------
const firebase = JSON.parse(read("firebase.json"));
const redirects = (firebase.hosting && firebase.hosting.redirects) || [];
const redirectSources = redirects.map((r) => r.source).filter((s) => !s.includes("*"));
const redirectMap = {};
redirects.forEach((r) => { if (!r.source.includes("*")) redirectMap[r.source] = r.destination; });

const sitemap = read("public/sitemap.xml");
const sitemapPaths = [...sitemap.matchAll(/<loc>https:\/\/bridgechampions\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/");

const hubSlugs = (src) => {
  // topic slugs: slug: "x" entries that belong to topics (not categories). Categories
  // are the 4 known keys; topics are everything else in the file's slug fields.
  const all = [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  return all.filter((s) => !["bidding", "declarer", "defence", "beginner"].includes(s));
};
const contentHubs = read("content-app/lib/topicHubs.js");
const craHubs = read("src/data/topicHubs.js");
const genSitemap = read("scripts/generate-sitemap.js");

// ---------- 1. no redirect source may appear in the public sitemap ----------
console.log("\n[1] firebase.json redirect sources vs public/sitemap.xml");
const inSitemap = redirectSources.filter((s) => sitemapPaths.includes(s));
if (inSitemap.length) inSitemap.forEach((s) => fail(`redirect source is in the sitemap: ${s}`));
else ok(`none of ${redirectSources.length} redirect sources are in the sitemap (${sitemapPaths.length} URLs)`);

// ---------- 2. no /learn redirect source may be a live topic-hub URL ----------
console.log("\n[2] /learn redirect sources vs topic-hub URLs");
const hubUrls = new Set();
const catForSlug = {};
// derive hub URLs from content-app copy: category keys wrap topics; simple scan by category blocks
const catBlocks = contentHubs.split(/key:\s*"/).slice(1);
catBlocks.forEach((block) => {
  const cat = block.slice(0, block.indexOf('"'));
  if (!["bidding", "declarer", "defence", "beginner"].includes(cat)) return;
  hubSlugs(block).forEach((s) => { hubUrls.add(`/learn/${cat}/${s}`); catForSlug[s] = cat; });
});
const learnRedirects = redirectSources.filter((s) => s.startsWith("/learn/"));
const hijacked = learnRedirects.filter((s) => hubUrls.has(s));
if (hijacked.length) hijacked.forEach((s) => fail(`redirect source is ALSO a live topic hub (hub unreachable!): ${s}`));
else ok(`no /learn redirect source collides with the ${hubUrls.size} live hub URLs`);

// ---------- 3. the two topicHubs.js copies must be in sync ----------
console.log("\n[3] content-app/lib/topicHubs.js vs src/data/topicHubs.js");
if (contentHubs === craHubs) ok("copies are byte-identical");
else {
  const a = new Set(hubSlugs(contentHubs)), b = new Set(hubSlugs(craHubs));
  const onlyA = [...a].filter((x) => !b.has(x)), onlyB = [...b].filter((x) => !a.has(x));
  if (onlyA.length || onlyB.length) fail(`topic slugs differ — only in content-app: [${onlyA}] only in src: [${onlyB}]`);
  const titles = (s) => new Set([...s.matchAll(/title:\s*"([^"]+)"/g)].map((m) => m[1]));
  const ta = titles(contentHubs), tb = titles(craHubs);
  const missing = [...ta].filter((t) => !tb.has(t));
  if (missing.length) fail(`src copy is missing ${missing.length} article title(s): ${missing.slice(0, 5).join(" | ")}${missing.length > 5 ? " …" : ""}`);
  if (!onlyA.length && !onlyB.length && !missing.length) fail("copies differ in content (run: diff src/data/topicHubs.js content-app/lib/topicHubs.js)");
}

// ---------- 4. generate-sitemap.js hub list vs live hub source ----------
console.log("\n[4] scripts/generate-sitemap.js static hub URLs vs content-app hubs");
const genHubUrls = new Set([...genSitemap.matchAll(/loc:\s*"(\/learn\/[a-z]+\/[a-z0-9-]+)"/g)].map((m) => m[1]));
const missingFromGen = [...hubUrls].filter((u) => !genHubUrls.has(u));
const extraInGen = [...genHubUrls].filter((u) => !hubUrls.has(u));
if (missingFromGen.length) missingFromGen.forEach((u) => fail(`live hub missing from generate-sitemap.js static list: ${u}`));
if (extraInGen.length) extraInGen.forEach((u) => fail(`generate-sitemap.js lists a hub that no longer exists: ${u}`));
if (!missingFromGen.length && !extraInGen.length) ok(`hub lists match (${hubUrls.size} hubs)`);

// ---------- 5. no redirect chains among firebase redirects ----------
console.log("\n[5] redirect chains (source -> dest that is itself a redirect source)");
const chains = redirects.filter((r) => !r.source.includes("*") && redirectMap[r.destination]);
if (chains.length) chains.forEach((r) => fail(`chain: ${r.source} -> ${r.destination} -> ${redirectMap[r.destination]}`));
else ok("no internal redirect chains");

console.log(failures ? `\n${failures} FAILURE(S)` : "\nAll URL-integrity checks passed.");
process.exit(failures ? 1 : 0);
