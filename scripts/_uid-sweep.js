// Temp: find every doc keyed by a UID across ALL collections, and compare the
// target UID against the most recent OTHER signups (the "normal" baseline).
// Usage: node scripts/_uid-sweep.js <uid>
const admin = require("firebase-admin");
const fs = require("fs");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))),
});
const db = admin.firestore();
const TARGET = process.argv[2];

(async () => {
  const cols = await db.listCollections();
  const colNames = cols.map((c) => c.id);
  console.log(`Top-level collections (${colNames.length}):\n  ${colNames.join(", ")}`);

  async function docsFor(uid) {
    const hits = [];
    await Promise.all(
      colNames.map(async (c) => {
        try {
          const s = await db.collection(c).doc(uid).get();
          if (s.exists)
            hits.push(`${c}  { ${Object.keys(s.data() || {}).slice(0, 10).join(", ")} }`);
        } catch (e) {
          /* ignore */
        }
      })
    );
    return hits;
  }

  console.log(`\n=== TARGET ${TARGET} — docs keyed by this UID ===`);
  const t = await docsFor(TARGET);
  console.log(t.length ? t.map((x) => "  " + x).join("\n") : "  (none in any collection)");

  let users = [],
    pageToken;
  do {
    const r = await admin.auth().listUsers(1000, pageToken);
    users.push(...r.users);
    pageToken = r.pageToken;
  } while (pageToken);
  console.log(`\n(total auth users: ${users.length})`);
  users.sort((a, b) => new Date(b.metadata.creationTime) - new Date(a.metadata.creationTime));
  const others = users.filter((u) => u.uid !== TARGET).slice(0, 5);
  for (const u of others) {
    console.log(`\n=== RECENT signup ${u.uid} (${u.email || "?"}, created ${u.metadata.creationTime}) ===`);
    const h = await docsFor(u.uid);
    console.log(h.length ? h.map((x) => "  " + x).join("\n") : "  (none in any collection)");
  }
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
