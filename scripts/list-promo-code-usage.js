/**
 * List users who used a promo code and print affiliate payout totals.
 *
 * Usage:
 *   node scripts/list-promo-code-usage.js blue
 *   node scripts/list-promo-code-usage.js blue --include-inactive
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
const toIso = (ts) => {
  if (!ts) return "";
  if (typeof ts.toDate === "function") return ts.toDate().toISOString();
  return "";
};
const formatDate = (iso) => (iso ? iso.slice(0, 10) : "");
const amountFromTier = (tierName) => {
  const s = String(tierName || "").toLowerCase();
  if (s.includes("premium")) return 50;
  if (s.includes("basic")) return 25;
  return 0;
};

async function main() {
  const codeArg = process.argv[2];
  if (!codeArg) {
    console.error("Usage: node scripts/list-promo-code-usage.js <promo-code>");
    process.exit(1);
  }

  const target = normalize(codeArg);
  const includeInactive = process.argv.includes("--include-inactive");
  const snap = await db.collection("promoCodeUsage").orderBy("createdAt", "desc").get();

  // Keep only latest record per uid for this promo code.
  const latestByUid = new Map();
  for (const doc of snap.docs) {
    const d = doc.data() || {};
    const entered = normalize(d.promoCodeEntered);
    const applied = normalize(d.promoCodeApplied);
    if (entered !== target && applied !== target) continue;
    const uid = d.uid || "";
    if (!uid) continue;

    latestByUid.set(uid, {
      docId: doc.id,
      uid,
      email: d.email || "",
      entered: d.promoCodeEntered || "",
      applied: d.promoCodeApplied || "",
      tierName: d.tierName || "",
      monthlyAmountAud: Number(d.monthlyAmountAud) || 0,
      provider: d.provider || "",
      status: d.status || "",
      stripeSessionId: d.stripeSessionId || "",
      createdAt: toIso(d.createdAt),
    });
  }

  const rows = [];
  for (const row of latestByUid.values()) {
    let authEmail = "";
    try {
      const user = await admin.auth().getUser(row.uid);
      authEmail = user.email || "";
    } catch (e) {
      // ignore
    }

    let member = {};
    try {
      const m = await db.collection("members").doc(row.uid).get();
      if (m.exists) member = m.data() || {};
    } catch (e) {
      // ignore
    }

    const active = !!member.subscriptionActive;
    if (!includeInactive && !active) continue;

    const amount = row.monthlyAmountAud > 0 ? row.monthlyAmountAud : amountFromTier(row.tierName);
    rows.push({
      ...row,
      email: row.email || authEmail || "",
      active,
      monthlyAmountAud: amount,
      subscriptionExpires:
        member.subscriptionExpires && typeof member.subscriptionExpires.toDate === "function"
          ? member.subscriptionExpires.toDate().toISOString()
          : "",
    });
  }

  rows.sort((a, b) => a.email.localeCompare(b.email));
  const total = rows.reduce((sum, r) => sum + (Number(r.monthlyAmountAud) || 0), 0);
  const affiliate25 = total * 0.25;

  console.log(`Promo code '${target}' matches: ${rows.length}${includeInactive ? " (including inactive)" : " (active only)"}`);
  if (!rows.length) return;

  console.log("");
  console.log("| Subscriber | Subscribed Date | Monthly Amount (AUD) | Active |");
  console.log("|---|---:|---:|---:|");
  rows.forEach((r) => {
    console.log(
      `| ${r.email || r.uid} | ${formatDate(r.createdAt)} | ${Number(r.monthlyAmountAud || 0).toFixed(2)} | ${r.active ? "Yes" : "No"} |`
    );
  });
  console.log("");
  console.log(`Total monthly collected: A$${total.toFixed(2)}`);
  console.log(`25% affiliate payout: A$${affiliate25.toFixed(2)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

