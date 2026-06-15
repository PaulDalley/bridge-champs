// Topic-hub taxonomy + article allocation.
//
// This is STRUCTURE, not content: topic names are the user's words, article
// titles are the articles' own wording (verbatim), and `intro` is a slot the
// user fills in their own words (left blank here on purpose).
//
// Each category has topics; each topic lists existing articles (title + URL +
// level). An article may appear under more than one topic. `suggested: true`
// marks topics Claude proposed for leftover articles — rename/merge/remove freely.

export const TRAINER_PATH = {
  declarer: "/declarer/practice",
  defence: "/defence/practice",
  bidding: "/bidding/practice",
};

const A = "Advanced";
const F = "Fundamentals";

export const CATEGORIES = [
  {
    key: "declarer",
    label: "Declarer",
    topics: [
      {
        slug: "trumps",
        name: "Trumps",
        intro: `The first question we're often faced with - should I draw trumps? In reality its probably about 50% of the time correct to draw them immediately, and 50% of the time correct to wait. There is no perfect rule, but there are a few good guidelines that will help you find the right approach

* Ruff losers in dummy before drawing trumps
* Typically set up long side suits before drawing trumps
* If you can "Just draw trumps", do so, don't delay unless its for a concrete reason
* Remember that trumps often double up as entries. Try to draw a trump when you also need an entry to the hand.`,
        articles: [
          { title: "Drawing Trumps: A Simple Habit That Saves Tricks", to: "/beginner/articles/declarer/drawing-trumps-simple-habit-saves", level: F },
          { title: "When Not to Draw Trumps: 3 Situations to Delay", to: "/beginner/articles/declarer/not-draw-trumps-3-situations", level: F },
          { title: "Ruff in Dummy: Win Extra Tricks Cheaply", to: "/beginner/articles/declarer/ruff-dummy-win-extra-tricks", level: F },
          { title: "Cash Trumps Without Blocking: Keep Your Winners Running", to: "/beginner/articles/declarer/cash-trumps-without-blocking-keep", level: F },
          { title: "Drawing Trumps: Make the Right Plan and Avoid Autopilot", to: "/declarer/articles/drawing-trumps-make-right-plan", level: A },
          { title: "Count Winners in Trumps: Avoid Missed Tricks and Read the Trump Layout", to: "/declarer/articles/count-winners-trumps-avoid-missed", level: A },
          { title: "Cash Side-Suit Winners with Trumps Out: Avoid Ruff Risk", to: "/declarer/articles/cash-side-suit-winners-trumps", level: A },
        ],
      },
      {
        slug: "counting",
        name: "Counting",
        intro: "",
        articles: [
          { title: "Counting Losers: Plan the Hand and Spot Hidden Dangers Early", to: "/declarer/articles/counting-losers-plan-hand-spot", level: A },
          { title: "Count Winners in No-Trump: Build a Trick Plan", to: "/declarer/articles/count-winners-no-trump-build", level: A },
          { title: "Count Winners in Trumps: Avoid Missed Tricks and Read the Trump Layout", to: "/declarer/articles/count-winners-trumps-avoid-missed", level: A },
        ],
      },
      {
        slug: "planning",
        name: "Planning",
        intro: "",
        articles: [
          { title: "Declarer Play Basics: Build a Plan at Trick One", to: "/declarer/articles/declarer-play-basics-build-plan", level: A },
          { title: "Counting Losers: Plan the Hand and Spot Hidden Dangers Early", to: "/declarer/articles/counting-losers-plan-hand-spot", level: A },
          { title: "Practice Hand 1: Plan Before You Play", to: "/declarer/articles/practice-hand-1-plan-before", level: A },
          { title: "Practice Hand 2: Timing and Entries Under Pressure", to: "/declarer/articles/practice-hand-2-timing-entries", level: A },
          { title: "Have a Backup Plan: Recover When Plan A Fails", to: "/declarer/articles/have-backup-plan-recover-plan", level: A },
          { title: "Take Every Chance: Create Extra Tricks Before Defence Settles", to: "/declarer/articles/take-every-chance-create-extra", level: A },
        ],
      },
      {
        slug: "hand-types",
        name: "Hand & dummy types",
        intro: "",
        articles: [
          { title: "Bridge Shapes Fundamentals: Read Distribution Quickly", to: "/declarer/articles/bridge-shapes-fundamentals-read-distribution", level: A },
          { title: "Pattern Recognition 1: Ruffing Strategy in Dummy", to: "/declarer/articles/pattern-recognition-1-ruffing-strategy", level: A },
          { title: "Pattern Recognition 4: Avoid Creating Extra Losers", to: "/declarer/articles/pattern-recognition-4-avoid-creating", level: A },
          { title: "Understand Fourth-Highest Leads: Read the Defensive Picture", to: "/declarer/articles/understand-fourth-highest-leads-read", level: A },
        ],
      },
      {
        slug: "setting-up-suits",
        name: "Setting up suits",
        intro: "",
        articles: [
          { title: "Playing Long Suits: Build Extra Winners Early", to: "/beginner/articles/declarer/playing-long-suits-build-extra", level: F },
          { title: "Establishing Side-Suit Winners: Honor Sequences Like KQJ10", to: "/beginner/articles/declarer/establishing-side-suit-winners-honor", level: F },
          { title: "No-Trump Basics: Build Your Long Suit and Cash Winners", to: "/beginner/articles/declarer/no-trump-basics-build-long", level: F },
          { title: "Duck to Preserve Communication: Set Up Your Long Suit", to: "/declarer/articles/duck-preserve-communication-set-up", level: A },
          { title: "Pattern Recognition 2: Set Up Side Suits", to: "/declarer/articles/pattern-recognition-2-set-up", level: A },
          { title: "Pattern Recognition 3: Find and Build Trick Sources", to: "/declarer/articles/pattern-recognition-3-find-build", level: A },
        ],
      },
      {
        slug: "finesses",
        name: "Finesses",
        intro: "",
        suggested: true,
        articles: [
          { title: "Finesses: Single, Double, and Leading Low Toward Honors", to: "/beginner/articles/declarer/finesses-beginners-single-double-leading", level: F },
        ],
      },
      {
        slug: "entries",
        name: "Entries",
        intro: "",
        suggested: true,
        articles: [
          { title: "Use Entries Well: Reach the Right Hand at the Right Time", to: "/declarer/articles/use-entries-well-reach-right", level: A },
        ],
      },
      {
        slug: "hold-up",
        name: "Hold-up & ducking",
        intro: "",
        suggested: true,
        articles: [
          { title: "Hold Up Play in No-Trump: When to Duck the First Trick", to: "/beginner/articles/declarer/hold-up-play-no-trump", level: F },
          { title: "Duck to Preserve Communication: Set Up Your Long Suit", to: "/declarer/articles/duck-preserve-communication-set-up", level: A },
        ],
      },
    ],
  },
  {
    key: "defence",
    label: "Defence",
    topics: [
      {
        slug: "hand-types",
        name: "Hand & dummy types",
        intro: `When a skilled defender looks at dummy, often they are able to tell the key points of the hand. They will often know declarer's main plan and as a result, will be focused on ways of defending.

A typical example is when you spot a very weak dummy with a singleton and 3 trumps. Declarer will often go for ruffs in dummy, and it will be the role of the defenders to play trumps. When the defenders are clued into that, they will be focused on, for example, getting the lead from the correct side in order to play a trump through.

There are main categories of dummy that we will work through in this section which will help you come up with plans in defence and have a better idea of which suit to play and when.`,
        articles: [
          { title: "Dummy Type 1: Limited Entries and How to Pressure It", to: "/defence/articles/dummy-type-1-limited-entries", level: A },
          { title: "Dummy Type 2: Strong Trick Source and How to Disrupt It", to: "/defence/articles/dummy-type-2-strong-trick", level: A },
          { title: "Dummy Type 3: Ruffing Dummy and How to Counter It", to: "/defence/articles/dummy-type-3-ruffing-dummy", level: A },
          { title: "Dummy Type 4: Passive Dummy and Active Defence", to: "/defence/articles/dummy-type-4-passive-dummy", level: A },
          { title: "Danger Hand Awareness: Keep the Dangerous Opponent Off Lead", to: "/defence/articles/danger-hand-awareness-keep-dangerous", level: A },
        ],
      },
      {
        slug: "counting",
        name: "Counting",
        intro: "",
        articles: [
          { title: "Count the Unseen Hand: Read Distribution in Defence", to: "/defence/articles/count-unseen-hand-read-distribution", level: A },
          { title: "Count Trumps in Defence: Prevent Surprise Ruffing", to: "/defence/articles/count-trumps-defence-prevent-surprise", level: A },
        ],
      },
      {
        slug: "leads",
        name: "Leads",
        intro: "",
        articles: [
          { title: "Opening Leads: Top of a Sequence and Longest Suit in No-Trump", to: "/beginner/articles/defence/opening-leads-beginners-top-sequence", level: F },
          { title: "What suit to switch to: Play Towards Weakness or Through Strength", to: "/beginner/articles/defence/suit-switch-play-towards-weakness", level: F },
          { title: "Lead Positioning: Dummy on Your Right with Small Cards", to: "/defence/articles/lead-positioning-dummy-right-small", level: A },
          { title: "Playing through strength and towards weakness: Advanced", to: "/defence/articles/playing-through-strength-towards-weakness-advanced", level: A },
          { title: "The Trump Lead: When It Kills Ruffing Plans", to: "/defence/articles/trump-lead-kills-ruffing-plans", level: A },
        ],
      },
      {
        slug: "signals",
        name: "Signals",
        intro: "",
        articles: [
          { title: "Bridge Signals: Attitude, Count, and Suit Preference", to: "/beginner/articles/defence/bridge-signals-beginners-attitude-count", level: F },
          { title: "Odds and Evens Discarding in Bridge: Should You Play It?", to: "/beginner/articles/defence/odds-evens-discarding-bridge-should", level: F },
          { title: "Suit preference signals (McKenney, Lavinthal)", to: "/defence/articles/suit-preference-signals-mckenney-lavinthal", level: A },
        ],
      },
      {
        slug: "second-third-hand",
        name: "Second & third hand play",
        intro: "",
        suggested: true,
        articles: [
          { title: "Second Hand Low: Improving Your Defensive Fundamentals", to: "/beginner/articles/defence/second-hand-low-beginners-default", level: F },
          { title: "Third Hand High: When to Play Your Best Card", to: "/beginner/articles/defence/third-hand-high-beginners-play", level: F },
        ],
      },
      {
        slug: "technique",
        name: "Technique & timing",
        intro: "",
        suggested: true,
        articles: [
          { title: "Defence Basics: Build a Plan at Trick One", to: "/defence/articles/defence-basics-build-plan-trick", level: A },
          { title: "Taking Tricks in Defence: Timing and Purpose", to: "/defence/articles/taking-tricks-defence-timing-purpose", level: A },
          { title: "Duck a Winner in Defence: Timing the Hold Up", to: "/defence/articles/duck-winner-defence-timing-hold", level: A },
          { title: "Ruffing in Defence: Turn Shortness into Tricks", to: "/defence/articles/ruffing-defence-turn-shortness-tricks", level: A },
          { title: "The Forcing Defence: Drain Declarer's Trumps", to: "/defence/articles/forcing-defence-drain-declarers-trumps", level: A },
        ],
      },
    ],
  },
  {
    key: "bidding",
    label: "Bidding",
    topics: [
      {
        slug: "constructive",
        name: "Partnership & constructive bidding",
        intro: "",
        articles: [
          { title: "Bidding Basics: Build a Clear Auction Plan", to: "/bidding/advanced/bidding-basics-build-clear-auction", level: A },
          { title: "Opening Bids: Balanced Hands and the 5-Card Major Rule", to: "/beginner/articles/bidding/opening-bids-beginners-balanced-hands", level: F },
          { title: "Opening 1NT: When to Open and When Not to", to: "/beginner/articles/bidding/opening-1nt-beginners-open-not", level: F },
          { title: "1NT with a Six-Card Suit: When It Still Works", to: "/bidding/advanced/1nt-six-card-suit-still", level: A },
          { title: "Responding to 1NT on Balanced Hands: Pass or Invite", to: "/bidding/advanced/responding-1nt-balanced-hands-pass", level: A },
          { title: "Responder's First Bid: Raise, New Suit, or No-Trump", to: "/beginner/articles/bidding/responders-first-bid-beginners-raise-2", level: F },
          { title: "Opener's Rebid: Introduction — What to Do With a Balanced Hand", to: "/beginner/articles/bidding/openers-rebid-beginners-choosing-suit", level: F },
          { title: "Opener's Rebid: Just Bid Your Suits", to: "/beginner/articles/bidding/openers-rebid-just-bid-your-suits", level: F },
          { title: "Opener's Rebid: Strong Rebids", to: "/beginner/articles/bidding/openers-strong-rebids", level: F },
          { title: "Responder Rebids in Bridge: A Practical Guide", to: "/beginner/articles/bidding/responders-rebids-bridge-beginner-guide", level: F },
          { title: "Bid Your Third Suit Naturally: Keep the Auction Clear", to: "/bidding/advanced/bid-third-suit-naturally-keep", level: A },
          { title: "Just Bid 3NT: Recognize the Right Auctions", to: "/bidding/advanced/just-bid-3nt-recognize-right", level: A },
          { title: "Misfit Auctions: Put the Brakes On Early", to: "/bidding/advanced/misfit-auctions-put-brakes-early", level: A },
          { title: "2C opening - Try not to bid it", to: "/bidding/advanced/opening-2c-avoid-whenever-possible", level: A },
          { title: "Third Seat Openings: Practical Aggression", to: "/bidding/advanced/third-seat-openings-practical-aggression", level: A },
          { title: "How to Play Contract Bridge: Step-by-Step Guide", to: "/beginner/articles/bidding/play-contract-bridge-step-step", level: F },
          { title: "How to Improve at Bridge: A Practical Roadmap That Actually Works", to: "/beginner/articles/bidding/improve-bridge-practical-roadmap-actually", level: F },
        ],
      },
      {
        slug: "competitive",
        name: "Competitive bidding",
        intro: "",
        articles: [
          { title: "KISS 1: Do Not Double Automatically", to: "/bidding/advanced/kiss-1-do-not-double", level: A },
          { title: "KISS 2: Consider Passing More Often", to: "/bidding/advanced/kiss-2-consider-passing-more", level: A },
          { title: "KISS 3: Support Partner as a Priority", to: "/bidding/advanced/kiss-3-support-partner-priority", level: A },
          { title: "KISS 4: Do Not Sacrifice by Default", to: "/bidding/advanced/kiss-4-do-not-save", level: A },
          { title: "Four-Level Doubles: What to Do Next", to: "/bidding/advanced/four-level-doubles-do-next", level: A },
          { title: "Takeout Doubles in Bridge: The Complete Guide", to: "/bidding/advanced/takeout-doubles-bridge-complete-guide", level: A },
          { title: "Second Suit in Competition: Compete with Purpose", to: "/bidding/advanced/second-suit-competition-compete-purpose", level: A },
          { title: "Lebensohl: Compete Smart Without Guessing", to: "/bidding/advanced/lebensohl-compete-smart-without-guessing", level: A },
          { title: "Preempting in First Seat: When to Be Bold", to: "/bidding/advanced/preempting-first-seat-bold", level: A },
          { title: "Preemptive Raises in Bridge: Why Big Trump Fits Beat Big Points", to: "/beginner/articles/bidding/preemptive-raises-bridge-big-trump", level: F },
        ],
      },
      {
        slug: "conventions",
        name: "Conventions",
        intro: "",
        articles: [
          { title: "Find a Major Fit After 1NT: Stayman, Smolen, Puppet, Texas", to: "/bidding/advanced/find-major-fit-after-1nt", level: A },
          { title: "Puppet Stayman: How to Check for 5-Card Majors", to: "/bidding/advanced/puppet-stayman-check-5-card", level: A },
          { title: "Smolen Convention: Show 5-4 Majors After Stayman", to: "/bidding/advanced/smolen-convention-show-5-4", level: A },
          { title: "Weak Stayman: Know When It Helps", to: "/bidding/advanced/weak-stayman-know-helps", level: A },
          { title: "Texas Transfers: Transfer Directly to Game", to: "/bidding/advanced/texas-transfers-transfer-directly-game", level: A },
          { title: "1NT Transfers vs Stayman: When to Use Each", to: "/bidding/advanced/1nt-transfers-stayman-use-each", level: A },
          { title: "1NT Responder Methods: A Practical Overview", to: "/bidding/advanced/1nt-responder-methods-practical-overview", level: A },
          { title: "Fourth Suit Forcing and Checkback: Core Structures", to: "/bidding/advanced/fourth-suit-forcing-checkback-core", level: A },
          { title: "5NT Pick a Slam: Practical Partnership Agreements", to: "/bidding/advanced/5nt-pick-slam-practical-partnership", level: A },
        ],
      },
      {
        slug: "hand-evaluation",
        name: "Hand evaluation",
        intro: "",
        articles: [
          { title: "Hand Evaluation 1: Card Texture Matters", to: "/bidding/advanced/hand-evaluation-1-card-texture", level: A },
          { title: "Hand Evaluation 2: Re-Evaluate as the Auction Develops", to: "/bidding/advanced/hand-evaluation-2-re-evaluate", level: A },
          { title: "Hand Evaluation 3: Do More with a Good Suit", to: "/bidding/advanced/hand-evaluation-3-do-more", level: A },
          { title: "Hand Evaluation 4: Do Less with a Weak Trump Suit", to: "/bidding/advanced/hand-evaluation-4-do-less", level: A },
          { title: "Loser Count for Bidding: Judge Contracts Better", to: "/bidding/advanced/loser-count-bidding-judge-contracts", level: A },
          { title: "Should You Invite with 11? Practical Guide", to: "/bidding/advanced/should-invite-11-practical-guide", level: A },
          { title: "Counting Combined Points in Bridge: When to Bid Game, Part-Score, or Pass", to: "/beginner/articles/bidding/counting-combined-points-bridge-bid", level: F },
        ],
      },
      {
        slug: "vulnerability",
        name: "Vulnerability",
        intro: "",
        articles: [
          { title: "Preempting by Vulnerability: Risk and Reward Across the Colours", to: "/bidding/advanced/preempting-vulnerability-risk-reward-across", level: A },
          { title: "Vulnerable Auctions: Why Too Careful Can Be Costly", to: "/bidding/advanced/vulnerable-auctions-too-careful-can", level: A },
          { title: "Bridge Scoring: What Actually Matters at the Table", to: "/beginner/articles/bidding/bridge-scoring-actually-matters-table", level: F },
        ],
      },
    ],
  },
];

export const getCategory = (key) => CATEGORIES.find((c) => c.key === key) || null;

export const getTopic = (categoryKey, topicSlug) => {
  const cat = getCategory(categoryKey);
  if (!cat) return null;
  return cat.topics.find((t) => t.slug === topicSlug) || null;
};

// Reverse lookup: an article's slug (last URL segment) -> its primary topic hub.
// Lets an article page assert which hub it belongs to (breadcrumb + back-link).
const SLUG_TO_TOPIC = (() => {
  const map = {};
  CATEGORIES.forEach((c) =>
    c.topics.forEach((t) =>
      (t.articles || []).forEach((a) => {
        const slug = String(a.to || "").split("/").filter(Boolean).pop();
        if (slug && !map[slug]) {
          map[slug] = {
            categoryKey: c.key,
            categoryLabel: c.label,
            topicSlug: t.slug,
            topicName: t.name,
            hubPath: `/learn/${c.key}/${t.slug}`,
          };
        }
      })
    )
  );
  return map;
})();

export const getTopicForSlug = (slug) => (slug ? SLUG_TO_TOPIC[slug] || null : null);
