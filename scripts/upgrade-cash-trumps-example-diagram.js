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
  const summaryId = "cKp3xSZor9xDNp0t3o78";
  const summary = (await db.collection("beginnerCardPlay").doc(summaryId).get()).data() || {};
  const bodyId = summary.body;
  if (!bodyId) throw new Error("Missing body id");

  const bodyRef = db.collection("beginnerCardPlayBody").doc(bodyId);
  const bodyData = (await bodyRef.get()).data() || {};
  let text = String(bodyData.text || ((bodyData.body || {}).text) || "");

  const from = "<h3>Other common examples</h3><pre>KQx opposite Axxxx\nKJx opposite AQxx</pre>";
  const to = [
    "<h3>Other common examples</h3>",
    "<table>",
    "  <thead>",
    "    <tr><th>Example</th><th>Short hand</th><th>Long hand</th><th>Idea</th></tr>",
    "  </thead>",
    "  <tbody>",
    "    <tr><td>A</td><td><code>KQx</code></td><td><code>Axxxx</code></td><td>Unblock short-hand honors, then run length.</td></tr>",
    "    <tr><td>B</td><td><code>KJx</code></td><td><code>AQxx</code></td><td>Choose order carefully to avoid stranding a winner.</td></tr>",
    "  </tbody>",
    "</table>",
    "<p><strong>Plain text recap:</strong> KQx opposite Axxxx, and KJx opposite AQxx are classic holdings where card order matters.</p>",
  ].join("");

  if (!text.includes(from)) {
    throw new Error("Expected target section not found; article format may have changed.");
  }
  text = text.replace(from, to);

  await bodyRef.set(
    {
      text,
      body: { text },
      updatedAt: F.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`Updated diagram section for ${summaryId} (body ${bodyId})`);
}

run().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
