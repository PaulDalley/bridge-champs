/**
 * Create or update Firestore userTokens/vcc26 for the VCC players promo:
 * 1 free month (30-day Stripe trial) on EITHER tier (Basic or Premium),
 * at standard pricing after the trial. Reusable (shared code for all VCC players).
 *
 * Standalone token — NOT aliased to BLUE. The backend validateUserToken reads
 * userTokens/<code> directly, so this works without a backend deploy.
 *
 * Prerequisites: serviceAccountKey.json in project root.
 *
 * Usage:
 *   node scripts/ensure-vcc26-token.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");

if (!fs.existsSync(keyPath)) {
  console.error(
    "\nMissing serviceAccountKey.json in project root.\n" +
      "Firebase Console → Project settings → Service accounts → Generate new private key.\n"
  );
  process.exit(1);
}

const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(key) });

// No `tier` field = valid on either Basic or Premium (mirrors userTokens/jess26).
const doc = {
  daysFree: 30,
  reusable: true,
};

async function main() {
  const ref = admin.firestore().collection("userTokens").doc("vcc26");
  await ref.set(doc, { merge: true });
  console.log("OK: userTokens/vcc26 set to:");
  console.log(JSON.stringify(doc, null, 2));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
