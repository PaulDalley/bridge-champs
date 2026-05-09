/**
 * List users who used a promo code and print affiliate payout totals.
 *
 * Usage:
 *   node scripts/list-promo-code-usage.js blue
 *   node scripts/list-promo-code-usage.js pete26 --match entered
 *   node scripts/list-promo-code-usage.js blue --match applied --include-inactive
 *   node scripts/list-promo-code-usage.js blue --require-confirmed
 *
 * Lookup which promo code one email used (checkout / members audit):
 *   node scripts/list-promo-code-usage.js --email someone@example.com
 *
 * Service account JSON (first match wins):
 *   --key <path> | env FIREBASE_SERVICE_ACCOUNT | ~/Downloads/firebase key.json |
 *   ~/Downloads/bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json | ./serviceAccountKey.json
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const os = require("os");

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
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
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

const keyPath = resolveServiceAccountPath();
if (!keyPath || !fs.existsSync(keyPath)) {
  console.error(
    "No service account JSON found. Use --key <path>, set FIREBASE_SERVICE_ACCOUNT, " +
      "add serviceAccountKey.json to project root, or place firebase key.json in Downloads."
  );
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
const CONFIRMED_STATUSES = new Set([
  "checkout_session_completed",
  "subscription_activated",
  "invoice_paid",
  "payment_succeeded",
]);

async function lookupPromoByEmail(emailRaw) {
  const email = String(emailRaw || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    console.error("Provide a valid email after --email");
    process.exit(1);
  }

  let user;
  try {
    user = await admin.auth().getUserByEmail(email);
  } catch (e) {
    console.error("Firebase Auth:", e.message || e);
    process.exit(1);
  }

  const uid = user.uid;
  console.log(`Auth email: ${user.email || email}`);
  console.log(`UID: ${uid}\n`);

  const memberSnap = await db.collection("members").doc(uid).get();
  const m = memberSnap.exists ? memberSnap.data() || {} : {};

  console.log("--- members/{uid} (last checkout promo audit) ---");
  console.log("lastPromoCodeEntered:", m.lastPromoCodeEntered ?? "(none)");
  console.log("lastPromoCodeApplied:", m.lastPromoCodeApplied ?? "(none)");
  console.log("lastPromoCaptureStage:", m.lastPromoCaptureStage ?? "(none)");
  console.log("lastPromoCaptureSessionId:", m.lastPromoCaptureSessionId ?? "(none)");
  console.log("");

  const usageSnap = await db.collection("promoCodeUsage").where("uid", "==", uid).get();

  if (usageSnap.empty) {
    console.log("No promoCodeUsage documents for this uid (no promo captured at checkout, or older data).");
    return;
  }

  const rows = usageSnap.docs.map((doc) => {
    const d = doc.data() || {};
    return {
      docId: doc.id,
      entered: d.promoCodeEntered || "",
      applied: d.promoCodeApplied || "",
      status: d.status || "",
      tierName: d.tierName || "",
      createdAt: toIso(d.createdAt),
      stripeSessionId: d.stripeSessionId || "",
      emailOnDoc: d.email || "",
    };
  });

  rows.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  console.log("--- promoCodeUsage (newest first) ---");
  console.log("| Entered | Applied | Date | Status | Tier |");
  console.log("|---|---|---|:---:|---|");
  rows.forEach((r) => {
    console.log(
      `| ${r.entered || "-"} | ${r.applied || "-"} | ${formatDate(r.createdAt)} | ${r.status || "-"} | ${r.tierName || "-"} |`
    );
  });
  console.log("");
  console.log(
    "Most recent entered:",
    rows[0]?.entered || "(unknown)",
    "| applied:",
    rows[0]?.applied || "(unknown)"
  );
}

async function main() {
  const emailFlag = process.argv.indexOf("--email");
  if (emailFlag >= 0) {
    const emailArg = process.argv[emailFlag + 1];
    await lookupPromoByEmail(emailArg);
    return;
  }

  const codeArg = process.argv[2];
  if (!codeArg || codeArg.startsWith("-")) {
    console.error(
      "Usage:\n" +
        "  node scripts/list-promo-code-usage.js <promo-code>\n" +
        "  node scripts/list-promo-code-usage.js --email user@example.com"
    );
    process.exit(1);
  }

  const target = normalize(codeArg);
  const includeInactive = process.argv.includes("--include-inactive");
  const requireConfirmed = process.argv.includes("--require-confirmed");
  const matchIndex = process.argv.indexOf("--match");
  const matchModeRaw = matchIndex >= 0 ? process.argv[matchIndex + 1] : "entered";
  const matchMode = normalize(matchModeRaw) || "entered";
  if (!["entered", "applied", "either"].includes(matchMode)) {
    console.error("Invalid --match option. Use one of: entered, applied, either");
    process.exit(1);
  }
  const snap = await db.collection("promoCodeUsage").orderBy("createdAt", "desc").get();

  // Keep only latest record per uid for this promo code filter.
  const latestByUid = new Map();
  for (const doc of snap.docs) {
    const d = doc.data() || {};
    const entered = normalize(d.promoCodeEntered);
    const applied = normalize(d.promoCodeApplied);
    if (matchMode === "entered" && entered !== target) continue;
    if (matchMode === "applied" && applied !== target) continue;
    if (matchMode === "either" && entered !== target && applied !== target) continue;
    const status = normalize(d.status);
    const isConfirmed = CONFIRMED_STATUSES.has(status) || d.confirmedPaid === true;
    if (requireConfirmed && !isConfirmed) continue;
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

  console.log(
    `Promo code '${target}' matches: ${rows.length}` +
      ` | match=${matchMode}` +
      `${requireConfirmed ? " | confirmed-only" : ""}` +
      `${includeInactive ? " | including inactive" : " | active only"}`
  );
  if (!rows.length) return;

  console.log("");
  console.log("| Subscriber | Entered | Applied | Subscribed Date | Monthly Amount (AUD) | Status | Active |");
  console.log("|---|---|---|---:|---:|---|---:|");
  rows.forEach((r) => {
    console.log(
      `| ${r.email || r.uid} | ${r.entered || "-"} | ${r.applied || "-"} | ${formatDate(r.createdAt)} | ${Number(
        r.monthlyAmountAud || 0
      ).toFixed(2)} | ${r.status || "-"} | ${r.active ? "Yes" : "No"} |`
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

