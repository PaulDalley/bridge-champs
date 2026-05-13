/**
 * Read-only: verify a merged pair looks correct in Firestore.
 *
 *   node scripts/verify-merge-pair.js --primary-body f4BeQ2lU5niFCt0ecmnv --secondary-body 0gF8pSxK8GB2bhguAqD3 --collection beginnerBidding --apply
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { extractBodyHtml } = require("./lib/body-field");

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

if (!process.argv.includes("--apply")) {
  console.error("Refusing to run without --apply.");
  process.exit(1);
}

const summaryCol = getArgValue("--collection");
const primaryBody = getArgValue("--primary-body");
const secondaryBody = getArgValue("--secondary-body");
if (!summaryCol || !primaryBody || !secondaryBody) {
  console.error("Required: --collection <X> --primary-body <id> --secondary-body <id>");
  process.exit(1);
}

const COLLECTION_INFO = {
  beginnerBidding: { body: "beginnerBiddingBody" },
  beginnerCardPlay: { body: "beginnerCardPlayBody" },
  beginnerDefence: { body: "beginnerDefenceBody" },
};

const keyPath = resolveServiceAccountPath();
if (!keyPath || !fs.existsSync(keyPath)) {
  console.error("No service account JSON found.");
  process.exit(1);
}
const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

async function findSummary(collection, bodyId) {
  const q = await db.collection(collection).where("body", "==", bodyId).get();
  if (!q.empty) return { id: q.docs[0].id, data: q.docs[0].data() };
  const direct = await db.collection(collection).doc(bodyId).get();
  if (direct.exists) return { id: direct.id, data: direct.data() };
  return null;
}

async function inspect(label, collection, bodyId) {
  const sum = await findSummary(collection, bodyId);
  if (!sum) {
    console.log(`${label}: summary not found for body ${bodyId}`);
    return;
  }
  const cfg = COLLECTION_INFO[collection];
  const bodySnap = await db.collection(cfg.body).doc(bodyId).get();
  const bodyData = bodySnap.exists ? bodySnap.data() || {} : {};
  const { html, shape } = extractBodyHtml(bodyData);
  const flat = typeof bodyData.text === "string" ? bodyData.text : null;
  const nested =
    bodyData.body && typeof bodyData.body === "object" && typeof bodyData.body.text === "string"
      ? bodyData.body.text
      : null;
  console.log(`${label} (summary ${collection}/${sum.id}, body ${cfg.body}/${bodyId}):`);
  console.log(`  title:           ${sum.data.title || "(no title)"}`);
  console.log(`  isHidden:        ${sum.data.isHidden === true}`);
  console.log(`  redirectTo:      ${sum.data.redirectTo || "(none)"}`);
  console.log(`  mergedFromAt:    ${sum.data.mergedFromAt || "(none)"}`);
  console.log(`  mergedIntoAt:    ${sum.data.mergedIntoAt || "(none)"}`);
  console.log(`  body shape:      ${shape}`);
  console.log(`  flat text len:   ${flat == null ? "(absent)" : flat.length}`);
  console.log(`  nested text len: ${nested == null ? "(absent)" : nested.length}`);
  if (flat != null && nested != null) {
    console.log(`  flat == nested:  ${flat === nested}`);
  }
  console.log(`  body html (first 240ch): ${(html || "").slice(0, 240)}…`);
}

(async function run() {
  await inspect("PRIMARY", summaryCol, primaryBody);
  console.log("");
  await inspect("SECONDARY", summaryCol, secondaryBody);
  process.exit(0);
})();
