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
const ARTICLE_TITLE = "Lebensohl Convention: Compete Smart After Interference";

const article = {
  title: ARTICLE_TITLE,
  teaser:
    "Lebensohl is a practical convention for competitive auctions. Learn when 2NT shows the weak hand and how to compete safely at the three level.",
  metaDescription:
    "Learn the Lebensohl convention in bridge bidding. Use 2NT relay auctions after interference to compete accurately and show hand strength.",
  primaryKeyword: "lebensohl convention bridge bidding",
  category: "Bidding",
  subcategory: "Conventions and Artificial Methods",
  seoSubtopic: "Conventions and Artificial Methods",
  ctaTarget: HUB_PATH,
  relatedLinks: [
    "/bidding/advanced/uryhI78pcS2v6yBKNTyG",
    "/bidding/advanced/7EOLfZHFMk8uvW3f2l8L",
    "/bidding/advanced/q8Aw4XZIKKKV9RhHhPQ9",
    HUB_PATH,
  ].join("\n"),
  bodyHtml: `
<h2>Lebensohl Convention: Compete Smart After Interference</h2>
<p>Lebensohl is very popular for a reason: it helps you compete accurately when opponents interfere, without forcing partner too high.</p>
<p>The core memory aid is simple: in Lebensohl auctions, <strong>2NT usually shows the weaker hand</strong>. Think of 2NT as a practical stop sign.</p>

<h3>Why Lebensohl matters</h3>
<p>Partscore battles are one of the most important parts of bridge bidding. Letting opponents play comfortably on the two level in a fit is usually a bad result for your side.</p>
<p>Lebensohl helps you compete with shape and suit quality while still separating weak hands from decent hands.</p>

<h3>Situation 1: After partner opens or overcalls 1NT and they compete on the two level</h3>
<p>Typical pattern:</p>
<p>1H - 1NT - 2H - ?</p>
<p>With a weak hand and a suit you want to compete in, bid <strong>2NT</strong>. Partner then bids <strong>3C</strong>, and you either pass 3C or correct to your suit at the three level.</p>
<p>Example flow:</p>
<p>1H - 1NT - 2H - 2NT - P - 3C - P - 3D</p>
<p>This lets you compete in 3D without forcing partner to guess at a higher level too early.</p>

<h3>Situation 2: After a weak two opening and partner doubles</h3>
<p>Typical pattern:</p>
<p>2H - X - P - ?</p>
<p>Here, Lebensohl helps separate hand strength clearly:</p>
<ul>
  <li>2NT = weak hand (often around 0-7), not interested in game</li>
  <li>Direct 3-level bid = decent values (often around 8-11), constructive but not forcing</li>
  <li>Game values = bid game directly or cue-bid when needed</li>
</ul>
<p>That structure gives doubler a much clearer picture and reduces random guesses.</p>

<h3>Do not overuse Lebensohl</h3>
<p>Having Lebensohl available does not mean every hand should start with 2NT.</p>
<p>Sometimes a direct takeout double is still best, especially when competing for partscore with useful shape. And sometimes pass is right, for example when you hold length in the opponent's suit and defending may be your best result.</p>

<h3>Quick recap</h3>
<ul>
  <li>Lebensohl is mainly about handling interference with better structure.</li>
  <li>In the key auctions, 2NT is the weak-hand route.</li>
  <li>Direct actions show more values and keep partnership communication clear.</li>
  <li>Use judgment: compete hard when shape says compete, but defend when the auction tells you to defend.</li>
</ul>

<h3>Final takeaway</h3>
<p>Lebensohl is not about fancy bidding. It is a practical partnership tool for accurate partscore decisions and cleaner competitive auctions.</p>
<p>If you remember one line, remember this: 2NT is usually the weak-hand stop sign, and direct bids show more.</p>

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
  const snapshot = await db.collection("bidding").get();
  const max = snapshot.docs.reduce((acc, doc) => {
    const n = Number((doc.data() || {}).articleNumber || 0);
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);
  return max + 1;
}

async function main() {
  const existing = await db
    .collection("bidding")
    .where("title", "==", ARTICLE_TITLE)
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

  const summaryPayload = {
    id: summaryRef.id,
    articleType: "bidding",
    difficulty: "4",
    articleNumber,
    title: article.title,
    category: article.category,
    subcategory: article.subcategory,
    teaser: article.teaser,
    metaDescription: article.metaDescription,
    primaryKeyword: article.primaryKeyword,
    seoSubtopic: article.seoSubtopic,
    relatedLinks: article.relatedLinks,
    ctaTarget: article.ctaTarget,
    body: bodyRef.id,
    isFree: true,
    freeUpdatedAt: now,
    updatedAt: now,
  };
  if (existing.empty) summaryPayload.createdAt = now;

  await summaryRef.set(summaryPayload, { merge: true });
  await bodyRef.set(
    {
      id: bodyRef.id,
      text: article.bodyHtml,
      body: { text: article.bodyHtml },
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
