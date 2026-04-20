/**
 * Create or update Firestore userTokens/klinger for the Ron Klinger list promo:
 * Premium only, 30 days free (Stripe trial) at standard Premium pricing after trial.
 *
 * Prerequisites: serviceAccountKey.json in project root (see ensure-ausyouth-token.js).
 *
 * Usage:
 *   node scripts/ensure-klinger-token.js
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

const doc = {
  daysFree: 30,
  tier: "premium",
  reusable: true,
};

async function main() {
  const ref = admin.firestore().collection("userTokens").doc("klinger");
  await ref.set(doc, { merge: true });
  console.log("OK: userTokens/klinger set to:");
  console.log(JSON.stringify(doc, null, 2));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
