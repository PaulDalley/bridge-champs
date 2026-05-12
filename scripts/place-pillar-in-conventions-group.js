/**
 * Move the major-fit-after-1NT pillar from "Other topics" into the
 * "Conventions and Artificial Methods" group on /bidding/advanced, and
 * sort it to the top of that group so readers land on the pillar before
 * clicking into Stayman / Transfers / Smolen / Texas / Puppet.
 *
 * Usage: node scripts/place-pillar-in-conventions-group.js --apply
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

const SUMMARY_ID = "At7zrVNseOY1Ymtn8uzZ";

async function run() {
  const ref = db.collection("bidding").doc(SUMMARY_ID);
  const snap = await ref.get();
  if (!snap.exists) {
    throw new Error(`Summary doc bidding/${SUMMARY_ID} not found.`);
  }
  const before = snap.data() || {};
  console.log("BEFORE:", {
    subcategory: before.subcategory || "(none)",
    difficulty: before.difficulty,
    articleNumber: before.articleNumber,
  });

  await ref.set(
    {
      subcategory: "Conventions and Artificial Methods",
      // The advanced-bidding category page sorts within a group by
      // difficulty ascending, then by articleNumber ascending. Setting
      // difficulty=1 + articleNumber=1 puts the pillar at the top of the
      // Conventions group, ahead of the individual convention articles
      // (Stayman/Transfers/Smolen/Texas/Puppet which are at difficulty 4).
      difficulty: 1,
      articleNumber: 1,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  const afterSnap = await ref.get();
  const after = afterSnap.data() || {};
  console.log("AFTER: ", {
    subcategory: after.subcategory,
    difficulty: after.difficulty,
    articleNumber: after.articleNumber,
  });
  console.log("");
  console.log(
    "Refresh /bidding/advanced — the pillar should now appear at the top of the 'Conventions and Artificial Methods' group."
  );
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error("Update failed:", err);
    process.exit(1);
  }
);
