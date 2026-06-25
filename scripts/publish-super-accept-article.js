/**
 * Publish "Super accept: 1NT Transfers Jacoby" to Firestore as a live, free
 * article in the Conventions family (NT conventions).
 * URL: /learn/bidding/super-accept-1nt-jacoby-transfers
 * Idempotent (matched by slug or title). Body is Paul Dalley's content verbatim,
 * with bid shorthand rendered as suit symbols and headings/boards/callout as
 * structural markup. Meta description is a draft for Paul to replace.
 *
 * Usage: node scripts/publish-super-accept-article.js --apply
 */
const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

function resolveKey() {
  const dl = path.join(os.homedir(), "Downloads", "firebase key.json");
  if (fs.existsSync(dl)) return dl;
  const root = path.join(__dirname, "..", "serviceAccountKey.json");
  if (fs.existsSync(root)) return root;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  throw new Error("No service account key.");
}
if (!process.argv.includes("--apply")) { console.error("Refusing to run without --apply."); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(resolveKey(), "utf8"))) });
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const SUMMARY_COLLECTION = "bidding";
const BODY_COLLECTION = "biddingBody";

const TITLE = "Super accept: 1NT Transfers Jacoby";
const SLUG = "super-accept-1nt-jacoby-transfers";
const TEASER =
  "1NT Jacoby transfers and the super-accept: how the 2-level transfers work, why opener usually just accepts, and which strong 4-card-support hands justify jumping.";
const META_DESCRIPTION = TEASER;
const PRIMARY_KEYWORD = "1nt super accept jacoby transfers";
const RELATED_LINKS = ["/learn/bidding/1nt-transfers-stayman-use-each", "/learn/bidding/conventions"].join("\n");

const EMPTY = "*S-*H-*D-*C-";
const B1 = `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="*S-1084*H-J9762*D-32*C-543" West="${EMPTY}" vuln="Nil Vul" dealer="North" bidding="_/1NT/P/2♦/P/2♥/P/P/P" />`;
const B2 = `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="*S-AQ94*H-KQ102*D-QJ3*C-J2" West="${EMPTY}" vuln="Nil Vul" dealer="South" bidding="_/_/_/1NT/P/2♦/P/3♥" />`;
const B3 = `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="*S-A1094*H-K1092*D-A103*C-A2" West="${EMPTY}" vuln="Nil Vul" dealer="South" bidding="_/_/_/1NT/P/2♦/P/3♥" />`;
const B4 = `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="*S-AK94*H-Q1092*D-A103*C-A2" West="${EMPTY}" vuln="Nil Vul" dealer="South" bidding="_/_/_/1NT/P/2♦/P/2NT" />`;
const B5 = `<MakeBoard boardType="double" position="North/South" North="*S-32*H-KJ842*D-7*C-108432" East="${EMPTY}" South="*S-AK94*H-Q1092*D-A103*C-A2" West="${EMPTY}" vuln="Nil Vul" dealer="South" bidding="_/_/_/1NT/P/2♦/P/2NT" />`;

const BODY_HTML = `
<p>Firstly, the terminology - some people refer to a simple transfer after 1NT as a Jacoby transfer.</p>

<h2>Transfers</h2>

<p>They are quite simple structures, 2♦ shows 5+ hearts, a bid of 2♥ shows 5+ spades. Most of the time, probably 90-95% of the time, the 1NT opener needs to accept the transfer. why?</p>

${B1}

<p>On this hand for example, we have very little but it should be routine to transfer with 0+ points and a 5 card major. As you can see, it wouldn't be a good idea for the 1NT opener to take us any higher than necessary.</p>

<p>In other words Transfers show 0+ points, so almost always the 1NT opener needs to simply accept the transfer, in case responder is planning to pass.</p>

<h2>Super accept</h2>

<p>A super accept typically happens when the 1NT opener has 4+ card support. Never do it on 3 card support, even with your best 17 point 1NT opening. If partner has say 2 or 3 points and you end up unnecessarily on the 3 level, in an 8 card fit, you're asking for a bad score! The 4th card support makes all the difference! Also even if partner is strong, they need to be able to expect 4 card support if they are thinking of slam - 9 card fits in slam make a big difference as well.</p>

<p>There are two ways people play it, and I will provide a recommendation</p>

<ol>
<li>One style is to always super accept with 4+ card support, and have bids to differentiate between a good hand with 4+ card support, and a bad hand with 4+ card support.</li>
<li>My preferred style, only super accept with 4+ card support and a good or very good hand. Otherwise there is typically no need to rush. The main reason is that its sometimes perfect to play in 2 of a major, its not always easy for the opponents to push you to the 3 level! And besides, it should be their job to do so, we shouldn't just volunteer to go to the 3 level if we can play in 2.</li>
</ol>

<div class="bc-callout bc-callout-expert"><span class="bc-callout-badge">Think about it</span><p>After a transfer auction, there is no guarantee that your side has a fit. From the opponents perspective, it becomes more difficult to balance, you will far more often play in 2♥ or 2♠ with an 8 or even 9 card fit, than you would if you opened 1♥ and raised to 2♥ - in that auction the opponents know they can compete more freely because you have a fit! For that reason we should sometimes aim to play on the 2 level.</p></div>

<p>Lets cover both, as they are very simple. Methods vary widely but this is the generally accepted style</p>

<p><strong>System</strong></p>

<ul>
<li>2NT = maximum hand with 4+ card support</li>
<li>3 of the Major = minimum hand with 4+ card support.</li>
</ul>

<p>Some people also like to bid 3 of a different suit to show 4+ card support, a maximum, and a natural feature. For example, AKJx of a suit. Hint: A feature is normally about 6+ points in a suit, that information can be useful to partner - its a good thing if for example they have 4+ cards in that suit.</p>

<p>Lets look at some examples</p>

${B2}

<p>Here the 1NT opener has shown a minimum hand with 4 card support. Again I would argue that it is fine to just bid 2♥ on such hands, save 3♥ to show a better hand. What might a better hand look like?</p>

${B3}

<p>This is a minimum hand but its much sharper - Aces and Kings are good cards, with nice 10's and 9's as well. In other words, its not just some random 15 point hand, its a hand that you actually judge as being good!</p>

<p>What about a maximum hand, lets take a look at what that might look like</p>

${B4}

<p>This is a monster of a hand - you have excellent chances making that opposite very little, you should encourage partner basically saying "I have an unusually good hand, even if you are light on HCP we have good chances", and partner trusts that you have an exceptional hand, and are not just someone who likes super accepting for fun.</p>

<p>This is the full hand where 4♥ makes, and partner bids it despite being short on High card points.</p>

${B5}

<h2>Overall recommendation</h2>

<p>You can experiment with super accepting all the time with 4 cards, and having various bids to show different type of super accepts. Alternatively you can aim to play on the 2 level more often when you have a minimum type hand, and put the pressure on your opponents to figure out that they need to push you to the 3 level. My recommendation is to use <a href="/learn/bidding/hand-evaluation-1-card-texture">hand evaluation</a> ideas and only super accept with genuinely useful hands (Aces and Kings, not with 4333 shape) that have solid prospects of game opposite a sub minimum partner. This, like most aspects of bidding, is a discussion you need to have with your partner and ultimately is a matter of style, don't get too concerned if your partner wants to play it differently to you, both ways are fine.</p>

<p><a href="/learn/bidding/conventions">Browse all Conventions &rarr;</a></p>
`.trim();

async function getNextArticleNumber() {
  const snap = await db.collection(SUMMARY_COLLECTION).get();
  return snap.docs.reduce((max, doc) => {
    const n = Number((doc.data() || {}).articleNumber || 0);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0) + 1;
}
async function findExisting() {
  const bySlug = await db.collection(SUMMARY_COLLECTION).where("slug", "==", SLUG).limit(1).get();
  if (!bySlug.empty) return bySlug.docs[0];
  const byTitle = await db.collection(SUMMARY_COLLECTION).where("title", "==", TITLE).limit(1).get();
  if (!byTitle.empty) return byTitle.docs[0];
  return null;
}
async function main() {
  const existing = await findExisting();
  const summaryRef = existing ? existing.ref : db.collection(SUMMARY_COLLECTION).doc();
  const existingBodyId = existing ? (existing.data() || {}).body : null;
  const bodyRef = existingBodyId ? db.collection(BODY_COLLECTION).doc(existingBodyId) : db.collection(BODY_COLLECTION).doc();
  const now = FieldValue.serverTimestamp();
  const articleNumber = existing
    ? String((existing.data() || {}).articleNumber || (await getNextArticleNumber()))
    : String(await getNextArticleNumber());

  await summaryRef.set({
    id: summaryRef.id, title: TITLE, slug: SLUG, teaser: TEASER, metaDescription: META_DESCRIPTION,
    primaryKeyword: PRIMARY_KEYWORD, category: "Bidding", subcategory: "Conventions and Artificial Methods",
    seoSubtopic: "Conventions and Artificial Methods", relatedLinks: RELATED_LINKS, articleType: "bidding",
    difficulty: "3", articleNumber, body: bodyRef.id, isHidden: false, isFree: true, freeUpdatedAt: now,
    updatedAt: now, ...(existing ? {} : { createdAt: now }),
  }, { merge: true });

  await bodyRef.set({
    id: bodyRef.id, text: BODY_HTML, body: { text: BODY_HTML }, isFree: true, freeUpdatedAt: now,
    updatedAt: now, ...(existingBodyId ? {} : { createdAt: now }),
  }, { merge: true });

  console.log(`${existing ? "Updated" : "Published"}: ${SUMMARY_COLLECTION}/${summaryRef.id}`);
  console.log(`Learn URL: /learn/bidding/${SLUG}`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
