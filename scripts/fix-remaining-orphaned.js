/**
 * Fix the remaining 19 orphaned articles by adding inbound links.
 * Usage: APPLY=1 node scripts/fix-remaining-orphaned.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPathCandidates = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
];
const keyPath = keyPathCandidates.find((p) => fs.existsSync(p));
if (!keyPath) {
  console.error("No Firebase service account key found.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const APPLY = process.env.APPLY === "1";

const REMAINING_ORPHANED = [
  { slug: "1nt-six-card-suit-still", title: "1NT with a Six-Card Suit: When It Still Works", collection: "bidding" },
  { slug: "find-major-fit-after-1nt", title: "Find a Major Fit After 1NT: Stayman, Smolen, Puppet, Texas", collection: "bidding" },
  { slug: "responding-1nt-balanced-hands-pass", title: "Responding on balanced hands - how much to invite?", collection: "bidding" },
  { slug: "count-trumps-accurately-control-contract", title: "Count Trumps Accurately: Control the Contract", collection: "cardPlay" },
  { slug: "cash-side-suit-winners-trumps", title: "Cash Side-Suit Winners: Before drawing trumps", collection: "cardPlay" },
  { slug: "count-winners-no-trump-build", title: "Count Winners in No-Trump: Build a Trick Plan", collection: "cardPlay" },
  { slug: "count-winners-trumps-avoid-missed", title: "Count Winners in Trumps: Avoid Missed Tricks and Read the Trump Layout", collection: "cardPlay" },
  { slug: "declarer-play-basics-build-plan", title: "Declarer Play Basics: Build a Plan at Trick One", collection: "cardPlay" },
  { slug: "responders-first-bid-beginners-raise", title: "Responder's First Bid: Raise Partner with Support", collection: "beginnerBidding" },
  { slug: "opening-bids-beginners-balanced-hands", title: "Opening Bids: Balanced Hands and the 5-Card Major Rule", collection: "beginnerBidding" },
  { slug: "responders-first-bid-beginners-raise-2", title: "Responder's First Bid: Raise, New Suit, or No-Trump", collection: "beginnerBidding" },
  { slug: "openers-rebid-just-bid-your-suits", title: "Opener's Rebid: Just Bid Your Suits", collection: "beginnerBidding" },
  { slug: "counting-combined-points-bridge-bid", title: "Counting Combined Points in Bridge: When to Bid Game, Part-Score, or Pass", collection: "beginnerBidding" },
  { slug: "openers-rebid-beginners-choosing-suit", title: "Opener's Rebid with a Balanced Hand", collection: "beginnerBidding" },
  { slug: "opening-1nt-beginners-open-not", title: "Opening 1NT: When to Open and When Not to", collection: "beginnerBidding" },
  { slug: "playing-long-suits-build-extra", title: "Playing Long Suits: Build Extra Winners Early", collection: "cardPlay" },
  { slug: "establishing-side-suit-winners-honor", title: "Establishing Side-Suit Winners: Honor Sequences Like KQJ10", collection: "cardPlay" },
  { slug: "third-hand-high-beginners-play", title: "Third Hand High: When to Play Your Best Card", collection: "beginnerDefence" },
  { slug: "opening-leads-beginners-start-top", title: "Opening Leads: Start with Top of a Sequence", collection: "beginnerDefence" },
];

const KEYWORDS = {
  "1nt-six-card-suit-still": ["1nt", "opening", "suit"],
  "find-major-fit-after-1nt": ["1nt", "stayman", "major", "transfer"],
  "responding-1nt-balanced-hands-pass": ["1nt", "respond", "balanced"],
  "count-trumps-accurately-control-contract": ["count", "trump", "control"],
  "cash-side-suit-winners-trumps": ["trump", "declarer", "winner"],
  "count-winners-no-trump-build": ["count", "no-trump", "trick"],
  "count-winners-trumps-avoid-missed": ["count", "trump", "winner"],
  "declarer-play-basics-build-plan": ["declarer", "play", "plan"],
  "responders-first-bid-beginners-raise": ["responder", "raise", "beginner"],
  "opening-bids-beginners-balanced-hands": ["opening", "balanced", "beginner"],
  "responders-first-bid-beginners-raise-2": ["responder", "beginner", "raise"],
  "openers-rebid-just-bid-your-suits": ["opener", "rebid", "suit"],
  "counting-combined-points-bridge-bid": ["count", "point", "bid"],
  "openers-rebid-beginners-choosing-suit": ["opener", "rebid", "beginner"],
  "opening-1nt-beginners-open-not": ["1nt", "opening", "beginner"],
  "playing-long-suits-build-extra": ["long suit", "declarer", "winner"],
  "establishing-side-suit-winners-honor": ["suit", "winner", "honor"],
  "third-hand-high-beginners-play": ["third hand", "defence", "beginner"],
  "opening-leads-beginners-start-top": ["lead", "defence", "beginner"],
};

const COLLECTION_BODIES = {
  bidding: "biddingBody",
  cardPlay: "cardPlayBody",
  beginnerBidding: "beginnerBiddingBody",
  beginnerDefence: "beginnerDefenceBody",
};

function scoreRelatedness(sourceTitle, targetTitle, sourceKeywords) {
  let score = 0;
  const target = targetTitle.toLowerCase();
  sourceKeywords.forEach((kw) => {
    if (target.includes(kw)) score += 2;
  });
  const sourceWords = sourceTitle.toLowerCase().split(/\s+/);
  sourceWords.forEach((word) => {
    if (word.length > 4 && target.includes(word)) score += 1;
  });
  return score;
}

async function findRelatedArticles(orphaned) {
  const keywords = KEYWORDS[orphaned.slug] || [];
  const collection = orphaned.collection;
  const snap = await db.collection(collection).get();
  const candidates = snap.docs
    .map((doc) => {
      const data = doc.data();
      if (data.slug === orphaned.slug || data.isHidden) return null;
      const score = scoreRelatedness(orphaned.title, data.title, keywords);
      return { ...data, collection, score };
    })
    .filter((x) => x && x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
  return candidates;
}

function capitalizeCollection(col) {
  const labels = {
    bidding: "Bidding",
    cardPlay: "Card Play",
    beginnerBidding: "Bidding (Beginner)",
    beginnerDefence: "Defence (Beginner)",
  };
  return labels[col] || col;
}

async function fixLinks() {
  const results = [];

  for (const orphaned of REMAINING_ORPHANED) {
    console.log(`\n${orphaned.title}`);
    const related = await findRelatedArticles(orphaned);
    if (related.length === 0) {
      console.log("  ⚠ No related articles found");
      results.push({ orphaned: orphaned.slug, linksAdded: 0 });
      continue;
    }

    console.log(`  ✓ Found ${related.length} related articles`);
    let linksAdded = 0;

    for (const relatedArticle of related) {
      const bodyCollection = COLLECTION_BODIES[relatedArticle.collection];
      const bodyRef = db.collection(bodyCollection).doc(relatedArticle.body);
      const bodySnap = await bodyRef.get();

      if (!bodySnap.exists) continue;

      const bodyData = bodySnap.data();
      let bodyText = bodyData.text || bodyData["body.text"] || bodyData.body?.text || "";
      bodyText = bodyText.replace(
        /<p><strong>Read next:.*?<\/p>\s*<p><a href="\/learn\/[^"]+">Browse all/s,
        ""
      ).replace(/<p><a href="\/learn\/[^"]+">Browse all.*?<\/p>/s, "");

      const newFooter = `<p><strong>Read next:</strong> <a href="/learn/${orphaned.collection}/${orphaned.slug}">${orphaned.title}</a></p>\n<p><a href="/learn/${orphaned.collection}">Browse all ${capitalizeCollection(orphaned.collection)} &rarr;</a></p>`;
      const newText = bodyText.trimEnd() + "\n\n" + newFooter;

      if (APPLY) {
        await bodyRef.set(
          {
            text: newText,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
        linksAdded++;
      } else {
        linksAdded++;
      }
    }

    results.push({ orphaned: orphaned.slug, linksAdded });
  }

  return results;
}

async function run() {
  console.log(`\nFixing remaining 19 orphaned articles (${APPLY ? "APPLY" : "DRY-RUN"})\n`);
  console.log("=".repeat(80));

  const results = await fixLinks();
  const totalLinks = results.reduce((sum, r) => sum + r.linksAdded, 0);

  console.log("\n" + "=".repeat(80));
  console.log(`Total links added: ${totalLinks}`);
  if (!APPLY) {
    console.log("To apply: APPLY=1 node scripts/fix-remaining-orphaned.js");
  } else {
    console.log("✓ Links updated in Firestore");
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
