/**
 * Generate the old -> new URL migration map for the SEO rebuild.
 * New scheme: /learn/<category>/<slug>. Reads PUBLIC summary collections via the
 * Firestore REST API (unauthenticated — same as the live audits). No credentials.
 *
 *   node scripts/gen-redirect-map.js          # prints summary + writes docs/redirect-map.json
 */
const https = require("https");
const fs = require("fs");
const path = require("path");
const API = "AIzaSyCT-YNVbhvxt2UNttu36HZQvo3k2bgl3JY";
const PROJECT = "bridgechampions";
const FS = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

function req(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 25000 }, (res) => {
      let b = ""; res.on("data", (c) => (b += c));
      res.on("end", () => resolve({ status: res.statusCode, body: b }));
    }).on("error", () => resolve({ status: 0, body: "" }))
      .on("timeout", function () { this.destroy(); resolve({ status: 0, body: "" }); });
  });
}
const sv = (f) => (f ? (f.stringValue !== undefined ? f.stringValue : f.booleanValue) : undefined);

// summary collection -> { category (new), oldPrefix }
const COLLECTIONS = {
  cardPlay:        { category: "declarer", oldPrefix: "/declarer/articles" },
  cardPlayBasics:  { category: "declarer", oldPrefix: "/declarer/articles" },
  counting:        { category: "declarer", oldPrefix: "/declarer/articles" },
  defence:         { category: "defence",  oldPrefix: "/defence/articles" },
  defenceBasics:   { category: "defence",  oldPrefix: "/defence/articles" },
  bidding:         { category: "bidding",  oldPrefix: "/bidding/advanced" },
  biddingAdvanced: { category: "bidding",  oldPrefix: "/bidding/advanced" },
  biddingBasics:   { category: "bidding",  oldPrefix: "/bidding/basics" },
  beginnerCardPlay:{ category: "beginner", oldPrefix: "/beginner/articles/declarer" },
  beginnerDefence: { category: "beginner", oldPrefix: "/beginner/articles/defence" },
  beginnerBidding: { category: "beginner", oldPrefix: "/beginner/articles/bidding" },
};

async function listCollection(name) {
  const out = [];
  let pageToken = "";
  do {
    const url = `${FS}/${name}?key=${API}&pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`;
    const r = await req(url);
    if (r.status !== 200) return out;
    let j; try { j = JSON.parse(r.body); } catch (_) { return out; }
    (j.documents || []).forEach((d) => {
      const f = d.fields || {};
      out.push({
        id: d.name.split("/").pop(),
        slug: sv(f.slug),
        body: sv(f.body),
        isHidden: sv(f.isHidden) === true,
        redirectTo: sv(f.redirectTo),
        title: sv(f.title),
      });
    });
    pageToken = j.nextPageToken || "";
  } while (pageToken);
  return out;
}

async function main() {
  const entries = [];
  const noSlug = [];
  const hidden = [];
  for (const [coll, cfg] of Object.entries(COLLECTIONS)) {
    const docs = await listCollection(coll);
    process.stdout.write(`[${coll}:${docs.length}]`);
    for (const d of docs) {
      if (d.isHidden) { hidden.push(`${coll}/${d.id}`); continue; }
      if (typeof d.redirectTo === "string" && d.redirectTo.startsWith("/")) continue; // merged stub
      const slug = d.slug && d.slug.trim() ? d.slug.trim() : null;
      if (!slug) { noSlug.push(`${coll}/${d.id} "${d.title || ""}"`); continue; }
      entries.push({
        collection: coll,
        category: cfg.category,
        slug,
        bodyId: d.body || d.id,
        title: d.title || "",
        oldUrl: `${cfg.oldPrefix}/${slug}`,
        newUrl: `/learn/${cfg.category}/${slug}`,
      });
    }
  }
  console.log("\n");

  // Detect slug collisions WITHIN a category (would break /learn/<cat>/<slug>).
  const byNew = {};
  entries.forEach((e) => { (byNew[e.newUrl] = byNew[e.newUrl] || []).push(e); });
  const collisions = Object.entries(byNew).filter(([, v]) => v.length > 1);

  const byCategory = entries.reduce((m, e) => ((m[e.category] = (m[e.category] || 0) + 1), m), {});

  const out = {
    generatedNote: "DRAFT old->new URL map for /learn/<category>/<slug> rebuild. Review before applying 301s.",
    totals: { articles: entries.length, byCategory },
    collisions: collisions.map(([url, v]) => ({ url, from: v.map((e) => `${e.collection}/${e.slug}`) })),
    missingSlug: noSlug,
    hidden,
    redirects: entries
      .sort((a, b) => a.newUrl.localeCompare(b.newUrl))
      .map((e) => ({ from: e.oldUrl, to: e.newUrl, type: 301, category: e.category, title: e.title })),
  };

  const outPath = path.join(__dirname, "..", "docs", "redirect-map.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");

  console.log(`Articles mapped: ${entries.length}`);
  console.log(`By category:`, JSON.stringify(byCategory));
  console.log(`Slug collisions within a category: ${collisions.length}`);
  collisions.forEach(([url, v]) => console.log(`   ${url}  <-  ${v.map((e) => e.collection + "/" + e.slug).join(" , ")}`));
  console.log(`Articles missing a slug (need one before migration): ${noSlug.length}`);
  noSlug.forEach((s) => console.log(`   ${s}`));
  console.log(`Hidden drafts skipped: ${hidden.length}`);
  console.log(`\nSample mappings:`);
  out.redirects.slice(0, 8).forEach((r) => console.log(`   ${r.from}  ->  ${r.to}`));
  console.log(`\nWrote ${out.redirects.length} redirects to docs/redirect-map.json`);
  process.exit(0);
}
main();
