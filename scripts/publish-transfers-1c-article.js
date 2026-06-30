/**
 * Publish "Transfers over 1C: How They Work" to Firestore as a live, free article.
 * URL: /learn/bidding/transfers-over-1c
 * Idempotent (matched by slug or title). Body is Paul Dalley's content verbatim;
 * bold lines -> headings, "(ai insert hint/rule/think about)" -> Callouts, bid
 * shorthand -> suit symbols, boards as MakeBoard. Spellcheck (clear mistakes only,
 * per Paul): as->ask, Wtih->With, opponetns->opponents; Board 1 diamonds QJ0432
 * read as QJ10432 (the only legal 13-card reading) pending confirmation.
 * Checkback link in "Important points" is intentionally omitted until the
 * checkback article exists.
 *
 * Usage: node scripts/publish-transfers-1c-article.js --apply
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

const TITLE = "Transfers over 1C: How They Work";
const SLUG = "transfers-over-1c";
const TEASER = "Transfers over 1C can seem a bit fancy, but they are actually straight forward, easy to learn and play.";
const META_DESCRIPTION = TEASER;
const PRIMARY_KEYWORD = "transfers over 1C";
const RELATED_LINKS = [
  "/learn/bidding/texas-transfers-transfer-directly-game",
  "/learn/bidding/system-over-1nt-conventions",
  "/learn/bidding/fourth-suit-forcing-checkback-core",
  "/learn/bidding/conventions",
].join("\n");

const EMPTY = "*S-*H-*D-*C-";
const single = (south, dealer, bidding) =>
  `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="${south}" West="${EMPTY}" vuln="Nil Vul" dealer="${dealer}" bidding="${bidding}" />`;

// Weak hand + minor: start 1S (no major), then bid the minor.
const B1 = single("*S-1083*H-7*D-QJ10432*C-A104", "North", "_/1♣/P/1♠/P/1NT/P/2♦");
// Bid naturally: 6-card club suit just rebids 2C, not 1NT.
const B2 = single("*S-1073*H-A104*D-6*C-AK10843", "South", "_/_/_/1♣/P/1♠/P/2♣");
// Accept the transfer with exactly 3-card support (1S).
const B3 = single("*S-K104*H-A1083*D-76*C-AJ94", "South", "_/_/_/1♣/P/1♥/P/1♠");
// Only 2-card support -> rebid 1NT.
const B4 = single("*S-K4*H-A1083*D-1076*C-AJ94", "South", "_/_/_/1♣/P/1♥/P/1NT");
// 4-card support -> jump to 2S.
const B5 = single("*S-K1042*H-A103*D-107*C-AJ94", "South", "_/_/_/1♣/P/1♥/P/2♠");
// Treat the transfer as having shown the suit: weak 6-card spades bids twice.
const B6 = single("*S-KQ10843*H-7*D-Q103*C-1043", "North", "_/1♣/P/1♥/P/1NT/P/2♠/P/P/P");

const BODY_HTML = `
<p>Transfers over 1♣ can seem a bit fancy, but they are actually straight forward, easy to learn and play.</p>

<h2>How they work</h2>

<p>After partner opens 1♣, this is what the bids mean</p>

<p>1♦ = 4+ hearts</p>

<p>1♥ = 4+ spades</p>

<p>1♠ = *Subject to partnership agreement. Recommendation - no 4 card major.</p>

<Callout type="expert">It is better to not think of the bids as "transfers", you are not forced to accept the transfer. Always bid naturally, don't let the word "transfers" confuse you.</Callout>

<p>In other words, partner's "transfer" simply just shows that suit, it doesn't force us to accept the transfer. More on further down.</p>

<h2>The 1♠ bid</h2>

<p>This is a bid which is important to discuss with your partner if you are thinking of playing transfers over 1♣. Some people play 1♠ to mean diamonds, others play it to show no major. My preference is to just show no major</p>

<p>A side point: If you are going to play transfers over 1♣, ask yourself these two questions</p>

<p>1. How do I show a weak hand with a minor?</p>

<p>2. How do I show a game forcing hand with a minor?</p>

<h3>My recommendations</h3>

<p>With a weak hand and a minor, start with 1♠, then just bid the minor. Simple and effective, so for example</p>

${B1}

<p>On this hand, we simply start by saying "no major", and then we bid the minor we want to play in.</p>

<Callout type="rule">When playing transfers over 1♣, 1♣ P 1♠ is usually a transfer to 1NT (any time partner has 12-14 balanced. They do not have to bid 1NT if they do not have that hand)</Callout>

<p>In relation to the above rule, 90% of the time after 1♣ P 1♠, partner will rebid 1NT, but not always. Don't let transfers confuse you, you should still bid your hand! For example</p>

${B2}

<p>In this hand for example, we simply rebid our hand normally. Partner's 1♠ does not force us to bid 1NT in any way, however any time we have a 12-14 balanced hand we should certainly be rebidding 1NT - in other words, we bid naturally.</p>

<h2>After 1♣ P 1♥ or 1♣ P 1♦, do we always accept the transfer?</h2>

<p>This is something to discuss with partner, I will give my recommendation but there are other ways people play it so it is worth discussing exactly with your partner, or if you come up against it, clarify with your opponents exactly what the bids mean if you need to.</p>

<p>Accepting the transfer shows exactly 3 cards in the suit. For example</p>

${B3}

<p>In this example partner's 1♥ shows 4+ spades. It is not a strict transfer, however here we are happy to bid 1♠ to show exactly 3 cards. Lets contrast this with a couple other hands</p>

${B4}

<p>Here we have not bid 1♠ since we only have 2, we have rebid 1NT, showing 12-14 balanced without 3 spades.</p>

<Callout type="expert">This is one of the advantages of transfers, we can show whether we have 3 card support or not on the 1 level!</Callout>

<p>One other point - what do you do with 4 card support? Lets change the hand slightly</p>

${B5}

<p>We bid 2♠ simply. This is the same as if, playing natural methods, the auction had gone 1♣ 1♠ 2♠. So, we are able to differentiate between 4 card, 3 card and 2 card support!</p>

<h2>Important points</h2>

<p>1. Checkback. Checkback is beyond the scope of this article, but ask partner when and how checkback applies. I will make recommendations for that in <a href="/learn/bidding/two-way-checkback">my article on the topic</a>.</p>

<p>2. What happens in competition? My simple suggestion is, just play all natural bids in competition, it is the best way to avoid confusion in most partnerships - in other words "All system off in competition".</p>

<p>3. It is generally a good idea to discuss follow up auctions, and also always keep in mind that even though you are playing transfers, normal bidding principles still apply. Just treat the "transfer" as having shown the suit, for example</p>

${B6}

<p>On that hand it is as if south has just bid spades twice, showing a weak hand with spades, don't let the fact that you are playing transfers confuse simple auctions like that.</p>

<p><strong>Read next:</strong> <a href="/learn/bidding/texas-transfers-transfer-directly-game">Texas Transfers: Transfer Directly to Game</a> &middot; <a href="/learn/bidding/system-over-1nt-conventions">System Over 1NT: Transfer Responses and Conventions</a> &middot; <a href="/learn/bidding/fourth-suit-forcing-checkback-core">Fourth Suit Forcing: How and When to Use It</a></p>

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
    difficulty: "2", articleNumber, body: bodyRef.id, isHidden: false, isFree: true, freeUpdatedAt: now,
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
