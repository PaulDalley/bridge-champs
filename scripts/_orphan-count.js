// Temp: count auth accounts that have NO membersData doc (and no members doc) —
// "orphaned" signups (auth account created but the profile doc never landed).
// Usage: node scripts/_orphan-count.js
const admin = require("firebase-admin");
const fs = require("fs");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))),
});
const db = admin.firestore();

(async () => {
  let users = [],
    pageToken;
  do {
    const r = await admin.auth().listUsers(1000, pageToken);
    users.push(...r.users);
    pageToken = r.pageToken;
  } while (pageToken);

  let noMembersData = 0,
    noMembers = 0;
  const orphans = []; // no membersData AND no members
  const chunk = 40;
  for (let i = 0; i < users.length; i += chunk) {
    await Promise.all(
      users.slice(i, i + chunk).map(async (u) => {
        const [md, m] = await Promise.all([
          db.collection("membersData").doc(u.uid).get(),
          db.collection("members").doc(u.uid).get(),
        ]);
        if (!md.exists) noMembersData++;
        if (!m.exists) noMembers++;
        if (!md.exists && !m.exists)
          orphans.push({ uid: u.uid, email: u.email || "(none)", created: u.metadata.creationTime, verified: u.emailVerified });
      })
    );
  }

  console.log("total auth users:        ", users.length);
  console.log("missing membersData doc: ", noMembersData);
  console.log("missing members doc:     ", noMembers);
  console.log("ORPHANED (neither doc):  ", orphans.length);
  orphans.sort((a, b) => new Date(b.created) - new Date(a.created));
  console.log("\nMost recent 20 orphaned accounts:");
  orphans.slice(0, 20).forEach((o) =>
    console.log(`  ${o.created}  verified=${o.verified}  ${o.email}  ${o.uid}`)
  );
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
