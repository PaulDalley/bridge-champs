/**
 * Read-only: for each body collection, sample a few documents and report
 * which fields hold the article HTML and which shape they use:
 *
 *   - flat-text:  { text: "<p>..." }         (string at top-level)
 *   - flat-body:  { body: "<p>..." }         (string at top-level)
 *   - nested:     { body: { text: "<p>..." } }  (string at body.text)
 *   - other:      none of the above
 *
 * Use to design a single robust extractor for the audit / backfill scripts.
 *
 *   node scripts/survey-body-shapes.js --apply
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

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

const keyPath = resolveServiceAccountPath();
if (!keyPath || !fs.existsSync(keyPath)) {
  console.error("No service account JSON found.");
  process.exit(1);
}
const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const BODY_COLLECTIONS = [
  "cardPlayBody",
  "defenceBody",
  "biddingBody",
  "biddingAdvancedBody",
  "biddingBasicsBody",
  "countingBody",
  "beginnerCardPlayBody",
  "beginnerDefenceBody",
  "beginnerBiddingBody",
];

function classify(data) {
  if (typeof data.text === "string" && data.text.trim()) return "flat-text";
  if (typeof data.body === "string" && data.body.trim()) return "flat-body";
  if (data.body && typeof data.body === "object" && typeof data.body.text === "string")
    return "nested";
  return "other";
}

async function run() {
  for (const col of BODY_COLLECTIONS) {
    const snap = await db.collection(col).get();
    const counts = { "flat-text": 0, "flat-body": 0, nested: 0, other: 0 };
    const otherSamples = [];
    for (const doc of snap.docs) {
      const data = doc.data() || {};
      const c = classify(data);
      counts[c]++;
      if (c === "other" && otherSamples.length < 3) {
        otherSamples.push({
          id: doc.id,
          fields: Object.keys(data),
          bodyShape:
            data.body && typeof data.body === "object" ? Object.keys(data.body) : typeof data.body,
        });
      }
    }
    console.log(`${col}  (n=${snap.size})`);
    for (const k of Object.keys(counts)) console.log(`    ${k}: ${counts[k]}`);
    if (otherSamples.length) {
      console.log("    samples (other):");
      for (const s of otherSamples) console.log("     ", JSON.stringify(s));
    }
  }
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error("Survey failed:", err);
    process.exit(1);
  }
);
