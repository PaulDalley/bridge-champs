// Temp one-off: look up a single UID across Auth + members + membersData.
// Usage: node scripts/_lookup-uid.js <uid>
const admin = require("firebase-admin");
const fs = require("fs");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))),
});
const db = admin.firestore();
const uid = process.argv[2];

const toIso = (exp) => {
  if (!exp) return null;
  if (typeof exp.toDate === "function") return exp.toDate().toISOString();
  const t = new Date(exp).getTime();
  return Number.isNaN(t) ? String(exp) : new Date(t).toISOString();
};
const toMillis = (exp) => {
  if (!exp) return 0;
  if (typeof exp.toMillis === "function") return exp.toMillis();
  if (typeof exp.toDate === "function") return exp.toDate().getTime();
  const t = new Date(exp).getTime();
  return Number.isNaN(t) ? 0 : t;
};

(async () => {
  let auth = null;
  try {
    auth = await admin.auth().getUser(uid);
  } catch (e) {
    auth = { __err: e.message };
  }
  const [members, membersData] = await Promise.all([
    db.collection("members").doc(uid).get(),
    db.collection("membersData").doc(uid).get(),
  ]);

  console.log("UID:", uid);
  console.log("\n=== Firebase Auth ===");
  if (auth && !auth.__err) {
    console.log("  email:        ", auth.email || "(none)");
    console.log("  displayName:  ", auth.displayName || "(none)");
    console.log("  emailVerified:", auth.emailVerified);
    console.log("  providers:    ", (auth.providerData || []).map((p) => p.providerId).join(",") || "(none)");
    console.log("  created:      ", auth.metadata && auth.metadata.creationTime);
    console.log("  lastSignIn:   ", auth.metadata && auth.metadata.lastSignInTime);
    console.log("  disabled:     ", auth.disabled);
  } else {
    console.log("  NO Firebase Auth user with this UID  (" + (auth && auth.__err) + ")");
  }

  console.log("\n=== members/" + uid + " ===");
  let active = false;
  if (members.exists) {
    const d = members.data() || {};
    const expMs = toMillis(d.subscriptionExpires);
    const validExpiry = expMs > Date.now();
    active = (d.subscriptionActive === true && validExpiry) || (d.subscriptionExpires != null && validExpiry);
    console.log("  EXISTS");
    console.log("  subscriptionActive: ", d.subscriptionActive ?? null);
    console.log("  subscriptionExpires:", toIso(d.subscriptionExpires));
    console.log("  tier:               ", d.tier ?? null);
    console.log("  paymentMethod:      ", d.paymentMethod ?? null);
    console.log("  subscriptionId:     ", d.subscriptionId ?? null);
    console.log("  all fields:         ", Object.keys(d).join(", "));
  } else {
    console.log("  DOES NOT EXIST");
  }

  console.log("\n=== membersData/" + uid + " ===");
  if (membersData.exists) {
    console.log("  EXISTS — fields:", Object.keys(membersData.data() || {}).join(", "));
  } else {
    console.log("  DOES NOT EXIST");
  }

  console.log("\n=== VERDICT ===");
  const hasAuth = auth && !auth.__err;
  if (!hasAuth && !members.exists && !membersData.exists) {
    console.log("  Unknown UID — no Auth account and no member docs at all.");
  } else if (active) {
    console.log("  ACTIVE MEMBER (paid subscription current).");
  } else if (members.exists || membersData.exists) {
    console.log("  Has member doc(s) but subscription is NOT active (lapsed/never-paid).");
  } else {
    console.log("  REGISTERED USER, NOT A MEMBER — has an Auth account but no members/membersData docs.");
  }
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
