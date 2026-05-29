/**
 * Embed YouTube Shorts in beginner declarer articles (from video descriptions).
 *
 * Usage: node scripts/embed-youtube-shorts-in-articles.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPathCandidates = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
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

const PAIRS = [
  {
    videoId: "6ahll1-usMY",
    bodyId: "CHceqeWpWsRcHIFnGA1N",
    title: "Drawing Trumps",
  },
  {
    videoId: "mkzaNn-jnLI",
    bodyId: "7nKvD5E5BYBrkAX1lmFS",
    title: "Finesses / Low Towards Honors",
  },
  {
    videoId: "WD35cmAGuZg",
    bodyId: "v5mZyAQXeBBWpgDD2PUj",
    title: "Playing Long Suits",
  },
  {
    videoId: "0bFXfKRBwL0",
    bodyId: "pchVEKAanUjUGJMnSy9Y",
    title: "Honor Sequences KQJ10",
  },
];

function bodyHtml(data) {
  if (!data || typeof data !== "object") return "";
  if (typeof data.text === "string") return data.text;
  if (data.body && typeof data.body.text === "string") return data.body.text;
  return "";
}

function embedAfterFirstH2(html, videoId) {
  if (html.includes(videoId)) return html;
  const tag = `<Video url="https://www.youtube.com/watch?v=${videoId}" />`;
  const replaced = html.replace(/(<h2>[\s\S]*?<\/h2>)/i, `$1${tag}`);
  if (replaced === html) {
    throw new Error("Could not find <h2> to insert video after");
  }
  return replaced;
}

async function setSummaryHasVideo(bodyId) {
  const snap = await db.collection("beginnerCardPlay").where("body", "==", bodyId).limit(1).get();
  if (snap.empty) {
    console.warn(`  No summary doc for body ${bodyId}`);
    return;
  }
  await snap.docs[0].ref.set({ hasVideo: true, updatedAt: F.serverTimestamp() }, { merge: true });
}

async function run() {
  const results = [];

  for (const { videoId, bodyId, title } of PAIRS) {
    const ref = db.collection("beginnerCardPlayBody").doc(bodyId);
    const snap = await ref.get();
    if (!snap.exists) throw new Error(`Body not found: ${bodyId}`);

    const original = bodyHtml(snap.data() || {});
    const updated = embedAfterFirstH2(original, videoId);
    const changed = updated !== original;

    if (changed) {
      await ref.set(
        { text: updated, body: { text: updated }, updatedAt: F.serverTimestamp() },
        { merge: true }
      );
    }

    await setSummaryHasVideo(bodyId);

    results.push({
      title,
      bodyId,
      videoId,
      url: `https://bridgechampions.com/beginner/articles/declarer/${bodyId}`,
      changed,
    });
  }

  console.log(JSON.stringify(results, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
