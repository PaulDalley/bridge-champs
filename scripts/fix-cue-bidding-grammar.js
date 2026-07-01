/**
 * Fix two grammar issues in the cue-bidding article.
 * 1. "and successfully stayed out of slam" → "and therefore successfully stayed out of slam"
 * 2. "Since we do not either have a control in diamonds," → "Since we do not have a control in diamonds either,"
 *
 * Usage: node scripts/fix-cue-bidding-grammar.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");
const https = require("https");

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

async function findArticleBySlug(slug) {
  const snap = await db.collection("bidding").where("slug", "==", slug).limit(1).get();
  if (snap.empty) {
    throw new Error(`Article not found with slug: ${slug}`);
  }
  return snap.docs[0];
}

async function fixArticle() {
  console.log("Finding cue-bidding article...");
  const summaryDoc = await findArticleBySlug("cue-bidding");
  const summaryData = summaryDoc.data();
  const bodyId = summaryData.body;

  console.log(`Found summary doc: ${summaryDoc.id}`);
  console.log(`Body ID: ${bodyId}`);

  const bodyRef = db.collection("biddingBody").doc(bodyId);
  const bodySnap = await bodyRef.get();

  if (!bodySnap.exists) {
    throw new Error(`Body doc not found: ${bodyId}`);
  }

  let text = bodySnap.data().text || "";

  console.log("Applying fixes...");

  // Fix 1: "and successfully stayed out of slam" → "and therefore successfully stayed out of slam"
  const fix1Original = "and successfully stayed out of slam";
  const fix1New = "and therefore successfully stayed out of slam";

  if (text.includes(fix1Original)) {
    text = text.replace(fix1Original, fix1New);
    console.log(`✓ Fix 1 applied: "${fix1Original}" → "${fix1New}"`);
  } else {
    console.log(`✗ Fix 1 not found in text`);
  }

  // Fix 2: "Since we do not either have a control in diamonds," → "Since we do not have a control in diamonds either,"
  const fix2Original = "Since we do not either have a control in diamonds,";
  const fix2New = "Since we do not have a control in diamonds either,";

  if (text.includes(fix2Original)) {
    text = text.replace(fix2Original, fix2New);
    console.log(`✓ Fix 2 applied: "${fix2Original}" → "${fix2New}"`);
  } else {
    console.log(`✗ Fix 2 not found in text`);
  }

  // Update Firestore
  await bodyRef.set(
    { text, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );

  console.log("Updated Firestore");

  // Revalidate
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  if (!revalidateSecret) {
    console.warn("⚠ REVALIDATE_SECRET env var not set; skipping revalidate");
    return;
  }

  console.log("Revalidating /learn/bidding/cue-bidding...");
  const revalidateUrl = `https://bc-content.run.app/api/revalidate?secret=${revalidateSecret}&path=/learn/bidding/cue-bidding`;

  return new Promise((resolve, reject) => {
    const req = https.request(revalidateUrl, { method: "POST" }, (res) => {
      if (res.statusCode === 200) {
        console.log("✓ Revalidated");
        resolve();
      } else {
        console.warn(`⚠ Revalidate returned: ${res.statusCode}`);
        resolve();
      }
    });
    req.on("error", (err) => {
      console.warn(`⚠ Revalidate error: ${err.message}`);
      resolve();
    });
    req.end();
  });
}

fixArticle().catch((err) => {
  console.error(err);
  process.exit(1);
});
