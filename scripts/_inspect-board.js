// scratch: find how existing article bodies encode boards/auctions
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
(async () => {
  const snap = await db.collection("biddingBody").get();
  let mk = 0, ad = 0;
  for (const doc of snap.docs) {
    const data = doc.data() || {};
    const t = data.text || (data.body && data.body.text) || "";
    const tags = t.match(/<MakeBoard[^>]*\/?>/g);
    if (tags && mk < 4) {
      console.log("[MakeBoard] doc", doc.id);
      tags.slice(0, 2).forEach((x) => console.log("   ", x));
      mk++;
    }
    const ads = t.match(/<AuctionDiagram[^>]*\/?>/g);
    if (ads && ad < 3) {
      console.log("[AuctionDiagram] doc", doc.id);
      ads.slice(0, 2).forEach((x) => console.log("   ", x));
      ad++;
    }
  }
  console.log(`\nscanned ${snap.size} biddingBody docs | with MakeBoard: ${mk>0?"yes":"none"} | with AuctionDiagram: ${ad>0?"yes":"none"}`);
  process.exit(0);
})();
