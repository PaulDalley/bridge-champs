const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPathCandidates = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
];
const keyPath = keyPathCandidates.find((p) => fs.existsSync(p));

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();

(async () => {
  const snap = await db.collection("bidding").where("slug", "==", "stayman-convention-find-4-4").limit(1).get();
  if (!snap.empty) {
    const doc = snap.docs[0];
    console.log(`Deleting: "${doc.data().title}"`);
    await doc.ref.delete();
    console.log("✓ Deleted from Firestore");
  } else {
    console.log("Not found");
  }
})();
