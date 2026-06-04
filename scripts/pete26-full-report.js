/**
 * Full PETE26 report: everyone who entered the code, sub status, revenue estimate.
 * Read-only. node scripts/pete26-full-report.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) {
  console.error("Missing serviceAccountKey.json");
  process.exit(1);
}
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))) });
const db = admin.firestore();

const norm = (v) => String(v || "").toLowerCase().replace(/\s+/g, "").trim();
const TARGET = "pete26";

const toIso = (ts) => {
  if (!ts) return "";
  if (typeof ts.toMillis === "function") return new Date(ts.toMillis()).toISOString();
  if (typeof ts.toDate === "function") return ts.toDate().toISOString();
  const t = new Date(ts).getTime();
  return Number.isNaN(t) ? "" : new Date(t).toISOString();
};

const toMillis = (ts) => {
  if (!ts) return 0;
  if (typeof ts.toMillis === "function") return ts.toMillis();
  if (typeof ts.toDate === "function") return ts.toDate().getTime();
  const t = new Date(ts).getTime();
  return Number.isNaN(t) ? 0 : t;
};

function amountFromTier(tierName) {
  const s = String(tierName || "").toLowerCase();
  if (s.includes("premium")) return 50;
  if (s.includes("basic")) return 25;
  return 0;
}

function subscriptionState(member) {
  if (!member) return { active: false, label: "never subscribed" };
  const exp = member.subscriptionExpires;
  const expiresAt = toMillis(exp);
  const hasValidExpiry = expiresAt > Date.now();
  const explicitlyActive = member.subscriptionActive === true;
  const hasFutureExpiry = exp != null && hasValidExpiry;
  const active = !!(explicitlyActive && hasValidExpiry) || !!hasFutureExpiry;

  if (active) {
    return { active: true, label: "subscribed" };
  }
  if (member.subscriptionId || member.subscriptionActive === true || expiresAt > 0) {
    if (expiresAt > 0 && expiresAt <= Date.now()) {
      return { active: false, label: "cancelled / expired" };
    }
    if (member.subscriptionActive === false) {
      return { active: false, label: "cancelled / inactive" };
    }
    return { active: false, label: "lapsed / not active" };
  }
  return { active: false, label: "never subscribed" };
}

async function getProfile(uid) {
  const snap = await db.collection("membersData").doc(uid).get();
  if (!snap.exists) return "";
  const d = snap.data() || {};
  return [d.firstName, d.surname].filter(Boolean).join(" ").trim();
}

async function main() {
  const byUid = new Map();

  const addUid = (uid, source, extra = {}) => {
    if (!uid) return;
    if (!byUid.has(uid)) {
      byUid.set(uid, { uid, sources: new Set(), promoRows: [], ...extra });
    }
    const row = byUid.get(uid);
    row.sources.add(source);
    Object.assign(row, { ...row, ...extra });
  };

  const usageSnap = await db.collection("promoCodeUsage").get();
  for (const doc of usageSnap.docs) {
    const d = doc.data() || {};
    if (norm(d.promoCodeEntered) !== TARGET) continue;
    const uid = d.uid || "";
    addUid(uid, "promoCodeUsage", { email: d.email || "" });
    byUid.get(uid).promoRows.push({
      docId: doc.id,
      entered: d.promoCodeEntered,
      applied: d.promoCodeApplied,
      status: d.status || "",
      tierName: d.tierName || "",
      monthlyAmountAud: Number(d.monthlyAmountAud) || 0,
      createdAt: toIso(d.createdAt),
      stripeSessionId: d.stripeSessionId || "",
    });
  }

  const membersSnap = await db.collection("members").get();
  for (const doc of membersSnap.docs) {
    const d = doc.data() || {};
    if (norm(d.lastPromoCodeEntered) !== TARGET) continue;
    addUid(doc.id, "members.lastPromoCodeEntered", {
      email: byUid.get(doc.id)?.email || "",
      lastEntered: d.lastPromoCodeEntered,
      lastApplied: d.lastPromoCodeApplied,
      lastStage: d.lastPromoCaptureStage || "",
    });
  }

  const rows = [];
  for (const entry of byUid.values()) {
    let authEmail = entry.email || "";
    let authName = "";
    try {
      const u = await admin.auth().getUser(entry.uid);
      authEmail = authEmail || u.email || "";
      authName = u.displayName || "";
    } catch (_) {
      /* deleted auth */
    }

    const memberSnap = await db.collection("members").doc(entry.uid).get();
    const member = memberSnap.exists ? memberSnap.data() || {} : null;
    const sub = subscriptionState(member);
    const profileName = await getProfile(entry.uid);

    const promoRows = (entry.promoRows || []).sort((a, b) =>
      String(b.createdAt).localeCompare(String(a.createdAt))
    );
    const latest = promoRows[0] || {};
    const tier = latest.tierName || member?.tier || "";
    const monthly =
      latest.monthlyAmountAud > 0 ? latest.monthlyAmountAud : amountFromTier(tier);

    const hadCheckout = promoRows.length > 0 || entry.lastStage;
    const everPaid =
      sub.label === "subscribed" ||
      sub.label.startsWith("cancelled") ||
      sub.label === "lapsed / not active" ||
      !!(member && member.subscriptionId);

    rows.push({
      name: profileName || authName || "(unknown)",
      email: authEmail || entry.uid,
      uid: entry.uid,
      entered: latest.entered || entry.lastEntered || TARGET,
      applied: latest.applied || entry.lastApplied || "",
      checkoutDate: (latest.createdAt || "").slice(0, 10),
      tier,
      monthlyAud: monthly,
      promoStatus: latest.status || entry.lastStage || "(no checkout record)",
      subStatus: sub.label,
      active: sub.active,
      expires: toIso(member?.subscriptionExpires).slice(0, 10),
      subscriptionId: member?.subscriptionId || "",
      paymentMethod: member?.paymentMethod || "",
      sources: [...entry.sources].join(", "),
      checkoutAttempts: promoRows.length,
      everPaid,
      collectedAud: sub.active ? monthly : everPaid && sub.label.includes("cancelled") ? monthly : 0,
    });
  }

  rows.sort((a, b) => a.email.localeCompare(b.email));

  console.log(`PETE26 full report — ${rows.length} unique people\n`);

  console.log(
    "| Name | Email | Checkout | Tier | Monthly (AUD) | Promo status | Sub status | Expires | Sub ID |"
  );
  console.log("|---|---|---:|---:|---:|---|---|---|---|");
  for (const r of rows) {
    console.log(
      `| ${r.name} | ${r.email} | ${r.checkoutDate || "-"} | ${r.tier || "-"} | ${r.monthlyAud.toFixed(2)} | ${r.promoStatus} | ${r.subStatus} | ${r.expires || "-"} | ${r.subscriptionId ? r.subscriptionId.slice(0, 20) + "…" : "-"} |`
    );
  }

  const subscribed = rows.filter((r) => r.active);
  const cancelled = rows.filter((r) => r.subStatus.includes("cancelled") || r.subStatus.includes("expired"));
  const neverSub = rows.filter((r) => r.subStatus === "never subscribed");
  const checkoutOnly = rows.filter((r) => !r.everPaid);

  const activeMrr = subscribed.reduce((s, r) => s + r.monthlyAud, 0);
  const affiliate25 = activeMrr * 0.25;

  console.log("\n================ SUMMARY ================");
  console.log(`Total who entered PETE26:     ${rows.length}`);
  console.log(`Currently subscribed:         ${subscribed.length}`);
  const line = (r, extra) =>
    console.log(`  • ${r.name} <${r.email}>  uid=${r.uid}  ${extra}`);
  subscribed.forEach((r) => line(r, `A$${r.monthlyAud}/mo (${r.tier})`));
  console.log(`Cancelled / expired:          ${cancelled.length}`);
  cancelled.forEach((r) =>
    line(r, `was ${r.tier || "?"} A$${r.monthlyAud}/mo, expires ${r.expires || "?"}`)
  );
  console.log(`Started checkout, never paid: ${checkoutOnly.length}`);
  checkoutOnly.forEach((r) => line(r, r.promoStatus));
  console.log(`Never subscribed (no payment): ${neverSub.length}`);
  neverSub.forEach((r) => line(r, ""));

  console.log(`\nActive monthly run-rate:      A$${activeMrr.toFixed(2)}/mo`);
  console.log(`25% affiliate (active MRR):   A$${affiliate25.toFixed(2)}/mo`);
  console.log(
    "\nNote: $ figures are tier list prices (Basic A$25, Premium A$50). " +
      "Firestore promo rows stay at checkout_session_created unless the webhook updates them; " +
      "actual Stripe lifetime revenue is in Stripe Dashboard per subscriptionId."
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
