/**
 * Set summary.hasVideo=true on article metadata docs whose body contains a video.
 *
 * Usage: node scripts/backfill-article-has-video.js
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

const COLLECTIONS = [
  { summary: "cardPlay", body: "cardPlayBody" },
  { summary: "defence", body: "defenceBody" },
  { summary: "bidding", body: "biddingBody" },
  { summary: "biddingAdvanced", body: "biddingAdvancedBody" },
  { summary: "biddingBasics", body: "biddingBasicsBody" },
  { summary: "counting", body: "countingBody" },
  { summary: "beginnerCardPlay", body: "beginnerCardPlayBody" },
  { summary: "beginnerDefence", body: "beginnerDefenceBody" },
  { summary: "beginnerBidding", body: "beginnerBiddingBody" },
];

function bodyHtml(data) {
  if (!data || typeof data !== "object") return "";
  if (typeof data.text === "string") return data.text;
  if (typeof data.body === "string") return data.body;
  if (data.body && typeof data.body === "object" && typeof data.body.text === "string") return data.body.text;
  return "";
}

function contentHasVideo(html) {
  if (!html || typeof html !== "string") return false;
  if (/<Video\s+url=/i.test(html) || /<Video>/i.test(html)) return true;
  if (/youtube\.com\/watch\?v=/i.test(html)) return true;
  if (/youtu\.be\//i.test(html)) return true;
  if (/youtube\.com\/embed\//i.test(html)) return true;
  if (/<iframe[^>]*youtube/i.test(html)) return true;
  if (/vimeo\.com/i.test(html)) return true;
  return false;
}

async function run() {
  const report = { setTrue: [], setFalse: [], skipped: [] };

  for (const cfg of COLLECTIONS) {
    const sumSnap = await db.collection(cfg.summary).get();
    for (const sumDoc of sumSnap.docs) {
      const meta = sumDoc.data() || {};
      if (meta.isHidden === true) continue;
      if (typeof meta.redirectTo === "string" && meta.redirectTo.startsWith("/")) continue;

      const bodyId = typeof meta.body === "string" ? meta.body : sumDoc.id;
      const bodySnap = await db.collection(cfg.body).doc(bodyId).get();
      if (!bodySnap.exists) {
        report.skipped.push({ collection: cfg.summary, id: sumDoc.id, reason: "no body" });
        continue;
      }

      const html = bodyHtml(bodySnap.data() || {});
      const shouldHaveVideo = contentHasVideo(html);
      const currently = meta.hasVideo === true;

      if (shouldHaveVideo === currently) continue;

      await sumDoc.ref.set(
        {
          hasVideo: shouldHaveVideo,
          updatedAt: F.serverTimestamp(),
        },
        { merge: true }
      );

      const row = {
        collection: cfg.summary,
        summaryId: sumDoc.id,
        bodyId,
        title: meta.title || "",
      };
      if (shouldHaveVideo) report.setTrue.push(row);
      else report.setFalse.push(row);
    }
  }

  console.log(JSON.stringify(report, null, 2));
  console.log(`\nMarked hasVideo=true: ${report.setTrue.length}`);
  console.log(`Cleared hasVideo: ${report.setFalse.length}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
