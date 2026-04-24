/**
 * List users who used a promo code at checkout.
 *
 * Usage:
 *   node scripts/list-promo-code-usage.js blue
 *
 * Requires:
 *   serviceAccountKey.json in project root.
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) {
  console.error("Missing serviceAccountKey.json in project root.");
  process.exit(1);
}

const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(key) });

const db = admin.firestore();

const normalize = (v) => String(v || "").toLowerCase().replace(/\s+/g, "").trim();

async function main() {
  const codeArg = process.argv[2];
  if (!codeArg) {
    console.error("Usage: node scripts/list-promo-code-usage.js <promo-code>");
    process.exit(1);
  }

  const target = normalize(codeArg);
  const snap = await db.collection("promoCodeUsage").orderBy("createdAt", "desc").get();

  const rows = [];
  for (const doc of snap.docs) {
    const d = doc.data() || {};
    const entered = normalize(d.promoCodeEntered);
    const applied = normalize(d.promoCodeApplied);
    if (entered !== target && applied !== target) continue;

    let authEmail = "";
    try {
      if (d.uid) {
        const user = await admin.auth().getUser(d.uid);
        authEmail = user.email || "";
      }
    } catch (e) {
      // Ignore missing/deleted auth users.
    }

    rows.push({
      docId: doc.id,
      uid: d.uid || "",
      email: d.email || authEmail || "",
      entered: d.promoCodeEntered || "",
      applied: d.promoCodeApplied || "",
      tierName: d.tierName || "",
      provider: d.provider || "",
      status: d.status || "",
      stripeSessionId: d.stripeSessionId || "",
      createdAt: d.createdAt && typeof d.createdAt.toDate === "function"
        ? d.createdAt.toDate().toISOString()
        : "",
    });
  }

  console.log(`Promo code '${target}' matches: ${rows.length}`);
  if (!rows.length) return;

  for (const r of rows) {
    console.log(
      [
        `uid=${r.uid}`,
        `email=${r.email}`,
        `entered=${r.entered}`,
        `applied=${r.applied}`,
        `tier=${r.tierName}`,
        `provider=${r.provider}`,
        `status=${r.status}`,
        `session=${r.stripeSessionId}`,
        `at=${r.createdAt}`,
      ].join(" | ")
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

