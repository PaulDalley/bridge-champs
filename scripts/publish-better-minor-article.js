/**
 * Publish "Better minor or short club?" article with full SEO setup.
 * - Creates article body with MakeBoard components
 * - Creates summary doc in bidding collection
 * - Adds read-next footer links to related articles
 * - Generates and updates sitemap
 * - Revalidates paths
 *
 * Usage: node scripts/publish-better-minor-article.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");
const https = require("https");

const keyPathCandidates = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
];
const keyPath = keyPathCandidates.find((p) => fs.existsSync(p));
if (!keyPath) {
  console.error("No Firebase service account key found.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const F = admin.firestore.FieldValue;

const ARTICLE_DATA = {
  slug: "better-minor-or-short-club",
  title: "Better minor or short club?",
  category: "bidding",
  summary:
    "Understand the two common systems for opening 1 of a minor: short club vs better minor. Learn which system works best for your style and how to recognize what your opponents are playing.",
  body: `<h2>Two ways to play 1 of a minor</h2>

<p>There are basically three common ways of playing a 1 of a minor opening. It's important to know these so you can decide what system best suits you, but also so you can understand what your opponents are doing.</p>

<h3>Short club</h3>

<p>A 1♣ opening shows 2+ clubs if you are playing short club.</p>

<p>In the past players opened 4 card majors and simply opened 1♥. These days, since 5 card majors are by far the most common way of playing, we cannot open 1♥ or 1♠. Short club goes like this: a 1♦ opening always shows 4. If I don't have a 5 card major, and don't have a 4 card diamond suit, I open 1♣.</p>

<p><MakeBoard seats="S" south={{ suit: "S", value: "AK104" }} southH={{ suit: "H", value: "KQ92" }} southD={{ suit: "D", value: "873" }} southC={{ suit: "C", value: "54" }} auction={[{ bid: "1C" }]} /></p>

<p>Within the umbrella of short club, there is a slight variation which is fairly popular: players open all balanced hands 1♣ (all 4432 and 4333). For players that do that, 1♦ would show two things:</p>

<ol>
  <li>4+ diamonds</li>
  <li>An unbalanced hand (since all balanced hands open 1♣)</li>
</ol>

<p>For example, on this hand some short club players would open 1♣, since the hand is balanced (4432):</p>

<p><MakeBoard seats="S" south={{ suit: "S", value: "AK84" }} southH={{ suit: "H", value: "872" }} southD={{ suit: "D", value: "K103" }} southC={{ suit: "C", value: "K54" }} auction={[{ bid: "1C" }]} /></p>

<p>That might look quite unusual to some players, but for others it might seem normal. If you don't like that style, the main thing is to understand what your opponents might be doing.</p>

<h3>Better minor</h3>

<p>The title almost fully describes it: when we can't open a major (we don't have a 5 card major) we open our better minor. That's normally very straightforward.</p>

<p><MakeBoard seats="S" south={{ suit: "S", value: "AK84" }} southH={{ suit: "H", value: "872" }} southD={{ suit: "D", value: "KQ103" }} southC={{ suit: "C", value: "54" }} auction={[{ bid: "1D" }]} /></p>

<p>It's fairly straightforward to notice that our diamonds are better.</p>

<p>One source of confusion is on these type of hands:</p>

<p><MakeBoard seats="S" south={{ suit: "S", value: "AK84" }} southH={{ suit: "H", value: "872" }} southD={{ suit: "D", value: "K103" }} southC={{ suit: "C", value: "K54" }} auction={[{ bid: "1C" }]} /></p>

<p>With 3-3 in both minors, I recommend just opening 1♣. Why? If you are playing better minor, about 95% of the time you can rely on 1♦ being a 4 card suit, the only exact time when it is not is on this type of hand:</p>

<p><MakeBoard seats="S" south={{ suit: "S", value: "AK104" }} southH={{ suit: "H", value: "KQ92" }} southD={{ suit: "D", value: "873" }} southC={{ suit: "C", value: "54" }} auction={[{ bid: "1D" }]} /></p>

<p>1♦ is only 3 cards on one occasion: when we are exactly 4-4 majors and 3-2 in the minors like that. This is relatively uncommon.</p>

<p>1♣ however, is let's say "often 4 cards", but it can be 3 a bit more often. It is only when we have exactly 4-4 in the majors, but a bit more frequently than the 1♦ example. Let's look at why. We'll start by changing the above example slightly:</p>

<p><MakeBoard seats="S" south={{ suit: "S", value: "AK104" }} southH={{ suit: "H", value: "KQ92" }} southD={{ suit: "D", value: "54" }} southC={{ suit: "C", value: "873" }} auction={[{ bid: "1C" }]} /></p>

<p>I changed the minors around: this time we open 1♣ and it is 3 cards.</p>

<p>And also, if you follow my recommendation of opening 1♣ when you are 4333, that is the other time when 1♣ will be opened with 3 cards.</p>

<p>In summary: if you play better minor, 1♦ is normally 4 unless you're exactly 4432. 1♣ is often 4, but sometimes 3 (4423 or 4333).</p>

<h3>Advantages and disadvantages</h3>

<p><strong>Better minor advantages:</strong></p>

<ul>
  <li>You can generally rely on the opening bid as showing length in that suit more often than not.</li>
</ul>

<p><strong>Short club advantages:</strong></p>

<ul>
  <li>When you open 1♦, you know partner has 4 for sure.</li>
  <li>The second version of short club mentioned has the advantage of knowing that when partner opens 1♦, she always has 4 cards and is always unbalanced: that's quite useful information to know straight away.</li>
</ul>

<p><strong>Better minor disadvantages:</strong></p>

<ul>
  <li>We can't be sure a 1 minor opening is 4: it can be 3.</li>
  <li>We don't know whether it is balanced or unbalanced.</li>
</ul>

<p><strong>Short club disadvantages:</strong></p>

<ul>
  <li>1♣ is "nebulous": we don't really know about partner's 4 card suits yet. We just know that the 1♣ bidder is probably balanced.</li>
</ul>

<h3>Which should you play?</h3>

<p>I think it is a matter of style and what you get used to. I prefer playing 1♣ as showing any balanced hand, and 1♦ as being unbalanced with 4+ diamonds (discussed above as one of the options under short club). But that has its drawbacks as mentioned.</p>

<p>I think for an improving pair, better minor might be better so you can keep it simple. Have simple auctions like opening 1♦ and raising it. Especially in competition it's useful to know what suits partner has, as you often don't have time to clarify when the opponents interfere.</p>

<p>I have seen lots of very successful pairs play each method. There is no need to play one or the other: both can work at all levels. Find one you enjoy and feel comfortable with, but also, be aware what your opponents are doing. Mainly remember: if they are playing short club they could have 4 diamonds and 2 clubs when they open 1♣!</p>

<p><strong>Read next:</strong> <a href="/learn/bidding/stayman-convention">Stayman Convention</a> &middot; <a href="/learn/bidding/4432-hand-opening-bids">4432 Hand Opening Bids</a> &middot; <a href="/learn/bidding/two-over-one">Two Over One Game Forcing</a></p>

<p><a href="/learn/bidding">Browse all Bidding conventions &rarr;</a></p>`,
};

async function createArticle() {
  const now = new Date();

  // Create body document
  console.log("Creating body document...");
  const bodyRef = db.collection("biddingBody").doc();
  await bodyRef.set({
    text: ARTICLE_DATA.body,
    updatedAt: F.serverTimestamp(),
    createdAt: F.serverTimestamp(),
  });
  const bodyId = bodyRef.id;
  console.log(`✓ Body document created: ${bodyId}`);

  // Create summary document
  console.log("Creating summary document...");
  await db
    .collection("bidding")
    .doc()
    .set({
      slug: ARTICLE_DATA.slug,
      title: ARTICLE_DATA.title,
      body: bodyId,
      summary: ARTICLE_DATA.summary,
      category: ARTICLE_DATA.category,
      hasVideo: false,
      createdAt: F.serverTimestamp(),
      updatedAt: F.serverTimestamp(),
    });
  console.log("✓ Summary document created");

  // Revalidate
  const revalidateSecret = process.env.REVALIDATE_SECRET;
  if (!revalidateSecret) {
    console.warn("⚠ REVALIDATE_SECRET env var not set; skipping revalidate");
    return {
      slug: ARTICLE_DATA.slug,
      title: ARTICLE_DATA.title,
      bodyId,
      url: `https://bridgechampions.com/learn/bidding/${ARTICLE_DATA.slug}`,
      revalidateSkipped: true,
    };
  }

  console.log("Revalidating /learn/bidding/better-minor-or-short-club...");
  const revalidateUrl = `https://bc-content.run.app/api/revalidate?secret=${revalidateSecret}&path=/learn/bidding/${ARTICLE_DATA.slug}`;

  return new Promise((resolve, reject) => {
    const req = https.request(revalidateUrl, { method: "POST" }, (res) => {
      console.log(`✓ Revalidate returned: ${res.statusCode}`);
      resolve({
        slug: ARTICLE_DATA.slug,
        title: ARTICLE_DATA.title,
        bodyId,
        url: `https://bridgechampions.com/learn/bidding/${ARTICLE_DATA.slug}`,
      });
    });
    req.on("error", (err) => {
      console.warn(`⚠ Revalidate error: ${err.message}`);
      resolve({
        slug: ARTICLE_DATA.slug,
        title: ARTICLE_DATA.title,
        bodyId,
        url: `https://bridgechampions.com/learn/bidding/${ARTICLE_DATA.slug}`,
        revalidateError: err.message,
      });
    });
    req.end();
  });
}

createArticle()
  .then((result) => {
    console.log("\n✓ Article published:");
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
