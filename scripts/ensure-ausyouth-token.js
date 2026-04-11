/**
 * Create or update Firestore userTokens/ausyouth for the Youth Squad promo ($20/mo Premium).
 *
 * Prerequisites:
 *   1. Create A$20/month recurring price in Stripe for your Premium product; copy Price ID (price_...).
 *   2. serviceAccountKey.json in project root (same as export-user-emails.js).
 *
 * Usage:
 *   node scripts/ensure-ausyouth-token.js price_xxxxxxxxxxxxxxxx
 *
 * Example:
 *   node scripts/ensure-ausyouth-token.js price_1ABCdefGHIjklMN
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
const stripePriceId = process.argv[2];

if (!stripePriceId || !String(stripePriceId).startsWith("price_")) {
  console.error(
    "\nUsage: node scripts/ensure-ausyouth-token.js <stripePriceId>\n" +
      "Example: node scripts/ensure-ausyouth-token.js price_1SxVk6E9mroRD7lKIHxCKA7c\n" +
      "\nGet the Price ID from Stripe → Product catalogue → your membership product → $20/month price.\n"
  );
  process.exit(1);
}

if (!fs.existsSync(keyPath)) {
  console.error(
    "\nMissing serviceAccountKey.json in bridge-champs/ishbridge-41/\n" +
      "Firebase Console → Project settings → Service accounts → Generate new private key.\n"
  );
  process.exit(1);
}

const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(key) });

const doc = {
  tier: "premium",
  stripePriceId: String(stripePriceId).trim(),
  monthlyPrice: 20,
  reusable: true,
};

async function main() {
  const ref = admin.firestore().collection("userTokens").doc("ausyouth");
  await ref.set(doc, { merge: true });
  console.log("OK: userTokens/ausyouth set to:");
  console.log(JSON.stringify(doc, null, 2));
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
