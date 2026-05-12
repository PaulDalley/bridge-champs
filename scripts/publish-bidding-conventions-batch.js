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

const articles = [
  {
    title: "Stayman Convention: Find a 4-4 Major Fit After 1NT",
    teaser: "Stayman is one of the most useful bidding tools. Use 2C after partner opens 1NT to check for a 4-card major fit.",
    metaDescription: "Learn Stayman in bridge bidding. Find 4-4 major fits after 1NT and avoid missing better major-suit contracts.",
    primaryKeyword: "stayman convention 1nt 4-4 major fit",
    bodyHtml: `
<h2>Stayman Convention: Find a 4-4 Major Fit After 1NT</h2>
<p>Stayman is a simple convention with a huge payoff.</p>
<p>After partner opens 1NT, you often want to know: do we have a 4-4 fit in hearts or spades? That is exactly what Stayman does.</p>
<h3>How Stayman works</h3>
<ul>
  <li>2C = Stayman (artificial, asks for a 4-card major)</li>
  <li>2D = no 4-card major</li>
  <li>2H = has 4 hearts (may also have 4 spades)</li>
  <li>2S = has 4 spades (typically denies 4 hearts in basic methods)</li>
</ul>
<h3>Simple use case</h3>
<p>Partner opens 1NT. You hold S: QJ84, H: K73, D: 94, C: A1096.</p>
<p>You have a 4-card major and enough values to care about game direction. Start with 2C Stayman and learn more before deciding.</p>
<h3>Final takeaway</h3>
<p>Stayman is a fit-finding tool, not a random bid. Use it to uncover 4-4 major fits after 1NT and improve contract accuracy.</p>
`.trim(),
  },
  {
    title: "Transfers: Let Opener Declare the Major",
    teaser: "Transfers help responder show major-suit length after 1NT while keeping opener as declarer. It also saves space.",
    metaDescription: "Learn transfers after 1NT. Show 5-card majors clearly and let opener declare to protect strong notrump values.",
    primaryKeyword: "transfers after 1nt major suit",
    bodyHtml: `
<h2>Transfers: Let Opener Declare the Major</h2>
<p>Transfers are a core 1NT convention. They make major-suit auctions cleaner and often protect your strong hand.</p>
<h3>How transfers work</h3>
<ul>
  <li>2D = transfer to hearts</li>
  <li>2H = transfer to spades</li>
  <li>1NT - 2D - 2H</li>
  <li>1NT - 2H - 2S</li>
</ul>
<p>Use transfers when you hold 5+ cards in a major and want to show it. Strength is shown later by continuation.</p>
<p><strong>Important note:</strong> opener always accepts the transfer in standard methods.</p>
<h3>Final takeaway</h3>
<p>Transfers are about efficient hand description and better contract placement. Use them to show 5-card majors and keep opener declarer whenever practical.</p>
`.trim(),
  },
  {
    title: "Stayman vs Transfers: Which Tool Should You Use?",
    teaser: "After 1NT, should responder use Stayman or transfer? Use this simple decision framework.",
    metaDescription: "Learn when to use Stayman vs transfers after 1NT. Make better responder choices and find the right strain faster.",
    primaryKeyword: "stayman vs transfers after 1nt",
    bodyHtml: `
<h2>Stayman vs Transfers: Which Tool Should You Use?</h2>
<ul>
  <li>Have a 5+ card major? Usually start with transfer.</li>
  <li>Have a 4-card major and no 5-card major to show first? Stayman is often right.</li>
  <li>Have both 4-card majors? Stayman is often right to explore 4-4 fit.</li>
  <li>Have no 4-card or longer major? Often choose your NT level directly.</li>
</ul>
<p>Transfers show 5+ cards in a major. Stayman checks 4-card major fits. They solve different problems.</p>
<p>In many methods, Stayman is often used with invitational-or-better values, but some systems include weak Stayman. We will cover weak Stayman in a future article.</p>
<h3>Final takeaway</h3>
<p>Transfers for 5+ majors, Stayman for 4-card fit exploration. Clear tool choice leads to cleaner auctions.</p>
`.trim(),
  },
  {
    title: "Puppet Stayman: How to Check for 5-Card Majors",
    teaser: "Puppet Stayman extends fit-finding after strong NT openings by checking for 5-card majors in opener’s hand.",
    metaDescription: "Learn Puppet Stayman in bridge bidding. Discover how it differs from basic Stayman and when to use it after strong NT ranges.",
    primaryKeyword: "puppet stayman 5 card majors",
    bodyHtml: `
<h2>Puppet Stayman: How to Check for 5-Card Majors</h2>
<p>Puppet Stayman is a more advanced extension of Stayman. It focuses on opener's 5-card major possibility and can also uncover 4-card fits.</p>
<ul>
  <li>1NT - 2C: normal Stayman</li>
  <li>1NT - 3C: Puppet Stayman</li>
</ul>
<p>Use Puppet only when both players know the exact responses and continuations.</p>
<h3>Final takeaway</h3>
<p>Puppet Stayman is useful but not essential. Use it once your basic Stayman and transfer foundation is solid.</p>
`.trim(),
  },
  {
    title: "Texas Transfers: Transfer Directly to Game",
    teaser: "Texas transfers let responder transfer to a major at the 4-level after NT openings when game in that major is clear.",
    metaDescription: "Learn Texas transfers in bridge bidding. Understand when to transfer directly to 4H or 4S and simplify game-forcing major auctions.",
    primaryKeyword: "texas transfers after notrump opening",
    bodyHtml: `
<h2>Texas Transfers: Transfer Directly to Game</h2>
<p>Texas transfers are designed for game-level major decisions after NT openings.</p>
<ul>
  <li>Version 1: 4C = transfer to hearts, 4D = transfer to spades</li>
  <li>Version 2: 4D = transfer to hearts, 4H = transfer to spades</li>
</ul>
<p>Agree your version with partner and stay consistent.</p>
<p>Use Texas when game in a major is already clear and responder has 6+ cards in that major.</p>
<h3>Final takeaway</h3>
<p>Texas transfers are about fast, clear commitment to major-suit game when the destination is already known.</p>
`.trim(),
  },
  {
    title: "Smolen Convention: Show 5-4 Majors After Stayman",
    teaser: "Smolen helps responder show 5-4 major patterns after Stayman when opener denies a 4-card major.",
    metaDescription: "Learn the Smolen convention in bridge. Show 5-4 major hands efficiently after 1NT and Stayman responses.",
    primaryKeyword: "smolen convention 5-4 majors",
    bodyHtml: `
<h2>Smolen Convention: Show 5-4 Majors After Stayman</h2>
<p>Smolen is used after a Stayman start. It solves a specific problem: responder has 5-4 in the majors and wants to show it efficiently.</p>
<p>Typical setup:</p>
<ul>
  <li>1NT - 2C (Stayman)</li>
  <li>2D (opener denies a 4-card major)</li>
  <li>Responder jumps in the major they do not have five cards in, to show the other 5-card major</li>
</ul>
<p>If agreements are unclear, this convention causes expensive misunderstandings.</p>
<h3>Final takeaway</h3>
<p>Smolen is a precision tool for 5-4 major hands after Stayman. Add it once your basic 1NT toolkit is stable.</p>
`.trim(),
  },
];

const navByTitle = {
  "Stayman Convention: Find a 4-4 Major Fit After 1NT": [
    "Transfers: Let Opener Declare the Major",
    "Stayman vs Transfers: Which Tool Should You Use?",
  ],
  "Transfers: Let Opener Declare the Major": [
    "Stayman Convention: Find a 4-4 Major Fit After 1NT",
    "Stayman vs Transfers: Which Tool Should You Use?",
  ],
  "Stayman vs Transfers: Which Tool Should You Use?": [
    "Puppet Stayman: How to Check for 5-Card Majors",
    "Texas Transfers: Transfer Directly to Game",
  ],
  "Puppet Stayman: How to Check for 5-Card Majors": [
    "Texas Transfers: Transfer Directly to Game",
    "Smolen Convention: Show 5-4 Majors After Stayman",
  ],
  "Texas Transfers: Transfer Directly to Game": [
    "Transfers: Let Opener Declare the Major",
    "Smolen Convention: Show 5-4 Majors After Stayman",
  ],
  "Smolen Convention: Show 5-4 Majors After Stayman": [
    "Stayman Convention: Find a 4-4 Major Fit After 1NT",
    "Puppet Stayman: How to Check for 5-Card Majors",
  ],
};

const stripTrailingNavigationSection = (html) =>
  String(html || "").replace(
    /<h3>\s*Where to next\s*<\/h3>[\s\S]*$/i,
    ""
  ).trim();

const buildWhereToNextHtml = (articleTitle, titleToPath) => {
  const [nextA, nextB] = navByTitle[articleTitle] || [];
  const linkA = titleToPath[nextA] || HUB_PATH;
  const linkB = titleToPath[nextB] || HUB_PATH;
  return `
<h3>Where to next</h3>
<ul>
  <li><a href="${linkA}">${nextA || "Bidding Article"}</a></li>
  <li><a href="${linkB}">${nextB || "Bidding Article"}</a></li>
  <li><a href="${HUB_PATH}">Bidding Articles Hub</a></li>
</ul>
`.trim();
};

async function upsertSummary(article, articleNumber) {
  const existing = await db
    .collection("bidding")
    .where("title", "==", article.title)
    .limit(1)
    .get();
  const ref = existing.empty ? db.collection("bidding").doc() : existing.docs[0].ref;
  const bodyRef = existing.empty
    ? db.collection("biddingBody").doc()
    : db.collection("biddingBody").doc((existing.docs[0].data() || {}).body || db.collection("biddingBody").doc().id);
  const now = FieldValue.serverTimestamp();
  const summary = {
    id: ref.id,
    title: article.title,
    category: "Bidding",
    subcategory: "Conventions and Artificial Methods",
    articleType: "bidding",
    difficulty: "4",
    articleNumber: String(articleNumber),
    teaser: article.teaser,
    metaDescription: article.metaDescription,
    primaryKeyword: article.primaryKeyword,
    seoSubtopic: "Conventions and Artificial Methods",
    relatedLinks: HUB_PATH,
    ctaTarget: HUB_PATH,
    isFree: true,
    freeUpdatedAt: now,
    updatedAt: now,
    body: bodyRef.id,
  };
  if (existing.empty) summary.createdAt = now;
  await ref.set(summary, { merge: true });
  await bodyRef.set(
    {
      id: bodyRef.id,
      text: article.bodyHtml,
      body: { text: article.bodyHtml },
      updatedAt: now,
    },
    { merge: true }
  );
  return { summaryId: ref.id, bodyId: bodyRef.id };
}

async function main() {
  const biddingSnapshot = await db.collection("bidding").get();
  const maxArticleNumber = biddingSnapshot.docs.reduce((max, doc) => {
    const n = Number((doc.data() || {}).articleNumber || 0);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);
  const titleToIds = {};
  for (let i = 0; i < articles.length; i += 1) {
    const article = articles[i];
    const ids = await upsertSummary(article, maxArticleNumber + i + 1);
    titleToIds[article.title] = ids;
    console.log(`Upserted: ${article.title} -> ${ids.summaryId}`);
  }

  const titleToPath = Object.fromEntries(
    Object.entries(titleToIds).map(([t, ids]) => [t, `${HUB_PATH}/${ids.summaryId}`])
  );

  for (const article of articles) {
    const ids = titleToIds[article.title];
    const whereToNext = buildWhereToNextHtml(article.title, titleToPath);
    const fullHtml = `${stripTrailingNavigationSection(article.bodyHtml)}\n\n${whereToNext}`;
    const [nextA, nextB] = navByTitle[article.title] || [];
    const relatedLinks = [titleToPath[nextA], titleToPath[nextB], HUB_PATH].filter(Boolean).join("\n");

    await db.collection("bidding").doc(ids.summaryId).set(
      {
        relatedLinks,
        ctaTarget: HUB_PATH,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    await db.collection("biddingBody").doc(ids.bodyId).set(
      {
        text: fullHtml,
        body: { text: fullHtml },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    console.log(`Linked + nav updated: ${article.title}`);
  }

  console.log("Done. Published 6 bidding convention articles.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
