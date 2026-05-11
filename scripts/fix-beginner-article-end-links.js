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
  const summaryId = "jQL1MYo0cR01ph0PURnt";
  const summaryRef = db.collection("beginnerCardPlay").doc(summaryId);
  const summaryData = (await summaryRef.get()).data() || {};
  const bodyId = summaryData.body;
  if (!bodyId) throw new Error("Missing body id on summary");

  const bodyRef = db.collection("beginnerCardPlayBody").doc(bodyId);
  const bodyData = (await bodyRef.get()).data() || {};
  let text = String(bodyData.text || ((bodyData.body || {}).text) || "");

  const replacement = [
    "<h3>Where to next</h3>",
    "<ul>",
    '  <li><a href="/beginner/articles/declarer/CHceqeWpWsRcHIFnGA1N">→ Next: Drawing Trumps</a></li>',
    '  <li><a href="/beginner/articles/declarer/scRLDZcTTmboZFDVRTq5">→ Related: Ruff in Dummy</a></li>',
    '  <li><a href="/beginner/articles/declarer">→ Back to Beginner Declarer Articles Hub</a></li>',
    "</ul>",
  ].join("\n");

  const re = /<h3>Related reading<\/h3>[\s\S]*?<\/ul>/i;
  if (re.test(text)) {
    text = text.replace(re, replacement);
  } else {
    text += `\n\n${replacement}`;
  }

  await bodyRef.set(
    {
      text,
      body: { text },
      updatedAt: F.serverTimestamp(),
    },
    { merge: true }
  );

  await summaryRef.set(
    {
      relatedLinks: [
        "/beginner/articles/declarer",
        "/beginner/articles/declarer/CHceqeWpWsRcHIFnGA1N",
        "/beginner/articles/declarer/scRLDZcTTmboZFDVRTq5",
      ].join("\n"),
      ctaTarget: "/beginner/articles/declarer",
      updatedAt: F.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`Updated end links for ${summaryId} (body ${bodyId})`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
