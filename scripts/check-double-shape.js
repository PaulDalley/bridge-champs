/**
 * Read-only: count docs that have BOTH a flat `text` and a nested
 * `body.text` field. The improve-learn-* scripts written on May 11 wrote
 * to both shapes deliberately, so flat-text docs in cardPlayBody /
 * defenceBody / biddingBody may now carry a redundant body.text sibling.
 *
 * Front-end reads `text` first so this is cosmetic, not corruption — but
 * worth knowing.
 *
 *   node scripts/check-double-shape.js --apply
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

const COLS = [
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

(async function run() {
  for (const col of COLS) {
    const snap = await db.collection(col).get();
    let bothMatch = 0;
    let bothMismatch = 0;
    let onlyFlat = 0;
    let onlyNested = 0;
    let neither = 0;
    const mismatches = [];
    for (const doc of snap.docs) {
      const d = doc.data() || {};
      const flat = typeof d.text === "string" && d.text.length > 0 ? d.text : null;
      const nested =
        d.body && typeof d.body === "object" && typeof d.body.text === "string" && d.body.text.length > 0
          ? d.body.text
          : null;
      if (flat && nested) {
        if (flat === nested) bothMatch++;
        else {
          bothMismatch++;
          mismatches.push({ id: doc.id, flatLen: flat.length, nestedLen: nested.length });
        }
      } else if (flat) onlyFlat++;
      else if (nested) onlyNested++;
      else neither++;
    }
    console.log(`${col}  (n=${snap.size})`);
    console.log(`    only flat (text):           ${onlyFlat}`);
    console.log(`    only nested (body.text):    ${onlyNested}`);
    console.log(`    both, identical content:    ${bothMatch}`);
    console.log(`    both, DIVERGED content:     ${bothMismatch}`);
    console.log(`    neither:                    ${neither}`);
    if (mismatches.length) {
      console.log("    mismatch samples:");
      for (const m of mismatches.slice(0, 5))
        console.log(`      ${m.id}  flat=${m.flatLen}ch  nested=${m.nestedLen}ch`);
    }
  }
  process.exit(0);
})();
