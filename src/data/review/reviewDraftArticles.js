// Local review queue for beginner SEO article drafts.
//
// Drafts in this file appear in the localhost-only /learn/review editor
// (see src/components/Review/ReviewDraftsPage.js). Each entry must have a
// unique id; the load logic merges seed drafts into existing localStorage
// without wiping in-progress edits, and the STORAGE_KEY version bump in
// ReviewDraftsPage.js is what forces a clean reload when the queue is
// substantially restructured.
//
// Published drafts are removed from this file once they go live, and any
// draft that overlaps with an already-live article is removed too — the
// queue should always represent the *next* batch of work, not history.

export const REVIEW_DRAFT_ARTICLES = [
  {
    id: "BCB-08",
    title: "Bridge Overcalls for Beginners: When to Bid Over an Opponent's Opening",
    articleType: "beginnerBidding",
    subcategory: "Competitive Bidding",
    keyword: "bridge overcalls for beginners",
    metaDescription:
      "Learn when to overcall in bridge: simple overcalls, jump overcalls, suit quality requirements, and the practical rules that keep you out of trouble.",
    teaser: "Overcalls are one of the most useful competitive bids in bridge — here's how to use them confidently.",
    body: `Planned outline (Paul to expand):
- Why overcalls matter: they fight for the part-score, suggest a lead, and use bidding room.
- The difference between an overcall and a takeout double (link to BCB-07).
- Simple overcalls at the 1-level: suit quality (5+ cards, usually decent honors), point range, typical hand shapes.
- Simple overcalls at the 2-level: stronger requirements, why "going to the 2-level" demands a better suit.
- Jump overcalls: weak preemptive style vs strong, when to use which.
- When NOT to overcall: balanced hands with no good suit, no clear suit to bid, vulnerable with weak suits.
- Common overcall mistakes: overcalling on rubbish suits, ignoring vulnerability, overcalling with the wrong shape.
- A simple decision checklist.
- Final takeaway.`,
  },
  {
    id: "BCB-09",
    title: "Stayman for Beginners: How to Find a 4-4 Major Fit After 1NT",
    articleType: "beginnerBidding",
    subcategory: "1NT Auctions",
    keyword: "stayman convention beginner",
    metaDescription:
      "Learn the Stayman convention in bridge: when to use 2 clubs over 1NT, opener's responses, and how to find a 4-4 major fit.",
    teaser: "The single most useful convention in bridge — how Stayman works, in beginner-friendly terms.",
    body: `Planned outline (Paul to expand):
- Why Stayman exists: 1NT openings often hide a 4-card major. Stayman asks opener if they have one.
- The bid: responder bids 2 clubs after partner's 1NT.
- Opener's three possible responses:
  - 2 diamonds = no 4-card major
  - 2 hearts = 4 hearts
  - 2 spades = 4 spades
- When to use Stayman as responder: 8+ points with a 4-card major.
- When NOT to use Stayman: weak hands (just pass 1NT), no 4-card major.
- Following up after opener's response: pass, raise, or sign off.
- Common Stayman mistakes: using it without a 4-card major, using it with too few points.
- A simple flowchart / checklist.
- Final takeaway.`,
  },
  {
    id: "BCB-10",
    title: "Jacoby Transfers for Beginners: A Practical Bridge Guide",
    articleType: "beginnerBidding",
    subcategory: "1NT Auctions",
    keyword: "jacoby transfers beginner bridge",
    metaDescription:
      "Learn Jacoby transfers in bridge: how to transfer to a major after partner opens 1NT, when to use them, and why they put declarer in the right hand.",
    teaser: "Transfers put the strong 1NT hand on lead — and that's a big advantage. Here's how they work.",
    body: `Planned outline (Paul to expand):
- Why transfers exist: with a 5+ card major after partner's 1NT, you want partner to be declarer (their strong hand stays hidden).
- The transfer bids: 2 diamonds = transfer to hearts, 2 hearts = transfer to spades.
- Opener's required response: complete the transfer at the cheapest level.
- After the transfer is accepted: responder's range and how to continue.
- When to use a transfer: 5+ card major, any strength (weak hands sign off, stronger hands invite or bid game).
- When NOT to use: short in the major suit, or with a balanced hand where Stayman or 3NT is better.
- Common transfer mistakes: forgetting to accept the transfer, treating it as a real bid, transferring with only 4 cards in the major.
- A simple checklist.
- Final takeaway.`,
  },
  {
    id: "BCD-05",
    title: "Counting Winners and Losers in Bridge: A Beginner Declarer Guide",
    articleType: "beginnerCardPlay",
    subcategory: "Declarer Planning",
    keyword: "counting winners losers bridge beginner",
    metaDescription:
      "Learn how to count winners in no-trump and losers in suit contracts as declarer in bridge — the single most useful planning habit at the table.",
    teaser: "The 60-second habit that turns most beginner declarers into intermediate ones.",
    body: `Planned outline (Paul to expand):
- Why counting matters: every contract has a target (e.g. 4 hearts = 10 tricks). Counting tells you how close you are.
- In no-trump: count immediate winners (cards you can cash without losing the lead).
- In a suit contract: count likely losers (cards you can't avoid losing).
- Worked examples:
  - No-trump: count winners suit by suit, identify the gap, plan how to fill it.
  - Suit contract: count losers in side suits, identify which can be ruffed, pitched, or finessed away.
- Combining the two: when in a suit contract you may also count winners on a long side suit.
- Common mistakes: counting "hopeful" winners as real winners, ignoring the trump suit losers, forgetting to subtract for entries.
- The pre-trick-one habit: count → identify gap → choose first objective.
- Final takeaway.`,
  },
  {
    id: "BCD-06",
    title: "Bridge Entries for Beginners: A Guide to Communication Between Hands",
    articleType: "beginnerCardPlay",
    subcategory: "Entries and Communication",
    keyword: "bridge entries beginner",
    metaDescription:
      "Learn what entries are in bridge, why they matter, and how beginner declarers can preserve communication between their hand and dummy.",
    teaser: "Entries are the currency of declarer play. Spend them deliberately.",
    body: `Planned outline (Paul to expand):
- What is an entry: a card that lets you reach a specific hand to take a trick from there.
- Why entries matter: you can have winners and still fail if you can't reach them.
- Where entries come from: high cards in each hand, ruffs, trump entries.
- The two big entry problems: stranded winners, and burning entries too early.
- Worked examples:
  - Setting up a long suit in dummy with limited entries.
  - Preserving the ace of trumps as a late entry.
  - Why the order of cashing winners matters.
- Common mistakes: cashing winners in random order, using entries before you need them, overlooking the side entry on the lead.
- A simple pre-play habit: identify your entries before you play from dummy at trick one.
- Final takeaway.`,
  },
  {
    id: "BCF-06",
    title: "Discarding in Bridge: A Beginner's Guide to Choosing Which Cards to Throw",
    articleType: "beginnerDefence",
    subcategory: "Defensive Signals",
    keyword: "discarding bridge beginner",
    metaDescription:
      "Learn how to choose discards in bridge: which cards to keep, which to pitch, and how to send useful messages to partner with your discards.",
    teaser: "Discarding well is one of the easiest ways to lift defence from amateur to solid.",
    body: `Planned outline (Paul to expand):
- The two questions every discard answers: what should I keep, and what message am I sending partner?
- The general principle: keep cards that might win tricks; throw cards that can't.
- The Foster (or Lavinthal) idea in plain terms: your first discard often shows attitude about that suit.
- Don't pitch from suits declarer is attacking — you'll set up tricks for them.
- Don't pitch from short suits where you may need every card.
- Watch dummy: discard from suits where dummy has length you need to cover.
- The "keep the same length as dummy" guideline.
- Common discarding mistakes: throwing your only stopper, telegraphing your hand to declarer, confusing partner with a wild discard.
- A simple pre-discard checklist.
- Final takeaway.`,
  },
  {
    id: "BCF-07",
    title: "Defensive Plan at Trick One: A Beginner's Guide",
    articleType: "beginnerDefence",
    subcategory: "Defence Planning",
    keyword: "defensive plan trick one bridge beginner",
    metaDescription:
      "Learn how to make a defensive plan at trick one in bridge: what to look at, what to count, and how to set the right defensive objective.",
    teaser: "Defence improves dramatically when you pause at trick one — here's exactly what to think about.",
    body: `Planned outline (Paul to expand):
- Why a defensive plan matters: defenders make more mistakes than declarer because they're reactive. A 20-second pause changes that.
- What you can see at trick one: your hand, dummy, the auction, partner's lead.
- The 4 questions to ask:
  - What did the auction tell me about declarer's hand?
  - What did partner's lead tell me about partner's hand?
  - How many tricks does my side need to set the contract?
  - Which suits are likely to produce our tricks?
- Active vs passive defence: when to attack, when to wait.
- Building the picture of declarer's hand from clues.
- Common defensive trick-one mistakes: playing automatically, ignoring the auction, not counting tricks needed to defeat.
- A simple defensive checklist.
- Final takeaway.`,
  },
];
