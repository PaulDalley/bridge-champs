const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const os = require("os");

const slug = "takeout-doubles-complete-guide";

function keyPath() {
  const c = [
    process.env.FIREBASE_SERVICE_ACCOUNT,
    path.join(os.homedir(), "Downloads", "firebase key.json"),
    path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
    path.join(__dirname, "..", "serviceAccountKey.json"),
  ]
    .filter(Boolean)
    .map((p) => path.resolve(p));
  return c.find((p) => fs.existsSync(p));
}

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath(), "utf8"))) });
const db = admin.firestore();

(async () => {
  for (const col of ["biddingAdvanced", "bidding", "biddingBasics"]) {
    const snap = await db.collection(col).where("slug", "==", slug).limit(1).get();
    if (snap.empty) continue;
    const doc = snap.docs[0];
    const s = doc.data();
    const bodyCol = col + "Body";
    const body = await db.collection(bodyCol).doc(s.body).get();
    const t = body.data().text || body.data().body?.text || "";
    fs.writeFileSync(path.join(__dirname, "tmp-tod-body.html"), t, "utf8");
    console.log("COL", col, "ID", doc.id, "BODY_ID", s.body);
    const re = /<MakeBoard[^>]*\/>/g;
    let m;
    let i = 0;
    while ((m = re.exec(t)) !== null) {
      const tag = m[0];
      const bid = tag.match(/bidding="([^"]*)"/);
      const dealer = tag.match(/dealer="([^"]*)"/);
      const south = tag.match(/South="([^"]*)"/);
      console.log("\n--- board", i, "---");
      console.log("dealer:", dealer ? dealer[1] : "?");
      console.log("bidding:", bid ? bid[1] : "?");
      if (south) console.log("South hand:", south[1]);
      i++;
    }
    return;
  }
  console.log("not found");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
