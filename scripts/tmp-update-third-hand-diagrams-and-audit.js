const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const TARGET_BODY_ID = "Y5xcpnE2hne3WbJph2JX";

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
const F = admin.firestore.FieldValue;

const BEGINNER = [
  { summary: "beginnerBidding", body: "beginnerBiddingBody", prefix: "/beginner/articles/bidding" },
  { summary: "beginnerCardPlay", body: "beginnerCardPlayBody", prefix: "/beginner/articles/declarer" },
  { summary: "beginnerDefence", body: "beginnerDefenceBody", prefix: "/beginner/articles/defence" },
];

function bodyHtml(data) {
  if (!data || typeof data !== "object") return "";
  if (typeof data.text === "string") return data.text;
  if (typeof data.body === "string") return data.body;
  if (data.body && typeof data.body === "object" && typeof data.body.text === "string") return data.body.text;
  return "";
}

const BOARD_K84 =
  '<MakeBoard boardType="double" position="North/East" North="*S-973*H-*D-*C-" East="*S-K84*H-*D-*C-" South="*S-*H-*D-*C-" West="*S-5*H-*D-*C-" vuln="Nil Vul" bidding="" />';
const BOARD_A105 =
  '<MakeBoard boardType="double" position="North/East" North="*S-K72*H-*D-*C-" East="*S-A105*H-*D-*C-" South="*S-*H-*D-*C-" West="*S-*H-*D-*C-" vuln="Nil Vul" bidding="" />';

function updateTargetArticle(html) {
  let updated = html;

  updated = updated.replace(
    /<p>Partner leads a small card\. Dummy plays low\. You hold <code>K84<\/code>\.<\/p>/i,
    "<p>Partner leads a small card. Dummy plays low.</p>"
  );
  updated = updated.replace(
    /<p>Partner leads a small card\. Dummy plays low\. You hold K84\.<\/p>/i,
    "<p>Partner leads a small card. Dummy plays low.</p>"
  );

  updated = updated.replace(/<MakeBoard[^>]*K84[^>]*\/>/i, BOARD_K84);
  updated = updated.replace(/<MakeBoard[^>]*A105[^>]*\/>/i, BOARD_A105);

  return updated;
}

async function auditPreBlocks() {
  const flagged = [];
  for (const cfg of BEGINNER) {
    const sumSnap = await db.collection(cfg.summary).get();
    for (const doc of sumSnap.docs) {
      const d = doc.data() || {};
      if (d.isHidden === true) continue;
      if (typeof d.redirectTo === "string" && d.redirectTo.startsWith("/")) continue;
      const bodyId = typeof d.body === "string" ? d.body : doc.id;
      const bodyDoc = await db.collection(cfg.body).doc(bodyId).get();
      if (!bodyDoc.exists) continue;
      const html = bodyHtml(bodyDoc.data() || {});
      if (!html) continue;
      if (/<pre>/i.test(html)) {
        flagged.push({
          title: d.title || "(untitled)",
          url: `${cfg.prefix}/${bodyId}`,
          bodyId,
        });
      }
    }
  }
  return flagged;
}

async function run() {
  const ref = db.collection("beginnerDefenceBody").doc(TARGET_BODY_ID);
  const snap = await ref.get();
  if (!snap.exists) throw new Error(`Body doc not found: ${TARGET_BODY_ID}`);
  const original = bodyHtml(snap.data() || {});
  if (!original) throw new Error("Target body html is empty.");

  const updated = updateTargetArticle(original);
  const changed = updated !== original;
  if (changed) {
    await ref.set(
      {
        text: updated,
        body: { text: updated },
        updatedAt: F.serverTimestamp(),
      },
      { merge: true }
    );
  }

  const preFlagged = await auditPreBlocks();
  console.log(JSON.stringify({ changed, targetBodyId: TARGET_BODY_ID, preFlagged }, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

