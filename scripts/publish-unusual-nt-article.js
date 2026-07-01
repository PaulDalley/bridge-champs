/**
 * Publish "The Unusual NT: A Two-Suited 2NT Overcall" to Firestore, live + free.
 * URL: /learn/bidding/unusual-2nt
 * Idempotent (matched by slug or title). Body is Paul Dalley's content verbatim;
 * bold lines -> headings, "(ai coloured box)" -> Callout, bid shorthand -> suit
 * symbols, boards as MakeBoard. Spellcheck (clear mistakes only): on->one,
 * "two l lowest"->"two lowest", robus->robust, vulenrable->vulnerable, and heading
 * "common mistakes"->"Common mistakes". Board 6 diamonds KQ10872 (14 cards) read as
 * KQ1087 (the only legal 13-card reading) pending confirmation.
 *
 * Usage: node scripts/publish-unusual-nt-article.js --apply
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

const TITLE = "The Unusual NT: A Two-Suited 2NT Overcall";
const SLUG = "unusual-2nt";
const TEASER = "The unusual NT is typically a jump in No Trump. It shows either the two lowest unbid suits (commonly abbreviated as LUBS), or others play it as both minors.";
const META_DESCRIPTION = TEASER;
const PRIMARY_KEYWORD = "unusual 2NT";
const RELATED_LINKS = [
  "/learn/bidding/landy-and-multi-landy",
  "/learn/bidding/dont-convention-interfering-over-1nt",
  "/learn/bidding/takeout-doubles-bridge-complete-guide",
  "/learn/bidding/conventions",
].join("\n");

const EMPTY = "*S-*H-*D-*C-";
const single = (south, dealer, bidding) =>
  `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="${south}" West="${EMPTY}" vuln="Nil Vul" dealer="${dealer}" bidding="${bidding}" />`;

// Typical unusual 2NT over 1H (two lowest unbid = diamonds + clubs).
const B1 = single("*S-103*H-2*D-AK1084*C-KQ943", "East", "_/_/1♥/2NT");
// Responding to partner's unusual 2NT over 1C.
const B2 = single("*S-K1084*H-A83*D-54*C-K1084", "West", "1♣/2NT/P");
// Same, but opponents opened 1D -> LUBS (hearts + clubs).
const B3 = single("*S-K1084*H-A83*D-54*C-K1084", "West", "1♦/2NT/P");
// A hand worth bidding on: good, well-placed points.
const B4 = single("*S-7*H-62*D-AQ1084*C-KQ985", "East", "_/_/1♠/2NT");
// A hand NOT to bid on: poor suits -> pass.
const B5 = single("*S-K*H-AQ*D-108543*C-J7542", "East", "_/_/1♠/P");
// Once our side has bid, 2NT is natural (not unusual).
const B6 = single("*S-A103*H-54*D-KQ1087*C-K102", "East", "_/_/1♣/1♦/P/2NT");

const BODY_HTML = `
<h2>What is it?</h2>

<p>The unusual NT is typically a jump in No Trump. It shows either the two lowest unbid suits (commonly abbreviated as LUBS), or others play it as both minors. I strongly recommend playing it as 5-5 at least in the minors. Not 5-4, or 6-4, etc. Lets look at some examples</p>

${B1}

<p>This is a typical example, showing the two lowest unbid suits. In case that sounds a bit confusing, lets think about it slowly for a moment.</p>

<p>Which suits haven't been bid</p>

<ul>
<li>Spades</li>
<li>Diamonds</li>
<li>Clubs</li>
</ul>

<p>Diamonds and clubs are the two lowest. As mentioned other people play it as both minors, which is the same thing. However, discuss what this means with partner.</p>

${B2}

<p>What suits does partner have? There are two ways of playing it</p>

<p>1. The two lowest UNBID suits, which would be hearts and diamonds.</p>

<p>2. Both minors, in which case now partner has clubs and diamonds.</p>

<Callout type="rule">Talk to partner about this - It makes a big difference, are you playing Lowest unbid or both minors?</Callout>

<p>Recommendation - these days lots of pairs play 1♣ as showing 2+, and frequently don't actually have a club suit. In that case, its okay to play the above auction as showing minors, or LUBS, your choice. No strong recommendation.</p>

<p>However, contrast with this</p>

${B3}

<p>Here the opponents have opened 1♦ - which is natural for most pairs. Over this it is more sensible to play it as showing LUBS (hearts and clubs) and not show diamonds.</p>

<h2>How strong should you be?</h2>

<p>I'm going to give a simple recommendation and a more advanced one.</p>

<p>1. Simple recommendation: Have a decent hand, about 9-14 points, with good suits (the majority of the points in our suits). For example</p>

${B4}

<p>This would be a nice hand to bid on - we have well placed points and good intermediate cards. Our suits are robust.</p>

<p>However, I would not recommend bidding on this</p>

${B5}

<p>Your suits are not good.</p>

<p>2. Advanced recommendation: This bid should be vulnerability dependent. When you are vulnerable you should have a good hand and hope partner raises you to game! When you are not vulnerable it is okay to bid it with a bad hand, and hope we get in their way or find a profitable sacrifice.</p>

<p>I would still apply the same to the standard above where I want my points in their suits, but I would perhaps change the pointcount requirement</p>

<p>NV - 0-12 points. Yes 0, especially if they are vulnerable. We get in their way, Non vul is the time to do that type of thing.</p>

<p>Vul - Stick with 9-14 points, quality suits.</p>

<h2>Common mistakes</h2>

<p>1. Getting confused whether the bid is natural or unusual. As a rule, once your partner has already bid, the unusual NT doesn't exist anymore, it is only when you immediately overcall like the above examples. But contrast with</p>

${B6}

<p>Here partner's 2NT bid is just natural and invitational. We do not have the unusual NT bid in response to partner, it is only when our side first enters the bidding.</p>

<p>2. Bidding the unusual NT with 5-4 in the minors or 6-4. With 5-4 you do not have the appropriate shape, and with 6-4 rather just bid your 6 card suit. You should have at least 5 in each minor to bid the unusual NT.</p>

<h2>Overall</h2>

<p>It is a fun and effective tool, it can also substantially get in your opponents way and make it difficult for them. It is also a good bid sometimes because it accurately conveys your hand in a single bid, and partner is often in a good position to know what to do. I recommend trying it.</p>

<p><strong>Read next:</strong> <a href="/learn/bidding/landy-and-multi-landy">Landy and Multi Landy</a> &middot; <a href="/learn/bidding/dont-convention-interfering-over-1nt">DONT convention: Interfering over No Trump</a> &middot; <a href="/learn/bidding/takeout-doubles-bridge-complete-guide">Takeout Doubles in Bridge: The Complete Guide</a></p>

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
