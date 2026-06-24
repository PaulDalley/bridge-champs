// Roll out "Read next" before/after internal links to every article, driven by
// the ordered groups in content-app/lib/topicHubs.js (the authoritative taxonomy).
// For each article: ~2 hub-group siblings before + ~2 after (reading order) as
// DIRECT /learn URLs, then a "Browse all <topic>" hub link. Replaces any existing
// trailing Read-next/Browse-all/arrow footer; never touches body content above it.
//
//   node scripts/_rollout-read-next.js           -> DRY RUN (no writes, prints plan)
//   node scripts/_rollout-read-next.js --apply    -> writes Firestore + emits revalidate paths
const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const APPLY = process.argv.includes("--apply");

function resolveKey() {
  const dl = path.join(os.homedir(), "Downloads", "firebase key.json");
  if (fs.existsSync(dl)) return dl;
  const root = path.join(__dirname, "..", "serviceAccountKey.json");
  if (fs.existsSync(root)) return root;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  throw new Error("No service account key.");
}
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(resolveKey(), "utf8"))) });
const db = admin.firestore();

const COLLECTIONS = [
  ["bidding", "biddingBody"], ["biddingAdvanced", "biddingAdvancedBody"], ["biddingBasics", "biddingBasicsBody"],
  ["cardPlay", "cardPlayBody"], ["cardPlayBasics", "cardPlayBasicsBody"], ["counting", "countingBody"],
  ["defence", "defenceBody"], ["defenceBasics", "defenceBasicsBody"],
  ["beginnerCardPlay", "beginnerCardPlayBody"], ["beginnerDefence", "beginnerDefenceBody"], ["beginnerBidding", "beginnerBiddingBody"],
];
const SUMM_TO_CAT = {
  bidding: "bidding", biddingAdvanced: "bidding", biddingBasics: "bidding",
  cardPlay: "declarer", cardPlayBasics: "declarer", counting: "declarer",
  defence: "defence", defenceBasics: "defence",
  beginnerCardPlay: "beginner", beginnerDefence: "beginner", beginnerBidding: "beginner",
};
const extractBody = (d) => { if (!d) return ""; const c = d.text != null ? d.text : d.body; return typeof c === "string" ? c : (c && typeof c.text === "string" ? c.text : ""); };
const lastSeg = (to) => String(to).split("?")[0].replace(/\/+$/, "").split("/").pop();

function loadCategories() {
  const src = fs.readFileSync(path.join(__dirname, "..", "content-app", "lib", "topicHubs.js"), "utf8");
  const js = src.replace(/^\s*import .*$/gm, "").replace(/export default /g, "var __def = ").replace(/export (const|let|var|function|class)/g, "$1");
  const tmp = path.join(os.tmpdir(), "topicHubs_cjs_" + process.pid + ".js");
  fs.writeFileSync(tmp, js + "\nmodule.exports = { CATEGORIES: (typeof CATEGORIES !== 'undefined' ? CATEGORIES : []) };\n");
  const mod = require(tmp); fs.unlinkSync(tmp); return mod.CATEGORIES;
}
function buildGroups(CATEGORIES) {
  const groups = [];
  for (const cat of (CATEGORIES || [])) {
    for (const topic of (cat.topics || [])) {
      const add = (arts) => { const items = (arts || []).map((a) => ({ slug: lastSeg(a.to), title: a.title })); if (items.length) groups.push({ catKey: cat.key, topicSlug: topic.slug, topicName: topic.name, items }); };
      if (Array.isArray(topic.groups)) topic.groups.forEach((g) => add(g.articles));
      if (Array.isArray(topic.articles)) add(topic.articles);
    }
  }
  return groups;
}
function chooseSiblings(items, idx, target) {
  const chosen = [];
  for (let d = 1; chosen.length < target && d < items.length; d++) {
    if (idx - d >= 0) { chosen.push(idx - d); if (chosen.length >= target) break; }
    if (idx + d < items.length) chosen.push(idx + d);
  }
  chosen.sort((a, b) => a - b);
  return chosen.map((i) => items[i]);
}
// Strip TRAILING nav/footer blocks. Tempered patterns match only the LAST
// <p>/<ul>/<aside> (no greedy run-back over the whole body), and a block is
// removed only if its text carries an unambiguous footer signature, so genuine
// content lists are safe. Comment-delimited BACKFILL asides are removed wholesale.
const FOOTER_SIG = /Read[ -]?next|Browse all|Articles Hub|Related:|BACKFILL|readnext-teaser|&rarr;|href="\/(?:bidding|declarer|defence|cardplay)\/advanced[/"]/i;
const STRONG_SIG = /Read[ -]?next|Browse all|Articles Hub|Related:|BACKFILL|readnext-teaser/i;
function stripFooter(body) {
  const removed = [];
  let b = String(body).replace(/<!--\s*BACKFILL:read-next[\s\S]*?\/BACKFILL:read-next[^>]*-->/gi, (m) => { removed.push(m); return ""; }).replace(/\s+$/, "");
  const blockPats = [
    /[ \t]*<p>(?:(?!<\/?p>)[\s\S])*?<\/p>\s*$/i,
    /[ \t]*<ul>(?:(?!<\/?ul>)[\s\S])*?<\/ul>\s*$/i,
    /[ \t]*<aside\b[^>]*>(?:(?!<\/?aside>)[\s\S])*?<\/aside>\s*$/i,
  ];
  let changed = true, guard = 0;
  while (changed && guard++ < 20) {
    changed = false;
    for (const p of blockPats) {
      const m = b.match(p);
      if (m && FOOTER_SIG.test(m[0])) { removed.push(m[0]); b = b.slice(0, b.length - m[0].length).replace(/\s+$/, ""); changed = true; break; }
    }
  }
  return { body: b, removed };
}

(async () => {
  const art = {};
  for (const [sum, bod] of COLLECTIONS) {
    const snap = await db.collection(sum).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      if (!d.slug || d.isHidden || (d.redirectTo && String(d.redirectTo).startsWith("/"))) continue;
      if (art[d.slug]) continue;
      const bd = await db.collection(bod).doc(d.body || doc.id).get();
      const raw = bd.exists ? bd.data() : null;
      art[d.slug] = { cat: SUMM_TO_CAT[sum], bodyColl: bod, bodyId: d.body || doc.id, title: d.title || d.slug, body: raw ? extractBody(raw) : "", raw };
    }
  }
  const groups = buildGroups(loadCategories());
  groups.forEach((g) => { g.pub = g.items.filter((it) => art[it.slug]); });
  const home = {};
  groups.forEach((g) => { if (g.pub.length >= 2) g.pub.forEach((it, idx) => { if (!(it.slug in home)) home[it.slug] = { g, idx }; }); });
  groups.forEach((g) => { g.pub.forEach((it, idx) => { if (!(it.slug in home)) home[it.slug] = { g, idx }; }); });

  const plans = [], skipped = [];
  for (const slug of Object.keys(art)) {
    const h = home[slug];
    if (!h) { skipped.push(slug); continue; }
    const sibs = chooseSiblings(h.g.pub, h.idx, 4).filter((s) => s.slug !== slug);
    const links = sibs.map((s) => `<a href="/learn/${art[s.slug].cat}/${s.slug}">${art[s.slug].title}</a>`);
    const readNext = links.length ? `<p><strong>Read next:</strong> ${links.join(" &middot; ")}</p>` : "";
    const hubUrl = `/learn/${h.g.catKey}/${h.g.topicSlug}`;
    const footer = (readNext ? readNext + "\n\n" : "") + `<p><a href="${hubUrl}">Browse all ${h.g.topicName} &rarr;</a></p>`;
    const sf = stripFooter(art[slug].body);
    const stripped = sf.body;
    const newBody = stripped + "\n\n" + footer;
    const oldLen = String(art[slug].body).length;
    const suspicious = sf.removed.filter((r) => !STRONG_SIG.test(r)); // removed via weak signal (&rarr; / advanced link) only
    plans.push({ slug, cat: art[slug].cat, hubName: h.g.topicName, sibs: sibs.map((s) => s.slug), newBody, oldBody: art[slug].body, stripped, removed: sf.removed, suspicious, oldLen, overStrip: oldLen > 400 && stripped.length < oldLen * 0.7, changed: newBody.trim() !== String(art[slug].body).trim() });
  }

  const willChange = plans.filter((p) => p.changed);
  console.log(`Articles loaded:                 ${Object.keys(art).length}`);
  console.log(`In a hub group (get a footer):   ${plans.length}`);
  console.log(`Will change:                     ${willChange.length}`);
  console.log(`Skipped (not in any hub group):  ${skipped.length}`);
  if (skipped.length) console.log(`  -> ${skipped.join(", ")}`);

  const byCat = {};
  plans.forEach((p) => { (byCat[p.cat] = byCat[p.cat] || []).push(p); });
  console.log(`\n--- SAMPLE footers (up to 3 per category) ---`);
  Object.keys(byCat).sort().forEach((c) => {
    byCat[c].slice(0, 3).forEach((p) => {
      console.log(`\n[${c}] ${p.slug}   (hub: ${p.hubName})`);
      console.log(`  Read next -> ${p.sibs.join(" | ") || "(none — hub link only)"}`);
    });
  });
  const collapse = (s) => String(s).replace(/\s+/g, " ").trim();
  const suspect = plans.filter((p) => p.suspicious.length);
  console.log(`\n!! SUSPICIOUS REMOVALS (a removed block lacked a strong footer signature — could be content): ${suspect.length}`);
  suspect.forEach((p) => p.suspicious.forEach((r) => console.log(`   [${p.slug}] removed-without-strong-sig: ${collapse(r).slice(0, 220)}`)));

  const overs = plans.filter((p) => p.overStrip);
  console.log(`\n--- OVER-STRIP (>30% removed): ${overs.length} — every removed chunk shown; all must be nav/footer ---`);
  overs.forEach((p) => {
    console.log(`\n   ${p.slug}: ${p.oldLen} -> ${p.stripped.length} chars; removed ${p.removed.length} block(s):`);
    p.removed.forEach((r) => console.log(`     - ${collapse(r).slice(0, 240)}`));
  });

  console.log(`\n--- BEFORE/AFTER tail for articles that already had a footer (up to 12) ---`);
  const tail = (s) => String(s).replace(/\s+/g, " ").slice(-200);
  plans.filter((p) => FOOTER_SIG.test(p.oldBody)).slice(0, 12).forEach((p) => {
    console.log(`\n[${p.slug}]`);
    console.log(`  OLD: ...${tail(p.oldBody)}`);
    console.log(`  NEW: ...${tail(p.newBody)}`);
  });

  if (APPLY) {
    if (suspect.length) { console.error(`Refusing to apply: ${suspect.length} suspicious removals. Inspect first.`); process.exit(2); }
    // Backup current bodies (restore-able) before overwriting.
    const backup = {};
    willChange.forEach((p) => { const a = art[p.slug]; backup[p.slug] = { bodyColl: a.bodyColl, bodyId: a.bodyId, raw: a.raw }; });
    fs.writeFileSync(path.join(__dirname, "_read-next-backup.json"), JSON.stringify(backup));
    console.log(`Backed up ${Object.keys(backup).length} bodies -> scripts/_read-next-backup.json`);
    const now = admin.firestore.FieldValue.serverTimestamp();
    const paths = [];
    for (const p of willChange) {
      const a = art[p.slug]; if (!a.raw) continue;
      const field = a.raw.text != null ? "text" : "body";
      const val = typeof a.raw[field] === "object" ? { text: p.newBody } : p.newBody;
      await db.collection(a.bodyColl).doc(a.bodyId).update({ [field]: val, updatedAt: now });
      paths.push(`/learn/${a.cat}/${p.slug}`);
    }
    fs.writeFileSync(path.join(__dirname, "_revalidate-paths.txt"), paths.join("\n") + "\n");
    console.log(`\nAPPLIED to ${paths.length} bodies. Paths -> scripts/_revalidate-paths.txt`);
  } else {
    console.log(`\n(DRY RUN — no writes. Re-run with --apply once approved.)`);
  }
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
