/**
 * Typical takeout hand diagram: dealer East, auction West 1♥ – P – P – (South ?).
 * Usage: node scripts/update-takeout-typical-hand-auction.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const os = require("os");

function keyPath() {
  const c = [
    process.env.FIREBASE_SERVICE_ACCOUNT,
    path.join(os.homedir(), "Downloads", "firebase key.json"),
    path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
    path.join(__dirname, "..", "serviceAccountKey.json"),
  ]
    .filter(Boolean)
    .map((p) => path.resolve(p));
  return c.find((p) => fs.existsSync(p));
}

const CANONICAL_BODY_ID = "yt6au7gwYwPahTxQ4kd5";

const HAND =
  'South="*S-KQ102*H-4*D-A1084*C-K932" West="*S-*H-*D-*C-"';

const CANONICAL =
  `${HAND} vuln="Nil Vul" dealer="East" bidding="_/_/1♥/P/P/?"`;

const OLD_VARIANTS = [
  `${HAND} vuln="Nil Vul" dealer="West" bidding="1♥/P/P/?"`,
  `${HAND} vuln="Nil Vul" dealer="East" bidding="_/1♥/?"`,
  `${HAND} vuln="Nil Vul" dealer="East" bidding="_/1♥/P/P/?"`,
];

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath(), "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

function applyReplacements(text) {
  let out = text;
  let changed = false;
  for (const old of OLD_VARIANTS) {
    if (out.includes(old)) {
      out = out.split(old).join(CANONICAL);
      changed = true;
    }
  }
  if (out.includes(CANONICAL) && !changed) return { out, changed: false, already: true };
  return { out, changed };
}

async function main() {
  const apply = process.argv.includes("--apply");
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  const { out, changed, already } = applyReplacements(text);

  if (already) {
    console.log("Already correct:", CANONICAL);
    return;
  }
  if (!changed) throw new Error("Typical-hand MakeBoard pattern not found.");

  console.log("Will set:", CANONICAL);
  if (!apply) {
    console.log("Dry run OK.");
    return;
  }
  await ref.set(
    { text: out, body: { text: out }, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  console.log("Updated biddingBody/" + CANONICAL_BODY_ID);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
