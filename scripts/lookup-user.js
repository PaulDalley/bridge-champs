const admin = require("firebase-admin");
const path = require("path");
const serviceAccount = require(path.join(__dirname, "..", "serviceAccountKey.json"));

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();
const auth = admin.auth();
const EMAIL = process.argv[2];

(async () => {
  console.log("=== LOOKING UP:", EMAIL, "===\n");

  // 1. Firebase Auth
  let uid = null;
  try {
    const user = await auth.getUserByEmail(EMAIL);
    uid = user.uid;
    console.log("--- FIREBASE AUTH ---");
    console.log("uid:           ", user.uid);
    console.log("email:         ", user.email);
    console.log("emailVerified: ", user.emailVerified);
    console.log("created:       ", user.metadata.creationTime);
    console.log("lastSignIn:    ", user.metadata.lastSignInTime);
    console.log("disabled:      ", user.disabled);
    console.log("");
  } catch (e) {
    console.log("--- FIREBASE AUTH ---");
    console.log("No Auth user found:", e.message, "\n");
  }

  // 2. Firestore collections that hold user/subscription data
  const collections = ["members", "membersData", "users"];
  for (const col of collections) {
    console.log(`--- FIRESTORE: ${col} ---`);
    // by uid as doc id
    if (uid) {
      const doc = await db.collection(col).doc(uid).get();
      if (doc.exists) {
        console.log(`[doc id = uid] ${col}/${uid}:`);
        console.log(JSON.stringify(doc.data(), null, 2));
      }
    }
    // by email field
    const snap = await db.collection(col).where("email", "==", EMAIL).get();
    if (!snap.empty) {
      snap.forEach((d) => {
        console.log(`[email match] ${col}/${d.id}:`);
        console.log(JSON.stringify(d.data(), null, 2));
      });
    }
    if ((!uid || !(await db.collection(col).doc(uid).get()).exists) && snap.empty) {
      console.log("(nothing found)");
    }
    console.log("");
  }

  process.exit(0);
})().catch((e) => {
  console.error("ERROR:", e);
  process.exit(1);
});
