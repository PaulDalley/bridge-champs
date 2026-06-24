const admin = require("firebase-admin");
const fs = require("fs");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))),
});
const db = admin.firestore();

const ARTICLES = [
  { slug: "blackwood-rkcb", summaryColl: "bidding", bodyColl: "biddingBody" },
  { slug: "openers-rebid-just-bid-your-suits", summaryColl: "beginnerBidding", bodyColl: "beginnerBiddingBody" },
];

(async () => {
  for (const { slug, summaryColl, bodyColl } of ARTICLES) {
    const snap = await db.collection(summaryColl).where("slug", "==", slug).limit(1).get();
    if (snap.empty) { console.log(`\n${slug}: NOT FOUND in ${summaryColl}`); continue; }
    const meta = snap.docs[0].data();
    const bodyId = meta.body || snap.docs[0].id;
    const bodyDoc = await db.collection(bodyColl).doc(bodyId).get();
    const html = bodyDoc.exists ? (bodyDoc.data().text || bodyDoc.data().body || "") : "";
    const bodyText = typeof html === "string" ? html : (html.text || "");

    // Extract all <a href> links
    const links = [...bodyText.matchAll(/<a\s[^>]*href=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
    const internalLinks = links.filter(l => l.startsWith("/") || l.includes("bridgechampions.com"));
    const externalLinks = links.filter(l => !l.startsWith("/") && !l.includes("bridgechampions.com"));

    console.log(`\n=== ${slug} ===`);
    console.log(`  Body length: ${bodyText.length} chars`);
    console.log(`  Internal links (${internalLinks.length}):`, internalLinks.length ? internalLinks.join("\n    ") : "(none)");
    console.log(`  External links (${externalLinks.length}):`, externalLinks.length ? externalLinks.slice(0, 5).join("\n    ") : "(none)");
  }
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
