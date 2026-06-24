// scratch: is a Blackwood/RKCB article already published in Firestore?
const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");
function keyPath() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) return process.env.FIREBASE_SERVICE_ACCOUNT;
  const d = path.join(os.homedir(), "Downloads", "firebase key.json");
  if (fs.existsSync(d)) return d;
  const r = path.join(__dirname, "..", "serviceAccountKey.json");
  if (fs.existsSync(r)) return r;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  return null;
}
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath(), "utf8"))) });
const db = admin.firestore();
const rx = /blackwood|rkcb|key ?card|roman key/i;
(async () => {
  let total = 0, hits = [];
  for (const col of ["bidding", "biddingBody"]) {
    const snap = await db.collection(col).get();
    total += snap.size;
    snap.docs.forEach((d) => {
      const t = d.data() || {};
      const hay = `${t.title || ""} ${t.slug || ""} ${t.metaTitle || ""}`;
      if (rx.test(hay)) {
        const upd = t.updatedAt && t.updatedAt.toDate ? t.updatedAt.toDate().toISOString() : "?";
        hits.push(`[${col}] ${d.id} | title="${t.title || ""}" | slug="${t.slug || ""}" | isFree=${t.isFree} | updated=${upd}`);
      }
    });
  }
  console.log("scanned", total, "docs across bidding + biddingBody");
  if (!hits.length) console.log("NO Blackwood / RKCB article exists in Firestore.");
  else hits.forEach((h) => console.log("FOUND:", h));
  process.exit(0);
})();
