/**
 * Publish "Cue raise" to Firestore as a live, free article in the Competitive
 * bidding family. URL: /learn/bidding/cue-raise
 * Idempotent (matched by slug or title). Body is Paul Dalley's content verbatim
 * (unambiguous typo fixes only, listed for approval in the session), with bid
 * shorthand as suit symbols and boards as structural markup.
 * Cannibalisation checked 2026-07-24: the only neighbour is "Cue bidding: Slam
 * bidding made simple" (/learn/bidding/cue-bidding) — DIFFERENT topic (slam
 * control-showing cue bids vs competitive cue raises). Distinct primaryKeyword
 * ("cue raise"), distinct hub (Competitive bidding vs Conventions/Slam), and
 * cross-linked via Read next so Google sees them as siblings, not duplicates.
 *
 * Usage: node scripts/publish-cue-raise-article.js --apply
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

const TITLE = "Cue raise";
const SLUG = "cue-raise";
const TEASER =
  "The cue raise is one of the most important and common tools in the bag. It is the bid of the opponent's suit, which shows a 3 card raise that is stronger than the simple raise.";
const META_DESCRIPTION = TEASER;
const PRIMARY_KEYWORD = "cue raise";
const RELATED_LINKS = [
  "/learn/bidding/kiss-3-support-partner-priority",
  "/learn/bidding/takeout-doubles-bridge-complete-guide",
  "/learn/bidding/cue-bidding",
  "/learn/bidding/competitive",
].join("\n");

const EMPTY = "*S-*H-*D-*C-";
const board = (south, dealer, bidding) =>
  `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="${south}" West="${EMPTY}" vuln="Nil Vul" dealer="${dealer}" bidding="${bidding}" />`;

const HAND1 = "*S-K103*H-54*D-AQ108*C-Q1084";
const B1 = board(HAND1, "West", "1♥/1♠/P/?");
const B2 = board(HAND1, "West", "1♥/1♠/P/2♥/P/2♠/P/P/P");
const B3 = board("*S-1054*H-AQ84*D-K103*C-AQ5", "North", "_/1♠/2♦/3♦");
const B4 = board("*S-104*H-5*D-AKQ10542*C-AQ3", "South", "_/_/_/1♦/P/1♠/2♥/3♥");
const B5 = board("*S-Q102*H-A543*D-72*C-K1043", "South", "_/_/_/P/1♥/1♠/P/2♥");

const BODY_HTML = `
<p>The cue raise is one of the most important and common tools in the bag. Using it effectively is fairly simple most of the time, with a few slightly deeper ideas to think about at times.</p>

<p>The best way of explaining a cue raise is through examples</p>

${B1}

<p>In this example you have 11 high card points, a nice useful small doubleton heart, some good intermediate cards (10's and 9's). Overall a very respectable hand. If a simple 2♠ raise shows say 6-10 points, this would be too strong. The solution is a cue raise - It is the bid of the opponent's suit, which shows a 3 card raise that is stronger than the simple raise (a bid of 2♠ here would be a simple raise).</p>

${B2}

<p>The bid of 2♥ shows 11+ points and 3 card support. In this example partner just bid 2♠, basically saying - "I have a minimum overcall, opposite your 11-13 points I just want to play in 2♠." So, partner likely has around 9-10 points.</p>

<p><strong>Note:</strong> You can have unlimited points when you cue raise, partner is always going to bid, partner will not pass 2♥. If, for example, you had 15 points in this hand, you could raise partner's 2♠ to game.</p>

<h2>So, lets summarise what a cue raise is:</h2>

<ul>
<li>A cue raise is the cue-bid of the opponents suit, to tell partner that you have 3 card support, and you are stronger than a simple raise. You do this at the lowest level (notice on the previous example you simply just bid 2♥, not 3♥).</li>
</ul>

<p>As mentioned it is at the lowest level, but take this hand for example</p>

${B3}

<p>On this example we show 11+ points and 3 card spade raise by bidding 3♦ (cue raising by bidding the opponent's suit). Notice on the example this time we had to cue raise on the 3 level.</p>

<h2>A few extra things to add</h2>

<p><strong>1.</strong> Traditionally this bid is made by responder's first bid only. Notice the difference for example on this hand</p>

${B4}

<p>On this example opener's bid of 3♥ is not a cue raise. With a good hand and spades opener just needs to raise spades to the appropriate level. A cue of the opponent's suit by opener just said "I have a good hand, better than a simple rebid of my suit".</p>

<p><strong>Key takeaway:</strong> As opener, just raise partner to the appropriate level, cue raises are for responder's first bid only.</p>

<p><strong>2.</strong> A cue raise with a passed hand shows the maximum end of a passed hand. So, for example</p>

${B5}

<p>In this example you are a passed hand, so your cue raise now is about 9-11 points - the upper range of a passed hand. It is obviously not unlimited anymore since you passed initially! Therefore a simple raise in the example above would have been about 5-8 points.</p>

<p>The cue raise is a neat and simple way to show a good raise, the range of it depends on whether you are a passed hand or not - if you are not, the range is about 11+. The cue raise is used by every experienced partnership I've seen and I would describe it as one of the most essential and standard agreements in bridge.</p>

<p><strong>Read next:</strong> <a href="/learn/bidding/kiss-3-support-partner-priority">Raising partner. Simply supporting is best.</a> &middot; <a href="/learn/bidding/takeout-doubles-bridge-complete-guide">Takeout Doubles in Bridge: The Complete Guide</a> &middot; <a href="/learn/bidding/cue-bidding">Cue bidding: Slam bidding made simple</a></p>

<p><a href="/learn/bidding/competitive">Browse all Competitive bidding &rarr;</a></p>
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
    primaryKeyword: PRIMARY_KEYWORD, category: "Bidding", subcategory: "Competitive Bidding",
    seoSubtopic: "Competitive Bidding", relatedLinks: RELATED_LINKS, articleType: "bidding",
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
