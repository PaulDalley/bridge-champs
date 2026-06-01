/**
 * Create or update Firestore userTokens for two NEW standalone promo codes:
 *
 *   GILL    — 1 month (30 days) free on Basic OR Premium.
 *   3TEAMS  — 1 month (30 days) free on Basic OR Premium.
 *
 * These are deliberately their OWN tokens (document ids `gill` and `3teams`),
 * NOT aliased to `blue`. They do the same thing as BLUE (free first month, any
 * tier) but are tracked separately for record keeping. `tier` is intentionally
 * omitted so the free month applies whether the member picks Basic or Premium.
 *
 * Service account JSON (first match wins):
 *   --key <path> | env FIREBASE_SERVICE_ACCOUNT | ~/Downloads/firebase key.json |
 *   ~/Downloads/bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json | ./serviceAccountKey.json
 *
 * Usage:
 *   node scripts/ensure-gill-3teams-tokens.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const os = require("os");

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
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
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

const keyPath = resolveServiceAccountPath();

if (!keyPath || !fs.existsSync(keyPath)) {
  console.error(
    "No service account JSON found. Use --key <path>, set FIREBASE_SERVICE_ACCOUNT, " +
      "add serviceAccountKey.json to project root, or place firebase key.json in Downloads."
  );
  process.exit(1);
}

const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(key) });

// daysFree: 30 -> one free month (Stripe trial) before the first charge.
// No `tier` field -> valid on both Basic and Premium.
// reusable: true -> document is kept after use (public/shareable code).
const tokens = {
  gill: {
    daysFree: 30,
    reusable: true,
  },
  "3teams": {
    daysFree: 30,
    reusable: true,
  },
};

async function main() {
  const db = admin.firestore();
  for (const [docId, data] of Object.entries(tokens)) {
    const ref = db.collection("userTokens").doc(docId);
    await ref.set(data, { merge: true });
    console.log(`OK: userTokens/${docId} set to:`);
    console.log(JSON.stringify(data, null, 2));
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
