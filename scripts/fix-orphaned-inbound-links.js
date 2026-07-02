/**
 * Fix orphaned articles by adding inbound links from related articles.
 * Strategy: for each orphaned article, find 4-6 closely related articles
 * and add read-next footer links to them.
 *
 * Usage: APPLY=1 node scripts/fix-orphaned-inbound-links.js
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

const ORPHANED = [
  { slug: "responding-takeout-double-keep-practical", title: "Responding to a Takeout Double: Keep It Practical", collection: "bidding" },
  { slug: "after-partner-opens-1nt-pass", title: "After Partner Opens 1NT: Pass or Invite", collection: "bidding" },
  { slug: "transfers-must-have-tool-nt", title: "Transfers: A must have tool for NT openings", collection: "bidding" },
  { slug: "non-vulnerable-preempting-apply-maximum", title: "Non-Vulnerable Preempting: Apply Maximum Pressure", collection: "bidding" },
  { slug: "better-minor-or-short-club", title: "Better minor or short club?", collection: "bidding" },
  { slug: "bidding-conversation-share-information-efficiently", title: "Bidding as a Conversation: Share Information Efficiently", collection: "bidding" },
  { slug: "stayman-convention-find-4-4", title: "Stayman Convention: Find a 4-4 Major Fit After 1NT", collection: "bidding" },
  { slug: "count-trumps-accurately-control-contract", title: "Count Trumps Accurately: Control the Contract", collection: "counting" },
  { slug: "draw-trumps-purpose-avoid-autopilot", title: "Draw Trumps with Purpose: Avoid Autopilot", collection: "cardPlay" },
  { slug: "count-potential-losers-spot-hidden", title: "Count Potential Losers: Spot Hidden Dangers Early", collection: "cardPlay" },
  { slug: "bridge-bidding-basics-opening-bids", title: "Bridge Bidding Basics: Opening Bids You Can Trust", collection: "beginnerBidding" },
  { slug: "responders-first-bid-beginners-raise", title: "Responder's First Bid: Raise Partner with Support", collection: "beginnerBidding" },
  { slug: "1nt-opening-beginners-bid-promises", title: "1NT Opening: What the Bid Promises", collection: "beginnerBidding" },
  { slug: "opening-bids-beginners-5-card", title: "Opening Bids: The 5-Card Major Rule Made Simple", collection: "beginnerBidding" },
  { slug: "bridge-bidding-responding-partners-opening", title: "Bridge Bidding: Responding to Partner's Opening Bid", collection: "beginnerBidding" },
  { slug: "openers-rebid-beginners-rebid-1nt", title: "Opener's Rebid: Rebid 1NT or Show a Second Suit?", collection: "beginnerBidding" },
  { slug: "finesse-double-finesse-create-extra", title: "Finesse and Double Finesse: Create Extra Winners", collection: "beginnerCardPlay" },
  { slug: "hold-up-play-no-trump", title: "Hold Up Play in No-Trump: When to Duck the First Trick", collection: "cardPlay" },
  { slug: "lead-towards-weakness-beginners-target", title: "Lead Towards Weakness: Target Their Weakest Holding", collection: "beginnerDefence" },
  { slug: "second-hand-low-beginners-exceptions", title: "Second Hand Low: Exceptions You Must Notice (When to Cover an Honor)", collection: "beginnerDefence" },
];

// Keywords for matching related articles
const KEYWORDS = {
  "responding-takeout-double-keep-practical": ["takeout", "double", "respond"],
  "after-partner-opens-1nt-pass": ["1nt", "opening", "pass", "invite"],
  "transfers-must-have-tool-nt": ["transfer", "1nt", "texas", "jacoby"],
  "non-vulnerable-preempting-apply-maximum": ["preempt", "preemptive", "opening"],
  "better-minor-or-short-club": ["minor", "opening", "1c", "1d", "opening bids"],
  "bidding-conversation-share-information-efficiently": ["bidding", "conversation", "communication"],
  "stayman-convention-find-4-4": ["stayman", "1nt", "major", "transfer"],
  "count-trumps-accurately-control-contract": ["count", "trump", "control"],
  "draw-trumps-purpose-avoid-autopilot": ["trump", "draw", "card play"],
  "count-potential-losers-spot-hidden": ["count", "loser", "declarer"],
  "bridge-bidding-basics-opening-bids": ["opening", "bid", "beginner"],
  "responders-first-bid-beginners-raise": ["responder", "raise", "beginner"],
  "1nt-opening-beginners-bid-promises": ["1nt", "opening", "beginner"],
  "opening-bids-beginners-5-card": ["opening", "major", "beginner", "5-card"],
  "bridge-bidding-responding-partners-opening": ["responder", "bidding", "beginner"],
  "openers-rebid-beginners-rebid-1nt": ["opener", "rebid", "beginner"],
  "finesse-double-finesse-create-extra": ["finesse", "card play", "beginner"],
  "hold-up-play-no-trump": ["holdout", "no-trump", "nt", "declarer"],
  "lead-towards-weakness-beginners-target": ["lead", "defence", "beginner"],
  "second-hand-low-beginners-exceptions": ["second hand", "defence", "beginner"],
};

const COLLECTION_BODIES = {
  bidding: "biddingBody",
  defence: "defenceBody",
  cardPlay: "cardPlayBody",
  counting: "countingBody",
  beginnerBidding: "beginnerBiddingBody",
  beginnerCardPlay: "beginnerCardPlayBody",
  beginnerDefence: "beginnerDefenceBody",
};

function scoreRelatedness(sourceTitle, targetTitle, sourceKeywords) {
  // Score how related two articles are based on title and keywords
  let score = 0;
  const target = targetTitle.toLowerCase();

  // Keyword matches
  sourceKeywords.forEach((kw) => {
    if (target.includes(kw)) score += 2;
  });

  // Title word overlap
  const sourceWords = sourceTitle.toLowerCase().split(/\s+/);
  sourceWords.forEach((word) => {
    if (word.length > 4 && target.includes(word)) score += 1;
  });

  return score;
}

async function findRelatedArticles(orphaned) {
  const keywords = KEYWORDS[orphaned.slug] || [];
  const collection = orphaned.collection;

  // Get all articles in the same collection
  const snap = await db.collection(collection).get();
  const candidates = snap.docs
    .map((doc) => {
      const data = doc.data();
      if (data.slug === orphaned.slug || data.isHidden) return null;

      const score = scoreRelatedness(orphaned.title, data.title, keywords);
      return { ...data, collection, score }; // Ensure collection is included
    })
    .filter((x) => x && x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6); // Pick top 6

  return candidates;
}

function buildReadNextFooter(orphanedArticle, relatedArticles) {
  // Build a read-next footer like: <p><strong>Read next:</strong> <a href="/learn/bidding/slug">Title</a> …</p>
  const links = relatedArticles
    .map((a) => `<a href="/learn/${a.collection}/${a.slug}">${a.title}</a>`)
    .join(" &middot; ");

  return `<p><strong>Read next:</strong> ${links}</p>\n<p><a href="/learn/${orphanedArticle.collection}">Browse all ${capitalizeCollection(
    orphanedArticle.collection
  )} &rarr;</a></p>`;
}

function capitalizeCollection(col) {
  const labels = {
    bidding: "Bidding",
    defence: "Defence",
    cardPlay: "Card Play",
    counting: "Counting",
    beginnerBidding: "Bidding (Beginner)",
    beginnerCardPlay: "Card Play (Beginner)",
    beginnerDefence: "Defence (Beginner)",
  };
  return labels[col] || col;
}

async function fixLinks() {
  const results = [];

  for (const orphaned of ORPHANED) {
    console.log(`\nFinding related articles for: "${orphaned.title}"`);

    const related = await findRelatedArticles(orphaned);
    if (related.length === 0) {
      console.log("  ⚠ No related articles found in same collection");
      results.push({
        orphaned: orphaned.slug,
        title: orphaned.title,
        linksAdded: 0,
        articlesFound: 0,
      });
      continue;
    }

    console.log(`  ✓ Found ${related.length} related articles`);

    // Add links from related articles to this orphaned one
    let linksAdded = 0;

    for (const relatedArticle of related) {
      const bodyCollection = COLLECTION_BODIES[relatedArticle.collection];
      const bodyRef = db.collection(bodyCollection).doc(relatedArticle.body);
      const bodySnap = await bodyRef.get();

      if (!bodySnap.exists) {
        console.log(`    ⚠ Body not found for "${relatedArticle.title}"`);
        continue;
      }

      const bodyData = bodySnap.data();
      let bodyText = bodyData.text || bodyData["body.text"] || bodyData.body?.text || "";

      // Check if already has a read-next footer
      const hasReadNext =
        bodyText.includes("Read next:") || bodyText.includes("Browse all");
      if (hasReadNext) {
        // Replace the footer
        bodyText = bodyText
          .replace(
            /<p><strong>Read next:.*?<\/p>\s*<p><a href="\/learn\/[^"]+">Browse all/s,
            ""
          )
          .replace(/<p><a href="\/learn\/[^"]+">Browse all.*?<\/p>/s, "");
      }

      // Add the orphaned article to the footer
      const newFooter = `<p><strong>Read next:</strong> <a href="/learn/${orphaned.collection}/${orphaned.slug}">${orphaned.title}</a></p>\n<p><a href="/learn/${orphaned.collection}">Browse all ${capitalizeCollection(
        orphaned.collection
      )} &rarr;</a></p>`;

      const newText = bodyText.trimEnd() + "\n\n" + newFooter;

      if (APPLY) {
        await bodyRef.set(
          {
            text: newText,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
        console.log(`    ✓ Added link in "${relatedArticle.title}"`);
        linksAdded++;
      } else {
        console.log(`    [DRY-RUN] Would add link in "${relatedArticle.title}"`);
        linksAdded++;
      }
    }

    results.push({
      orphaned: orphaned.slug,
      title: orphaned.title,
      articlesFound: related.length,
      linksAdded,
    });
  }

  return results;
}

async function run() {
  console.log(
    `SEO: Adding inbound links to orphaned articles (${APPLY ? "APPLY" : "DRY-RUN"})\n`
  );
  console.log("=".repeat(70));

  const results = await fixLinks();

  console.log("\n" + "=".repeat(70));
  console.log("SUMMARY");
  console.log("=".repeat(70));

  const totalLinksAdded = results.reduce((sum, r) => sum + r.linksAdded, 0);
  console.log(`Total inbound links added: ${totalLinksAdded}`);
  console.log(
    `Articles with no related content found: ${results.filter((r) => r.articlesFound === 0).length}`
  );

  if (!APPLY) {
    console.log("\n⚠️ DRY-RUN MODE: No changes applied.");
    console.log("To apply: APPLY=1 node scripts/fix-orphaned-inbound-links.js");
  } else {
    console.log("\n✓ Links updated in Firestore");
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
