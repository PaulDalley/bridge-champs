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

const articles = [
  {
    title: "Stayman Convention: Find a 4-4 Major Fit After 1NT",
    teaser:
      "Stayman is one of the most useful bidding tools. Use 2C after partner opens 1NT to check for a 4-card major fit.",
    metaDescription:
      "Learn Stayman in bridge bidding. Find 4-4 major fits after 1NT and avoid missing better major-suit contracts.",
    bodyHtml: `
<h2>Stayman Convention: Find a 4-4 Major Fit After 1NT</h2>
<p>Stayman is a simple convention with a huge payoff.</p>
<p>Before we start - At the top level, most pairs are using simple stayman, not extended stayman. Without going into a long debate about the advantages, I recommend just using simple stayman.</p>

<Callout type="example">
  <p>After partner opens 1NT, you often want to know: do we have a 4-4 fit in hearts or spades?</p>
  <p><strong>Pro tip:</strong> It's almost always a good idea to find a major fit if you have one.</p>
</Callout>

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
<p>If you have an 8-card major fit, a major contract is often better than NT. Stayman helps you find that fit quickly before you commit the contract.</p>

<h3>Simple use case</h3>
<p>Partner opens 1NT.</p>
<p>You hold:<br/>S: QJ84<br/>H: K73<br/>D: 94<br/>C: A1096</p>
<p>You have a 4-card major and enough values to care about game direction. Start with 2C Stayman and learn more before deciding.</p>

<Callout type="rule">
  <p>Stayman is a fit-finding tool, not a random bid.</p>
  <p>Use it to uncover 4-4 major fits after 1NT and improve contract accuracy.</p>
  <p>Don't use it for fun, only use it if you have a 4 card major.</p>
</Callout>

<h3>Where to next</h3>
<ul>
  <li><a href="${HUB}/7EOLfZHFMk8uvW3f2l8L">Transfers: Let Opener Declare the Major</a></li>
  <li><a href="${HUB}/q8Aw4XZIKKKV9RhHhPQ9">Stayman vs Transfers: Which Tool Should You Use?</a></li>
  <li><a href="${HUB}">Bidding Articles Hub</a></li>
</ul>
`.trim(),
  },
  {
    title: "Transfers: Let Opener Declare the Major",
    teaser:
      " transfers help responder show major-suit length after 1NT while keeping opener as declarer. It also saves \"space\".",
    metaDescription:
      "Learn  transfers after 1NT. Show 5-card majors clearly and let opener declare to protect strong notrump values.",
    bodyHtml: `
<h2>Transfers: Let Opener Declare the Major</h2>
<p>transfers are a core 1NT convention. They make major-suit auctions cleaner and often protect your strong hand.</p>

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
<p>Responder uses an artificial bid first, then opener declares the major if that becomes the final contract. That keeps opener’s stronger NT hand hidden from the opening lead.</p>
<p>Also, it allows for more efficient auctions - first we transfer, then we continue to describe our hand.</p>

<h3>When to use transfers</h3>
<p>Use transfers when you hold 5+ cards in a major and want to show it. This applies to weak, invitational, and stronger hands; strength is shown later by continuation.</p>

<h3>Example</h3>
<p>Partner opens 1NT.</p>
<p>You hold:<br/>S: KJ984<br/>H: 74<br/>D: Q83<br/>C: 1062</p>
<p>Bid 2H (transfer to spades), then decide whether to pass, invite, or push based on values.</p>

<Callout type="checklist">
  <p><strong>IMPORTANT NOTE:</strong> Opener always "accepts" the transfer.</p>
  <p>Responder may bid on. Just becuase opener accepts the transfer, it does not mean that it will be our final contract.</p>
  <p>Some systems have super accepts, but we will look at that in another article.</p>
</Callout>

<h3>Common mistakes</h3>
<ul>
  <li>Forgetting opener must accept transfer in standard methods</li>
  <li>Treating transfer bids as strength-showing by themselves (they just show 5+ cards in that suit, can have 0 points)</li>
</ul>

<Callout type="rule">
  <p>Transfers are about efficient hand description and better contract placement.</p>
  <p>Use them to show 5-card majors and keep opener declarer whenever practical.</p>
</Callout>

<h3>Where to next</h3>
<ul>
  <li><a href="${HUB}/uryhI78pcS2v6yBKNTyG">Stayman Convention: Find a 4-4 Major Fit After 1NT</a></li>
  <li><a href="${HUB}/q8Aw4XZIKKKV9RhHhPQ9">Stayman vs Transfers: Which Tool Should You Use?</a></li>
  <li><a href="${HUB}">Bidding Articles Hub</a></li>
</ul>
`.trim(),
  },
  {
    title: "Stayman vs Transfers: Which Tool Should You Use?",
    teaser:
      "After 1NT, should responder use Stayman or transfer? Use this simple decision framework.",
    metaDescription:
      "Learn when to use Stayman vs transfers after 1NT. Make better responder choices and find the right strain faster.",
    bodyHtml: `
<h2>Stayman vs Transfers: Which Tool Should You Use?</h2>
<p>A common 1NT question is: Do I start with Stayman, or do I transfer?</p>

<h3>Simple decision rule</h3>
<ul>
  <li>Have a 5+ card major? Usually start with transfer.</li>
  <li>Have a 4-card major (and no 5-card major to show first)? Stayman is often right.</li>
  <li>Have both 4-card majors? Stayman is often right to explore 4-4 fit.</li>
  <li>Have no 4 card or longer major? Often just choose your NT level directly.</li>
</ul>

<h3>Why this works</h3>
<p>Transfers always show 5+ cards in that major, its just a fact of bridge. Stayman is best for checking 4-card major fits.</p>
<p>Thinking of them as competitors causes confusion. They solve different hand-description problems.</p>

<h3>Practical examples</h3>
<p>A) 5 spades, no 4 hearts: Use transfer to spades first.</p>
<p>B) 4 hearts, 4 spades, game values: Use Stayman first.</p>
<p>C) Balanced hand, no major length: Often no Stayman/transfer needed; choose NT level.</p>

<h3>Common mistakes</h3>
<ul>
  <li>Using Stayman with clear 5-card major transfer hand</li>
  <li>Ignoring 4-4 fit chances by skipping Stayman</li>
  <li>Overcomplicating: one tool shows 5+ cards in a suit, the other tool looks for 4-4 fits</li>
</ul>

<Callout type="example">
  <p>We will look in future articles at how strong you need to be to stayman.</p>
  <p>It is usually strong enough to invite so around 9+ points, but sometimes you can do it with a weak hand (see weak stayman article).</p>
</Callout>

<Callout type="rule">
  <p>Choose the tool based on your major-suit structure:</p>
  <p>Transfers for 5+ majors, Stayman for 4-card fit exploration.</p>
  <p>Clear tool choice leads to cleaner auctions.</p>
</Callout>

<h3>Where to next</h3>
<ul>
  <li><a href="${HUB}/C4jrUVt0dNiSvlieHCqE">Puppet Stayman: How to Check for 5-Card Majors</a></li>
  <li><a href="${HUB}/10IETg6h06Ox4Ne6oG1E">Texas Transfers: Transfer Directly to Game</a></li>
  <li><a href="${HUB}">Bidding Articles Hub</a></li>
</ul>
`.trim(),
  },
  {
    title: "Puppet Stayman: How to Check for 5-Card Majors",
    teaser:
      "Puppet Stayman extends fit-finding after strong NT openings by checking for 5-card majors in opener’s hand.",
    metaDescription:
      "Learn Puppet Stayman in bridge bidding. Discover how it differs from basic Stayman and when to use it after strong NT ranges.",
    bodyHtml: `
<h2>Puppet Stayman: How to Check for 5-Card Majors</h2>
<p>Puppet Stayman is a more advanced extension of Stayman.</p>
<p>Its main job is to investigate if the NT opener has 5-card major suits. It also has the power to ask about 4 card majors aswell. If that sounds confusing, it isn't, lets see.</p>

<h3>Core idea</h3>
<p>Basic Stayman asks about 4-card majors. Puppet Stayman focuses more on opener’s 5-card major possibility.</p>

<h3>Recommended sequence</h3>
<p>1NT - 2C is NORMAL stayman</p>
<p>1NT - 3C is PUPPET stayman</p>
<p>After 2NT opening, many partnerships play puppet stayman. It is up to you, many top partnerships also just play simple stayman, you don't need to complicate things to get good results - simple stayman has upsides and is an effective tool.</p>

<h3>Why players use it</h3>
<p>Sometimes opener has a 5-card major and responder would like to know about it.</p>

<Callout type="mistake">
  <p><strong>Practical warning:</strong> this is a convention where system memory matters.</p>
  <p>If partnership agreements are fuzzy, mistakes multiply fast. If you don't feel confident with this, stick to simple stayman - you wil be fine.</p>
  <p>Use Puppet Stayman only when both players know exact responses/continuations, you've practiced follow-ups, and you can execute under time pressure.</p>
</Callout>

<h3>Lets see how it works</h3>
<p>1NT - 3C: Responder has initiated puppet stayman - main question "do you have a 5 card major".</p>
<p>If the 1NT opener has a 5 card major they simply bid it. Great, thats the end of it.</p>
<p>However, if opener doesn't have a 5 card major, they bid 3D - I do not have a 5 card major.</p>
<p>After opener has denied a 5 card major, responder can now ask about 4 card majors. Responder will show which major she has 4 cards of by bidding the other major so opener can bid the actual major.</p>
<p>Example:<br/>1NT 3C<br/>3D 3H - 3H shows 4 spades (bidding the other major).</p>
<p>Another note auction:<br/>1NT 3C<br/>3D 3S - 3S shows 4 hearts.</p>

<h3>Common mistakes</h3>
<ul>
  <li>Treating Puppet Stayman like normal Stayman</li>
  <li>Mixing response structures from different systems</li>
  <li>Trying to play it without written partnership notes</li>
</ul>

<Callout type="rule">
  <p>Puppet Stayman is useful but definitely not essential. You can do fine without it.</p>
  <p>Use it to uncover deeper major-fit detail once your basic Stayman/transfer foundation is solid.</p>
</Callout>

<h3>Where to next</h3>
<ul>
  <li><a href="${HUB}/10IETg6h06Ox4Ne6oG1E">Texas Transfers: Transfer Directly to Game</a></li>
  <li><a href="${HUB}/GlSFN2vWrC4FBg00jRsQ">Smolen Convention: Show 5-4 Majors After Stayman</a></li>
  <li><a href="${HUB}">Bidding Articles Hub</a></li>
</ul>
`.trim(),
  },
  {
    title: "Texas Transfers: Transfer Directly to Game",
    teaser:
      "Texas transfers let responder transfer to a major at the 4-level after NT openings when game in that major is clear. Responder will have 6+ cards in that major (and NT opener will always have 2+, so you have a fit!)",
    metaDescription:
      "Learn Texas transfers in bridge bidding. Understand when to transfer directly to 4H/4S and simplify game-forcing major auctions.",
    bodyHtml: `
<h2>Texas Transfers: Transfer Directly to Game</h2>
<p>Texas transfers are designed for game-level major decisions after NT openings.</p>

<h3>Core concept</h3>
<p>After a NT opening, responder can transfer directly to game in a major. I've seen two different versions of this commonly used, once again make sure you and partner are on the same page:</p>

<h3>Version 1</h3>
<ul>
  <li>4C = transfers to 4H (two bids below 4H)</li>
  <li>4D = transfers to 4S (two bids below 4S)</li>
</ul>

<h3>Version 2</h3>
<ul>
  <li>4D = transfer to 4H (one bid below)</li>
  <li>4H = transfer to 4S (one bid below)</li>
</ul>
<p>(Exact system context should match your partnership notes.)</p>

<h3>Why use Texas</h3>
<p>When game in a major is already clear, Texas can simplify the auction, get to 4M quickly, and stop the opponents from bidding at lower levels.</p>

<h3>When Texas is usually right</h3>
<ul>
  <li>You know you want game in a major</li>
  <li>You do not need lower-level exploration first</li>
</ul>
<p>If you still need to investigate slam/shape details, another route may be better.</p>

<h3>Common mistakes</h3>
<ul>
  <li>Using Texas too early when more information is still needed</li>
  <li>Forgetting partnership agreements about follow-up slam tries</li>
  <li>Confusing Texas with Jacoby transfers at lower levels</li>
  <li>You must have 6+ cards in the major to use it</li>
</ul>

<Callout type="rule">
  <p>Texas transfers are about fast, clear commitment to major-suit game.</p>
  <p>Use them when the destination is already known and you want clean auction control.</p>
</Callout>

<h3>Where to next</h3>
<ul>
  <li><a href="${HUB}/7EOLfZHFMk8uvW3f2l8L">Transfers: Let Opener Declare the Major</a></li>
  <li><a href="${HUB}/GlSFN2vWrC4FBg00jRsQ">Smolen Convention: Show 5-4 Majors After Stayman</a></li>
  <li><a href="${HUB}">Bidding Articles Hub</a></li>
</ul>
`.trim(),
  },
  {
    title: "Smolen Convention: Show 5-4 Majors After Stayman",
    teaser:
      "Smolen helps responder show 5-4 major patterns after Stayman when opener denies a 4-card major.",
    metaDescription:
      "Learn the Smolen convention in bridge. Show 5-4 major hands efficiently after 1NT and basic Stayman responses.",
    bodyHtml: `
<h2>Smolen Convention: Show 5-4 Majors After Stayman</h2>
<p>Smolen is a convention used after a Stayman start. It solves a specific problem: responder has 5-4 in the majors and wants to show it efficiently.</p>

<h3>Typical setup</h3>
<p>Partner opens 1NT and you have 5-4 in the majors and enough points for game (or slam). Some people just transfer to the 5 card then bid the other one. There is a different way to do this, commonly used, called Smolen.</p>
<p>With 5-4 in the majors (can have 5 cards of either major, and 4 of the other), start by bidding stayman.</p>
<p>If partner shows a major, great, you have a fit - end of story. Now bid game.</p>
<p>If partner bids 2D, denying a major, this is where smolen comes in - we want to show our 5 card major now.</p>

<h3>A common Smolen context</h3>
<ul>
  <li>1NT - 2C (Stayman)</li>
  <li>2D (no 4-card major shown by opener)</li>
</ul>
<p>Now responder jumps in the major they DON'T have 5 cards in. This is the main tricky part of smolen.</p>

<h3>Typical sequence</h3>
<p>1NT 2C<br/>2D 3S</p>
<p>Responder jumped to 3S. That shows 5 cards in hearts (we jump in the other major). It's a bit like a transfer.</p>

<Callout type="mistake">
  <p>If agreements are unclear, it causes expensive misunderstandings.</p>
  <ul>
    <li>Using Smolen without confirming partnership version</li>
    <li>Confusing Smolen jumps with natural jump bids</li>
    <li>Forgetting opener’s rebid implications after Smolen action</li>
  </ul>
</Callout>

<Callout type="rule">
  <p>Smolen is a precision tool for 5-4 major hands after Stayman.</p>
  <p>Once your basic 1NT toolkit is stable, Smolen can improve accuracy significantly.</p>
</Callout>

<h3>Where to next</h3>
<ul>
  <li><a href="${HUB}/uryhI78pcS2v6yBKNTyG">Stayman Convention: Find a 4-4 Major Fit After 1NT</a></li>
  <li><a href="${HUB}/C4jrUVt0dNiSvlieHCqE">Puppet Stayman: How to Check for 5-Card Majors</a></li>
  <li><a href="${HUB}">Bidding Articles Hub</a></li>
</ul>
`.trim(),
  },
];

async function main() {
  for (const article of articles) {
    const snap = await db.collection("bidding").where("title", "==", article.title).limit(1).get();
    if (snap.empty) {
      console.log(`Missing summary: ${article.title}`);
      continue;
    }
    const summaryDoc = snap.docs[0];
    const summary = summaryDoc.data() || {};
    const bodyId = summary.body;
    if (!bodyId) {
      console.log(`Missing body id: ${article.title}`);
      continue;
    }
    await summaryDoc.ref.set(
      {
        teaser: article.teaser,
        metaDescription: article.metaDescription,
        category: "Bidding",
        subcategory: "Conventions and Artificial Methods",
        seoSubtopic: "Conventions and Artificial Methods",
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
    console.log(`Rich formatted: ${article.title}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
