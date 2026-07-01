/**
 * Publish "Cue bidding: Slam bidding made simple" to Firestore as a live, free
 * article. URL: /learn/bidding/cue-bidding
 * Idempotent (matched by slug or title). Body is Paul Dalley's content verbatim;
 * bold lines -> headings, "(ai insert rule ...)" -> Callouts, bid shorthand ->
 * suit symbols, boards as MakeBoard. Spellcheck: only "KIngs"->"Kings" applied
 * (see PR note for flagged-but-unchanged slips). EXAMPLE 1 South hand was 14
 * cards (AK108432 = 7 spades); rendered as AK10843 (6 spades) pending confirmation.
 *
 * Usage: node scripts/publish-cue-bidding-article.js --apply
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

const TITLE = "Cue bidding: Slam bidding made simple";
const SLUG = "cue-bidding";
const TEASER = "Cue bidding is used by most expert level partnerships, and I highly recommend it for all partnerships.";
const META_DESCRIPTION = TEASER;
const PRIMARY_KEYWORD = "cue bidding";
const RELATED_LINKS = [
  "/learn/bidding/best-slam-bidding-conventions",
  "/learn/bidding/blackwood-rkcb",
  "/learn/bidding/5nt-pick-slam-practical-partnership",
  "/learn/bidding/conventions",
].join("\n");

const EMPTY = "*S-*H-*D-*C-";
const single = (south, dealer, bidding) =>
  `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="${south}" West="${EMPTY}" vuln="Nil Vul" dealer="${dealer}" bidding="${bidding}" />`;

// Example 1 — partial (South to act after 4H). South = AK10843 (6 spades, see note).
const B1 = single("*S-AK10843*H-KQ104*D-87*C-4", "South", "_/_/_/1♠/P/3♠/P/4♣/P/4♥/P");
// Example 1 — full deal (N+S shown), signed off in 4S.
const B2 = `<MakeBoard boardType="double" position="North/South" North="*S-QJ95*H-AJ983*D-QJ10*C-A" East="${EMPTY}" South="*S-AK10843*H-KQ104*D-87*C-4" West="${EMPTY}" vuln="Nil Vul" dealer="South" bidding="_/_/_/1♠/P/3♠/P/4♣/P/4♥/P/4♠/P/P/P" />`;
// Sign-off example — minimum/bad hand just bids game.
const B3 = single("*S-K5432*H-QJ4*D-KQ*C-J103", "South", "_/_/_/1♠/P/3♠/P/4♠");
// Bids below 3NT are natural — 3H is natural, South bids 3NT.
const B4 = single("*S-AQ10*H-543*D-K104*C-10873", "North", "_/1♦/1♠/2♦/2♠/3♥/P");
// No slam prospects — just bid game, don't cue bid.
const B5 = single("*S-QJ1043*H-72*D-8*C-A10543", "North", "_/1NT/P/2♥/P/2♠/P/3♣/P/4♣/P");
// Example 2 — below 3NT both sides angle for 3NT; South shows spade values with 3S (to act).
const B6 = single("*S-AQ10*H-72*D-Q1084*C-10832", "North", "_/1♦/P/3♦/P/3♥/P");

const BODY_HTML = `
<p>Cue bidding is used by most expert level partnerships, and I highly recommend it for all partnerships - its not difficult to understand and it is worth the effort to learn.</p>

<h2>Clarify this with your partner</h2>

<p>What does a cue bid show? That may sound like a simple question, but the answer varies greatly depending who you ask. I'll give my recommendation and also look at where there might be confusion.</p>

<Callout type="rule">Cue bidding shows 1st OR 2nd round control in a suit. Typically it also shows extra strength.</Callout>

<h2>What is 1st or 2nd round control</h2>

<p>First round control is an Ace or a void in a suit (if you have agreed a trump suit). Put simply, first round control simply means "I can win the first round if that suit is played!"</p>

<p>Second round control is a King or a singleton, similarly this means "I can win the second round of the suit if that suit is played!".</p>

<p>Cue bidding, at least initially (other articles will be coming with exceptions), shows EITHER 1st or 2nd, so we are left guessing to an extent, but it is a guess that is not normally a problem.</p>

<h2>The main idea of a cue bid</h2>

<p>If we are thinking of slam, we don't want to be wide open in any of the suits. If for example, the opponents can cash the Ace and King of diamonds, taking us down in our slam, its a good idea to try to avoid it, for example take this auction</p>

<h3>Example 1.</h3>

${B1}

<p>Let's assume for simplicity that 3♠ showed slam interest (not a typical modern treatment). Lets look at the rest of the auction</p>

<p>4♣ - I have a reasonable or better hand, if I had a bad hand I wouldn't cue bid altogether (one aspect of cue bidding is that it shows a good hand). I also have 1st or second round control in clubs (in this case a singleton).</p>

<p>4♥- Partner is saying - I also have a good hand, and I have 1st or 2nd round control in hearts, but NOT diamonds. Why not diamonds?</p>

<Callout type="rule">If you do not cue bid a suit, it denies control there, that is the main way we diagnose if we have two straight forward losers in a suit (the Ace and King).</Callout>

<p>So in example 1, partner has denied an Ace or King of diamonds, and doesn't either have a singleton or void - Since we do not either have a control in diamonds, we simply sign off, we are absolutely sure slam is a bad idea. This is the full hand</p>

${B2}

<p>As you can see, we could simply lose the first 2 diamond tricks, which we have diagnosed, and successfully stayed out of slam.</p>

<h2>Should we always cue bid?</h2>

<p>No, with a bad idea it is good to simply sign off, conveying that message clearly to partner. It is very rare that partner will be able to bid slam despite you having a total minimum hand. So, for example</p>

${B3}

<p>Once again lets assume 3♠ was a slam try hand. In this case its not a good idea to cue bid your diamond King. It is much better to convey to partner "I have a terrible hand, if that is relevant to you, sign off!". In an experienced partnership, the players are aware of what type of hands might sign off, for example its common to make the rules</p>

<p>1. A minimum hand</p>

<p>AND</p>

<p>2. A hand without many Aces and Kings (these are often the key ingredient for slam if partner has an appropriate hand).</p>

<p>In other words, we don't sign off with all minimum hands. It needs to be a minimum AND a bad hand - lots of queens and jacks, not many Aces and Kings.</p>

<h2>Essential cue bidding rule: "Bids below 3NT are natural"</h2>

<p>This is an essential rule, particularly when a minor is agreed, for example</p>

${B4}

<p>Partners bid of 3♥ is natural. <u>It is not a cuebid</u>. Since 3NT is one of our favourite contracts, bids below 3NT should basically communicate two main things "I have natural hearts (4+ cards, not a cue bid) in case we have a fit, otherwise is 3NT a viable contract rather than 5 of a minor". We have no problem bidding 3NT with those cards in spades, likely we have a double stopper.</p>

<h3>Example 2.</h3>

<p>In this very similar hand where you have 4 diamonds.</p>

${B6}

<p>In the auction 3♦ showed 7-11 points with a 4 card raise, without a 4 card major. Partner's 3♥ bid is not a cue bid, partner is angling for 3NT, showing where their values are. We can now bid 3♠ showing that we have values there. The main point to remember - below 3NT, our bids are focused on getting to 3NT. Partner had a singleton in spades and didn't want to directly bid it and lose the first 5 spade tricks! Partner didn't know at that point whether 5♦ or 3NT is best, we discovered that 3NT was best.</p>

<p>So, Cuebids only apply when</p>

<p>1. We have agreed a major</p>

<p>2. Generally only on the 4 level and higher. (there is an exception people play where they treat 3♠ as a cue bid, when hearts are already agreed. Why? Because otherwise to find out whether partner has a cue bid, we would have to bid 4♠, which forces us to the 5 level! Don't worry too much about this if its new to you, just have it in the back of your mind in case partner wants to play that).</p>

<h2>Main source of confusion</h2>

<p>1. In the past it was common for cue bids to only show first round control (Aces or voids). In most auctions this is no longer considered the modern way, my recommendation is to use it as I've talked about above - 1st or 2nd round, and also as showing extra strength or in some way a decent hand.</p>

<p>2. Does it show extra strength or not - some people always cue bid, they say to not cue bid denies the ability to (no control in the suit). As mentioned I think it should also show extra strength, take for example this hand.</p>

<Callout type="rule">If you think your side has no prospect of slam, don't cue bid! Keep it simple and just bid game</Callout>

<p>For example</p>

${B5}

<p>5♣ here is already a contract that may need some luck, you only have a combined say 23 points. Just bid game, there's no reason to exaggerate your hand by cue bidding.</p>

<p>3. It only applies on the 4 level or higher (subject to the one exception)</p>

<h2>Overall</h2>

<p>I highly recommend learning cue bids and practicing them. Always keep it simple and remember you need to be thinking about slam in order to cue bid, with a very bad hand rather just sign off and let partner know your hand is bad.</p>

<p>Cue bids are so widely used that the benefit of learning them properly is</p>

<p>1. Partner may want to play them</p>

<p>2. To understand what the opponents are doing, in defence often it is helpful to know what the auction meant.</p>

<p><strong>Read next:</strong> <a href="/learn/bidding/best-slam-bidding-conventions">Best slam bidding conventions</a> &middot; <a href="/learn/bidding/blackwood-rkcb">Blackwood and Roman Key Card Blackwood (RKCB)</a> &middot; <a href="/learn/bidding/5nt-pick-slam-practical-partnership">5NT Pick a Slam: Practical Partnership Agreements</a></p>

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
