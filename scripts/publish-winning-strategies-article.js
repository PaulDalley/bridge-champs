/**
 * Publish "Bridge winning strategies - Top 5 to improve your results" to
 * Firestore as a live, free article in the Conventions family.
 * URL: /learn/bidding/bridge-winning-strategies-top-5
 * Idempotent (matched by slug or title). Body is Paul Dalley's content verbatim;
 * bid shorthand rendered as suit symbols, headings/boards as structural markup.
 *
 * Usage: node scripts/publish-winning-strategies-article.js --apply
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

const TITLE = "Bridge winning strategies - Top 5 to improve your results";
const SLUG = "bridge-winning-strategies-top-5";
// Meta description — Paul's words.
const TEASER = "Winning bridge strategies and tips to improve score";
const META_DESCRIPTION = TEASER;
const PRIMARY_KEYWORD = "bridge winning strategies";
const RELATED_LINKS = [
  "/learn/bidding/kiss-2-consider-passing-more",
  "/learn/bidding/takeout-doubles-bridge-complete-guide",
  "/learn/bidding/preempting-first-seat-bold",
  "/learn/bidding/competitive",
].join("\n");

const EMPTY = "*S-*H-*D-*C-";
// Board 1 — compete over the opponents' 2-level fit (South to act).
const B1 = `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="*S-542*H-85*D-A92*C-QJ1084" West="${EMPTY}" vuln="EW Vul" dealer="East" bidding="_/_/1♥/P/2♥/P/P" />`;
// Board 2 — opponents in a misfit, leave them alone (full auction, South passes).
const B2 = `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="*S-542*H-85*D-A92*C-AQJ108" West="${EMPTY}" vuln="EW Vul" dealer="East" bidding="_/_/1♥/P/1NT/P/2♦/P/2♥/P/P/P" />`;
// Board 3 — 4333 opposite 1NT: just bid 3NT (South to act).
const B3 = `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="*S-A1094*H-K93*D-Q102*C-J54" West="${EMPTY}" vuln="Nil Vul" dealer="North" bidding="_/1NT/P" />`;
// Board 4 — an automatic 1NT opener (hand only, no auction).
const B4 = `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="*S-K10*H-Q4*D-A10842*C-AQ42" West="${EMPTY}" vuln="Nil Vul" dealer="South" bidding="" />`;

const BODY_HTML = `
<p>These are my pick for the top 5 ways to win in bridge.</p>

<h2>1. Don't let the opponents play on the 2 level in a fit</h2>

<p>One of the very trusted rules. It will be more right most of the time to compete, especially when you are not vulnerable. So combine those two factors, and competing should almost be automatic, lets look at an extreme looking example</p>

${B1}

<p>It's quite reasonable to bid 3♣ here, even though it looks quite ridiculous to bid so much on 7 points balanced! You aren't vulnerable and the opponents are comfortably sitting in 2♥. Also you have nice club texture. While you get used to the idea of competing NV when the opponents have a fit, some of your bids might feel extreme or ridiculous.</p>

<p>When the opponents have a fit, there is a greater chance that we will have a fit, and also its likely a good hand to declare. It could be the type of hand where both players are making 8 or 9 tricks in a part score, and fortune favours the bold. Conversely if they were misfitting, it could be possible that neither side is making anything above the 1 level! For example I would stay out of this auction</p>

<h3>Don't bid in this auction</h3>

${B2}

<p>I've improved your hand yet I do not suggest bidding - the opponents are in a misfit, no need to rescue them from it!</p>

<p>Does it matter if the opponents are vulnerable? - Not really, our main consideration is whether we are vulnerable or not, when we are NV we take a more aggressive stance, when we are vulnerable we want to be a bit more cautious and bid on good hands, distributional hands etc, because 2 off is quite a bad score vulnerable, whereas it can be fine NV (unless you get doubled!).</p>

<h2>2. Bid 3NT more often</h2>

<p>When we have enough points for game, 3NT should always be on our radar, particularly as an alternative to 5 of a minor. It will not always be the best contract, but generally you should be looking for it, or at least, certainly not avoiding it. For example.</p>

${B3}

<p>With a 4333 opposite a balanced hand, just bid 3NT. Don't worry about looking for a major fit. It is these type of situations, and others which might be marginal and players will say "Should I just bid 3NT or look for something else" - if 3NT is a sensible consideration, choose it!</p>

<h2>3. Open 1NT more</h2>

<p>"If it looks like 1NT, it is 1NT". All rules should be taken within reason and our judgement should still be applied, but this rule is a good one because 1NT is a high value bid - it shows a lot about your hand in a single bid. For example, this type of hand</p>

${B4}

<p>This should be an automatic 1NT opening and not a 1♦ opening. A time to rather open 1NT would be if your doubletons did not have points in them, then it becomes more justified to bid your suits naturally.</p>

<p>Some experts have taken this idea quite far and open 1NT on 6 card suits, even 6 card majors! (don't try that at home).</p>

<h2>4. You can "bash" games, but be "slow to slam".</h2>

<p>If you think you have game on, and things look like they line up, you can bid game. However, for slam we want to be quite careful. We do not want to speculatively bid slams that are unsound and end up 1 off. It can really hurt your scores unnecessarily!</p>

<h2>5. When you have a pass, just pass.</h2>

<p>I include this because bidding has become so aggressive in the modern day, that some people have seemingly forgotten how to pass. My favourite idea is that "if you have bid your hand already" you can pass. Ask yourself - does my partner already substantially know the nature and point count of my hand? Am I forced to bid, is pass an option?</p>

<p>If pass is an option and partner already knows, more or less, what your hand looks like - Pass is probably a good idea!</p>

<p><strong>Read next:</strong> <a href="/learn/bidding/kiss-2-consider-passing-more">Pass can be the best bid</a> &middot; <a href="/learn/bidding/takeout-doubles-bridge-complete-guide">Takeout Doubles in Bridge: The Complete Guide</a> &middot; <a href="/learn/bidding/preempting-first-seat-bold">Preempting in First Seat: When to Be Bold</a></p>

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
