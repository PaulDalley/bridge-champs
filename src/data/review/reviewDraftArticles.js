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
    title: "Stayman for Beginners: The Simple 2C Ask After Partner Opens 1NT",
    articleType: "beginnerBidding",
    subcategory: "1NT Auctions",
    keyword: "stayman for beginners after 1nt",
    metaDescription:
      "Learn Stayman in plain English: when to bid 2 clubs over partner's 1NT, what opener's replies mean, and when to use transfers instead.",
    teaser: "A practical beginner version of Stayman: no overload, just what to do at the table.",
    body: `<h2>Stayman in one sentence</h2>
<p>Stayman is a question bid. After partner opens 1NT, you bid <strong>2 clubs</strong> to ask: "Do you have a 4-card major?"</p>

<p>That is all it is at beginner level. Keep it simple, and it will win a lot of auctions for you.</p>

<h2>Why Stayman exists</h2>
<p>When partner opens 1NT, they often have a balanced hand and may still hold a 4-card major. If you also have a 4-card major, your side might have a 4-4 fit.</p>

<p>A 4-4 major fit often plays better than no-trump, especially at game level. Stayman helps you find that fit quickly.</p>

<h2>The basic auction</h2>
<p>After 1NT - 2C (Stayman), opener replies:</p>
<ul>
  <li><strong>2D</strong> = no 4-card major</li>
  <li><strong>2H</strong> = has 4 hearts (may also have 4 spades depending on system)</li>
  <li><strong>2S</strong> = has 4 spades</li>
</ul>

<p>That is the core structure you should memorise first.</p>

<h2>When to use Stayman</h2>
<p>At beginner level, a practical rule is:</p>
<ul>
  <li>Use Stayman with <strong>8+ points</strong> and a <strong>4-card major</strong>.</li>
  <li>With very weak hands, usually pass 1NT.</li>
</ul>

<p>It does not need to be perfect to be useful. This simple rule is good enough to start and play confident bridge.</p>

<h2>When NOT to use Stayman</h2>
<ul>
  <li>No 4-card major? Usually do not use Stayman.</li>
  <li>Very weak hand with no game interest? Usually pass 1NT.</li>
  <li>Have a 5-card major? In many methods, use transfers instead of Stayman.</li>
</ul>

<p>That last point is important. Stayman and transfers work together, but they are not the same tool. For now, keep this simple: 4-card major ask = Stayman, 5-card major hand = usually transfer agreements.</p>

<h2>What to do after opener replies</h2>
<p>Once partner answers your Stayman bid, you choose a level based on strength:</p>
<ul>
  <li><strong>Weak range:</strong> stop low when possible.</li>
  <li><strong>Invite range:</strong> make an invitational action.</li>
  <li><strong>Game-going range:</strong> bid game.</li>
</ul>

<p>You do not need every advanced branch at first. Focus on finding the fit and reaching a sensible contract.</p>

<h2>Quick practical examples</h2>
<h3>Example 1: Find a heart fit</h3>
<p>Partner opens 1NT. You hold 9 points and 4 hearts. Bid 2C. If partner replies 2H, you have found a 4-4 heart fit and can continue accordingly.</p>

<h3>Example 2: No major fit found</h3>
<p>Partner opens 1NT. You bid 2C. Partner replies 2D (no 4-card major). Now you know not to chase a 4-4 major fit and can choose between no-trump actions based on strength.</p>

<h2>Common beginner mistakes</h2>
<ul>
  <li>Using Stayman without a 4-card major.</li>
  <li>Using Stayman on very weak hands that should just pass.</li>
  <li>Forgetting what 2D means (it means no 4-card major).</li>
  <li>Treating Stayman as advanced and avoiding it completely.</li>
</ul>

<h2>A simple checklist</h2>
<ol>
  <li>Did partner open 1NT?</li>
  <li>Do I have a 4-card major?</li>
  <li>Do I have enough values to act (practical beginner rule: 8+)?</li>
  <li>If yes, bid 2C Stayman.</li>
</ol>

<h2>Final takeaway</h2>
<p>Stayman is one of the most useful beginner conventions because it solves one common problem: finding a 4-4 major fit after 1NT. Keep your first version simple - 2C asks, opener answers, then place the contract sensibly. You can add advanced branches later once this base is automatic.</p>`,
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
    id: "BCT-01",
    title: "How to Spot Winners Fast in Bridge: The Card Rush Method",
    articleType: "beginnerCardPlay",
    subcategory: "Card Play Fundamentals",
    keyword: "spot winners fast bridge",
    metaDescription:
      "Learn how to spot the winning card fast in bridge — the trick-play reflex that separates fluent players from hesitant ones. Companion to Card Rush.",
    teaser: "The trick-play reflex that separates fluent players from hesitant ones — and the drill that trains it.",
    body: `Planned outline (Paul to edit). Pairs with the Card Rush trainer at /treadmill/practice/card-rush.
- Why "fast" matters: bridge clocks (online and at the club) reward instant decisions. Hesitation costs tricks and signals information to the opponents.
- The three "winner" categories you have to recognise: top of a sequence, a long-suit winner, and a card promoted by an opponent's play.
- The recognition pattern: look at suit length first, then top card, then context (what's already been played).
- Common mistakes that slow players down: counting in your head every time instead of recognising the pattern, hesitating on third-hand-high, freezing when dummy looks complicated.
- A 30-second framework you can run at the table.
- "Practice this skill the right way": link to Card Rush trainer with explanation of why isolated drilling beats playing full hands for this specific reflex.
- Final takeaway.`,
  },
  {
    id: "BCT-02",
    title: "Hand Shape Recognition in Bridge: Train Your Eye for Distribution",
    articleType: "beginnerBidding",
    subcategory: "Hand Evaluation",
    keyword: "hand shape recognition bridge",
    metaDescription:
      "Learn to recognise bridge hand shapes instantly — balanced, semi-balanced, distributional — and how to drill the skill until it's automatic.",
    teaser: "Most bidding mistakes start with miscounting shape. Here's how to fix it.",
    body: `Planned outline (Paul to edit). Pairs with the Hand Shape drill in the Treadmill at /treadmill/practice.
- Why hand shape matters more than HCP for most decisions (opening / responding / overcalling / competing).
- The three shape buckets every player should recognise instantly:
  - Balanced (4-3-3-3, 4-4-3-2, 5-3-3-2)
  - Semi-balanced (5-4-2-2, 6-3-2-2)
  - Distributional (6-4 or longer, two-suiters, freaks)
- The 5-second rule: if you can't name your shape in 5 seconds, you're guessing in the auction.
- Common shape-recognition mistakes: counting only the long suit, forgetting the second suit, misreading a 4-4-4-1.
- A simple training pattern that builds the reflex.
- "Practice this skill the right way": link to Hand Shape drill in the Treadmill — explain why isolated reps beat playing full hands for shape recognition.
- Final takeaway.

Note: differentiated from the existing live article "Bridge Shapes Fundamentals" (intermediate, 449 words) by being beginner-tier with an explicit drill companion. If overlap feels too close once written, consider re-titling to "Hand Shape Recognition for Beginners" to claim a distinct SERP.`,
  },
  {
    id: "BCT-03",
    title: "Reading Opponent Distribution in Bridge: A Beginner's Detective Guide",
    articleType: "beginnerDefence",
    subcategory: "Reading the Hand",
    keyword: "reading opponent distribution bridge",
    metaDescription:
      "Learn how to read opponents' distribution in bridge from the auction and play — the detective skill that lifts beginner defence to solid.",
    teaser: "Bridge is a detective game. Here's how to read what opponents must hold.",
    body: `Planned outline (Paul to edit). Pairs with the Opponent Shape drill in the Treadmill at /treadmill/practice.
- Why reading opponent shape matters: in defence and as declarer, every accurate play depends on knowing what opponents hold.
- The three sources of information: the auction (what they bid and didn't bid), the lead, the play to early tricks.
- The starting picture: count from 13. Every suit length you fix narrows the unseen shapes.
- Worked examples:
  - "They opened 1NT" → 5-3-3-2 / 4-4-3-2 / 4-3-3-3 shapes only (if 15-17 standard).
  - "They opened 1S and rebid 2S" → 6+ spades.
  - "They responded 1NT to 1H" → no 4-card support, no 4 spades, 6-9 points.
- Common mistakes: ignoring the negative inference (what they DIDN'T bid), not counting suits as they're played.
- "Practice this skill the right way": link to Opponent Shape drill in the Treadmill — explain how isolated reps build the reflex.
- Final takeaway.

Note: differentiated from existing live article "Count the Unseen Hand: Read Distribution in Defence" (intermediate, 546 words) by being beginner-tier with an explicit drill companion and worked starter examples. If overlap feels too close once written, consider re-titling.`,
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
  {
    id: "BCB-11",
    title: "Vulnerability in Bridge: A Beginner's Guide",
    articleType: "beginnerBidding",
    subcategory: "Bidding Fundamentals",
    keyword: "vulnerability in bridge beginner",
    metaDescription:
      "Learn what vulnerability means in bridge: how it changes scoring, when to bid more cautiously, and how it shapes preempts, sacrifices and overcalls.",
    teaser: "Vulnerability quietly changes almost every close decision in bridge. Here's how to read it.",
    body: `Planned outline (Paul to expand). High-value SEO gap: vulnerability is a fundamental concept with no dedicated beginner article on the site.

- What vulnerability is in plain English: a scoring multiplier that makes both bonuses (for making) and penalties (for going down) larger.
- The four vulnerability states in duplicate: None, NS, EW, Both. How the indicator on the screen / board tells you which one is in play.
- Why vulnerability matters in bidding (not just scoring):
  - Vulnerable preempts need a better suit.
  - Vulnerable overcalls demand more shape and quality.
  - Sacrifices look very different vulnerable vs non-vulnerable.
- The "favourable" vs "unfavourable" mental shortcut: when you are non-vul and they are vul (favourable), you can stretch. When you are vul and they are non-vul (unfavourable), pull back.
- Worked examples:
  - A 6-card suit you'd preempt non-vul but pass vulnerable.
  - A sacrifice that costs 500 vs 800 — and why one is good and the other is terrible.
- Common beginner mistakes: ignoring vulnerability entirely, bidding the same way regardless of colour, mis-reading the vulnerability shown on screen.
- A simple "check vulnerability first" habit before every borderline auction.
- Final takeaway.`,
  },
  {
    id: "BCB-12",
    title: "Bridge Conventions for Beginners: What to Learn First (and What to Skip)",
    articleType: "beginnerBidding",
    subcategory: "Conventions",
    keyword: "bridge conventions for beginners",
    metaDescription:
      "A beginner-friendly orientation to bridge conventions: which ones to learn first, which to skip until later, and how to add them safely with partner.",
    teaser: "There are hundreds of bridge conventions. You only need 4 to start.",
    body: `Planned outline (Paul to expand). Orientation article — links out to specific convention pages already live on the site.

- What a "convention" actually is: an artificial agreement with partner about what a bid means.
- The "you don't need conventions to play bridge well" reassurance — natural bidding works.
- The starter four (in order):
  1. Stayman (link to BCB-09 once published).
  2. Jacoby Transfers (link to BCB-10 once published).
  3. Blackwood (link to existing live article if available).
  4. Takeout Doubles (link to BCB-07 once published).
- The "wait to learn" group: Smolen, Puppet, Lebensohl, splinters, Bergen raises — what they do briefly, but why beginners don't need them yet.
- Common mistakes when adding conventions: adding too many at once, not agreeing follow-ups with partner, forgetting alerts.
- A practical rule: don't add a new convention until the previous one is automatic with partner in real play.
- Final takeaway.`,
  },
  {
    id: "BCD-07",
    title: "Counting Trumps for Beginners: How to Track What's Out",
    articleType: "beginnerCardPlay",
    subcategory: "Declarer Planning",
    keyword: "counting trumps bridge beginner",
    metaDescription:
      "Learn how to count trumps in bridge as a beginner declarer: simple subtraction methods, the patterns that matter, and how to avoid the classic 'who has the last trump?' mistake.",
    teaser: "If you can't tell who has the last trump, you can't safely play the rest of the hand. Here's the simplest way to track them.",
    body: `Planned outline (Paul to expand). Distinct from any existing article — the intermediate "Count Trumps Accurately" page is a redirect and there's no beginner-tier counterpart.

- Why counting trumps is the most important counting habit: every plan changes when you know how many trumps the opponents have left.
- The simplest method: subtract from what you started with. "We have 8, opponents have 5. Round 1: 2 each side played, 3 still out. Round 2: 1 still out."
- The shortcut: "How many rounds are left until trumps are all in?"
- Worked examples:
  - 8-card trump fit, normal 3-2 break, 2 rounds clears all but one — that last trump becomes the question.
  - 9-card fit, normal 2-2 or 3-1 — when to stop drawing.
  - 7-card fit, when to delay drawing entirely.
- How counting trumps interacts with drawing trumps decisions (link to "When Not to Draw Trumps").
- Reading the bidding to estimate trump breaks before play begins.
- Common counting mistakes: losing count after the third round, forgetting which opponent shortened first, not noticing a discard early.
- A simple at-the-table habit: say the count silently after every round of trumps.
- Final takeaway.`,
  },
  {
    id: "BCD-08",
    title: "Safety Plays in Bridge for Beginners: Guarantee Your Contract",
    articleType: "beginnerCardPlay",
    subcategory: "Declarer Planning",
    keyword: "safety play bridge beginner",
    metaDescription:
      "Learn bridge safety plays: how to give up an overtrick to guarantee your contract, the classic safety positions, and when safety is the right play.",
    teaser: "Sometimes the best play is one that gives up an overtrick — to guarantee the contract.",
    body: `Planned outline (Paul to expand). Clear gap topic at beginner tier — no current article on safety plays at any tier.

- What a safety play is: a line that protects against a bad break, at the cost of an overtrick or two.
- Why safety plays exist: in many contracts (especially game and slam), the contract is worth far more than the overtrick. Trading overtrick for safety is great value.
- The mindset shift: stop trying to maximise tricks; start trying to guarantee the contract.
- The simplest safety play patterns every beginner should know:
  - AKJ10x opposite xxx — duck the first round to guard against Qxxx on either side.
  - AK10xx opposite xxxx — cash the king first, watching for the queen drop.
  - AQJxx opposite xx — when to take the finesse and when to play for the drop.
- The "what's at stake" question: how to decide whether safety is worth the overtrick.
- IMPs vs Pairs: a quick note that pairs scoring sometimes argues against safety (because overtricks matter more) — but beginners playing rubber bridge or social bridge should almost always prefer safety.
- Common safety-play mistakes: over-finessing for the overtrick, ignoring the trump count, taking a percentage line that risks the contract.
- A simple "is this a safety play moment?" checklist.
- Final takeaway.`,
  },
  {
    id: "BCF-09",
    title: "Returning Partner's Suit (and When to Switch Instead)",
    articleType: "beginnerDefence",
    subcategory: "Defence Planning",
    keyword: "returning partners suit bridge",
    metaDescription:
      "Learn when to return partner's opening lead in bridge and when to switch suits — the decision that decides most defences.",
    teaser: "Defence isn't just about leads — it's about what you return. Here's the framework.",
    body: `Planned outline (Paul to expand). High-intent beginner search; pairs naturally with the existing opening-leads articles.

- Why this decision matters: partner's lead set the defensive plan. Returning the suit usually continues that plan — switching abandons it.
- The default: return partner's suit.
- The 4 main reasons to switch:
  1. Dummy is now strong in partner's suit (continuing helps declarer).
  2. You can see a better source of tricks in another suit.
  3. Partner's signal asked for a switch (link to BCF-05 Signals article).
  4. The auction tells you the suit can't deliver enough tricks.
- Which card to return when you DO continue:
  - With 3 cards originally, return the higher of remaining two (= original middle, gives count).
  - With 4 cards, return the original 4th-best.
  - With a doubleton, return the higher card.
- Worked examples:
  - Continuing a 4th-best lead through declarer to set up partner's tricks.
  - Switching to attack a side suit when dummy threatens.
  - Reading partner's signal and switching to the right suit.
- Common mistakes: switching out of fear instead of analysis, returning the wrong card and confusing partner, ignoring dummy's threats.
- A simple "continue or switch" checklist.
- Final takeaway.`,
  },
];
