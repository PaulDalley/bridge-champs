// Topic-hub taxonomy + article allocation.
//
// This is STRUCTURE, not content: topic names are the user's words, article
// titles are the articles' own wording (verbatim), and `intro` is a slot the
// user fills in their own words (left blank here on purpose).
//
// Optional per-topic `video` slot (also the author's content — left unset here):
//   video: { url, title, description, uploadDate, duration?, thumbnail? }
//   `url` is any YouTube link (watch / youtu.be / shorts / embed). The hub then
//   renders a lazy click-to-play embed under the intro; a VideoObject schema is
//   emitted only when title + description + uploadDate are all present.
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
        trainerHref: "/declarer/practice?difficulty=1&problem=cp1-7",
        intro: `The first question we're often faced with: should I draw trumps? In reality it's probably correct to draw them immediately about 50% of the time, and to wait the other 50%. There's no perfect rule, but a few good guidelines will help you find the right approach:

* Ruff losers in dummy before drawing trumps
* Typically set up long side suits before drawing trumps
* If you can "Just draw trumps", do so — don't delay unless it's for a concrete reason
* Remember that trumps often double up as entries. Try to draw a trump when you also need an entry to the hand.`,
        articles: [
          { title: "Drawing Trumps: A Simple Habit That Saves Tricks", to: "/beginner/articles/declarer/drawing-trumps-simple-habit-saves", level: F },
          { title: "When Not to Draw Trumps: 3 Situations to Delay", to: "/beginner/articles/declarer/not-draw-trumps-3-situations", level: F },
          { title: "Ruff in Dummy: Win Extra Tricks Cheaply", to: "/beginner/articles/declarer/ruff-dummy-win-extra-tricks", level: F },
          { title: "Cash Trumps Without Blocking: Keep Your Winners Running", to: "/beginner/articles/declarer/cash-trumps-without-blocking-keep", level: F },
          { title: "Drawing Trumps: Make the Right Plan and Avoid Autopilot", to: "/declarer/articles/drawing-trumps-make-right-plan", level: A },
          { title: "Count Winners in Trumps: Avoid Missed Tricks and Read the Trump Layout", to: "/declarer/articles/count-winners-trumps-avoid-missed", level: A },
          { title: "Cash Side-Suit Winners: Before drawing trumps", to: "/declarer/articles/cash-side-suit-winners-trumps", level: A },
        ],
      },
      {
        slug: "counting",
        name: "Counting",
        trainerHref: "/counting/practice?difficulty=1&problem=p1-20",
        treadmillHref: "/treadmill/practice",
        intro: `Counting as declarer is a critical skill. We've often heard about counting winners or losers, but most players aren't in the habit of doing it — and doing it repeatedly as the hand develops. Applied correctly, it's a very powerful skill and the basis for any good declarer planning.

Counting is usually very simple — it's about looking at basic suit holdings and counting to small numbers, for example up to 7 or 10. Or, when counting losers, it's often just making sure there aren't 4 losers when you're in 4♠. It sounds basic and pointless, but as you do it, an amazing skill gets unlocked — you'll be in the top 1–5% of declarers!`,
        articles: [
          { title: "Counting Losers: Plan the Hand and Spot Hidden Dangers Early", to: "/declarer/articles/counting-losers-plan-hand-spot", level: A },
          { title: "Count Winners in No-Trump: Build a Trick Plan", to: "/declarer/articles/count-winners-no-trump-build", level: A },
          { title: "Count Winners in Trumps: Avoid Missed Tricks and Read the Trump Layout", to: "/declarer/articles/count-winners-trumps-avoid-missed", level: A },
        ],
      },
      {
        slug: "planning",
        name: "Planning",
        intro: `Start by practising "stop and think" when dummy comes down. Always give yourself at least 30 seconds to think about how the play might go — which suits you plan to play, and why. Through experience we learn to spot dangers and opportunities before it's too late, but the key skill is built through routine: develop a habit of planning, and an awareness that playing too quickly without a plan — particularly at trick 1 — can be very costly.

"Take your time at trick 1 and make a plan — even a mediocre plan is a good start."`,
        articles: [
          { title: "Declarer Play Basics: Build a Plan at Trick One", to: "/declarer/articles/declarer-play-basics-build-plan", level: A },
          { title: "Counting Losers: Plan the Hand and Spot Hidden Dangers Early", to: "/declarer/articles/counting-losers-plan-hand-spot", level: A },
          { title: "Declarer Practice: Plan Before You Play", to: "/declarer/articles/practice-hand-1-plan-before", level: A },
          { title: "Declarer Practice: Timing and Entries", to: "/declarer/articles/practice-hand-2-timing-entries", level: A },
          { title: "Have a Backup Plan: Recover When Plan A Fails", to: "/declarer/articles/have-backup-plan-recover-plan", level: A },
          { title: "Take Every Chance: Create Extra Tricks Before Defence Settles", to: "/declarer/articles/take-every-chance-create-extra", level: A },
        ],
      },
      {
        slug: "hand-types",
        name: "Hand & dummy types",
        intro: `When dummy comes down, a good declarer will have one or two ideas for the hand straight away. These ideas are based on the type of dummy and the opportunities available. This is pattern recognition that takes seconds — it isn't a deep-thinking skill. It's the basis for more detailed planning and calculation.`,
        trainerHref: "/declarer/practice?difficulty=1&problem=cp1-12",
        articles: [
          { title: "Bridge Shapes Fundamentals: Read Distribution Quickly", to: "/declarer/articles/bridge-shapes-fundamentals-read-distribution", level: A },
          { title: "Ruffing in Dummy: A Declarer Plan", to: "/declarer/articles/pattern-recognition-1-ruffing-strategy", level: A },
          { title: "Avoiding Extra Losers as Declarer", to: "/declarer/articles/pattern-recognition-4-avoid-creating", level: A },
          { title: "Understand Fourth-Highest Leads: Read the Defensive Picture", to: "/declarer/articles/understand-fourth-highest-leads-read", level: A },
        ],
      },
      {
        slug: "setting-up-suits",
        name: "Setting up tricks",
        intro: `Long suits are often the most fruitful way to set up tricks. Train your eyes to go straight to the 5+ card suits and think: can I set that suit up? Even 4-card suits (4-3 fits) can create extra winners if the suit breaks 4-3-3-3.

Being aware of these long suits is the first step to making a lot more tricks. From there we develop strategies to handle them well. The guiding principle is often "set up long suits as a priority, before drawing trumps."`,
        articles: [
          { title: "Playing Long Suits: Build Extra Winners Early", to: "/beginner/articles/declarer/playing-long-suits-build-extra", level: F },
          { title: "Establishing Side-Suit Winners: Honor Sequences Like KQJ10", to: "/beginner/articles/declarer/establishing-side-suit-winners-honor", level: F },
          { title: "No-Trump Basics: Build Your Long Suit and Cash Winners", to: "/beginner/articles/declarer/no-trump-basics-build-long", level: F },
          { title: "Finesses: Single, Double, and Leading Low Toward Honors", to: "/beginner/articles/declarer/finesses-beginners-single-double-leading", level: F },
          { title: "Duck to Preserve Communication: Set Up Your Long Suit", to: "/declarer/articles/duck-preserve-communication-set-up", level: A },
          { title: "Setting Up Side Suits as Declarer", to: "/declarer/articles/pattern-recognition-2-set-up", level: A },
          { title: "Finding and Building Trick Sources", to: "/declarer/articles/pattern-recognition-3-find-build", level: A },
        ],
      },
      {
        slug: "entries",
        name: "Entries",
        intro: `Entries have been described as "the lifeblood of bridge". When we truly appreciate the value of an entry, we start asking what its best use is every time we're in a hand. It helps to see high cards not just as tricks but also as entries — that's what lets you time questions like "when do I draw trumps?" If you think of the Ace of trumps as an entry, you'll often know when you need to play it.

Topics like setting up long suits and ruffing in dummy — and countless others — all require entries to execute. Every plan should consider entries closely; one of the most common reasons plans fail is entry mismanagement.`,
        trainerHref: "/declarer/practice?difficulty=2&problem=cp2-6",
        suggested: true,
        articles: [
          { title: "Use Entries Well: Reach the Right Hand at the Right Time", to: "/declarer/articles/use-entries-well-reach-right", level: A },
        ],
      },
      {
        slug: "hold-up",
        name: "Hold-up & ducking",
        intro: "",
        trainerHref: "/declarer/practice?difficulty=1&problem=cp1-3",
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
        trainerHref: "/defence/practice?difficulty=1&problem=df1-1",
        intro: `When a skilled defender looks at dummy, they can often read the key points of the hand. They'll usually know declarer's main plan and, as a result, be focused on how to defend.

A typical example is when you spot a very weak dummy with a singleton and 3 trumps. Declarer will often go for ruffs in dummy, so it falls to the defenders to play trumps. A defender who is clued into that will focus on, for example, getting the lead from the correct side in order to play a trump through.

In this section we'll work through the main categories of dummy. Knowing them helps you form plans in defence and get a better idea of which suit to play, and when.`,
        articles: [
          { title: "Defence when Dummy has Limited Entries", to: "/defence/articles/dummy-type-1-limited-entries", level: A },
          { title: "Defence when Dummy is strong", to: "/defence/articles/dummy-type-2-strong-trick", level: A },
          { title: "Defence against ruffs in dummy", to: "/defence/articles/dummy-type-3-ruffing-dummy", level: A },
          { title: "Active and Passive defence", to: "/defence/articles/dummy-type-4-passive-dummy", level: A },
          { title: "Danger Hand Awareness: Keep the Dangerous Opponent Off Lead", to: "/defence/articles/danger-hand-awareness-keep-dangerous", level: A },
        ],
      },
      {
        slug: "counting",
        name: "Counting",
        intro: "",
        treadmillHref: "/treadmill/practice",
        articles: [
          { title: "Count the Unseen Hand: Read Distribution in Defence", to: "/defence/articles/count-unseen-hand-read-distribution", level: A },
          { title: "Count Trumps in Defence: Prevent Surprise Ruffing", to: "/defence/articles/count-trumps-defence-prevent-surprise", level: A },
        ],
      },
      {
        slug: "leads",
        name: "Leads",
        intro: `A lot of newer players mistakenly think leads are luck-based. It's true that on a single hand there's a lot of luck involved. But in the long run, an expert player gets a very big edge from good leads. Opening leads are all about:

* Is there a need to take risks and lead aggressively? If not, what are your best passive leads?
* Is a trump lead indicated?
* What is our goal for the hand — are we trying to force declarer?

Leads during the hand are often about:

* What holding does dummy have? Lead through strength and towards weakness.
* What are my goals for the hand — setting up partner's suit?
* Is there a need for me to open up the suit, or can I play passively?`,
        trainerHref: "/defence/practice?difficulty=1&problem=df1-23",
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
        intro: `Signals are often the difference between beating a contract and not; used correctly, they're invaluable. There are a few important decisions to make with them:

1. Which signals will your partnership use?
2. When do they apply? A big source of confusion is the two players being on a different page about which signal is being given — one might be giving count while the other reads it as attitude about a suit. Having crystal-clear, consistent rules around this is essential.
3. Keep it simple; don't overdo it. One or two simple but reliable signals will often achieve the goal.

Modern partnerships are building a lot of suit preference into their signalling — the play of irrelevant pips can be made to carry rich information. But, as always, keep it simple and don't overdo it, especially at the intermediate stage: one or two signals per hand will be sufficient.`,
        articles: [
          { title: "Bridge Signals and Discards", to: "/beginner/articles/defence/bridge-signals-beginners-attitude-count", level: F },
          { title: "Odds and Evens Discarding in Bridge: Should You Play It?", to: "/beginner/articles/defence/odds-evens-discarding-bridge-should", level: F },
          { title: "Suit preference signals and discards", to: "/defence/articles/suit-preference-signals-mckenney-lavinthal", level: A },
          { title: "UDCA signals and discards", to: "/defence/articles/udca-signals", level: A },
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
        trainerHref: "/defence/practice?difficulty=1&problem=df1-5",
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
        trainerHref: "/bidding/practice?difficulty=1&problem=bid1-6",
        articles: [
          { title: "Bidding Basics: Build a Clear Auction Plan", to: "/bidding/advanced/bidding-basics-build-clear-auction", level: A },
          { title: "Opening Bids: Balanced Hands and the 5-Card Major Rule", to: "/beginner/articles/bidding/opening-bids-beginners-balanced-hands", level: F },
          { title: "Opening 1NT: When to Open and When Not to", to: "/beginner/articles/bidding/opening-1nt-beginners-open-not", level: F },
          { title: "1NT with a Six-Card Suit: When It Still Works", to: "/bidding/advanced/1nt-six-card-suit-still", level: A },
          { title: "Responding on balanced hands - how much to invite?", to: "/bidding/advanced/responding-1nt-balanced-hands-pass", level: A },
          { title: "Responder's First Bid: Raise, New Suit, or No-Trump", to: "/beginner/articles/bidding/responders-first-bid-beginners-raise-2", level: F },
          { title: "Opener's Rebid with a Balanced Hand", to: "/beginner/articles/bidding/openers-rebid-beginners-choosing-suit", level: F },
          { title: "Opener's Rebid: Just Bid Your Suits", to: "/beginner/articles/bidding/openers-rebid-just-bid-your-suits", level: F },
          { title: "Opener's Rebid: Strong Rebids", to: "/beginner/articles/bidding/openers-strong-rebids", level: F },
          { title: "Responder Rebids in Bridge: A Practical Guide", to: "/beginner/articles/bidding/responders-rebids-bridge-beginner-guide", level: F },
          { title: "Bid Your Third Suit Naturally: Keep the Auction Clear", to: "/bidding/advanced/bid-third-suit-naturally-keep", level: A },
          { title: "Just Bid 3NT: Recognize the Right Auctions", to: "/bidding/advanced/just-bid-3nt-recognize-right", level: A },
          { title: "Misfit Auctions: Put the Brakes On Early", to: "/bidding/advanced/misfit-auctions-put-brakes-early", level: A },
          { title: "Opening 2C: When (Not) to Use It", to: "/bidding/advanced/opening-2c-avoid-whenever-possible", level: A },
          { title: "Third Seat Openings: Practical Aggression", to: "/bidding/advanced/third-seat-openings-practical-aggression", level: A },
          { title: "How to Play Contract Bridge: Step-by-Step Guide", to: "/beginner/articles/bidding/play-contract-bridge-step-step", level: F },
          { title: "How to Improve at Bridge - Focus", to: "/beginner/articles/bidding/improve-bridge-practical-roadmap-actually", level: F },
        ],
      },
      {
        slug: "competitive",
        name: "Competitive bidding",
        intro: `Most of the scoring happens in the competitive bidding. Pairs gain a significant edge from competing under the right conditions — and from knowing when it's correct to defend instead.

The modern takeout double has evolved a lot and is one of the most important tools we have in competitive auctions. Once we've found a fit, a flood of questions often comes up, including:

* How high should I raise?
* Should I investigate a major fit as well, or just raise a minor?
* Should I bid 3 over 3, or 5 over 5?
* Is there a way to show a good 4-card raise and a bad 4-card raise?

At its core, competitive bidding is about finding our fits early and bidding as high as possible as soon as possible — leaving little room for our opponents and forcing them to guess. They are often guessing in the dark whether to bid, pass or double.

Another key idea is not letting the opponents play in comfortable contracts when we can avoid it — this applies especially to their fits at the two level, where it's often correct to compete, particularly when we aren't vulnerable. Vulnerability is a factor we have to weigh constantly in competitive bidding.`,
        trainerHref: "/bidding/practice?difficulty=2&problem=bid2-9",
        articles: [
          { title: "Takeout double expert principles", to: "/bidding/advanced/kiss-1-do-not-double", level: A },
          { title: "Pass can be the best bid", to: "/bidding/advanced/kiss-2-consider-passing-more", level: A },
          { title: "Raising partner. Simply supporting is best.", to: "/bidding/advanced/kiss-3-support-partner-priority", level: A },
          { title: "Sacrifices when and how to use.", to: "/bidding/advanced/kiss-4-do-not-save", level: A },
          { title: "Four-Level Doubles: What to Do Next", to: "/bidding/advanced/four-level-doubles-do-next", level: A },
          { title: "Takeout Doubles in Bridge: The Complete Guide", to: "/bidding/advanced/takeout-doubles-bridge-complete-guide", level: A },
          { title: "Second Suit in Competition: Compete with Purpose", to: "/bidding/advanced/second-suit-competition-compete-purpose", level: A },
          { title: "Lebensohl Convention Explained", to: "/bidding/advanced/lebensohl-compete-smart-without-guessing", level: A },
          { title: "Preempting in First Seat: When to Be Bold", to: "/bidding/advanced/preempting-first-seat-bold", level: A },
          { title: "Preemptive Raises in Bridge: Why Big Trump Fits Beat Big Points", to: "/beginner/articles/bidding/preemptive-raises-bridge-big-trump", level: F },
          { title: "Bridge winning strategies - Top 5 to improve your results", to: "/bidding/advanced/bridge-winning-strategies-top-5", level: A },
        ],
      },
      {
        slug: "conventions",
        name: "Conventions",
        intro: `In modern bridge there is a vast range of conventions for all types of auctions. A lot of them are very useful, but there are often trade-offs, and of course we need to be sure we'll remember what our conventions are under pressure — so the advice is to keep it minimal and only consider adding more with a regular partner.

A test for a good convention is that it's easy to remember, likely to come up frequently, and adds a lot of value. Although it can be fun to add gadgets to our bidding, if it doesn't pass that test, it is ill-advised.

Overall, we want to pick our conventions carefully and not overcrowd our system to the point that we cannot bid our hands naturally and confidently under pressure.`,
        trainerHref: "/bidding/practice?difficulty=3&problem=bid3-16",
        groups: [
          {
            heading: "General",
            articles: [
              { title: "What is a convention, and what conventions are the best to play?", to: "/bidding/advanced/what-is-a-convention-best-to-play", level: A },
            ],
          },
          {
            heading: "NT conventions",
            articles: [
              { title: "System Over 1NT: Transfer Responses and Conventions", to: "/bidding/advanced/system-over-1nt-conventions", level: A },
              { title: "Find a Major Fit After 1NT: Stayman, Smolen, Puppet, Texas", to: "/bidding/advanced/find-major-fit-after-1nt", level: A },
              { title: "Puppet Stayman: How to Check for 5-Card Majors", to: "/bidding/advanced/puppet-stayman-check-5-card", level: A },
              { title: "Smolen Convention: Show 5-4 Majors After Stayman", to: "/bidding/advanced/smolen-convention-show-5-4", level: A },
              { title: "Garbage stayman: Stayman with weak hands", to: "/bidding/advanced/weak-stayman-know-helps", level: A },
              { title: "Texas Transfers: Transfer Directly to Game", to: "/bidding/advanced/texas-transfers-transfer-directly-game", level: A },
              { title: "Super accept: 1NT Transfers Jacoby", to: "/bidding/advanced/super-accept-1nt-jacoby-transfers", level: A },
              { title: "Negative Doubles and One-Level Responses", to: "/bidding/advanced/1nt-responder-methods-practical-overview", level: A },
              { title: "Landy and Multi Landy", to: "/bidding/advanced/landy-and-multi-landy", level: A },
              { title: "DONT convention: Interfering over No Trump", to: "/bidding/advanced/dont-convention-interfering-over-1nt", level: A },
            ],
          },
          {
            heading: "Slam Bidding",
            articles: [
              { title: "Blackwood and Roman Key Card Blackwood (RKCB)", to: "/bidding/advanced/blackwood-rkcb", level: A },
              { title: "Best slam bidding conventions", to: "/bidding/advanced/best-slam-bidding-conventions", level: A },
              { title: "Jacoby 2NT: The Game-Forcing Major Raise", to: "/bidding/advanced/jacoby-2nt", level: A },
              { title: "5NT Pick a Slam: Practical Partnership Agreements", to: "/bidding/advanced/5nt-pick-slam-practical-partnership", level: A },
            ],
          },
          {
            heading: "4th suit forcing",
            articles: [
              { title: "Fourth Suit Forcing: How and When to Use It", to: "/bidding/advanced/fourth-suit-forcing-checkback-core", level: A },
            ],
          },
          {
            heading: "Other useful conventions",
            articles: [
              { title: "Lebensohl Convention Explained", to: "/bidding/advanced/lebensohl-compete-smart-without-guessing", level: A },
              { title: "Reverse Bids in Bridge: Showing Extra Strength", to: "/bidding/advanced/reverses", level: A },
              { title: "Multi two (2D) opening: How to play it and how to defend against it.", to: "/bidding/advanced/multi-2d-opening", level: A },
            ],
          },
        ],
      },
      {
        slug: "hand-evaluation",
        name: "Hand evaluation",
        intro: `Hand evaluation is at the heart of every bidding decision. Point count is a useful starting point, but it only tells part of the story. Tools like Losing Trick Count give you a more nuanced picture, and experienced players learn to read their hands in the context of the auction as a whole.

Key factors include fits and misfits — a trump fit transforms a hand, while a misfit can make even high-card-rich holdings dangerous. The position of your points matters too: values sitting opposite partner's long suits are powerful, while points opposite a shortage often signal trouble. Getting this right is what separates good bidding from great bidding, whether you're deciding to compete, push to game, or explore slam.`,
        trainerHref: "/bidding/practice?difficulty=2&problem=bid2-6",
        articles: [
          { title: "Hand Evaluation: Why Card Texture Matters", to: "/bidding/advanced/hand-evaluation-1-card-texture", level: A },
          { title: "Hand Evaluation: Re-Evaluate as the Auction Develops", to: "/bidding/advanced/hand-evaluation-2-re-evaluate", level: A },
          { title: "Hand Evaluation: Do More with a Good Suit", to: "/bidding/advanced/hand-evaluation-3-do-more", level: A },
          { title: "Hand Evaluation: Do Less with a Weak Trump Suit", to: "/bidding/advanced/hand-evaluation-4-do-less", level: A },
          { title: "Loser Count for Bidding: Judge Contracts Better", to: "/bidding/advanced/loser-count-bidding-judge-contracts", level: A },
          { title: "Should You Invite with 11? Practical Guide", to: "/bidding/advanced/should-invite-11-practical-guide", level: A },
          { title: "Counting Combined Points in Bridge: When to Bid Game, Part-Score, or Pass", to: "/beginner/articles/bidding/counting-combined-points-bridge-bid", level: F },
        ],
      },
      {
        slug: "vulnerability",
        name: "Vulnerability",
        intro: `Vulnerability is the starting point for every bidding decision. The crux of being vulnerable is that the bonus for games and slams increases, but the penalty for going down also increases, particularly if the opponents double.

There is a misconception that dictates being cautious when vulnerable, but if players are too cautious they can miss out on their game bonus. So a mixture of appropriate aggression and caution is the key.

Part-score battles are also dictated by vulnerability. Being non-vulnerable is the best time to compete aggressively, especially against vulnerable opponents, who should take part-score decisions, particularly on the three level, with some caution and care.

From opening bids to preempts, and everything that follows, vulnerability will change the nature of the game. Understanding the nuanced differences between the four vulnerabilities will give you a big edge.

* All vulnerable
* No one vulnerable (also called Nil vul)
* Only opponents vulnerable (also called favourable vulnerability)
* Only us vulnerable (unfavourable)`,
        articles: [
          { title: "Preempting by Vulnerability: Risk and Reward Across the Colours", to: "/bidding/advanced/preempting-vulnerability-risk-reward-across", level: A },
          { title: "Vulnerable Auctions: Why Too Careful Can Be Costly", to: "/bidding/advanced/vulnerable-auctions-too-careful-can", level: A },
          { title: "Bridge Scoring: What Actually Matters at the Table", to: "/beginner/articles/bidding/bridge-scoring-actually-matters-table", level: F },
        ],
      },
    ],
  },
];

// A topic may define labelled `groups` (sub-sections) instead of a flat
// `articles` list. Flatten them into `articles` here so every consumer
// (progress counts, search, schema, the slug->topic reverse map) keeps working
// unchanged; the grouped layout itself is handled by the TopicHub component.
CATEGORIES.forEach((c) =>
  c.topics.forEach((t) => {
    if (Array.isArray(t.groups) && !Array.isArray(t.articles)) {
      t.articles = t.groups.flatMap((g) => g.articles || []);
    }
  })
);

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
