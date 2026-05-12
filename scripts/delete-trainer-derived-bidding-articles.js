const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPathCandidates = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
];
const keyPath = keyPathCandidates.find((p) => fs.existsSync(p));
if (!keyPath) throw new Error("No Firebase service account key found.");

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();

// Trainer-derived articles created in this session (+ Lebensohl article requested for removal)
const summaryIds = [
  "3rcWPkKTvaD90WRyRdMg", // Lebensohl standalone article
  "5QKP4YsgR0u6dHfQDl9x",
  "R1a4lEsuLvKWGrtvKgvG",
  "iI0GqL9J1Yj3D7gJIhD6",
  "kM93Bxv1ZrZdZVia1hJ1",
  "AQWBgqLgLtGnczEyaoqW",
  "RzaCo7BDQ7IFrDWJdYX0",
  "ZYZfKNNvSnonBBI3zARw",
  "BYzRX5RX0IJKXUYfsN0k",
  "vEucKTZQouMrbL2b2LbM",
  "8RXxh3yyTPbgsguior2Q",
  "BlU30t5jc9A5L84X93wP",
  "vHmKAs0w9Y6ufXW1oyPC",
  "WCNxPT0xk1eiZ6oIn218",
  "gpwdbazMvQwsPt0qV72x",
  "I7cGvaE9GJWaKnYRWoZE",
  "hSdOzo1256YiXxavgBJM",
];

async function main() {
  let deletedSummaries = 0;
  let deletedBodies = 0;

  for (const summaryId of summaryIds) {
    const summaryRef = db.collection("bidding").doc(summaryId);
    const summarySnap = await summaryRef.get();
    if (!summarySnap.exists) {
      console.log(`SKIP summary missing: ${summaryId}`);
      continue;
    }
    const summary = summarySnap.data() || {};
    const bodyId = summary.body;

    if (bodyId) {
      const bodyRef = db.collection("biddingBody").doc(bodyId);
      const bodySnap = await bodyRef.get();
      if (bodySnap.exists) {
        await bodyRef.delete();
        deletedBodies += 1;
        console.log(`Deleted body: ${bodyId}`);
      } else {
        console.log(`SKIP body missing: ${bodyId}`);
      }
    } else {
      console.log(`No body id on summary: ${summaryId}`);
    }

    await summaryRef.delete();
    deletedSummaries += 1;
    console.log(`Deleted summary: ${summaryId}`);
  }

  console.log(`Done. Deleted ${deletedSummaries} summaries and ${deletedBodies} bodies.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
