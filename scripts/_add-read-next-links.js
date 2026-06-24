// Adds "Read next" internal links to article bodies that have none.
// Related articles determined by topic cluster membership (from topicHubs.js).
// Usage: node scripts/_add-read-next-links.js [--dry-run]
const admin = require("firebase-admin");
const fs = require("fs");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))),
});
const db = admin.firestore();

const DRY_RUN = process.argv.includes("--dry-run");

// All Firestore summary/body collection pairs
const COLLECTIONS = [
  ["bidding", "biddingBody"],
  ["biddingAdvanced", "biddingAdvancedBody"],
  ["biddingBasics", "biddingBasicsBody"],
  ["cardPlay", "cardPlayBody"],
  ["cardPlayBasics", "cardPlayBasicsBody"],
  ["counting", "countingBody"],
  ["defence", "defenceBody"],
  ["defenceBasics", "defenceBasicsBody"],
  ["beginnerCardPlay", "beginnerCardPlayBody"],
  ["beginnerDefence", "beginnerDefenceBody"],
  ["beginnerBidding", "beginnerBiddingBody"],
];
const SUMM_TO_CAT = {
  bidding: "bidding", biddingAdvanced: "bidding", biddingBasics: "bidding",
  cardPlay: "declarer", cardPlayBasics: "declarer", counting: "declarer",
  defence: "defence", defenceBasics: "defence",
  beginnerCardPlay: "beginner", beginnerDefence: "beginner", beginnerBidding: "beginner",
};

// Topic clusters — each cluster is an ordered list of {slug, title}.
// Articles in the same cluster link to the next 1–2 articles in the list.
const CLUSTERS = [
  // DECLARER — trumps
  [
    { s: "drawing-trumps-simple-habit-saves", t: "Drawing Trumps: A Simple Habit That Saves Tricks" },
    { s: "not-draw-trumps-3-situations", t: "When Not to Draw Trumps: 3 Situations to Delay" },
    { s: "ruff-dummy-win-extra-tricks", t: "Ruff in Dummy: Win Extra Tricks Cheaply" },
    { s: "drawing-trumps-make-right-plan", t: "Drawing Trumps: Make the Right Plan and Avoid Autopilot" },
  ],
  // DECLARER — planning / counting
  [
    { s: "counting-losers-plan-hand-spot", t: "Counting Losers: Plan the Hand and Spot Hidden Dangers Early" },
    { s: "count-winners-no-trump-build", t: "Count Winners in No-Trump: Build a Trick Plan" },
    { s: "practice-hand-1-plan-before", t: "Practice Hand 1: Plan Before You Play" },
    { s: "have-backup-plan-recover-plan", t: "Have a Backup Plan: Recover When Plan A Fails" },
    { s: "take-every-chance-create-extra", t: "Take Every Chance: Create Extra Tricks Before Defence Settles" },
  ],
  // DECLARER — pattern recognition / hand types
  [
    { s: "pattern-recognition-1-ruffing-strategy", t: "Pattern Recognition 1: Ruffing Strategy in Dummy" },
    { s: "pattern-recognition-2-set-up", t: "Pattern Recognition 2: Set Up Side Suits" },
    { s: "pattern-recognition-3-find-build", t: "Pattern Recognition 3: Find and Build Trick Sources" },
    { s: "pattern-recognition-4-avoid-creating", t: "Pattern Recognition 4: Avoid Creating Extra Losers" },
    { s: "understand-fourth-highest-leads-read", t: "Understand Fourth-Highest Leads: Read the Defensive Picture" },
  ],
  // DECLARER — setting up suits / ducking
  [
    { s: "establishing-side-suit-winners-honor", t: "Establishing Side-Suit Winners: Honor Sequences" },
    { s: "duck-preserve-communication-set-up", t: "Duck to Preserve Communication: Set Up Your Long Suit" },
    { s: "hold-up", t: "Hold Up Play in No-Trump: When to Duck the First Trick" },
    { s: "entries", t: "Use Entries Well: Reach the Right Hand at the Right Time" },
  ],
  // DEFENCE — dummy types
  [
    { s: "dummy-type-3-ruffing-dummy", t: "Dummy Type 3: Ruffing Dummy and How to Counter It" },
    { s: "dummy-type-4-passive-dummy", t: "Dummy Type 4: Passive Dummy and Active Defence" },
    { s: "danger-hand-awareness-keep-dangerous", t: "Danger Hand Awareness: Keep the Dangerous Opponent Off Lead" },
  ],
  // DEFENCE — counting
  [
    { s: "count-unseen-hand-read-distribution", t: "Count the Unseen Hand: Read Distribution in Defence" },
    { s: "count-trumps-defence-prevent-surprise", t: "Count Trumps in Defence: Prevent Surprise Ruffing" },
  ],
  // DEFENCE — leads
  [
    { s: "lead-positioning-dummy-right-small", t: "Lead Positioning: Dummy on Your Right with Small Cards" },
    { s: "playing-through-strength-towards-weakness-advanced", t: "Playing Through Strength and Towards Weakness: Advanced" },
    { s: "suit-switch-play-towards-weakness", t: "What Suit to Switch To: Play Towards Weakness or Through Strength" },
  ],
  // DEFENCE — signals
  [
    { s: "bridge-signals-beginners-attitude-count", t: "Bridge Signals: Attitude, Count, and Suit Preference" },
    { s: "suit-preference-signals-mckenney-lavinthal", t: "Suit Preference Signals (McKenney, Lavinthal)" },
    { s: "udca-signals", t: "UDCA Signals" },
  ],
  // DEFENCE — technique
  [
    { s: "defence-basics-build-plan-trick", t: "Defence Basics: Build a Plan at Trick One" },
    { s: "taking-tricks-defence-timing-purpose", t: "Taking Tricks in Defence: Timing and Purpose" },
    { s: "duck-winner-defence-timing-hold", t: "Duck a Winner in Defence: Timing the Hold Up" },
    { s: "ruffing-defence-turn-shortness-tricks", t: "Ruffing in Defence: Turn Shortness into Tricks" },
    { s: "forcing-defence-drain-declarers-trumps", t: "The Forcing Defence: Drain Declarer's Trumps" },
  ],
  // BIDDING — opener's rebid
  [
    { s: "openers-rebid-beginners-choosing-suit", t: "Opener's Rebid: Introduction — What to Do With a Balanced Hand" },
    { s: "openers-rebid-just-bid-your-suits", t: "Opener's Rebid: Just Bid Your Suits" },
  ],
  // BIDDING — competitive
  [
    { s: "kiss-3-support-partner-priority", t: "KISS 3: Support Partner as a Priority" },
    { s: "four-level-doubles-do-next", t: "Four-Level Doubles: What to Do Next" },
    { s: "second-suit-competition-compete-purpose", t: "Second Suit in Competition: Compete with Purpose" },
    { s: "preempting-first-seat-bold", t: "Preempting in First Seat: When to Be Bold" },
  ],
  // BIDDING — NT conventions
  [
    { s: "system-over-1nt-conventions", t: "System Over 1NT: Transfer Responses and Conventions" },
    { s: "puppet-stayman-check-5-card", t: "Puppet Stayman: How to Check for 5-Card Majors" },
    { s: "texas-transfers-transfer-directly-game", t: "Texas Transfers: Transfer Directly to Game" },
  ],
  // BIDDING — slam conventions (blackwood has special links below)
  [
    { s: "jacoby-2nt", t: "Worthwhile Conventions #1 — Jacoby 2NT" },
    { s: "fourth-suit-forcing-checkback-core", t: "Fourth Suit Forcing: Introduction" },
    { s: "5nt-pick-slam-practical-partnership", t: "5NT Pick a Slam: Practical Partnership Agreements" },
  ],
  // BIDDING — hand evaluation
  [
    { s: "hand-evaluation-1-card-texture", t: "Hand Evaluation 1: Card Texture Matters" },
    { s: "hand-evaluation-2-re-evaluate", t: "Hand Evaluation 2: Re-Evaluate as the Auction Develops" },
    { s: "hand-evaluation-3-do-more", t: "Hand Evaluation 3: Do More with a Good Suit" },
    { s: "should-invite-11-practical-guide", t: "Should You Invite with 11? Practical Guide" },
  ],
  // BIDDING — NT / inviting
  [
    { s: "1nt-six-card-suit-still", t: "1NT with a Six-Card Suit: When It Still Works" },
    { s: "responding-1nt-balanced-hands-pass", t: "Responding on Balanced Hands — How Much to Invite?" },
    { s: "just-bid-3nt-recognize-right", t: "Just Bid 3NT: Recognize the Right Auctions" },
  ],
];

// Special case: user-specified links for blackwood
const BLACKWOOD_LINKS = [
  { s: "fourth-suit-forcing-checkback-core", t: "Fourth Suit Forcing: Introduction" },
  { s: "5nt-pick-slam-practical-partnership", t: "5NT Pick a Slam: Practical Partnership Agreements" },
];

function buildReadNext(links, slugMap) {
  const valid = links.filter(l => slugMap[l.s]);
  if (!valid.length) return null;
  const parts = valid.map(l => `<a href="/learn/${slugMap[l.s].cat}/${l.s}">${l.t}</a>`);
  return `<p><strong>Read next:</strong> ${parts.join(" &middot; ")}</p>`;
}

function getRelated(cluster, index) {
  const n = cluster.length;
  if (n <= 1) return [];
  if (n === 2) return [cluster[1 - index]];
  return [cluster[(index + 1) % n], cluster[(index + 2) % n]];
}

function hasInternalLinks(html) {
  return /<a\s[^>]*href=["']\/[^"']+["']/i.test(html) || /Read next/i.test(html);
}

function extractBody(data) {
  if (!data) return "";
  const c = data.text != null ? data.text : data.body;
  return typeof c === "string" ? c : (c && typeof c.text === "string" ? c.text : "");
}

(async () => {
  // Build slug → {bodyId, bodyColl, cat} map
  console.log("Loading articles from Firestore...");
  const slugMap = {};
  for (const [summaryColl, bodyColl] of COLLECTIONS) {
    const snap = await db.collection(summaryColl).get();
    snap.forEach(doc => {
      const d = doc.data();
      if (!d.slug || d.isHidden || (d.redirectTo && d.redirectTo.startsWith("/"))) return;
      if (!slugMap[d.slug]) {
        slugMap[d.slug] = { bodyId: d.body || doc.id, bodyColl, cat: SUMM_TO_CAT[summaryColl] };
      }
    });
  }
  console.log(`Loaded ${Object.keys(slugMap).length} publishable articles.\n`);

  let updated = 0, skipped = 0, notFound = 0;

  // Build full list of (slug, related[]) pairs
  const workItems = [];

  // Blackwood special case
  workItems.push({ slug: "blackwood-rkcb", related: BLACKWOOD_LINKS });

  // Cluster-based
  for (const cluster of CLUSTERS) {
    for (let i = 0; i < cluster.length; i++) {
      const { s: slug } = cluster[i];
      if (slug === "blackwood-rkcb") continue; // handled above
      workItems.push({ slug, related: getRelated(cluster, i) });
    }
  }

  for (const { slug, related } of workItems) {
    const info = slugMap[slug];
    if (!info) { notFound++; console.log(`  SKIP (not in Firestore): ${slug}`); continue; }

    const bodyDoc = await db.collection(info.bodyColl).doc(info.bodyId).get();
    if (!bodyDoc.exists) { notFound++; console.log(`  SKIP (no body doc): ${slug}`); continue; }

    const body = extractBody(bodyDoc.data());
    if (hasInternalLinks(body)) { skipped++; console.log(`  SKIP (already has links): ${slug}`); continue; }

    const readNext = buildReadNext(related, slugMap);
    if (!readNext) { skipped++; console.log(`  SKIP (related articles not in Firestore): ${slug}`); continue; }

    console.log(`  ADD: ${slug}`);
    related.filter(r => slugMap[r.s]).forEach(r => console.log(`    → /learn/${slugMap[r.s].cat}/${r.s}`));

    if (!DRY_RUN) {
      const newBody = body + "\n" + readNext;
      const field = bodyDoc.data().text != null ? "text" : "body";
      await db.collection(info.bodyColl).doc(info.bodyId).update({
        [field]: typeof bodyDoc.data()[field] === "object" ? { text: newBody } : newBody,
      });
      updated++;
    } else {
      updated++;
    }
  }

  console.log(`\n=== ${DRY_RUN ? "DRY RUN" : "DONE"} ===`);
  console.log(`  Updated: ${updated}, Skipped (already had links): ${skipped}, Not found: ${notFound}`);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
