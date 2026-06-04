/**
 * Read-only audit of (possibly duplicate) accounts and their subscription status.
 *
 * Usage:
 *   node scripts/audit-duplicate-accounts.js                 # auto-detect likely duplicates
 *   node scripts/audit-duplicate-accounts.js a@b.com c@d.com # focus on specific emails
 *   node scripts/audit-duplicate-accounts.js uid:<uid> ...   # focus on specific uids
 *
 * Subscription is read exactly the way the app does (see src/App.js):
 *   active = (subscriptionActive === true AND subscriptionExpires in future)
 *            OR (any future subscriptionExpires)
 *
 * This script ONLY reads. It never deletes or modifies anything.
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) {
  console.error("Missing serviceAccountKey.json at repo root.");
  process.exit(1);
}
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))) });

const db = admin.firestore();

function parseArgs(argv) {
  const emails = [];
  const uids = [];
  for (const a of argv) {
    if (a.startsWith("uid:")) uids.push(a.slice(4));
    else if (a.includes("@")) emails.push(a.toLowerCase());
  }
  return { emails, uids };
}

async function listAllUsers() {
  const users = [];
  let nextPageToken;
  do {
    const res = await admin.auth().listUsers(1000, nextPageToken);
    res.users.forEach((u) => users.push(u));
    nextPageToken = res.pageToken;
  } while (nextPageToken);
  return users;
}

function toMillis(exp) {
  if (!exp) return 0;
  if (typeof exp.toMillis === "function") return exp.toMillis();
  if (typeof exp.toDate === "function") return exp.toDate().getTime();
  const t = new Date(exp).getTime();
  return Number.isNaN(t) ? 0 : t;
}

async function getSubscription(uid) {
  const [memberSnap, dataSnap] = await Promise.all([
    db.collection("members").doc(uid).get(),
    db.collection("membersData").doc(uid).get(),
  ]);
  const data = memberSnap.exists ? memberSnap.data() : null;
  const exp = data?.subscriptionExpires;
  const expiresAt = toMillis(exp);
  const hasValidExpiry = expiresAt > Date.now();
  const explicitlyActive = data?.subscriptionActive === true;
  const hasFutureExpiry = data && exp != null && hasValidExpiry;
  const active = !!(explicitlyActive && hasValidExpiry) || !!hasFutureExpiry;
  return {
    hasMembersDoc: memberSnap.exists,
    hasMembersDataDoc: dataSnap.exists,
    subscriptionActiveField: data?.subscriptionActive ?? null,
    subscriptionExpires: expiresAt ? new Date(expiresAt).toISOString() : null,
    tier: data?.tier ?? null,
    paymentMethod: data?.paymentMethod ?? null,
    subscriptionId: data?.subscriptionId ?? null,
    active,
  };
}

function fmtUser(u) {
  return {
    uid: u.uid,
    email: u.email || "(none)",
    emailVerified: u.emailVerified,
    providers: (u.providerData || []).map((p) => p.providerId).join(",") || "(none)",
    created: u.metadata?.creationTime || null,
    lastSignIn: u.metadata?.lastSignInTime || null,
  };
}

async function main() {
  const { emails, uids } = parseArgs(process.argv.slice(2));
  const allUsers = await listAllUsers();

  let targets;
  if (emails.length || uids.length) {
    targets = allUsers.filter(
      (u) => (u.email && emails.includes(u.email.toLowerCase())) || uids.includes(u.uid)
    );
  } else {
    // Auto-detect likely spam duplicates:
    //  (a) same normalized email used by >1 auth account, and
    //  (b) clusters of accounts created within 2 minutes of each other.
    const byEmail = new Map();
    for (const u of allUsers) {
      const key = (u.email || "").trim().toLowerCase();
      if (!key) continue;
      if (!byEmail.has(key)) byEmail.set(key, []);
      byEmail.get(key).push(u);
    }
    const dupSet = new Set();
    for (const [, group] of byEmail) {
      if (group.length > 1) group.forEach((u) => dupSet.add(u.uid));
    }
    const sorted = [...allUsers].sort(
      (a, b) =>
        new Date(a.metadata?.creationTime || 0) - new Date(b.metadata?.creationTime || 0)
    );
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].metadata?.creationTime || 0).getTime();
      const cur = new Date(sorted[i].metadata?.creationTime || 0).getTime();
      if (cur - prev <= 2 * 60 * 1000) {
        dupSet.add(sorted[i - 1].uid);
        dupSet.add(sorted[i].uid);
      }
    }
    targets = allUsers.filter((u) => dupSet.has(u.uid));
  }

  console.log(`Total auth accounts: ${allUsers.length}`);
  console.log(`Accounts in this report: ${targets.length}\n`);

  const rows = [];
  for (const u of targets) {
    const sub = await getSubscription(u.uid);
    rows.push({ ...fmtUser(u), ...sub });
  }

  // Group output by email so duplicates sit together.
  rows.sort((a, b) => (a.email + a.created).localeCompare(b.email + b.created));

  for (const r of rows) {
    const flag = r.active ? "SUBSCRIBED" : "not subscribed";
    console.log(`[${flag}] ${r.email}`);
    console.log(`    uid:          ${r.uid}`);
    console.log(`    providers:    ${r.providers}   verified: ${r.emailVerified}`);
    console.log(`    created:      ${r.created}`);
    console.log(`    lastSignIn:   ${r.lastSignIn}`);
    console.log(`    members doc:  ${r.hasMembersDoc}   membersData doc: ${r.hasMembersDataDoc}`);
    console.log(
      `    sub fields:   active=${r.subscriptionActiveField} expires=${r.subscriptionExpires} tier=${r.tier} pay=${r.paymentMethod} subId=${r.subscriptionId}`
    );
    console.log("");
  }

  const subscribed = rows.filter((r) => r.active);
  console.log("================ SUMMARY ================");
  console.log(`Subscribed:     ${subscribed.length}`);
  subscribed.forEach((r) => console.log(`  - ${r.email}  (${r.uid})`));
  const notSub = rows.filter((r) => !r.active);
  console.log(`Not subscribed: ${notSub.length}`);
  notSub.forEach((r) => console.log(`  - ${r.email}  (${r.uid})`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
