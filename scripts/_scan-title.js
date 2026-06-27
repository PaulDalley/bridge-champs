// Read-only: find any article body or title across all collections containing a
// given string. Used to confirm a retitle left no stale references.
// Run: node scripts/_scan-title.js "Old Title String"
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
const NEEDLE = process.argv[2];
if (!NEEDLE) { console.error('usage: node scripts/_scan-title.js "string"'); process.exit(1); }
const COLLECTIONS = [["bidding", "biddingBody"], ["biddingAdvanced", "biddingAdvancedBody"], ["biddingBasics", "biddingBasicsBody"], ["cardPlay", "cardPlayBody"], ["cardPlayBasics", "cardPlayBasicsBody"], ["counting", "countingBody"], ["defence", "defenceBody"], ["defenceBasics", "defenceBasicsBody"], ["beginnerCardPlay", "beginnerCardPlayBody"], ["beginnerDefence", "beginnerDefenceBody"], ["beginnerBidding", "beginnerBiddingBody"]];
const extractBody = (d) => { if (!d) return ""; const c = d.text != null ? d.text : d.body; return typeof c === "string" ? c : (c && typeof c.text === "string" ? c.text : ""); };
(async () => {
  let hits = 0;
  for (const [sum, bod] of COLLECTIONS) {
    const snap = await db.collection(sum).get();
    for (const doc of snap.docs) {
      const d = doc.data();
      if ((d.title || "").includes(NEEDLE)) { console.log(`TITLE  ${sum}/${d.slug}`); hits++; }
      const bd = await db.collection(bod).doc(d.body || doc.id).get();
      if (bd.exists && extractBody(bd.data()).includes(NEEDLE)) { console.log(`BODY   ${sum}/${d.slug}`); hits++; }
    }
  }
  console.log(`\n${hits} live reference(s) to: "${NEEDLE}"`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
