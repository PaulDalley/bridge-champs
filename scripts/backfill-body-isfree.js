/**
 * Backfill `isFree` onto article BODY docs.
 *
 * Why this matters: logged-out visitors and Googlebot are gated by the BODY
 * doc's `isFree` flag (the summary metadata isn't reliably readable for them).
 * If an intended-free article's body doc is missing `isFree`, the page redirects
 * to /membership for crawlers — so the article is never indexed. New articles
 * should set body.isFree at publish time; this script catches any that slip
 * through (e.g. migrated articles).
 *
 * For every non-hidden summary with isFree === true whose body doc lacks
 * isFree === true, it sets body.isFree = true (+ ctaTarget, freeUpdatedAt).
 * Premium articles (summary.isFree !== true) are left gated.
 *
 * DRY RUN by default; pass --apply to write.
 *   node scripts/backfill-body-isfree.js            # report only
 *   node scripts/backfill-body-isfree.js --apply    # write
 */
const admin = require("firebase-admin");
const fs = require("fs");

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))) });
const db = admin.firestore();
const FV = admin.firestore.FieldValue;
const APPLY = process.argv.includes("--apply");

// summary collection -> body collection
const PAIRS = {
  cardPlay: "cardPlayBody",
  defence: "defenceBody",
  bidding: "biddingBody",
  biddingAdvanced: "biddingAdvancedBody",
  biddingBasics: "biddingBasicsBody",
  counting: "countingBody",
  beginnerCardPlay: "beginnerCardPlayBody",
  beginnerDefence: "beginnerDefenceBody",
  beginnerBidding: "beginnerBiddingBody",
};

(async () => {
  const fixes = [];
  for (const [col, bodyCol] of Object.entries(PAIRS)) {
    const snap = await db.collection(col).get();
    for (const doc of snap.docs) {
      const d = doc.data() || {};
      if (d.isHidden === true) continue;
      if (d.isFree !== true) continue; // premium -> leave gated
      const bodyId = d.body || doc.id;
      const bodySnap = await db.collection(bodyCol).doc(bodyId).get();
      const bd = bodySnap.exists ? bodySnap.data() : {};
      if (bd.isFree === true) continue; // already fine
      fixes.push({ col, bodyCol, bodyId, slug: d.slug, ctaTarget: d.ctaTarget || "/bidding/practice" });
    }
  }
  console.log(`${APPLY ? "APPLYING" : "DRY RUN"} — body docs needing isFree: ${fixes.length}`);
  for (const f of fixes) {
    console.log("  " + f.col + " | " + (f.slug || f.bodyId));
    if (APPLY) {
      await db.collection(f.bodyCol).doc(f.bodyId).set({ isFree: true, ctaTarget: f.ctaTarget, freeUpdatedAt: FV.serverTimestamp() }, { merge: true });
    }
  }
  if (!APPLY && fixes.length) console.log("\nRe-run with --apply to write.");
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
