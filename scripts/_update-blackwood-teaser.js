const admin = require("firebase-admin");
const fs = require("fs");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))),
});
const db = admin.firestore();

const TEASER = "The most effective tool for slam bidding. Focusing on the 5 keycards and the Queen of trumps. We need 4/5 of them for slam, and 5/5 for grand slam.";

(async () => {
  const snap = await db.collection("bidding").where("slug", "==", "blackwood-rkcb").limit(1).get();
  if (snap.empty) { console.log("Not found in bidding — trying biddingAdvanced..."); }

  const collections = snap.empty ? ["biddingAdvanced"] : ["bidding"];
  for (const coll of collections) {
    const s = coll === "bidding" ? snap : await db.collection(coll).where("slug", "==", "blackwood-rkcb").limit(1).get();
    if (s.empty) { console.log(`Not found in ${coll}`); continue; }
    const ref = s.docs[0].ref;
    await ref.update({ teaser: TEASER, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    console.log(`Updated teaser in ${coll}/${s.docs[0].id}`);
    console.log("Teaser:", TEASER);
    console.log("Length:", TEASER.length, "chars");
    break;
  }
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
