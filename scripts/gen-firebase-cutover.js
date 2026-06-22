/**
 * Generate the firebase.json hosting additions for the Phase-1 cutover:
 *   - rewrites: /learn/**, /sitemap.xml, /robots.txt  -> the Cloud Run content service
 *   - redirects: every legacy article URL (301) -> /learn/<category>/<slug>
 * Reads docs/redirect-map.json. Writes content-app/firebase-cutover-snippet.json.
 *
 * These must go live TOGETHER (the 301s point at /learn/*, which only render once the
 * Next service is wired). Do NOT merge into the live firebase.json until the Cloud Run
 * service exists, or /learn will break.
 *
 *   node scripts/gen-firebase-cutover.js
 */
const fs = require("fs");
const path = require("path");

const SERVICE = { serviceId: "bc-content", region: "us-central1" };

const mapPath = path.join(__dirname, "..", "docs", "redirect-map.json");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));

const rewrites = [
  { source: "/learn/**", run: { ...SERVICE } },
  { source: "/sitemap.xml", run: { ...SERVICE } },
  { source: "/robots.txt", run: { ...SERVICE } },
];

const redirects = (map.redirects || []).map((r) => ({
  source: r.from,
  destination: r.to,
  type: 301,
}));

const snippet = {
  _note:
    "MERGE into firebase.json hosting.rewrites (these BEFORE the '**'->/_shell.html rule) and hosting.redirects. Deploy ONLY with the Cloud Run service live.",
  "hosting.rewrites (prepend)": rewrites,
  "hosting.redirects (append)": redirects,
};

const outPath = path.join(__dirname, "..", "content-app", "firebase-cutover-snippet.json");
fs.writeFileSync(outPath, JSON.stringify(snippet, null, 2), "utf8");
console.log(`Wrote ${rewrites.length} rewrites + ${redirects.length} 301 redirects to`);
console.log(`  ${path.relative(path.join(__dirname, ".."), outPath)}`);
console.log("\nReminder: deploy these ONLY once the bc-content Cloud Run service is live.");
