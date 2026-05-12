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

const HUB_PATH = "/bidding/advanced";
const TITLE = "Lebensohl: Compete Smart Without Guessing";

const payload = {
  title: TITLE,
  teaser:
    "Lebensohl is popular for a reason: it gives you a simple structure to compete in partscore battles without random guessing.",
  metaDescription:
    "Learn practical Lebensohl in two common auctions. Understand when 2NT shows the weak hand, when direct bids show more, and when to double or pass instead.",
  category: "Bidding",
  subcategory: "Conventions and Artificial Methods",
  seoSubtopic: "Conventions and Artificial Methods",
  primaryKeyword: "lebensohl compete smart without guessing",
  ctaTarget: "/bidding/practice",
  relatedLinks: [
    "/bidding/advanced/uryhI78pcS2v6yBKNTyG",
    "/bidding/advanced/7EOLfZHFMk8uvW3f2l8L",
    "/bidding/advanced/q8Aw4XZIKKKV9RhHhPQ9",
    HUB_PATH,
  ].join("\n"),
  articleType: "bidding",
  difficulty: "4",
  isFree: true,
  bodyHtml: `
<h2>Lebensohl: Compete Smart Without Guessing</h2>
<p>Let&apos;s look at Lebensohl. It&apos;s very popular at top level bridge, for good reason, and it&apos;s super easy to learn and play.</p>
<p>At heart, this is about partscore battles. Partscore battles are one of the most important parts of bridge bidding, and Lebensohl gives us a clean structure so we can compete without confusion.</p>

<h3>Why this matters</h3>
<p>When deciding whether to compete, keep these factors in mind:</p>
<ul>
  <li>If opponents have a fit and are playing on the 2-level, letting them stay there is often a bad idea.</li>
  <li>The more unbalanced we are, the more attractive competing becomes.</li>
  <li>Good suit quality in our long suits makes competing more attractive.</li>
</ul>

<Callout type="rule">
  <p>So the practical summary is simple: don&apos;t let opponents sit comfortably in a 2-level fit, especially when we are unbalanced and have a good suit.</p>
</Callout>

<h3>Situation 1: Partner opened or overcalled 1NT, and they bid on the 2-level</h3>
<p>This is a classic Lebensohl spot.</p>
<p>The practical sequence is:</p>
<ol>
  <li>Partner opens/overcalls 1NT</li>
  <li>Opponents bid on the 2-level</li>
  <li>You bid <strong>2NT</strong>, saying: &quot;I have a suit I want to bid, just to compete.&quot;</li>
</ol>
<p>Why 2NT? Because often we are not strong enough to bid 3 of our suit directly and force partner onward, but we also can&apos;t afford to pass.</p>
<p>Critical detail: after Lebensohl, partner should bid <strong>3♣</strong>. That gives you room to pass 3♣ if clubs is your suit, or correct to your actual suit at the 3-level.</p>
<p>That&apos;s the whole beauty: you compete with structure, not panic.</p>

<h3>Situation 2: Opponents open a weak 2, partner makes a takeout double</h3>
<p>This is the other huge use case.</p>
<p>A very practical memory aid:</p>
<ul>
  <li><strong>2NT = weak hand / bad hand / terrible hand</strong> (often around 0-7)</li>
  <li>direct 3-level suit bids = more constructive, around 8-11, natural, not forcing</li>
</ul>

<Callout type="checklist">
  <p>Think of 2NT as a <strong>STOP sign</strong>. In both main Lebensohl contexts, 2NT is the weak-hand route.</p>
  <p>That solves a real partnership problem: partner can separate very weak hands from decent hands instead of guessing.</p>
</Callout>

<h3>What if you are stronger?</h3>
<p>If you have enough for game, just bid game. Or if you don&apos;t have a clean direct game bid, cue-bid the opponent&apos;s suit and keep the auction moving.</p>
<p>So there&apos;s a clean ladder:</p>
<ul>
  <li>weak -> 2NT route</li>
  <li>intermediate/decent -> direct natural bid (often 8-11, not forcing)</li>
  <li>game-going -> bid game / cue-bid as appropriate</li>
</ul>

<h3>Don&apos;t overuse Lebensohl: keep doubles in your toolkit</h3>
<p>Just because Lebensohl exists does not mean we must press that button every time.</p>
<p>Sometimes the simple <strong>takeout double</strong> is still best.</p>
<p>Why?</p>
<ul>
  <li>We don&apos;t let them play comfortably on the 2-level in a fit.</li>
  <li>Partner already has useful strength range in many of these auctions.</li>
  <li>Our shape might be ideal for takeout action.</li>
</ul>

<h3>Compete hard — but pass in the right spots</h3>
<p>Yes, we are fiercely determined to compete when we can. But if we have 3+ cards in the opponent&apos;s suit, that often points toward <strong>pass</strong>.</p>
<p>Why pass there?</p>
<ul>
  <li>Partner with shortage can still act later if needed.</li>
  <li>Or partner may have length behind them, which means defending could be best.</li>
  <li>Sometimes they are in a poor contract already — don&apos;t rescue them.</li>
</ul>
<p>Great line to remember: <strong>We are fiercely determined to compete, except when they are in a bad contract.</strong></p>

<h3>Final takeaway</h3>
<Callout type="rule">
  <p>Lebensohl gives you structure in competitive auctions.</p>
  <p>If you remember one line, remember this: <strong>2NT is usually the weak-hand route (the stop sign), and direct bids show more.</strong></p>
  <p>Use Lebensohl to compete with structure, not emotion.</p>
</Callout>

<h3>Where to next</h3>
<ul>
  <li><a href="/bidding/advanced/uryhI78pcS2v6yBKNTyG">Stayman Convention: Find a 4-4 Major Fit After 1NT</a></li>
  <li><a href="/bidding/advanced/7EOLfZHFMk8uvW3f2l8L">Transfers: Let Opener Declare the Major</a></li>
  <li><a href="/bidding/advanced/q8Aw4XZIKKKV9RhHhPQ9">Stayman vs Transfers: Which Tool Should You Use?</a></li>
  <li><a href="/bidding/advanced">Bidding Articles Hub</a></li>
</ul>
`.trim(),
};

async function getNextArticleNumber() {
  const snap = await db.collection("bidding").get();
  return (
    snap.docs.reduce((max, doc) => {
      const n = Number((doc.data() || {}).articleNumber || 0);
      return Number.isFinite(n) ? Math.max(max, n) : max;
    }, 0) + 1
  );
}

async function main() {
  const existing = await db
    .collection("bidding")
    .where("title", "==", TITLE)
    .limit(1)
    .get();

  const summaryRef = existing.empty ? db.collection("bidding").doc() : existing.docs[0].ref;
  const existingBodyId = existing.empty ? null : (existing.docs[0].data() || {}).body;
  const bodyRef = existingBodyId
    ? db.collection("biddingBody").doc(existingBodyId)
    : db.collection("biddingBody").doc();

  const now = FieldValue.serverTimestamp();
  const articleNumber = existing.empty
    ? String(await getNextArticleNumber())
    : String((existing.docs[0].data() || {}).articleNumber || "");

  await summaryRef.set(
    {
      id: summaryRef.id,
      title: payload.title,
      teaser: payload.teaser,
      metaDescription: payload.metaDescription,
      primaryKeyword: payload.primaryKeyword,
      category: payload.category,
      subcategory: payload.subcategory,
      seoSubtopic: payload.seoSubtopic,
      ctaTarget: payload.ctaTarget,
      relatedLinks: payload.relatedLinks,
      articleType: payload.articleType,
      difficulty: payload.difficulty,
      articleNumber,
      body: bodyRef.id,
      isFree: payload.isFree,
      freeUpdatedAt: now,
      updatedAt: now,
      ...(existing.empty ? { createdAt: now } : {}),
    },
    { merge: true }
  );

  await bodyRef.set(
    {
      id: bodyRef.id,
      text: payload.bodyHtml,
      body: { text: payload.bodyHtml },
      updatedAt: now,
    },
    { merge: true }
  );

  console.log(`Published: ${summaryRef.id}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
