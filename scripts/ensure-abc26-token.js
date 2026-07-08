/**
 * Create or update Firestore userTokens/abc26 for the ABC26 promo (Adelaide Bridge
 * Centre outreach): 1 month free (Stripe trial, 30 days) on Standard OR Premium, at
 * standard pricing after the trial. Independent code — NOT routed through BLUE or TRUMPS,
 * so sign-ups on this code can be identified separately.
 *
 * Mirrors what the backend returns for BLUE (daysFree: 30, reusable: true), but as its
 * own Firestore document so it validates and tracks on its own id.
 *
 * Prerequisites: serviceAccountKey.json in project root.
 *
 * Usage:
 *   node scripts/ensure-abc26-token.js
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

// No `tier` field => usable on Standard or Premium, same as BLUE/TRUMPS.
const doc = {
  daysFree: 30,
  reusable: true,
};

async function main() {
  const ref = admin.firestore().collection("userTokens").doc("abc26");
  await ref.set(doc, { merge: true });
  const after = (await ref.get()).data();
  console.log("OK: userTokens/abc26 set to:");
  console.log(JSON.stringify(after, null, 2));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
