/**
 * Publish "9 Card trump fit does it matter?" to Firestore as a live, free
 * article in the Hand evaluation family. URL: /learn/bidding/9-card-trump-fit
 * Idempotent (matched by slug or title). Body is Paul Dalley's content verbatim
 * (spell-check only: recommeendations->recommendations), with bid shorthand as
 * suit symbols and headings/boards/lists as structural markup.
 * Cannibalisation checked 2026-07-21: only neighbour is the beginner
 * "Preemptive Raises" article (different keyword/intent) — cross-linked via
 * relatedLinks, distinct primaryKeyword here.
 *
 * Usage: node scripts/publish-9-card-fit-article.js --apply
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

const TITLE = "9 Card trump fit does it matter?";
const SLUG = "9-card-trump-fit";
const TEASER =
  "We know a 9 card fit is a good thing. I want to give a practical guide of what to do with a 9 card fit.";
const META_DESCRIPTION = TEASER;
const PRIMARY_KEYWORD = "9 card trump fit";
const RELATED_LINKS = [
  "/learn/bidding/hand-evaluation-4-do-less",
  "/learn/beginner/preemptive-raises-bridge-big-trump",
  "/learn/bidding/hand-evaluation",
].join("\n");

const EMPTY = "*S-*H-*D-*C-";
const board = (south, dealer, bidding) =>
  `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="${south}" West="${EMPTY}" vuln="Nil Vul" dealer="${dealer}" bidding="${bidding}" />`;

const B1 = board("*S-Axxxx*H-AQxxx*D-xx*C-x", "East", "_/_/1♣/1♠/2♣/3♠/P/4♠");
const B2 = board("*S-95432*H-5*D-AKJ2*C-AQ3", "East", "_/_/1♦/1♠/2♦/3♠/P/?");

const BODY_HTML = `
<p>We know a 9 card fit is a good thing. There are various theories to explain why including something called "the law of total tricks". I want to give a practical guide of what to do with a 9 card fit.</p>

<h2>1. When you have a flat hand, don't get carried away</h2>

<p>9 Card fits might make little or no difference when you have a flat hand. In such situations you can be slightly encouraged (imagine the 9 card fit being worth about 1-2 points), but basically not do much different.</p>

<h2>2. When you are distributional - 9+ card fits can make a big difference</h2>

<p>Take this hand for example</p>

${B1}

<p>On this auction lets say partner showed 4 card support and 6-9 points. I think it is pushy but not terribly unrealistic to bid game. This Partner had Kxxx spades, they broke, and the heart finesse made, and declarer was able to ruff hearts. Declarer made an overtrick opposite 6 points!</p>

<p>There are numerous problems with a hand like that opposite 3 card support. In an 8 card fit lots of things can go wrong including</p>

<ol>
<li>Declarer will be forced to ruff the side suits, and this could cause declarer to lose control of the hand.</li>
<li>It is harder to draw the enemy's trumps, they have more of them, you have less of them.</li>
<li>The trump suit is too weak, opposite 3 cards there is likely 1-2 trump losers even if they break well.</li>
<li>Setting up that heart suit is harder to do when partner only has 3 trumps, you may not be able to ruff as many times in dummy.</li>
</ol>

<p>Overall High card points are much more relevant with an 8 card fit.</p>

<p>Whereas</p>

<p>with a 9+ card fit, distribution and long side suits are paramount. Things like voids and singletons are working overtime when you have a big trump fit, whereas they are not as strong when you only have an 8 card fit, unless you have plenty of high card points.</p>

<h2>Trump quality</h2>

<p>Trump quality matters a LOT less when you have a 9+ card fit. Take this hand for example</p>

${B2}

<p>Lets be fickle and this time say that partner's 3♠ raise shows 0-6 points. Do you bid on or not? If you look at your side suits, they are actually really good. You may only lose 1-2 tricks in total in the side suits. The big problem is the trump suit, however when partner has 4 cards, we hold our losers to a maximum of 2 if they break, and sometimes less for example if partner has the Ace or the King of trumps.</p>

<p>overall - bid on with an 9 card fit, because trump texture no longer is a problem, whereas with an 8 card fit - its likely that you have too many trump losers to make game opposite a weak hand.</p>

<h2>In summary my recommendations are</h2>

<ol>
<li>When you have a distributional hand, bid at least 1 more level with a 9+ card fit than you would otherwise</li>
<li>With a flat hand, don't get carried away</li>
<li>Don't worry about a bad trump suit when you have 9+ card fit, but DO worry about it when you only have an 8 card fit.</li>
</ol>

<p><strong>Read next:</strong> <a href="/learn/bidding/hand-evaluation-4-do-less">Hand Evaluation: Do Less with a Weak Trump Suit</a> &middot; <a href="/learn/bidding/hand-evaluation-3-do-more">Hand Evaluation: Do More with a Good Suit</a> &middot; <a href="/learn/bidding/loser-count-bidding-judge-contracts">Loser Count for Bidding: Judge Contracts Better</a></p>

<p><a href="/learn/bidding/hand-evaluation">Browse all Hand evaluation &rarr;</a></p>
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
    primaryKeyword: PRIMARY_KEYWORD, category: "Bidding", subcategory: "Hand Evaluation",
    seoSubtopic: "Hand Evaluation", relatedLinks: RELATED_LINKS, articleType: "bidding",
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
