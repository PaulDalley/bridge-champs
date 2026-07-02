/**
 * Pass 1 remediation for the damage done by fix-orphaned-inbound-links.js /
 * fix-remaining-orphaned.js (run on the wrong engine):
 *   (a) remove dangling "<label> &rarr;</a></p>" footer fragments (partial strips)
 *   (b) remove read-next anchors pointing to the 9 deleted articles
 * Prose is never touched (only trailing footer nav). Backs up every changed body.
 *
 *   node scripts/fix-footer-corruption.js            -> DRY RUN
 *   APPLY=1 node scripts/fix-footer-corruption.js    -> write + emit revalidate paths
 */
const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");
const keyPath = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
].find((p) => fs.existsSync(p));
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))) });
const db = admin.firestore();
const APPLY = process.env.APPLY === "1";

const COLLECTIONS = [
  ["bidding", "biddingBody"], ["defence", "defenceBody"], ["cardPlay", "cardPlayBody"],
  ["counting", "countingBody"], ["beginnerBidding", "beginnerBiddingBody"],
  ["beginnerCardPlay", "beginnerCardPlayBody"], ["beginnerDefence", "beginnerDefenceBody"],
];
const SUMM_TO_CAT = {
  bidding: "bidding", defence: "defence", cardPlay: "cardPlay", counting: "counting",
  beginnerBidding: "beginnerBidding", beginnerCardPlay: "beginnerCardPlay", beginnerDefence: "beginnerDefence",
};
const DELETED = new Set([
  "non-vulnerable-preempting-apply-maximum", "bidding-conversation-share-information-efficiently",
  "draw-trumps-purpose-avoid-autopilot", "count-potential-losers-spot-hidden",
  "finesse-double-finesse-create-extra", "lead-towards-weakness-beginners-target",
  "second-hand-low-beginners-exceptions", "third-hand-high-beginners-win", "stayman-convention-find-4-4",
]);
const getText = (d) => (d && (typeof d.text === "string" ? d.text : (d.body && typeof d.body.text === "string" ? d.body.text : ""))) || "";
const collapse = (s) => String(s).replace(/\s+/g, " ").trim();

// A dangling fragment: a line (after a newline) that does NOT start with '<'
// and ends with "&rarr;</a></p>" (the tail of a stripped Browse-all line).
const FRAG_RE = /\n[ \t]*[^<\n][^\n]*?&rarr;<\/a><\/p>/g;

function clean(body) {
  const removedFrags = [];
  let b = String(body);

  // (a) strip dangling fragments
  b = b.replace(FRAG_RE, (m) => { removedFrags.push(m.replace(/^\n/, "")); return ""; });

  // (b) repair the read-next paragraph: drop anchors to deleted slugs
  let readNextChanged = false;
  const droppedLinks = [];
  b = b.replace(/<p><strong>Read next:<\/strong>([\s\S]*?)<\/p>/i, (full, inner) => {
    const parts = inner.split("&middot;").map((s) => s.trim()).filter(Boolean);
    const kept = parts.filter((a) => {
      const m = a.match(/href="\/learn\/[^\/"]+\/([^"]+)"/);
      if (m && DELETED.has(m[1])) { droppedLinks.push(m[1]); readNextChanged = true; return false; }
      return true;
    });
    if (!kept.length) { readNextChanged = true; return ""; } // drop empty para entirely
    if (kept.length !== parts.length) readNextChanged = true;
    return `<p><strong>Read next:</strong> ${kept.join(" &middot; ")}</p>`;
  });

  // normalise blank-line runs left behind
  b = b.replace(/\n{3,}/g, "\n\n").replace(/\s+$/, "") + "\n";

  return { body: b, removedFrags, droppedLinks, readNextChanged };
}

(async () => {
  const changes = [];
  let suspicious = 0;

  for (const [sum, bod] of COLLECTIONS) {
    const snap = await db.collection(sum).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      if (!d.slug || !d.body) continue;
      const bref = db.collection(bod).doc(d.body);
      const bsnap = await bref.get();
      if (!bsnap.exists) continue;
      const raw = bsnap.data();
      const before = getText(raw);
      const { body: after, removedFrags, droppedLinks, readNextChanged } = clean(before);
      if (after.trim() === before.trim()) continue;

      // SAFETY: every removed fragment must look like footer nav, never content.
      const bad = removedFrags.filter((f) => f.length > 80 || /<p\b|<h[1-6]|<img|<MakeBoard|Read next/i.test(f) || !/&rarr;<\/a><\/p>$/.test(f.trim()));
      if (bad.length) { suspicious += bad.length; }

      changes.push({
        sum, bod, slug: d.slug, title: d.title, bodyId: d.body,
        cat: SUMM_TO_CAT[sum], before, after, raw,
        fragCount: removedFrags.length, removedFrags, droppedLinks, readNextChanged,
        bad,
        delta: before.length - after.length,
      });
    }
  }

  console.log(`Bodies needing cleanup: ${changes.length}\n${"=".repeat(80)}`);
  changes.forEach((c) => {
    console.log(`\n[${c.sum}] ${c.title}  (${c.slug})  -${c.delta} chars`);
    if (c.fragCount) console.log(`   frags removed (${c.fragCount}): ${[...new Set(c.removedFrags.map((f) => collapse(f)))].join("  |  ")}`);
    if (c.droppedLinks.length) console.log(`   broken read-next links dropped: ${c.droppedLinks.join(", ")}`);
    if (c.bad.length) console.log(`   !!! SUSPICIOUS removed chunk(s): ${c.bad.map(collapse).join(" || ")}`);
  });

  console.log(`\n${"=".repeat(80)}`);
  console.log(`Total bodies to change:        ${changes.length}`);
  console.log(`Total frags removed:           ${changes.reduce((n, c) => n + c.fragCount, 0)}`);
  console.log(`Total broken links dropped:    ${changes.reduce((n, c) => n + c.droppedLinks.length, 0)}`);
  console.log(`Suspicious removals (must be 0 to apply): ${suspicious}`);

  if (!APPLY) { console.log(`\n(DRY RUN — no writes. Re-run with APPLY=1 once confirmed.)`); return; }
  if (suspicious) { console.error(`\nREFUSING TO APPLY: ${suspicious} suspicious removals. Inspect first.`); process.exit(2); }

  // backup
  const backup = {};
  changes.forEach((c) => { backup[c.slug] = { bod: c.bod, bodyId: c.bodyId, before: c.before }; });
  fs.writeFileSync(path.join(__dirname, "_footer-corruption-backup.json"), JSON.stringify(backup, null, 0));
  console.log(`\nBacked up ${Object.keys(backup).length} bodies -> scripts/_footer-corruption-backup.json`);

  const now = admin.firestore.FieldValue.serverTimestamp();
  const paths = [];
  for (const c of changes) {
    const field = typeof c.raw.text === "string" ? "text" : "body";
    const val = field === "body" && typeof c.raw.body === "object" ? { text: c.after } : c.after;
    await db.collection(c.bod).doc(c.bodyId).update({ [field]: val, updatedAt: now });
    paths.push(`/learn/${c.cat}/${c.slug}`);
  }
  fs.writeFileSync(path.join(__dirname, "_revalidate-corruption-paths.txt"), paths.join("\n") + "\n");
  console.log(`APPLIED to ${paths.length} bodies. Paths -> scripts/_revalidate-corruption-paths.txt`);
})().catch((e) => { console.error(e); process.exit(1); });
