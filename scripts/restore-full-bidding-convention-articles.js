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
    teaser:
      "Stayman is one of the most useful bidding tools. Use 2C after partner opens 1NT to check for a 4-card major fit.",
    metaDescription:
      "Learn Stayman in bridge bidding. Find 4-4 major fits after 1NT and avoid missing better major-suit contracts.",
    primaryKeyword: "stayman convention find 4-4 major fit after 1nt",
    bodyHtml: `
<h2>Stayman Convention: Find a 4-4 Major Fit After 1NT</h2>
<p>Stayman is a simple convention with a huge payoff.</p>
<p>At the top level, most pairs are using simple Stayman, not extended Stayman. Without going into a long debate about advantages, simple Stayman is a great practical starting point.</p>

<p>After partner opens 1NT, you often want to know: do we have a 4-4 fit in hearts or spades?</p>
<p><strong>Pro tip:</strong> it is almost always a good idea to find a major fit if you have one.</p>
<p>That is exactly what Stayman does.</p>

<h3>How Stayman works</h3>
<p>After 1NT from partner:</p>
<ul>
  <li>2C = Stayman (artificial, asks for a 4-card major)</li>
</ul>
<p>Common opener replies:</p>
<ul>
  <li>2D = no 4-card major</li>
  <li>2H = has 4 hearts (may also have 4 spades)</li>
  <li>2S = has 4 spades (typically denies 4 hearts in basic methods)</li>
</ul>

<h3>Why this is useful</h3>
<p>If you have an 8-card major fit, a major contract is often better than no-trump. Stayman helps you find that fit quickly before you commit the contract.</p>

<h3>Simple use case</h3>
<p>Partner opens 1NT.<br/>You hold:<br/>S: QJ84<br/>H: K73<br/>D: 94<br/>C: A1096</p>
<p>You have a 4-card major and enough values to care about game direction. Start with 2C Stayman and learn more before deciding.</p>

<Callout type="rule">
  <p>Stayman is a fit-finding tool, not a random bid.</p>
  <p>Use it to uncover 4-4 major fits after 1NT and improve contract accuracy.</p>
</Callout>

<h3>Final takeaway</h3>
<p>Use Stayman with purpose. If you have a 4-card major and want to check for a fit, 2C gives your side a clear, practical route.</p>

<h3>Where to next</h3>
<ul>
  <li><a href="/bidding/advanced/7EOLfZHFMk8uvW3f2l8L">Transfers: Let Opener Declare the Major</a></li>
  <li><a href="/bidding/advanced/q8Aw4XZIKKKV9RhHhPQ9">Stayman vs Transfers: Which Tool Should You Use?</a></li>
  <li><a href="/bidding/advanced">Bidding Articles Hub</a></li>
</ul>
`.trim(),
  },
  {
    title: "Transfers: Let Opener Declare the Major",
    teaser:
      "Transfers help responder show major-suit length after 1NT while keeping opener as declarer. It also saves space.",
    metaDescription:
      "Learn transfers after 1NT. Show 5-card majors clearly and let opener declare to protect strong notrump values.",
    primaryKeyword: "transfers let opener declare the major",
    bodyHtml: `
<h2>Transfers: Let Opener Declare the Major</h2>
<p>Transfers are a core 1NT convention. They make major-suit auctions cleaner and often protect your strong hand.</p>

<h3>How transfers work</h3>
<p>After partner opens 1NT:</p>
<ul>
  <li>2D = transfer to hearts</li>
  <li>2H = transfer to spades</li>
</ul>
<p>Opener accepts the transfer:</p>
<ul>
  <li>1NT - 2D - 2H</li>
  <li>1NT - 2H - 2S</li>
</ul>

<h3>Key idea</h3>
<p>Responder uses an artificial bid first, then opener declares the major if that becomes the final contract. That keeps opener's stronger NT hand hidden from the opening lead.</p>
<p>It also allows more efficient auctions: first we transfer, then we continue to describe our hand.</p>

<h3>When to use transfers</h3>
<p>Use transfers when you hold 5+ cards in a major and want to show it. This applies to weak, invitational, and stronger hands; strength is shown later by continuation.</p>

<h3>Example</h3>
<p>Partner opens 1NT.<br/>You hold:<br/>S: KJ984<br/>H: 74<br/>D: Q83<br/>C: 1062</p>
<p>Bid 2H (transfer to spades), then decide whether to pass, invite, or push based on values.</p>

<Callout type="rule">
  <p><strong>Important note:</strong> opener always accepts the transfer in standard methods.</p>
  <p>Responder may bid on. Opener accepting the transfer does not mean it is automatically the final contract.</p>
</Callout>

<h3>Common mistakes</h3>
<ul>
  <li>Forgetting opener must accept transfer in standard methods</li>
  <li>Treating transfer bids as strength-showing by themselves (they show suit length, not strength)</li>
</ul>

<h3>Final takeaway</h3>
<p>Transfers are about efficient hand description and better contract placement. Use them to show 5-card majors and keep opener declarer whenever practical.</p>

<h3>Where to next</h3>
<ul>
  <li><a href="/bidding/advanced/uryhI78pcS2v6yBKNTyG">Stayman Convention: Find a 4-4 Major Fit After 1NT</a></li>
  <li><a href="/bidding/advanced/q8Aw4XZIKKKV9RhHhPQ9">Stayman vs Transfers: Which Tool Should You Use?</a></li>
  <li><a href="/bidding/advanced">Bidding Articles Hub</a></li>
</ul>
`.trim(),
  },
  {
    title: "Stayman vs Transfers: Which Tool Should You Use?",
    teaser:
      "After 1NT, should responder use Stayman or transfer? Use this simple decision framework.",
    metaDescription:
      "Learn when to use Stayman vs transfers after 1NT. Make better responder choices and find the right strain faster.",
    primaryKeyword: "stayman vs transfers which tool should you use",
    bodyHtml: `
<h2>Stayman vs Transfers: Which Tool Should You Use?</h2>
<p>A common 1NT question is: do I start with Stayman, or do I transfer?</p>

<h3>Simple decision rule</h3>
<ul>
  <li>Have a 5+ card major? Usually start with transfer.</li>
  <li>Have a 4-card major (and no 5-card major to show first)? Stayman is often right.</li>
  <li>Have both 4-card majors? Stayman is often right to explore a 4-4 fit.</li>
  <li>Have no 4-card or longer major? Often just choose your NT level directly.</li>
</ul>

<h3>Why this works</h3>
<p>Transfers show 5+ cards in a major. Stayman checks for 4-card major fits.</p>
<p>Thinking of them as competitors causes confusion. They solve different hand-description problems.</p>

<h3>Practical examples</h3>
<p>A) 5 spades, no 4 hearts: use transfer to spades first.</p>
<p>B) 4 hearts, 4 spades, game values: use Stayman first.</p>
<p>C) Balanced hand, no major length: often no Stayman/transfer needed; choose NT level.</p>

<h3>Common mistakes</h3>
<ul>
  <li>Using Stayman with a clear 5-card major transfer hand</li>
  <li>Ignoring 4-4 fit chances by skipping Stayman</li>
  <li>Overcomplicating it: one tool shows 5+ cards, the other checks 4-4 fits</li>
</ul>

<Callout type="example">
  <p>We will look in a future article at how strong you usually need to be for Stayman.</p>
  <p>In many standard methods it is often invitational-or-better (around 9+), but some partnerships also play weak Stayman treatments.</p>
</Callout>

<h3>Final takeaway</h3>
<p>Choose the tool based on your major-suit structure: transfers for 5+ majors, Stayman for 4-card fit exploration. Clear tool choice leads to cleaner auctions.</p>

<h3>Where to next</h3>
<ul>
  <li><a href="/bidding/advanced/C4jrUVt0dNiSvlieHCqE">Puppet Stayman: How to Check for 5-Card Majors</a></li>
  <li><a href="/bidding/advanced/10IETg6h06Ox4Ne6oG1E">Texas Transfers: Transfer Directly to Game</a></li>
  <li><a href="/bidding/advanced">Bidding Articles Hub</a></li>
</ul>
`.trim(),
  },
  {
    title: "Puppet Stayman: How to Check for 5-Card Majors",
    teaser:
      "Puppet Stayman extends fit-finding after strong NT openings by checking for 5-card majors in opener’s hand.",
    metaDescription:
      "Learn Puppet Stayman in bridge bidding. Discover how it differs from basic Stayman and when to use it after strong NT ranges.",
    primaryKeyword: "puppet stayman how to check for 5-card majors",
    bodyHtml: `
<h2>Puppet Stayman: How to Check for 5-Card Majors</h2>
<p>Puppet Stayman is a more advanced extension of Stayman.</p>
<p>Its main job is to investigate whether the NT opener has a 5-card major. It can also help with 4-card major detail once opener denies five.</p>

<h3>Core idea</h3>
<p>Basic Stayman asks about 4-card majors. Puppet Stayman focuses more on opener's 5-card major possibility.</p>

<h3>Recommended sequence</h3>
<p>1NT - 2C = normal Stayman</p>
<p>1NT - 3C = Puppet Stayman</p>
<p>After a 2NT opening, many partnerships also play Puppet Stayman. Others stay with simple methods. Both approaches can work if partnership agreements are clear.</p>

<h3>Why players use it</h3>
<p>Sometimes opener has a 5-card major and responder wants to find out before choosing strain.</p>

<Callout type="mistake">
  <p>This is a convention where system memory matters.</p>
  <p>If agreements are fuzzy, mistakes multiply quickly. If you are not confident, simple Stayman is still a very effective tool.</p>
</Callout>

<h3>A practical structure</h3>
<p>1NT - 3C asks opener about a 5-card major.</p>
<p>If opener has a 5-card major, they show it directly. If not, many partnerships use 3D to deny a 5-card major, then continue to sort out 4-card major detail.</p>
<p>Exact continuations vary by partnership style. Write them down and keep them consistent.</p>

<h3>Common mistakes</h3>
<ul>
  <li>Treating Puppet Stayman like normal Stayman</li>
  <li>Mixing response structures from different systems</li>
  <li>Playing it without written partnership notes</li>
</ul>

<h3>Final takeaway</h3>
<p>Puppet Stayman is useful but not essential. You can do very well without it. Add it once your basic Stayman and transfer foundation is solid.</p>

<h3>Where to next</h3>
<ul>
  <li><a href="/bidding/advanced/10IETg6h06Ox4Ne6oG1E">Texas Transfers: Transfer Directly to Game</a></li>
  <li><a href="/bidding/advanced/GlSFN2vWrC4FBg00jRsQ">Smolen Convention: Show 5-4 Majors After Stayman</a></li>
  <li><a href="/bidding/advanced">Bidding Articles Hub</a></li>
</ul>
`.trim(),
  },
  {
    title: "Texas Transfers: Transfer Directly to Game",
    teaser:
      "Texas transfers let responder transfer to a major at the 4-level after NT openings when game in that major is clear.",
    metaDescription:
      "Learn Texas transfers in bridge bidding. Understand when to transfer directly to 4H or 4S and simplify game-forcing major auctions.",
    primaryKeyword: "texas transfers transfer directly to game",
    bodyHtml: `
<h2>Texas Transfers: Transfer Directly to Game</h2>
<p>Texas transfers are designed for game-level major decisions after NT openings.</p>

<h3>Core concept</h3>
<p>After a NT opening, responder can transfer directly to game in a major. There are two common versions, so make sure you and partner are on the same page.</p>
<p><strong>Version 1</strong></p>
<ul>
  <li>4C = transfers to 4H</li>
  <li>4D = transfers to 4S</li>
</ul>
<p><strong>Version 2</strong></p>
<ul>
  <li>4D = transfer to 4H</li>
  <li>4H = transfer to 4S</li>
</ul>

<h3>Why use Texas</h3>
<p>When major-suit game is already clear, Texas can simplify the auction, get to 4M quickly, and reduce room for opponents to enter cheaply.</p>

<h3>When Texas is usually right</h3>
<ul>
  <li>You already know you want game in a major</li>
  <li>You do not need low-level investigation first</li>
  <li>Responder has 6+ cards in the target major</li>
</ul>

<h3>Common mistakes</h3>
<ul>
  <li>Using Texas too early when more information is still needed</li>
  <li>Forgetting follow-up partnership agreements for slam exploration</li>
  <li>Confusing Texas with lower-level transfers</li>
</ul>

<h3>Final takeaway</h3>
<p>Texas transfers are about fast, clear commitment to major-suit game when the destination is already known.</p>

<h3>Where to next</h3>
<ul>
  <li><a href="/bidding/advanced/7EOLfZHFMk8uvW3f2l8L">Transfers: Let Opener Declare the Major</a></li>
  <li><a href="/bidding/advanced/GlSFN2vWrC4FBg00jRsQ">Smolen Convention: Show 5-4 Majors After Stayman</a></li>
  <li><a href="/bidding/advanced">Bidding Articles Hub</a></li>
</ul>
`.trim(),
  },
  {
    title: "Smolen Convention: Show 5-4 Majors After Stayman",
    teaser:
      "Smolen helps responder show 5-4 major patterns after Stayman when opener denies a 4-card major.",
    metaDescription:
      "Learn the Smolen convention in bridge. Show 5-4 major hands efficiently after 1NT and Stayman responses.",
    primaryKeyword: "smolen convention show 5-4 majors after stayman",
    bodyHtml: `
<h2>Smolen Convention: Show 5-4 Majors After Stayman</h2>
<p>Smolen is used after a Stayman start.</p>
<p>It solves a specific problem: responder has 5-4 in the majors and wants to show it efficiently while often keeping opener declarer.</p>

<h3>Typical setup</h3>
<p>Partner opens 1NT and responder holds 5-4 in the majors with enough strength to keep going.</p>
<p>Start with Stayman. If opener shows a major, great — you have found a fit. If opener replies 2D (no 4-card major shown), Smolen becomes relevant.</p>

<h3>Core Smolen action</h3>
<p>After 1NT - 2C - 2D, responder jumps in the major they <strong>do not</strong> have five cards in, to show the other 5-card major.</p>
<p>Example:</p>
<p>1NT - 2C<br/>2D - 3S</p>
<p>That jump to 3S typically shows 5 hearts and 4 spades.</p>

<Callout type="checklist">
  <p>This is the key memory point:</p>
  <ul>
    <li>Smolen jump = shows the other major as the 5-card suit</li>
    <li>Partnership agreement must be explicit</li>
    <li>Write follow-ups down before using it in live sessions</li>
  </ul>
</Callout>

<h3>Common mistakes</h3>
<ul>
  <li>Using Smolen without confirming partnership version</li>
  <li>Confusing Smolen jumps with natural jump bids</li>
  <li>Forgetting opener's follow-up responsibilities after Smolen</li>
</ul>

<h3>Final takeaway</h3>
<p>Smolen is a precision tool for 5-4 major hands after Stayman. Once your basic 1NT toolkit is stable, Smolen can improve accuracy significantly.</p>

<h3>Where to next</h3>
<ul>
  <li><a href="/bidding/advanced/uryhI78pcS2v6yBKNTyG">Stayman Convention: Find a 4-4 Major Fit After 1NT</a></li>
  <li><a href="/bidding/advanced/C4jrUVt0dNiSvlieHCqE">Puppet Stayman: How to Check for 5-Card Majors</a></li>
  <li><a href="/bidding/advanced">Bidding Articles Hub</a></li>
</ul>
`.trim(),
  },
];

async function getSummaryByTitle(title) {
  const snap = await db.collection("bidding").where("title", "==", title).limit(1).get();
  if (snap.empty) return null;
  return snap.docs[0];
}

async function main() {
  for (const article of articles) {
    const summaryDoc = await getSummaryByTitle(article.title);
    if (!summaryDoc) {
      console.log(`SKIP (not found): ${article.title}`);
      continue;
    }
    const summaryRef = summaryDoc.ref;
    const summaryData = summaryDoc.data() || {};
    const bodyId = summaryData.body;
    if (!bodyId) {
      console.log(`SKIP (missing body id): ${article.title}`);
      continue;
    }

    await summaryRef.set(
      {
        teaser: article.teaser,
        metaDescription: article.metaDescription,
        primaryKeyword: article.primaryKeyword,
        seoSubtopic: "Conventions and Artificial Methods",
        category: "Bidding",
        subcategory: "Conventions and Artificial Methods",
        ctaTarget: HUB_PATH,
        relatedLinks: `${HUB_PATH}/7EOLfZHFMk8uvW3f2l8L\n${HUB_PATH}/uryhI78pcS2v6yBKNTyG\n${HUB_PATH}`,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await db.collection("biddingBody").doc(bodyId).set(
      {
        text: article.bodyHtml,
        body: { text: article.bodyHtml },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    console.log(`Updated full article: ${article.title}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
