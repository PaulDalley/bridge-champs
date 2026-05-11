const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPathCandidates = [
  "serviceAccountKey.json",
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
];
const keyPath = keyPathCandidates.find((p) => fs.existsSync(p));

if (!keyPath) {
  console.error("No Firebase service account key found.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const F = admin.firestore.FieldValue;

async function run() {
  const summaryId = "JEFXuHAqaGfQ7BNHSJqF";
  const summary = (await db.collection("beginnerCardPlay").doc(summaryId).get()).data() || {};
  const bodyId = summary.body;
  if (!bodyId) throw new Error("Missing body id.");

  const bodyRef = db.collection("beginnerCardPlayBody").doc(bodyId);
  const bodyData = (await bodyRef.get()).data() || {};
  let text = String(bodyData.text || ((bodyData.body || {}).text) || "");

  text = text.replace(
    "<ul><li>One hand: AJ10</li><li>Other hand: xxx</li></ul>",
    "<pre>One hand: AJ10\nOther hand: xxx</pre>"
  );

  await bodyRef.set(
    {
      text,
      body: { text },
      updatedAt: F.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`Updated hand block formatting for ${summaryId} (body ${bodyId})`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
