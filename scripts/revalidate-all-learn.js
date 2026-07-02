/**
 * Revalidate every published /learn article path with the CORRECT category
 * mapping (cardPlay/counting -> declarer, beginner* -> beginner).
 * Secret via env: REVALIDATE_SECRET=... node scripts/revalidate-all-learn.js
 */
const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");
const https = require("https");
const { URL } = require("url");

const keyPath = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
].find((p) => fs.existsSync(p));
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))) });
const db = admin.firestore();

const ORIGIN = "https://bc-content-surk2ebu7q-uc.a.run.app";
const SECRET = process.env.REVALIDATE_SECRET;
if (!SECRET) { console.error("Set REVALIDATE_SECRET env var"); process.exit(1); }

const COLLECTIONS = ["bidding", "defence", "cardPlay", "counting", "beginnerBidding", "beginnerCardPlay", "beginnerDefence"];
const SUMM_TO_CAT = {
  bidding: "bidding", defence: "defence", cardPlay: "declarer", counting: "declarer",
  beginnerBidding: "beginner", beginnerCardPlay: "beginner", beginnerDefence: "beginner",
};

function revalidate(p) {
  return new Promise((resolve) => {
    const u = new URL(`${ORIGIN}/api/revalidate`);
    u.searchParams.set("secret", SECRET);
    u.searchParams.set("path", p);
    const req = https.request(u, { method: "POST", headers: { "Content-Length": 0 } }, (res) => {
      let body = ""; res.on("data", (d) => (body += d));
      res.on("end", () => resolve({ p, code: res.statusCode, ok: res.statusCode === 200 }));
    });
    req.on("error", () => resolve({ p, code: 0, ok: false }));
    req.end();
  });
}

(async () => {
  const paths = [];
  for (const c of COLLECTIONS) {
    const snap = await db.collection(c).get();
    snap.docs.forEach((d) => {
      const x = d.data();
      if (!x.slug || x.isHidden) return;
      paths.push(`/learn/${SUMM_TO_CAT[c]}/${x.slug}`);
    });
  }
  const uniq = [...new Set(paths)];
  console.log(`Revalidating ${uniq.length} paths...`);

  let ok = 0, fail = 0;
  // small concurrency
  const CONC = 8;
  for (let i = 0; i < uniq.length; i += CONC) {
    const batch = uniq.slice(i, i + CONC);
    const res = await Promise.all(batch.map(revalidate));
    res.forEach((r) => { if (r.ok) ok++; else { fail++; console.log(`  FAIL ${r.code} ${r.p}`); } });
  }
  console.log(`\nDone. ok=${ok} fail=${fail}`);
})().catch((e) => { console.error(e); process.exit(1); });
