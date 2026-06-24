// Temp: tally auth users by sign-in provider — proves whether Google/Facebook
// sign-in is actually enabled & used. Usage: node scripts/_provider-tally.js
const admin = require("firebase-admin");
const fs = require("fs");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))),
});

(async () => {
  let users = [], t;
  do {
    const r = await admin.auth().listUsers(1000, t);
    users.push(...r.users);
    t = r.pageToken;
  } while (t);

  const tally = {};
  for (const u of users) {
    const provs = (u.providerData || []).map((p) => p.providerId).sort();
    const key = provs.length ? provs.join(" + ") : "(none)";
    tally[key] = (tally[key] || 0) + 1;
  }
  console.log("total auth users:", users.length, "\nby provider:");
  Object.entries(tally).sort((a, b) => b[1] - a[1]).forEach(([k, v]) =>
    console.log(`  ${String(v).padStart(3)}  ${k}`)
  );

  const social = users.filter((u) =>
    (u.providerData || []).some((p) => /google\.com|facebook\.com/.test(p.providerId))
  );
  console.log(`\nusers who signed in with Google/Facebook: ${social.length}`);
  social
    .sort((a, b) => new Date(b.metadata.creationTime) - new Date(a.metadata.creationTime))
    .slice(0, 10)
    .forEach((u) =>
      console.log(`  ${(u.providerData || []).map((p) => p.providerId).join(",")}  ${u.email || "(no email)"}  ${u.metadata.creationTime}`)
    );
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
