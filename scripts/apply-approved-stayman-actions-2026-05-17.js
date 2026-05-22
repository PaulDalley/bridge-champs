const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { extractBodyHtml, buildPreservingBodyUpdate } = require("./lib/body-field");

function getArgValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return null;
  const v = process.argv[i + 1];
  if (!v || v.startsWith("-")) return null;
  return v;
}

function resolveServiceAccountPath() {
  const fromFlag = getArgValue("--key");
  if (fromFlag) return path.resolve(fromFlag);
  if (process.env.FIREBASE_SERVICE_ACCOUNT)
    return path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT);
  const downloadsSpaced = path.join(os.homedir(), "Downloads", "firebase key.json");
  if (fs.existsSync(downloadsSpaced)) return downloadsSpaced;
  const downloadsSdk = path.join(
    os.homedir(),
    "Downloads",
    "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"
  );
  if (fs.existsSync(downloadsSdk)) return downloadsSdk;
  const root = path.join(__dirname, "..", "serviceAccountKey.json");
  if (fs.existsSync(root)) return root;
  return null;
}

function stripTrailingNav(html) {
  return String(html || "")
    .replace(/<h3>\s*where to next\s*<\/h3>[\s\S]*$/i, "")
    .replace(/<h3>\s*practice this when you are ready\s*<\/h3>[\s\S]*$/i, "")
    .trim();
}

function buildSecondaryStub(primaryUrl, primaryTitle) {
  return [
    `<p>This article has been combined with another in the same series. The full content has moved to <a href="${primaryUrl}">${primaryTitle} →</a>.</p>`,
    `<p>If your link brought you here, follow the link above — your browser should redirect automatically.</p>`,
  ].join("\n");
}

async function fetchBiddingArticleByBodyId(db, bodyId) {
  const summarySnap = await db.collection("bidding").where("body", "==", bodyId).limit(1).get();
  if (summarySnap.empty) return null;
  const summaryDoc = summarySnap.docs[0];
  const summary = summaryDoc.data() || {};
  const bodyDoc = await db.collection("biddingBody").doc(bodyId).get();
  const bodyData = bodyDoc.exists ? bodyDoc.data() || {} : {};
  const { html } = extractBodyHtml(bodyData);
  return {
    summaryId: summaryDoc.id,
    summary,
    bodyId,
    bodyData,
    bodyHtml: html,
    url: `/bidding/advanced/${bodyId}`,
  };
}

async function main() {
  const APPLY = process.argv.includes("--apply");
  const keyPath = resolveServiceAccountPath();
  if (!keyPath || !fs.existsSync(keyPath)) {
    console.error("No service account JSON found.");
    process.exit(1);
  }
  const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
  admin.initializeApp({ credential: admin.credential.cert(key) });
  const db = admin.firestore();
  const FieldValue = admin.firestore.FieldValue;

  // Approved action 1: retitle this article.
  const retitleBodyId = "QmadBtW2QFMGu3o51NNi";
  const retitleTo = "1NT Responder Methods: A Practical Overview";

  const retitleArticle = await fetchBiddingArticleByBodyId(db, retitleBodyId);
  if (!retitleArticle) {
    throw new Error(`Retitle target not found for body id ${retitleBodyId}`);
  }
  console.log(`[retitle] ${retitleArticle.url}`);
  console.log(`  current: ${retitleArticle.summary.title || "(missing)"}`);
  console.log(`  next   : ${retitleTo}`);

  // Approved action 2: merge stayman base into major-fit pillar.
  const primaryBodyId = "Czs8FCV33GJN6Jtchw8o";
  const secondaryBodyId = "U2h4h8kDjcgPT9k4YLq0";
  const primary = await fetchBiddingArticleByBodyId(db, primaryBodyId);
  const secondary = await fetchBiddingArticleByBodyId(db, secondaryBodyId);
  if (!primary || !secondary) {
    throw new Error("Merge pair not found in bidding collection.");
  }
  console.log(`[merge] primary=${primary.url}`);
  console.log(`[merge] secondary=${secondary.url}`);

  if (secondary.summary.redirectTo === primary.url) {
    console.log("  secondary already redirects to primary; merge already applied, skipping.");
  }

  const mergedBody = [
    stripTrailingNav(primary.bodyHtml),
    `<p><em>The next section was originally a separate article on the same topic — combined here for easier reading.</em></p>`,
    stripTrailingNav(secondary.bodyHtml),
  ]
    .filter(Boolean)
    .join("\n");
  const secondaryStub = buildSecondaryStub(primary.url, primary.summary.title || retitleTo);

  console.log(`  primary body chars: ${primary.bodyHtml.length} -> ${mergedBody.length}`);
  console.log(`  secondary stub chars: ${secondaryStub.length}`);

  if (!APPLY) {
    console.log("Dry run only. Re-run with --apply to commit.");
    return;
  }

  const batch = db.batch();

  // 1) Retitle summary + first H1 in body (if present).
  batch.set(
    db.collection("bidding").doc(retitleArticle.summaryId),
    { title: retitleTo, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  const retitleHtml = String(retitleArticle.bodyHtml || "").replace(
    /<h1>[\s\S]*?<\/h1>/i,
    `<h1>${retitleTo}</h1>`
  );
  if (retitleHtml !== retitleArticle.bodyHtml) {
    const retitleBodyUpdate = buildPreservingBodyUpdate(retitleArticle.bodyData, retitleHtml);
    batch.set(
      db.collection("biddingBody").doc(retitleArticle.bodyId),
      { ...retitleBodyUpdate, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );
  }

  // 2) Merge + redirect
  const primaryBodyUpdate = buildPreservingBodyUpdate(primary.bodyData, mergedBody);
  batch.set(
    db.collection("bidding").doc(primary.summaryId),
    {
      mergedFromAt: new Date().toISOString(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  batch.set(
    db.collection("biddingBody").doc(primary.bodyId),
    { ...primaryBodyUpdate, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );

  const secondaryBodyUpdate = buildPreservingBodyUpdate(secondary.bodyData, secondaryStub);
  batch.set(
    db.collection("bidding").doc(secondary.summaryId),
    {
      redirectTo: primary.url,
      mergedIntoAt: new Date().toISOString(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  batch.set(
    db.collection("biddingBody").doc(secondary.bodyId),
    { ...secondaryBodyUpdate, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );

  await batch.commit();
  console.log("Applied successfully.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
