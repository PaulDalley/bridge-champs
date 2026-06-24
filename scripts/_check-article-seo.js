// Check SEO meta fields for recently added articles.
// Usage: node scripts/_check-article-seo.js
const admin = require("firebase-admin");
const fs = require("fs");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))),
});
const db = admin.firestore();

const SLUGS_TO_CHECK = [
  { slug: "blackwood-rkcb", colls: ["biddingAdvanced", "bidding"] },
  { slug: "openers-rebid-just-bid-your-suits", colls: ["beginnerBidding"] },
  { slug: "openers-rebid-beginners-choosing-suit", colls: ["beginnerBidding"] },
];

(async () => {
  for (const { slug, colls } of SLUGS_TO_CHECK) {
    let found = false;
    for (const coll of colls) {
      const snap = await db.collection(coll).where("slug", "==", slug).limit(1).get();
      if (snap.empty) continue;
      found = true;
      const d = snap.docs[0].data() || {};
      console.log(`\n=== ${slug} (${coll}) ===`);
      console.log("  title:       ", d.title || "(none)");
      console.log("  metaTitle:   ", d.metaTitle || "(none)");
      console.log("  teaser:      ", d.teaser ? d.teaser.slice(0, 200) : "(none)");
      console.log("  category:    ", d.category || "(none)");
      console.log("  isHidden:    ", d.isHidden ?? false);
      console.log("  redirectTo:  ", d.redirectTo || "(none)");
      console.log("  updatedAt:   ", d.updatedAt ? d.updatedAt.toDate().toISOString() : "(none)");
      break;
    }
    if (!found) console.log(`\n=== ${slug} — NOT FOUND in any collection ===`);
  }
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
