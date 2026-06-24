// Read-only audit: internal "Read next" / onward-link coverage across every article.
// Usage: node scripts/_audit-internal-links.js
const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

function resolveKey() {
  const dl = path.join(os.homedir(), "Downloads", "firebase key.json");
  if (fs.existsSync(dl)) return dl;
  const root = path.join(__dirname, "..", "serviceAccountKey.json");
  if (fs.existsSync(root)) return root;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  throw new Error("No service account key found.");
}
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(resolveKey(), "utf8"))) });
const db = admin.firestore();

const COLLECTIONS = [
  ["bidding", "biddingBody"], ["biddingAdvanced", "biddingAdvancedBody"], ["biddingBasics", "biddingBasicsBody"],
  ["cardPlay", "cardPlayBody"], ["cardPlayBasics", "cardPlayBasicsBody"], ["counting", "countingBody"],
  ["defence", "defenceBody"], ["defenceBasics", "defenceBasicsBody"],
  ["beginnerCardPlay", "beginnerCardPlayBody"], ["beginnerDefence", "beginnerDefenceBody"], ["beginnerBidding", "beginnerBiddingBody"],
];
function extractBody(data) {
  if (!data) return "";
  const c = data.text != null ? data.text : data.body;
  return typeof c === "string" ? c : (c && typeof c.text === "string" ? c.text : "");
}

(async () => {
  const rows = [];
  for (const [sum, bod] of COLLECTIONS) {
    const snap = await db.collection(sum).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      if (!d.slug || d.isHidden || (d.redirectTo && String(d.redirectTo).startsWith("/"))) continue;
      const bodyDoc = await db.collection(bod).doc(d.body || doc.id).get();
      const body = bodyDoc.exists ? extractBody(bodyDoc.data()) : "";
      const learnLinks = (body.match(/href=["']\/learn\/[^"']+["']/g) || []).length;
      const anyInternal = (body.match(/href=["']\/[^"']+["']/g) || []).length;
      rows.push({
        coll: sum, slug: d.slug, free: !!d.isFree, learnLinks, anyInternal,
        hasReadNext: /Read next/i.test(body), title: d.title || "",
      });
    }
  }
  const total = rows.length;
  const pct = (n) => `${Math.round((n / total) * 100)}%`;
  const withLearn = rows.filter((r) => r.learnLinks > 0).length;
  const withReadNext = rows.filter((r) => r.hasReadNext).length;
  const zero = rows.filter((r) => r.anyInternal === 0);
  const dist = {};
  rows.forEach((r) => { const k = r.learnLinks >= 5 ? "5+" : String(r.learnLinks); dist[k] = (dist[k] || 0) + 1; });

  console.log(`Total publishable articles: ${total}`);
  console.log(`  with >=1 /learn/ internal link: ${withLearn} (${pct(withLearn)})`);
  console.log(`  with a "Read next" block:       ${withReadNext} (${pct(withReadNext)})`);
  console.log(`  with ZERO internal links:       ${zero.length} (${pct(zero.length)})`);
  console.log(`  /learn link-count distribution:`, dist);
  console.log(`\nZero-internal-link articles (${zero.length}):`);
  zero.sort((a, b) => (b.free - a.free)).forEach((r) => console.log(`  ${r.free ? "[FREE]" : "[paid]"} [${r.coll}] ${r.slug} — ${r.title}`));
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
