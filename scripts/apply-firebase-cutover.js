/**
 * Apply the Phase-1 cutover to firebase.json (idempotent):
 *   - prepend rewrites: /learn, /learn/**, /sitemap.xml, /robots.txt -> Cloud Run (bc-content)
 *   - append 301 redirects: legacy article URLs -> /learn/<category>/<slug> (from docs/redirect-map.json)
 *
 * Merging this to `main` triggers the CI hosting deploy = the live cutover. Deploy
 * ONLY with the bc-content Cloud Run service live (it is). Re-runnable safely.
 *
 *   node scripts/apply-firebase-cutover.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const fbPath = path.join(root, "firebase.json");
const fb = JSON.parse(fs.readFileSync(fbPath, "utf8"));
const map = JSON.parse(fs.readFileSync(path.join(root, "docs", "redirect-map.json"), "utf8"));

const SVC = { serviceId: "bc-content", region: "us-central1" };
// NOTE: /robots.txt intentionally stays on the CRA (public/robots.txt) so its
// admin/editor/pillars Disallow rules are preserved. Only the content surface
// + the (new-URL) sitemap move to the Next service.
const runRewrites = ["/learn", "/learn/**", "/sitemap.xml"].map((source) => ({
  source,
  run: { ...SVC },
}));

// Rewrites: drop any prior bc-content entries, then prepend the canonical set
// (so they match before the catch-all "**" -> /_shell.html).
fb.hosting.rewrites = [
  ...runRewrites,
  ...fb.hosting.rewrites.filter((r) => !(r.run && r.run.serviceId === SVC.serviceId)),
];

// Redirects: append legacy->new, skipping any source already present.
const existing = new Set((fb.hosting.redirects || []).map((r) => r.source));
const added = (map.redirects || [])
  .filter((r) => !existing.has(r.from))
  .map((r) => ({ source: r.from, destination: r.to, type: 301 }));
fb.hosting.redirects = [...(fb.hosting.redirects || []), ...added];

fs.writeFileSync(fbPath, JSON.stringify(fb, null, 2) + "\n", "utf8");
console.log(
  `firebase.json updated: ${fb.hosting.rewrites.length} rewrites (incl. ${runRewrites.length} Cloud Run), ` +
    `${fb.hosting.redirects.length} redirects (+${added.length} new).`
);
