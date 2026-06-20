/**
 * Publish two new advanced-bidding articles into Firestore:
 *   1. "What is a convention, and what conventions are the best to play?"  (hub group: General)
 *   2. "Best slam bidding conventions"                                      (hub group: Slam Bidding)
 *
 * Modelled on publish-bidding-lebensohl-article.js. Creates a summary doc in
 * `bidding` + a body doc in `biddingBody`, sets a readable `slug`, and is
 * idempotent (re-running updates the same docs, matched by title).
 *
 * Usage: node scripts/publish-conventions-and-slam-articles.js
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error("Missing serviceAccountKey.json");
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))) });

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;
const HUB_PATH = "/bidding/advanced";

// Wrap red suits (hearts/diamonds) in a span, but never touch text inside a <MakeBoard .../> tag.
const iterativelyReplace = (string, suit) => {
  let oldString = string;
  let newString = "";
  let indexOf = oldString.indexOf(suit);
  while (indexOf !== -1) {
    newString += oldString.slice(0, indexOf);
    oldString = oldString.slice(indexOf + 1);
    if (oldString.slice(0, 7) !== "</span>" && oldString[0] !== "/" && oldString[0] !== '"') {
      newString += `<span class="red-suit">${suit}</span>`;
    } else {
      newString += suit;
    }
    indexOf = oldString.indexOf(suit);
  }
  if (newString === "") return oldString;
  return newString + oldString;
};
const prepareArticleStringForSave = (html) => {
  const parts = html.split(/(<MakeBoard[^>]*\/>)/);
  return parts
    .map((p) => (p.includes("MakeBoard") ? p : iterativelyReplace(iterativelyReplace(p, "♥"), "♦")))
    .join("");
};

const ARTICLES = [
  {
    slug: "what-is-a-convention-best-to-play",
    title: "What is a convention, and what conventions are the best to play?",
    teaser:
      "Understand what a convention actually is, the costs and benefits of adding one, and the conventions most worth playing.",
    metaDescription:
      "What is a bridge convention? Learn how conventions work, when they are worth adding, and the best conventions to play (Stayman, transfers, Jacoby, takeout doubles, 1NT interference).",
    primaryKeyword: "what is a bridge convention best conventions to play",
    bodyHtml: `
<h2>What is a convention, and what conventions are the best to play?</h2>
<p>This article will help you understand what a convention is, and the costs and benefits of adding them to your bidding.</p>
<p>A convention is an artificial bid — a bid we assign a particular meaning, one that need not resemble the suit actually bid.</p>
<h3>The most common example</h3>
<p>1NT (P) 2♣. We call that Stayman: it is a bid that asks the 1NT opener, "Do you have a 4-card major?" Importantly, the 2♣ bid has absolutely nothing to do with clubs.</p>
<p>Here are some important practical considerations when deciding which conventions are best for you and your partnership:</p>
<ol>
<li>It is fairly easy to remember, especially under pressure. There's no point playing a convention that you might forget even occasionally — you will lose more from forgetting it than you gain from having it in your system in the first place.</li>
<li>It comes up at the table reasonably often. There is no point in adopting an obscure convention that will only serve its purpose once every year or two — the "memory cost" of learning it will outweigh its practical value.</li>
<li>It solves a problem. Don't add conventions just to be flashy; add one only if you genuinely believe it will help you reach good contracts consistently.</li>
</ol>
<p>However, some people enjoy playing lots of conventions. If you are not worried about your score and just want to play bridge the way you like, then go for it — at the end of the day, bridge is there for you to enjoy!</p>
<h3>How to add a convention to your system</h3>
<p>The challenge when you add a convention is that you need to be on the same page about the follow-up bids. Make sure you have discussed the most common continuations, and try to anticipate any issues that might come up.</p>
<p>For example, after 1NT (P) 2♣ — Stayman:</p>
<ul>
<li>What does partner do with a 4-card major?</li>
<li>What does partner do with no 4-card major?</li>
<li>What does partner do with both 4-card majors?</li>
<li>What about 5-card majors?</li>
</ul>
<p>As you can see, these types of questions should cross your mind; otherwise it can be a bit of a wake-up call when the bid comes up and you're not sure how to handle it.</p>
<h3>Don't forget about competition</h3>
<p>Bridge these days is typically very competitive; people are getting into the auction a lot. Don't assume you will get peace and quiet from the opponents in the bidding. Discuss with your partner:</p>
<ul>
<li>Does our system still apply in competition (when the opponents bid)?</li>
<li>Are there any adjustments we need to make if they bid?</li>
<li>Are we using the common rule that all bids are natural in competition?</li>
<li>What do we do if the opponents double one of our bids? (A common treatment is to simply ignore doubles and carry on!)</li>
</ul>
<h3>So how many conventions should you play?</h3>
<p>My personal opinion is to keep it minimal and play a mostly natural system. Conventions have pros and cons, and adding too many can get in the way of natural bidding. I particularly recommend that beginner and intermediate players minimise conventions completely while they learn and get a feel for natural bidding — improving your judgement is best done without conventions that "prescribe" your responses. People get far too focused on the meaning of their bids, rather than developing a feel for natural bids that "show their hand".</p>
<p>TLDR: Too many conventions will hinder genuine bidding improvement for intermediate players.</p>
<h3>Which are the 5 best and most recommended conventions?</h3>
<p>There are a few excellent conventions:</p>
<ol>
<li><strong>Stayman</strong> — so well known that in Australia and other parts of the world you don't even need to alert it; it's expected!</li>
<li><strong>Transfers and the 1NT system generally</strong> — again, this applies when partner opens 1NT. A well-organised system over partner's 1NT is high-value because it's such a common opening; and with the auction already starting a bit higher (your first response has to be at the 2 level), it pays to know what you're doing, as space is more limited.</li>
<li><strong>Jacoby and other 4-card major raises</strong> — when partner opens or overcalls one of a major (1♥ or 1♠), it's important to be able to communicate the size of your fit. When you have 4-card support (and therefore a 9-card fit), it's good for partner to know that. Big fits bring to life distributional hands and hands with poor trump quality (when you have a lot of trumps, the quality is not as critical). Partner needs to know that so they can bid and compete appropriately.</li>
<li><strong>Takeout doubles</strong> — as mentioned, bidding is competitive, and most of our bidding is done alongside our opponents. Well-organised agreements around takeout doubles help a lot, because they come up in an endless variety of auctions.</li>
<li><strong>Interference over their 1NT</strong> — this is an area where it pays to have a good system. You would like to interfere and compete as much as possible. Just because they open 1NT does not mean your side doesn't have its fair share of the points, and you may want to compete for the part-score. Showing two-suited hands in particular is popular, and it can help with both the safety of your bidding and your success rate in finding a fit! Bridge is often won or lost in the part-score battle! (And besides, if nothing else, interfering makes it hard for them to use all their gadgets, like transfers.)</li>
</ol>
<h3>Conclusion</h3>
<p>Conventions can be really effective and fun if used correctly. Overall, I think there is a tendency to overdo it; people correlate good results with "more" conventions. However, many of the top pairs try hard to keep it simple. At its core, it's a stylistic decision — do you want all the bells and whistles, or do you prefer a more natural and classical approach?</p>
`.trim(),
  },
  {
    slug: "best-slam-bidding-conventions",
    title: "Best slam bidding conventions",
    teaser:
      "Slam bidding needs to be accurate. A practical run-through of the most critical slam conventions: Jacoby, splinters, cue bids, RKCB, and 2 over 1.",
    metaDescription:
      "The best slam bidding conventions in bridge: Jacoby 2NT, splinters, cue bids, Roman Keycard Blackwood (RKCB), and 2 over 1 game force — with a worked splinter example.",
    primaryKeyword: "best slam bidding conventions bridge",
    bodyHtml: `
<h2>Best slam bidding conventions</h2>
<p>Slam bidding is a very important area of bridge, and we need to be quite accurate. There is a common mentality among expert players of being content to bash game and hope for the best, while trying to be surgically precise with slam where possible — it is not nice to go one or two off when your side holds a huge share of the points!</p>
<p>So let's look at some of the most critical slam conventions:</p>
<ol>
<li><strong>Jacoby</strong> — lots of our slams will arise out of big major fits. When partner opens 1♥ or 1♠, Jacoby is typically a 2NT response, showing 4+ card support and game-forcing values. By quickly agreeing the trump suit and creating a game force, the stage is set to show partner various important details about each other's hands, including:
<ul>
<li>Shortage</li>
<li>Strength</li>
<li>Extra trump length</li>
</ul>
</li>
<li><strong>Splinters</strong> — one of my very favourite conventions. A splinter is a very specific bid over a 1♥ or 1♠ opening that shows 4 trumps, a singleton or void in a suit, and a tightly defined range of points and card quality.</li>
</ol>
<p>Here is an example:</p>
<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-K1094*H-A1043*D-7*C-K432" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="North" bidding="1♠/P/4♦" /></p>
<p>On this hand, South has shown 1-2 diamonds, 4-card spade support, and about 9-11 points with sharp cards (Aces and Kings are perfect!). You now have a perfectly predictable hand, so partner should be well placed to judge what the contract should be!</p>
<ol start="3">
<li><strong>Cue bids</strong> — an essential tool for slam bidding. Cue bidding helps your side figure out whether you are missing two top losers in a suit. You can have 33 high-card points, but if you are missing, say, the A-K of spades and you are in 6NT, it usually won't work out well!</li>
<li><strong>Blackwood, or RKCB (Roman Keycard Blackwood)</strong> — this is one of the very best conventions. It is there to help you stay out of slams where you are missing two Aces or two keycards (if you include the King of trumps). Those slams are usually completely hopeless, so this should really rank #1 as the most useful convention. Also, RKCB can help you find out whether your side has all four Aces and the King and Queen of trumps — so if you aspire to bid a grand slam, you really need to make sure you have all those cards before you go!</li>
<li><strong>2 over 1</strong> — this is a very common modern-day agreement: if one player responds at the 2 level to a 1-level opening (other than by making a simple raise), the partnership agrees they are in a game-forcing auction. That is great because you don't need to worry about partner passing, or jump and waste bidding room just to force partner to keep bidding. With that concern out of the way, you have more energy and space to show the features of your hand that matter. Many good slam auctions begin with a 2-over-1 game force, which allows both players to show their hand and strength in an unrushed fashion.</li>
</ol>
`.trim(),
  },
];

async function getNextArticleNumber() {
  const snapshot = await db.collection("bidding").get();
  const max = snapshot.docs.reduce((acc, doc) => {
    const n = Number((doc.data() || {}).articleNumber || 0);
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);
  return max + 1;
}

async function publishOne(article, articleNumberFallback) {
  const existing = await db.collection("bidding").where("title", "==", article.title).limit(1).get();
  const summaryRef = existing.empty ? db.collection("bidding").doc() : existing.docs[0].ref;
  const existingBodyId = existing.empty ? null : (existing.docs[0].data() || {}).body;
  const bodyRef = existingBodyId ? db.collection("biddingBody").doc(existingBodyId) : db.collection("biddingBody").doc();
  const now = FieldValue.serverTimestamp();
  const articleNumber = existing.empty
    ? String(articleNumberFallback)
    : String((existing.docs[0].data() || {}).articleNumber || articleNumberFallback);

  const processed = prepareArticleStringForSave(article.bodyHtml);

  const summaryPayload = {
    id: summaryRef.id,
    articleType: "bidding",
    difficulty: "4",
    articleNumber,
    slug: article.slug,
    title: article.title,
    category: "Bidding",
    subcategory: "Conventions and Artificial Methods",
    seoSubtopic: "Conventions and Artificial Methods",
    teaser: article.teaser,
    metaDescription: article.metaDescription,
    primaryKeyword: article.primaryKeyword,
    relatedLinks: HUB_PATH,
    ctaTarget: HUB_PATH,
    body: bodyRef.id,
    isFree: true,
    freeUpdatedAt: now,
    updatedAt: now,
  };
  if (existing.empty) summaryPayload.createdAt = now;

  await summaryRef.set(summaryPayload, { merge: true });
  await bodyRef.set({ id: bodyRef.id, text: processed, body: { text: processed }, updatedAt: now }, { merge: true });
  console.log(`Published "${article.title}" -> ${HUB_PATH}/${article.slug}  (summary ${summaryRef.id}, body ${bodyRef.id})`);
}

async function main() {
  let n = await getNextArticleNumber();
  for (const a of ARTICLES) {
    await publishOne(a, n);
    n += 1;
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
