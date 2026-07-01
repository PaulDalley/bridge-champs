/**
 * Publish "2 over 1: Game forcing" to Firestore, live + free.
 * URL: /learn/bidding/2-over-1-game-forcing
 * Idempotent (matched by slug or title). Body is Paul Dalley's content verbatim;
 * bold lines -> headings, bid shorthand -> suit symbols, boards as MakeBoard.
 * Spellcheck (clear mistakes only): "2C with can be short"->"2C which...",
 * biproduct->byproduct. "you might very miss" left verbatim (ambiguous — flagged).
 *
 * Usage: node scripts/publish-2over1-article.js --apply
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

const TITLE = "2 over 1: Game forcing";
const SLUG = "2-over-1-game-forcing";
const TEASER = "Two over one is simple - if opener makes a bid on the 1 level (not including 1NT), any two level change of suit is game forcing, except a simple raise.";
const META_DESCRIPTION = TEASER;
const PRIMARY_KEYWORD = "2 over 1 game forcing";
const RELATED_LINKS = [
  "/learn/bidding/bidding-basics-build-clear-auction",
  "/learn/bidding/fourth-suit-forcing-checkback-core",
  "/learn/bidding/two-way-checkback",
  "/learn/bidding/constructive",
].join("\n");

const EMPTY = "*S-*H-*D-*C-";
const single = (south, dealer, bidding) =>
  `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="${south}" West="${EMPTY}" vuln="Nil Vul" dealer="${dealer}" bidding="${bidding}" />`;

// 2D is game forcing (and natural).
const B1 = single("*S-K5*H-A10*D-KQ1084*C-10753", "North", "_/1♠/P/2♦");
// A simple raise (2S) is NOT game forcing.
const B2 = single("*S-KJ976*H-A1043*D-A2*C-52", "South", "_/_/_/1♠/P/2♠");
// Advantage: rebid the long suit simply, partner can't pass.
const B3 = single("*S-7*H-A5*D-KQ108432*C-A54", "North", "_/1♠/P/2♦/P/2♥/P/3♦");
// Disadvantage: too weak to game-force, must bid 1NT.
const B4 = single("*S-7*H-KQ108432*D-95*C-A54", "North", "_/1♠/P/1NT");
// A 2-level response shows a 5-card suit (8-card fit).
const B5 = single("*S-A9843*H-K103*D-J743*C-A", "South", "_/_/_/1♠/P/2♥");
// The 2C quirk: 5-card majors/diamonds needed, so bid 2C (South to act).
const B6 = single("*S-102*H-KQ54*D-AQ103*C-A53", "North", "_/1♠/P");
// 2C can even hold 3-card support (South to act).
const B7 = single("*S-A102*H-KQ54*D-AQ103*C-53", "North", "_/1♠/P");
// ...then bid spades to show the 3-card support.
const B8 = single("*S-A102*H-KQ54*D-AQ103*C-53", "North", "_/1♠/P/2♣/P/2♥/P/2♠");

const BODY_HTML = `
<p>Two over one is simple - if opener makes a bid on the 1 level (not including 1NT), any two level change of suit is game forcing, except a simple raise. Easiest to clarify that with examples</p>

${B1}

<p>Here south's first bid of 2♦ is game forcing (and natural).</p>

${B2}

<p>Just to clarify in case, the above auction is still just a simple raise. Partner is showing 3 card support and say 6-10 points, it is not game forcing.</p>

<h2>Advantages:</h2>

<p>- We can game force in a single bid, and do not need to worry that partner will later pass. This makes it easier to describe our hand, for example</p>

${B3}

<p>Here we can bid our diamond suit again in a simple fashion, just emphasising to partner that we have a long suit, without worrying that partner will pass. Playing standard some people may play this as passable, and therefore would have to bid something a bit strange with this hand.</p>

<h2>Disadvantage:</h2>

<p>- The biggest disadvantage is we have to respond 1NT more and cannot bid our suits if we are not strong enough to game force, for example</p>

${B4}

<p>Here we had to bid 1NT because we did not think we were strong enough to game force with 2♥. In standard bidding we might be able to bid 2♥ which we would like to do here, but cannot. This can sometimes mean that you end up playing in 1NT when you have a big fit and 4♥ as an available contract. Some bidding systems have catered for this hand with a different bid, for example 3♥ in response to 1♠, as showing this hand. But that is beyond the scope of the article, and whatever you do, there will always be some disadvantages of playing 2 over 1. The decision is whether you think the good outweighs the bad.</p>

<p>- The range of 1NT increases to about 11 points. This can seem clumsy but for most experienced pairs it doesn't matter much. The rare time where it will matter is when partner opens with 14, you bid 1NT with 11, and partner passes - you might very miss a 25 point game.</p>

<h2>2 level bids should be 5+ quality suits, except 2♣ which can be short.</h2>

<p>-This is the best way to play 2 over 1. When partner responds on the 2 level, they are showing a 5 card suit.</p>

${B5}

<p>In the above auction partner has shown 5 hearts and is game forcing, we can be confident that we have an 8 card fit.</p>

<p>- One strange byproduct is the 2♣ bid, so for example what do you bid on this?</p>

${B6}

<p>On this hand, since we have just said that a bid of 2♥ or 2♦ needs to contain a 5 card suit, the correct bid is 2♣. 2♣ is either a real club suit, or a balanced hand. In fact, it can contain 3 card support, for example lets change that hand slightly to have 3 spades.</p>

${B7}

<p>Here we start with 2♣. It sets up a game force (we are playing 2 over 1), and at our soonest opportunity we bid spades to show our 3 card support. The bidding may continue like this</p>

${B8}

<p>This should show 3 card support by you, and set spades.</p>

<h2>Recommendation</h2>

<p>I like 2 over 1 and think it is a good system when you get used to it. However, I definitely do not think it is essential and know there have been a lot of high achieving pairs over the years who do not play it. The majority of experts these days seem to be playing 2 over 1, but I think more important than worrying about what is absolutely "best" rather think about what suits your style and you feel confident playing.</p>

<p><strong>Read next:</strong> <a href="/learn/bidding/bidding-basics-build-clear-auction">Bidding Basics: Build a Clear Auction Plan</a> &middot; <a href="/learn/bidding/fourth-suit-forcing-checkback-core">Fourth Suit Forcing: How and When to Use It</a> &middot; <a href="/learn/bidding/two-way-checkback">Two-way checkback: all you need to know</a></p>

<p><a href="/learn/bidding/constructive">Browse all constructive bidding &rarr;</a></p>
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
    primaryKeyword: PRIMARY_KEYWORD, category: "Bidding", subcategory: "Constructive Bidding",
    seoSubtopic: "Constructive Bidding", relatedLinks: RELATED_LINKS, articleType: "bidding",
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
