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
    id: "BCF-05",
    title: "Bridge Signals for Beginners: Attitude, Count, and Suit Preference",
    articleType: "beginnerDefence",
    subcategory: "Defensive Signals",
    keyword: "bridge signals beginner",
    metaDescription:
      "Learn the three main bridge signals — attitude, count, and suit preference — when each one applies, and the one rule that always comes first.",
    teaser: "Signals turn defence into a partnership conversation. But they come second to one rule that's bigger than all of them.",
    body: `<p>Signals are one of the most appealing parts of defence. They let you and partner share information without speaking — which suits you like, how many cards you hold, where to switch. Done well, they turn defence from two people guessing into one team working together.</p>

<p>But signals are <em>secondary</em>. There is one rule that comes first, and if you skip it, no amount of signaling will save you.</p>

<h2>Rule #1 in defence: keep winners, throw losers</h2>

<p>The most important defensive rule has nothing to do with signals. It's this: <strong>keep useful cards, throw away useless ones.</strong> Or put another way — keep winners, throw losers.</p>

<p>This means you should also be sympathetic to partner doing the same. Don't expect every card partner plays to be a meaningful message. Sometimes they're just shedding a convenient card because it was the right thing to do. Reading signals into every spot card partner throws is a fast way to confuse yourself and misdefend.</p>

<p>Once the priority is firmly in your mind — sensible play first, signals second — you can start thinking about signals.</p>

<h2>Be precise: not every card is a signal</h2>

<p>One of the most useful habits in bridge is being precise about <em>when</em> a card is genuinely a signal and when it's just normal play. Signals work best when both partners know exactly which moments to read into.</p>

<p>There are three main situations where a card you play is a real signal.</p>

<h3>1. Attitude on partner's opening lead</h3>

<p>When you make an opening lead, partner's first card is often a single card. If they are contributing to the trick — for example covering dummy's Queen with their King — that's not a signal, it's just the correct card to play.</p>

<p>But if partner has a free choice (a typical case is when you lead an Ace or a King), the card they choose tells you whether they like the suit. They typically like it if they hold an honor in it. A high spot card from partner says "I'm interested" and a low spot card says "I'm not."</p>

<p>You and partner just need to agree: <strong>high encourages</strong> (standard signals) or <strong>low encourages</strong> (upside-down signals). Both work. Pick one.</p>

<h3>2. Your first discard</h3>

<p>When you can't follow suit and you discard, the first discard you make in the hand carries an attitude message. It says whether you like or dislike the suit you're throwing.</p>

<p>Again, pick one system with partner: high spot = like, or low spot = like. Either is fine. The first discard is the easiest signal to read because partner is alert to it — they know it's your first one.</p>

<h3>3. Count when declarer leads a suit</h3>

<p>When declarer leads a suit and you're just following with low cards — not contributing to the trick — your card can show partner <em>how many</em> cards you have in the suit. This is called a count signal.</p>

<p>There are two common conventions:</p>

<ul>
  <li><strong>Natural count:</strong> high-low shows an even number, low-high shows odd.</li>
  <li><strong>Reverse count:</strong> low-high shows even, high-low shows odd.</li>
</ul>

<p>Both are fine. Pick one with partner and stick to it.</p>

<p>Here's a quick example. You hold J842 and declarer leads the suit. You're just following with a small card.</p>

<ul>
  <li>If you play <strong>reverse count</strong> (low-high = even): play the 2 first.</li>
  <li>If you play <strong>natural count</strong> (high-low = even): play the 8 first, then the 4. Ideally the 8 — unless throwing the 8 might cost you a trick.</li>
</ul>

<h2>The override rule: never signal at the cost of a trick</h2>

<p>This is the rule that beats every other signaling rule:</p>

<blockquote>Never signal at the cost of a trick.</blockquote>

<p>If giving partner the "correct" count signal means throwing a card that might have won a trick, don't do it. Trick first, signal second.</p>

<p>Partner needs to be sympathetic to this too. They can't rely on your signal one hundred percent of the time, because sometimes you have to preserve the card that would have been the accurate signal. You couldn't afford to throw it away. Defence is full of moments where you do the best you can and partner does the same — neither of you should expect perfect information every time.</p>

<h2>One more signal: suit preference (briefly)</h2>

<p>There's a third traditional signal called <strong>suit preference</strong>. It comes up less often than attitude or count, and you don't need it in your first weeks of signaling. The most common time it applies is when you're giving partner a ruff, and your card tells partner which side suit to return next.</p>

<p>The convention: a <em>high</em> spot card asks for the <em>higher-ranking</em> side suit; a <em>low</em> spot card asks for the <em>lower-ranking</em> side suit. Add this to your toolkit once attitude and count feel natural.</p>

<h2>Three practical reminders</h2>

<ul>
  <li><strong>Agree the system with partner before the session.</strong> Standard or upside-down attitude. Natural or reverse count. Both partners on the same page.</li>
  <li><strong>Declarer can read your signals too.</strong> Every card you play is visible to declarer as well as partner. Don't broadcast information that helps them more than it helps your side.</li>
  <li><strong>Start with attitude.</strong> If you do nothing else, signal attitude on partner's opening lead and on your first discard. That alone lifts your defence noticeably.</li>
</ul>

<h2>The takeaway</h2>

<p>Signals are powerful, but they sit on top of sensible card play, not in place of it. Keep winners, throw losers, be sympathetic to partner doing the same — that's the foundation. Then layer on attitude, count, and (eventually) suit preference, and only ever within the override rule: <strong>never signal at the cost of a trick.</strong></p>`,
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
