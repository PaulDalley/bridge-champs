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
const FieldValue = admin.firestore.FieldValue;

const summaryId = "fI7DC63YopLtZy9fIobM";
const bodyId = "wsCt4ouPgZU1cB86fj2A";
const lebensohlTrainerPath = "/bidding/practice?difficulty=3&problem=bid3-6";
const subscribeThenTrainerPath = `/subscribe?redirectTo=${encodeURIComponent(lebensohlTrainerPath)}`;
const signupThenSubscribePath = `/signup?redirectTo=${encodeURIComponent(subscribeThenTrainerPath)}`;

const ctaHtml = `
<h3>Practice the Lebensohl decisions</h3>
<Callout type="example">
  <p>When you are ready, try the Lebensohl problem questions. Reading gives you the idea; the questions help make the decisions feel automatic.</p>
  <p>If you are not signed in, sign in first - it takes about 1 minute. Then you can start the 7-day free trial and continue to these exact Lebensohl questions.</p>
  <p><a href="${signupThenSubscribePath}">Sign in or create account</a> · <a href="${lebensohlTrainerPath}">Go to the Lebensohl questions</a></p>
</Callout>
`.trim();

async function main() {
  const bodyRef = db.collection("biddingBody").doc(bodyId);
  const bodySnap = await bodyRef.get();
  if (!bodySnap.exists) throw new Error(`Missing body doc ${bodyId}`);
  const bodyData = bodySnap.data() || {};
  let html = String(bodyData.text || bodyData.body?.text || "");

  if (!html.includes("Practice the Lebensohl decisions")) {
    if (/<h3>\s*Where to next\s*<\/h3>/i.test(html)) {
      html = html.replace(/<h3>\s*Where to next\s*<\/h3>/i, `${ctaHtml}\n\n<h3>Where to next</h3>`);
    } else {
      html = `${html}\n\n${ctaHtml}`;
    }
  }

  html = html.replace(/href="\/bidding\/practice"/g, `href="${lebensohlTrainerPath}"`);
  html = html.replace(
    /href="\/signup\?redirectTo=%2Fsubscribe"/g,
    `href="${signupThenSubscribePath}"`
  );

  await bodyRef.set(
    {
      text: html,
      body: { text: html },
      isFree: true,
      ctaTarget: lebensohlTrainerPath,
      freeUpdatedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  await db.collection("bidding").doc(summaryId).set(
    {
      isFree: true,
      ctaTarget: lebensohlTrainerPath,
      freeUpdatedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log("Injected visible Lebensohl body CTA and confirmed free flags.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
