const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPathCandidates = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
];
const keyPath = keyPathCandidates.find((p) => fs.existsSync(p));
if (!keyPath) throw new Error("No Firebase service account key found.");

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const HUB = "/bidding/advanced";
const PRACTICE = "/bidding/practice";

const ARTICLES = {
  "Do You Open the Bidding? Problems 1-5 Explained": {
    subcategory: "Hand Evaluation and Judgment",
    primaryKeyword: "do you open the bidding hand evaluation",
    teaser:
      "These first five bidding drills build your opening discipline: when to open, when to pass, and how shape changes borderline decisions.",
    metaDescription:
      "Learn opening hand evaluation from practical bidding problems 1-5. Build clear opening discipline and avoid random starts.",
    bodyHtml: `
<h2>Do You Open the Bidding? Problems 1-5 Explained</h2>
<p>These early trainer problems are about one skill: making your first call with purpose.</p>
<p>If we open too light with no plan, partner gets bad information. If we pass too many real openings, we miss easy part-scores and games.</p>

<h3>The practical opening baseline</h3>
<ul>
  <li>Start with your agreed point range and shape rules.</li>
  <li>Upgrade when shape and controls improve trick-taking potential.</li>
  <li>Downgrade flat, honor-heavy hands with poor texture.</li>
  <li>Do not open just because the hand "looks pretty". Open because your call describes your hand honestly.</li>
</ul>

<Callout type="rule">
  <p>Bridge gets easier when your first bid is consistent. Partner should feel your opening style is reliable, not random.</p>
</Callout>

<h3>What problems 1-5 are teaching you</h3>
<ul>
  <li>Borderline opens are mostly about shape, not just raw points.</li>
  <li>A tidy pass can be better than a noisy opening that drags partnership into trouble.</li>
  <li>When you do open, choose the bid that best explains your hand structure.</li>
</ul>

<h3>Common mistakes</h3>
<ul>
  <li>Opening because of one attractive honor combination while ignoring weak overall structure.</li>
  <li>Using different standards each session depending on mood.</li>
  <li>Forgetting vulnerability and seat context in close decisions.</li>
</ul>

<h3>Final takeaway</h3>
<p>Opening decisions are your foundation. Be disciplined, be clear, and let partner trust your first call every time.</p>

<h3>Where to next</h3>
<ul>
  <li><a href="${PRACTICE}">Bidding Practice Trainer</a></li>
  <li><a href="${HUB}">Bidding Articles Hub</a></li>
</ul>
`.trim(),
  },
  "Responding to Partner: Problems 6-10 Explained": {
    subcategory: "Core Bidding Fundamentals",
    primaryKeyword: "responding to partner first response decisions",
    teaser:
      "Problems 6-10 focus on first response discipline: support partner early, show shape clearly, and avoid vague auctions.",
    metaDescription:
      "Learn responder fundamentals from bidding problems 6-10. Improve first responses with clearer support and shape communication.",
    bodyHtml: `
<h2>Responding to Partner: Problems 6-10 Explained</h2>
<p>Responder's first call is where many auctions are won or lost. These problems train you to show useful information quickly.</p>

<h3>Core responder priorities</h3>
<ol>
  <li>Check for immediate support and show fit early when appropriate.</li>
  <li>If no fit yet, show major-suit shape efficiently.</li>
  <li>Use no-trump only when it describes hand type and values accurately.</li>
</ol>

<Callout type="rule">
  <p>A clean first response helps opener place the contract faster. Ambiguous bids force partner to guess later.</p>
</Callout>

<h3>What problems 6-10 are drilling</h3>
<ul>
  <li>Raising with support instead of hiding fit information.</li>
  <li>Choosing between new suit and no-trump based on shape, not fear.</li>
  <li>Keeping auctions calm and structured when multiple calls look possible.</li>
</ul>

<h3>Common mistakes</h3>
<ul>
  <li>Delaying support to mention a side suit with no clear gain.</li>
  <li>Defaulting to no-trump without evaluating shape and fit potential.</li>
  <li>Treating first response as a one-off guess instead of a partnership message.</li>
</ul>

<h3>Final takeaway</h3>
<p>Responder bidding is not about cleverness. It is about making partner's next decision easier.</p>

<h3>Where to next</h3>
<ul>
  <li><a href="${PRACTICE}">Bidding Practice Trainer</a></li>
  <li><a href="${HUB}">Bidding Articles Hub</a></li>
</ul>
`.trim(),
  },
  "The Modern 1NT Opening: Problems 11-16 Explained": {
    subcategory: "No-Trump Auctions and Decisions",
    primaryKeyword: "modern 1nt opening discipline",
    teaser:
      "Problems 11-16 build your modern 1NT discipline: range accuracy, balanced shape, and partnership trust in your notrump promise.",
    metaDescription:
      "Learn the modern 1NT opening from problems 11-16. Improve range discipline, shape judgment, and no-trump auction clarity.",
    bodyHtml: `
<h2>The Modern 1NT Opening: Problems 11-16 Explained</h2>
<p>The modern 1NT opening is powerful because it says so much in one call. These drills train you to keep that promise accurate.</p>

<h3>The promise behind 1NT</h3>
<ul>
  <li>Agreed point range (for many pairs, 15-17).</li>
  <li>Balanced hand type.</li>
  <li>Predictable follow-up structure for responder.</li>
</ul>

<Callout type="mistake">
  <p>If you stretch 1NT with wrong shape or wrong range, partner's whole auction map breaks down.</p>
</Callout>

<h3>What problems 11-16 are teaching</h3>
<ul>
  <li>When a hand is truly balanced enough for 1NT.</li>
  <li>When to open a suit instead and describe strength later.</li>
  <li>Why consistency beats occasional "creative" 1NT calls.</li>
</ul>

<h3>Common mistakes</h3>
<ul>
  <li>Opening 1NT outside range because it feels convenient.</li>
  <li>Ignoring shape red flags such as awkward singletons.</li>
  <li>Forgetting that responder decisions rely on your accuracy.</li>
</ul>

<h3>Final takeaway</h3>
<p>A great 1NT system is built on trust. Keep your range and shape promises, and your partnership auctions become dramatically cleaner.</p>

<h3>Where to next</h3>
<ul>
  <li><a href="${HUB}/uryhI78pcS2v6yBKNTyG">Stayman Convention: Find a 4-4 Major Fit After 1NT</a></li>
  <li><a href="${HUB}/7EOLfZHFMk8uvW3f2l8L">Transfers: Let Opener Declare the Major</a></li>
  <li><a href="${PRACTICE}">Bidding Practice Trainer</a></li>
</ul>
`.trim(),
  },
  "1-level overcalls: Practical Trainer Lessons Across Levels": {
    subcategory: "Competitive Bidding and Doubles",
    primaryKeyword: "1-level overcalls bridge bidding",
    teaser: "Learn practical 1-level overcalls: when to enter, what partner needs to know, and how to compete without chaos.",
    metaDescription: "Improve 1-level overcalls with practical rules on suit quality, values, and partnership communication.",
    bodyHtml: `
<h2>1-Level Overcalls: Practical Lessons</h2>
<p>A good 1-level overcall puts pressure on opponents while giving partner a useful picture of your hand.</p>
<h3>Overcall essentials</h3>
<ul><li>Respect suit quality.</li><li>Know vulnerability context.</li><li>Do not overcall hands that partner cannot navigate.</li></ul>
<h3>Common errors</h3>
<ul><li>Overcalling with weak texture and no plan.</li><li>Entering just to "do something".</li></ul>
<p>Overcalls are competitive tools, not noise. Enter when your call helps partner, not when it hides your hand.</p>
<h3>Where to next</h3><ul><li><a href="${PRACTICE}">Bidding Practice Trainer</a></li><li><a href="${HUB}">Bidding Articles Hub</a></li></ul>
`.trim(),
  },
  "Quick check: Practical Trainer Lessons Across Levels": {
    subcategory: "Core Bidding Fundamentals",
    primaryKeyword: "bridge bidding quick checks",
    teaser: "Use quick bidding checks to avoid avoidable errors and keep partnership auctions stable.",
    metaDescription: "A practical quick-check framework for bidding decisions under pressure.",
    bodyHtml: `
<h2>Bidding Quick Check Framework</h2>
<p>Before each call, run a fast mental checklist: strength, shape, fit, and forcing status.</p>
<Callout type="checklist"><ul><li>What have we shown?</li><li>What remains unknown?</li><li>Is this call forcing?</li><li>Does this call help partner?</li></ul></Callout>
<p>This 5-second routine cuts out many expensive partnership misunderstandings.</p>
<h3>Where to next</h3><ul><li><a href="${PRACTICE}">Bidding Practice Trainer</a></li><li><a href="${HUB}">Bidding Articles Hub</a></li></ul>
`.trim(),
  },
  "2-level overcalls: Practical Trainer Lessons Across Levels": {
    subcategory: "Competitive Bidding and Doubles",
    primaryKeyword: "2-level overcalls bridge",
    teaser: "2-level overcalls carry more risk and more reward. Learn when they are practical and when to pass.",
    metaDescription: "Learn practical 2-level overcall judgment with risk control and partnership clarity.",
    bodyHtml: `<h2>2-Level Overcalls: Risk and Reward</h2><p>At the two level, discipline matters more. Enter with real suit quality and enough playing strength.</p><ul><li>Vulnerability amplifies bad overcalls.</li><li>Weak texture gets punished quickly.</li><li>A pass is often a winning bid.</li></ul><h3>Where to next</h3><ul><li><a href="${PRACTICE}">Bidding Practice Trainer</a></li><li><a href="${HUB}">Bidding Articles Hub</a></li></ul>`.trim(),
  },
  "Preempts: Practical Trainer Lessons Across Levels": {
    subcategory: "Preempting Strategy",
    primaryKeyword: "preempt bidding strategy",
    teaser: "Preempts are pressure tools. Use them to consume space, not to guess wildly.",
    metaDescription: "Learn practical preempt strategy with vulnerability, suit quality, and partnership discipline.",
    bodyHtml: `<h2>Preempts: Practical Strategy</h2><p>Preempts are best when they take away room and still describe your hand honestly.</p><ul><li>Respect vulnerability.</li><li>Respect suit texture.</li><li>Do not preempt balanced junk hands.</li></ul><Callout type="rule"><p>A good preempt makes opponents guess. A bad preempt makes partner guess.</p></Callout><h3>Where to next</h3><ul><li><a href="${PRACTICE}">Bidding Practice Trainer</a></li><li><a href="${HUB}">Bidding Articles Hub</a></li></ul>`.trim(),
  },
  "Is this forcing?: Practical Trainer Lessons Across Levels": {
    subcategory: "Partnership Style and Discipline",
    primaryKeyword: "is this forcing bridge bidding",
    teaser: "Forcing misunderstandings are expensive. Learn practical forcing discipline and partnership safety checks.",
    metaDescription: "Understand forcing vs non-forcing auctions with practical bridge bidding rules.",
    bodyHtml: `<h2>Is This Forcing? Practical Discipline</h2><p>Many bad contracts come from one mistake: partners disagreeing on whether auction is forcing.</p><ul><li>Know your partnership forcing triggers.</li><li>Do not invent forcing status at the table.</li><li>When unsure, choose the bid that keeps auction safest.</li></ul><h3>Where to next</h3><ul><li><a href="${PRACTICE}">Bidding Practice Trainer</a></li><li><a href="${HUB}">Bidding Articles Hub</a></li></ul>`.trim(),
  },
  "Duplicate bidding: Practical Trainer Lessons Across Levels": {
    subcategory: "Partnership Style and Discipline",
    primaryKeyword: "duplicate bridge bidding discipline",
    teaser: "Duplicate rewards consistency. Learn bidding discipline that performs over many boards, not just one hand.",
    metaDescription: "Practical duplicate bidding habits for consistency, partnership trust, and lower error rate.",
    bodyHtml: `<h2>Duplicate Bidding: Consistency Wins</h2><p>Duplicate is not about occasional brilliance. It is about repeated good decisions.</p><ul><li>Use stable methods.</li><li>Minimize misunderstandings.</li><li>Prefer clear ranges over vague ambitions.</li></ul><p>Over a full session, discipline beats drama.</p><h3>Where to next</h3><ul><li><a href="${PRACTICE}">Bidding Practice Trainer</a></li><li><a href="${HUB}">Bidding Articles Hub</a></li></ul>`.trim(),
  },
  "Advanced hand evaluation: Practical Trainer Lessons Across Levels": {
    subcategory: "Hand Evaluation and Judgment",
    primaryKeyword: "advanced hand evaluation bridge",
    teaser: "Advanced evaluation means converting points into tricks, controls, and fit quality.",
    metaDescription: "Learn advanced bridge hand evaluation beyond raw points: shape, controls, and fit.",
    bodyHtml: `<h2>Advanced Hand Evaluation</h2><p>Raw points are a start, not the whole story. Shape, controls, and fit quality drive real outcomes.</p><ul><li>Upgrade hands with controls and working honors.</li><li>Downgrade flat hands with poor honor texture.</li><li>Re-evaluate after fit discovery.</li></ul><h3>Where to next</h3><ul><li><a href="${PRACTICE}">Bidding Practice Trainer</a></li><li><a href="${HUB}">Bidding Articles Hub</a></li></ul>`.trim(),
  },
  "Doubles: Practical Trainer Lessons Across Levels": {
    subcategory: "Competitive Bidding and Doubles",
    primaryKeyword: "bridge doubles practical guide",
    teaser: "Doubles are precision tools. Learn when they are for takeout, penalties, or cooperative action.",
    metaDescription: "Practical guide to doubles in bridge bidding: takeout discipline, penalty context, and partnership clarity.",
    bodyHtml: `<h2>Doubles: Practical Use</h2><p>A double only works when both partners agree what it means in that auction.</p><ul><li>Classify doubles by context.</li><li>Do not over-double without shape and backup.</li><li>Prioritize partnership agreements.</li></ul><h3>Where to next</h3><ul><li><a href="${PRACTICE}">Bidding Practice Trainer</a></li><li><a href="${HUB}">Bidding Articles Hub</a></li></ul>`.trim(),
  },
  "Responding to a double: Practical Trainer Lessons Across Levels": {
    subcategory: "Competitive Bidding and Doubles",
    primaryKeyword: "responding to takeout double",
    teaser: "Responder after partner doubles must communicate shape and strength cleanly, without panic bids.",
    metaDescription: "Learn practical responses to partner's takeout double with strength and shape clarity.",
    bodyHtml: `<h2>Responding to a Double</h2><p>After partner's takeout double, your job is to keep the auction accurate: show shape, then strength.</p><ul><li>Bid naturally with weak hands.</li><li>Show constructive values without jumping randomly.</li><li>Support partnership strain discovery.</li></ul><h3>Where to next</h3><ul><li><a href="${PRACTICE}">Bidding Practice Trainer</a></li><li><a href="${HUB}">Bidding Articles Hub</a></li></ul>`.trim(),
  },
  "The Power of Pass: Practical Trainer Lessons Across Levels": {
    subcategory: "Partnership Style and Discipline",
    primaryKeyword: "power of pass bridge bidding",
    teaser: "Pass is often the highest-skill call in bridge. Learn when disciplined pass beats noisy competition.",
    metaDescription: "Learn the power of pass in bridge bidding and when disciplined passing improves results.",
    bodyHtml: `<h2>The Power of Pass</h2><p>Strong players pass more good hands than most people realize. Passing is a strategic decision, not surrender.</p><ul><li>Pass when your side lacks clear constructive direction.</li><li>Pass when defending may outperform speculative competing.</li><li>Pass to protect partnership accuracy.</li></ul><Callout type="rule"><p>Compete hard when right, but do not rescue opponents from bad contracts.</p></Callout><h3>Where to next</h3><ul><li><a href="${PRACTICE}">Bidding Practice Trainer</a></li><li><a href="${HUB}">Bidding Articles Hub</a></li></ul>`.trim(),
  },
  "Slam judgment: Practical Trainer Lessons Across Levels": {
    subcategory: "Hand Evaluation and Judgment",
    primaryKeyword: "slam judgment bridge",
    teaser: "Slam bidding is mostly judgment. Learn when to drive and when to stop below slam.",
    metaDescription: "Improve slam judgment in bridge with practical evaluation of controls, fit quality, and loser structure.",
    bodyHtml: `<h2>Slam Judgment</h2><p>Slam is not about optimism. It is about evidence: controls, fit quality, and trick projection.</p><ul><li>Count controls, not just points.</li><li>Evaluate wasted values opposite partner's shape.</li><li>Stop low when key ingredients are missing.</li></ul><h3>Where to next</h3><ul><li><a href="${PRACTICE}">Bidding Practice Trainer</a></li><li><a href="${HUB}">Bidding Articles Hub</a></li></ul>`.trim(),
  },
  "Splinters: Practical Trainer Lessons Across Levels": {
    subcategory: "Conventions and Artificial Methods",
    primaryKeyword: "splinter bid bridge",
    teaser: "Splinters are powerful fit-showing tools. Learn when they clarify slam interest and when they overstate.",
    metaDescription: "Learn practical splinter bidding: fit confirmation, shortness, and slam evaluation.",
    bodyHtml: `<h2>Splinters: Practical Use</h2><p>Splinters combine fit and shortness in one call. They are powerful when used with discipline.</p><ul><li>Confirm fit first.</li><li>Show shortness clearly.</li><li>Avoid splinters on hands that cannot support follow-up pressure.</li></ul><h3>Where to next</h3><ul><li><a href="${PRACTICE}">Bidding Practice Trainer</a></li><li><a href="${HUB}">Bidding Articles Hub</a></li></ul>`.trim(),
  },
  "Lebensohl: Practical Trainer Lessons Across Levels": {
    subcategory: "Conventions and Artificial Methods",
    primaryKeyword: "lebensohl practical trainer lessons",
    teaser: "Learn the practical Lebensohl lesson: 2NT as the weak-hand route and direct actions for stronger hands.",
    metaDescription: "Practical Lebensohl lessons from trainer scenarios: weak-hand 2NT route, direct bids, and competitive judgment.",
    bodyHtml: `<h2>Lebensohl: Practical Lessons</h2><p>Lebensohl is a structure tool for competitive auctions, especially around interference over no-trump and weak-two contexts.</p><ul><li>2NT route usually shows weaker hands.</li><li>Direct actions usually show more values.</li><li>Do not overuse convention tools when simple doubles/pass are best.</li></ul><p>For the full teaching article, see: <a href="${HUB}/3rcWPkKTvaD90WRyRdMg">Lebensohl Convention: Compete Smart After Interference</a>.</p><h3>Where to next</h3><ul><li><a href="${PRACTICE}">Bidding Practice Trainer</a></li><li><a href="${HUB}">Bidding Articles Hub</a></li></ul>`.trim(),
  },
};

async function updateByTitle(title, payload) {
  const snap = await db.collection("bidding").where("title", "==", title).limit(1).get();
  if (snap.empty) return { title, updated: false };
  const summaryDoc = snap.docs[0];
  const summary = summaryDoc.data() || {};
  const bodyId = summary.body;
  if (!bodyId) return { title, updated: false };

  await summaryDoc.ref.set(
    {
      teaser: payload.teaser,
      metaDescription: payload.metaDescription,
      primaryKeyword: payload.primaryKeyword,
      subcategory: payload.subcategory,
      seoSubtopic: payload.subcategory,
      category: "Bidding",
      ctaTarget: PRACTICE,
      relatedLinks: `${PRACTICE}\n${HUB}`,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  await db.collection("biddingBody").doc(bodyId).set(
    {
      text: payload.bodyHtml,
      body: { text: payload.bodyHtml },
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  return { title, updated: true, summaryId: summaryDoc.id, bodyId };
}

async function main() {
  const entries = Object.entries(ARTICLES);
  const out = [];
  for (const [title, payload] of entries) {
    const res = await updateByTitle(title, payload);
    out.push(res);
  }
  const updated = out.filter((x) => x.updated);
  console.log(`Updated ${updated.length}/${out.length} trainer-theme articles.`);
  updated.forEach((x) => console.log(`${x.summaryId} | ${x.bodyId} | ${x.title}`));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
