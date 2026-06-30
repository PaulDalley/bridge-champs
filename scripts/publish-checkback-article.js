/**
 * Publish "Two-way checkback: all you need to know" to Firestore as a live, free
 * article. URL: /learn/bidding/two-way-checkback
 * Idempotent (matched by slug or title). Body is Paul Dalley's content verbatim;
 * bold lines -> headings, "(ai rule/box)" -> Callouts, bid shorthand -> suit
 * symbols, boards as MakeBoard. Spellcheck (clear mistakes only): consdired->
 * considered, WHat->What, worthwile->worthwhile; title de-typo'd + de-duplicated.
 * Two H3 subheadings ("The 2D bid" / "The 2C bid") authored at Paul's request.
 *
 * Usage: node scripts/publish-checkback-article.js --apply
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

const TITLE = "Two-way checkback: all you need to know";
const SLUG = "two-way-checkback";
const TEASER = "Checkback is considered to be essential by many partnerships - it is a convenient way of inviting or game forcing on the 2 level.";
const META_DESCRIPTION = TEASER;
const PRIMARY_KEYWORD = "two-way checkback";
const RELATED_LINKS = [
  "/learn/bidding/fourth-suit-forcing-checkback-core",
  "/learn/bidding/transfers-over-1c",
  "/learn/bidding/system-over-1nt-conventions",
  "/learn/bidding/conventions",
].join("\n");

const EMPTY = "*S-*H-*D-*C-";
const single = (south, dealer, bidding) =>
  `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="${south}" West="${EMPTY}" vuln="Nil Vul" dealer="${dealer}" bidding="${bidding}" />`;

// 2D game force; opener then bids naturally (2H = 4 hearts).
const B1 = single("*S-KQ1084*H-AK54*D-J2*C-104", "North", "_/1♣/P/1♠/P/1NT/P/2♦");
const B2 = single("*S-KQ1084*H-AK54*D-J2*C-104", "North", "_/1♣/P/1♠/P/1NT/P/2♦/P/2♥");
// 2C checkback used to play in 2D (weak with diamonds).
const B3 = single("*S-A1084*H-7*D-QJ9642*C-53", "North", "_/1♣/P/1♠/P/1NT/P/2♣/P/2♦/P/P/P");
// 2C checkback then 2H = invitational, 5 spades 4 hearts.
const B4 = single("*S-KQ1084*H-AQ53*D-75*C-42", "North", "_/1♣/P/1♠/P/1NT/P/2♣/P/2♦/P/2♥");
// Don't checkback for its own sake: no major fit to chase (South to act).
const B5 = single("*S-K1084*H-AK5*D-QJ3*C-J104", "North", "_/1♣/P/1♠/P/1NT/P");
// Checkback only after a 1NT rebid: here 2C is natural.
const B6 = single("*S-K1084*H-72*D-5*C-AKQ954", "South", "_/_/_/1♣/P/1♥/P/1♠/P/2♣");

const BODY_HTML = `
<p>Checkback is considered to be essential by many partnerships - it is a convenient way of inviting or game forcing on the 2 level. Lets look at how it works.</p>

<h2>The standard checkback sequence</h2>

<Callout type="rule">After opener rebids 1NT (showing 12-14 points), a bid of 2♣ and 2♦ are both checkback.</Callout>

<p>In this context, the bids are as follows</p>

<p>2♣ = Artificial (does not show clubs), any invitational hand OR Diamonds and weak.</p>

<p>2♦ = Any game force hand.</p>

<p>Let's look at some examples. I'll start with 2♦ since its a bit simpler, it only has one meaning.</p>

<h3>The 2♦ bid</h3>

${B1}

<p>Here we would like to game force with 2♦. Now we can conveniently find a possible major fit, otherwise we will settle for 3NT as the final contract.</p>

<p>NOTE: after the bid of 2♦ (checkback), all bids are natural, for example</p>

${B2}

<p>Here opener has shown 4 hearts, simple and natural.</p>

<h3>The 2♣ bid</h3>

<Callout type="rule">2♣ is artificial, it forces opener to bid 2♦. Responder then either passes that OR bids on. IF responder bids on, the hand should be invitational strength.</Callout>

<p>a) A hand that wants to play in 2♦.</p>

<p>This is a useful quirk of the system, if you have a hand that suits playing in 2♦, for example</p>

${B3}

<p>A sensible contract, we used 2♣ checkback just to get opener to bid 2♦, and then passed it!</p>

<p>But make an important note, when responder bids 2♣ checkback, they don't always have diamonds, look at the next example.</p>

<p>b) An invitational hand, typically say 11ish points. For example</p>

${B4}

<p>We've shown an invitational hand (by going through 2♣ checkback), and have rather naturally just shown spades and hearts. We will be 5 spades and 4 hearts (with 4-4 we would've bid 1♥ initially).</p>

<h2>Why bid checkback?</h2>

<p>We normally bid checkback to look for a major fit. Don't bid checkback as a matter of routine, only bid it if you need it. For example</p>

${B5}

<p>Would you bid checkback here? Contrast that to the previous example where we could have a heart or spade fit still, and we would like to investigate</p>

<Callout type="expert">Just bid 3NT if it looks correct, don't bid checkback for the sake of it, have a reason (looking for a major fit).</Callout>

<h2>Some important things to clarify</h2>

<p>I suggest that checkback only applies after a 1NT rebid. Contrast that, for example with this auction.</p>

${B6}

<p>In this context I suggest just having 2♣ as natural, it is sensible to be able to play in opener's club suit.</p>

<h2>Common issues</h2>

<p>1. What happens in competition? My suggestion for most partnerships is to just agree, as always, "System off in competition". This is an easy catch all rule, no one can get confused. So in competition the bids will be natural.</p>

<p>2. Forgetting checkback is very common if you're not used to it. It is important for you and partner to have a good attitude and be patient.</p>

<p>3. Remember it only applies after a 1NT rebid (and not in competition). Don't invent other auctions where it applies unless it is specifically agreed with partner.</p>

<p>Overall I think it is a worthwhile convention to learn. It is high value, high frequency (it comes up a lot), and reasonably easy to remember once you get used to it. Also, you may find your opponents playing it regularly, so its worth knowing what is going on!</p>

<p><strong>Read next:</strong> <a href="/learn/bidding/fourth-suit-forcing-checkback-core">Fourth Suit Forcing: How and When to Use It</a> &middot; <a href="/learn/bidding/transfers-over-1c">Transfers over 1C: How They Work</a> &middot; <a href="/learn/bidding/system-over-1nt-conventions">System Over 1NT: Transfer Responses and Conventions</a></p>

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
