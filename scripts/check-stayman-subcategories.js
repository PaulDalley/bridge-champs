/**
 * Read-only: dump subcategory + difficulty for the pillar and the related
 * convention articles so we know which group to put the pillar in.
 *
 * Usage: node scripts/check-stayman-subcategories.js --apply
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

const TARGETS = [
  { id: "Czs8FCV33GJN6Jtchw8o", role: "PILLAR (major fit after 1NT)" },
  { id: "U2h4h8kDjcgPT9k4YLq0", role: "Stayman" },
  { id: "AbPr2z4sByvVgT1U5Ehc", role: "Puppet Stayman" },
  { id: "DcqQjNCQDyNMWk2fOvIO", role: "Smolen" },
  { id: "imr5fXsuVBeMFItvoGY3", role: "Texas Transfers" },
  { id: "uiRZXtZ2zjxVxq7e1lAb", role: "Transfers" },
  { id: "i2CIdysS7cErPJYWBUDO", role: "Stayman vs Transfers" },
  { id: "QmadBtW2QFMGu3o51NNi", role: "Find a Major Fit (existing pillar candidate)" },
];

async function run() {
  console.log("Role".padEnd(48), "subcategory".padEnd(36), "diff", "artNo", "isHidden");
  console.log("-".repeat(110));
  for (const t of TARGETS) {
    const snap = await db
      .collection("bidding")
      .where("body", "==", t.id)
      .limit(1)
      .get();
    if (snap.empty) {
      console.log(t.role.padEnd(48), "(summary not found)");
      continue;
    }
    const d = snap.docs[0].data() || {};
    console.log(
      t.role.padEnd(48),
      String(d.subcategory || "(none)").padEnd(36),
      String(d.difficulty || "?").padEnd(4),
      String(d.articleNumber ?? "?").padEnd(5),
      String(d.isHidden ?? false)
    );
  }
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error("Failed:", err);
    process.exit(1);
  }
);
