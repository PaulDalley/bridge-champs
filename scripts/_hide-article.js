// Hide (de-index) an article by slug: sets isHidden=true so the content app 404s
// it and the sitemap excludes it. Reversible (set isHidden=false). Read-only report
// of which other article bodies still link to it.
// Run: node scripts/_hide-article.js <slug>
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
  throw new Error("No key.");
}
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(resolveKey(), "utf8"))) });
const db = admin.firestore();
const SLUG = process.argv[2];
if (!SLUG) { console.error("usage: node scripts/_hide-article.js <slug>"); process.exit(1); }
const COLLECTIONS = [["bidding", "biddingBody"], ["biddingAdvanced", "biddingAdvancedBody"], ["biddingBasics", "biddingBasicsBody"], ["cardPlay", "cardPlayBody"], ["cardPlayBasics", "cardPlayBasicsBody"], ["counting", "countingBody"], ["defence", "defenceBody"], ["defenceBasics", "defenceBasicsBody"], ["beginnerCardPlay", "beginnerCardPlayBody"], ["beginnerDefence", "beginnerDefenceBody"], ["beginnerBidding", "beginnerBiddingBody"]];
const extractBody = (d) => { if (!d) return ""; const c = d.text != null ? d.text : d.body; return typeof c === "string" ? c : (c && typeof c.text === "string" ? c.text : ""); };
(async () => {
  let target = null;
  for (const [sum] of COLLECTIONS) {
    const snap = await db.collection(sum).where("slug", "==", SLUG).limit(1).get();
    if (!snap.empty) { target = { coll: sum, doc: snap.docs[0] }; break; }
  }
  if (!target) { console.error("Article not found:", SLUG); process.exit(1); }
  await target.doc.ref.set({ isHidden: true, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  console.log(`HIDDEN: ${target.coll}/${target.doc.id} (slug ${SLUG})`);
  console.log("Inbound links to this slug in other article bodies:");
  let n = 0;
  for (const [sum, bod] of COLLECTIONS) {
    const snap = await db.collection(sum).get();
    for (const doc of snap.docs) {
      const d = doc.data(); if (!d.slug || d.slug === SLUG) continue;
      const bd = await db.collection(bod).doc(d.body || doc.id).get();
      if (bd.exists && extractBody(bd.data()).includes("/" + SLUG)) { console.log("  " + d.slug); n++; }
    }
  }
  console.log(`  (${n} articles link to it — the rollout will drop footer links once it's out of topicHubs)`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
