/**
 * Publish "Multi two (2D) opening: How to play it and how to defend against it."
 * to Firestore as a live, free article in the Conventions family.
 * URL: /learn/bidding/multi-2d-opening
 * Idempotent (matched by slug or title). Body is Paul Dalley's content verbatim;
 * bid shorthand rendered as suit symbols, headings/boards as structural markup.
 *
 * Usage: node scripts/publish-multi-2d-article.js --apply
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

const TITLE = "Multi two (2D) opening: How to play it and how to defend against it.";
const SLUG = "multi-2d-opening";
// Teaser = Paul's own opening line (verbatim) — replace with a custom one if wanted.
const TEASER = "The multi 2 opening, typically the multi 2D opening, has become very common.";
const META_DESCRIPTION = TEASER;
const PRIMARY_KEYWORD = "multi 2d opening";
const RELATED_LINKS = [
  "/learn/bidding/preempting-first-seat-bold",
  "/learn/bidding/landy-and-multi-landy",
  "/learn/bidding/what-is-a-convention-best-to-play",
  "/learn/bidding/conventions",
].join("\n");

const EMPTY = "*S-*H-*D-*C-";
const single = (south, dealer, bidding) =>
  `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="${south}" West="${EMPTY}" vuln="Nil Vul" dealer="${dealer}" bidding="${bidding}" />`;
const BA = single("*S-K1042*H-7*D-AQ104*C-KQ93", "East", "_/_/2♦");
const BB = single("*S-A1084*H-7*D-543*C-AQ1084", "North", "_/2♦/4♣");
const BC = single("*S-7*H-KQ108*D-A43*C-AJ842", "North", "_/2♦/P/2♠");
const BD = single("*S-J754*H-A103*D-4*C-J10842", "North", "_/2♦/P/3♥");
const BE = single("*S-AJ1084*H-76*D-KQ104*C-K3", "East", "_/_/2♦");
const BF = single("*S-98*H-KQ104*D-AK54*C-J103", "East", "_/_/2♦/X");
const BG = single("*S-98*H-KQ104*D-AK54*C-J103", "East", "_/_/2♦/X/2♠/X/P");

const BODY_HTML = `
<p>The multi 2 opening, typically the multi 2♦ opening, has become very common. It is a good idea to know how to play it and how to play against it, because you will encounter it a lot. Also your partner(s) may want to play it!</p>

<p>The basic structure is simple</p>

<p>2♦ opening = Weak 2 in a major, Or a strong hand (typically 20-21 but you can adjust that). It is common to only play it as showing the major, so if someone explains their bid as just "multi" it is not a silly question at all to say "what does it show specifically" or glance at their system card. It is common to only play it as showing a 6+ card major (either of hearts or spades, unknown at the point of opening 2♦) and some people like adding other meanings, such as an 8+ playing trick hand in a minor. I do not recommend that, and I will explain why shortly.</p>

<h2>The advantages of playing it</h2>

<p>The opponents don't know which suit you have or whether you have the strong hand. This can sometimes be an advantage, for example, What do you do with this hand when your opponent opens 2♦ multi</p>

${BA}

<p>You are pretty sure the opponent has 6 hearts, and if they simply opened 2♥ you would have a text-book takeout double. But what are you supposed to do over 2♦? The answer is still Double (I will explain my recommended defence shortly), but as you can see the auction starts off a little bit murky for the opponents, they don't know whats going on for a little while.</p>

<p>Also, if you choose to put in a very strong balanced hand as one of the options, (say 20-21), if the opponents overcall, they may be walking into a very dangerous situation! Or they are more conservative as a result of that possibility, and miss out as a result. Either way, it can potentially be wrong whatever they do.</p>

<h2>Disadvantages of playing it</h2>

<p>Just like their side does not know what is going on, nor do we. That is not always a good thing. For example, what do you do here?</p>

${BB}

<p>If partner opened 2♠, you would gladly and confidently bid 4♠ here, but in this context you can't really bid, partner can just have say 7 points and 6 hearts (and probably does), it is asking for trouble to enter on the 4 level. Not knowing what partner's suit is, is problematic.</p>

<p>An additional problem, when partner opens say 2♠, if you have a weak hand and say 4 or 5 spades, you can raise the spades immediately, potentially to the 4 level. However, if you have say 4 spades and 1 heart and partner opens 2♦, You can't move as partner may have hearts and not spades!</p>

<p>Overall the fact that neither side knows what suit the 2♦ bidder has can work well or badly for either side. Its a gambling style of bid, the logic is "I have a weak hand, the opponents probably have more points than us, lets be destructive and create chaos and hope it works in our favour". If that sounds like a style you enjoy playing go for it.</p>

<h2>Recommendation</h2>

<p>I have seen expert partnerships play multis and I have seen experts who strongly prefer to stay away from it. I prefer to know what suit my partner has straight away, so I don't like playing it. I think modern bidding is often quick, competitive and explosive - if we don't know what suit our partner has, we often will never know till the hand is over!</p>

<p>Lets now look at the system to play after partner opens 2♦, and the recommended defence in case your opponents open 2♦ against you!</p>

<h2>System if partner opens 2♦</h2>

<p>The standard way is to play any major bid, up to and including 4♥, as "pass or correct". So, 2♥, 2♠, 3♥, 3♠, 4♥ --&gt; Are all pass or correct. That means, very simply, "pass my bid if that is your suit, or otherwise bid your suit at the nearest available level". Lets look at a few example hands to get a sense for why we bid that way.</p>

<h3>Example 1</h3>

${BC}

<p>On this bid south has an excellent hand if the opener has hearts, whereas in the possible 6-1 spade fit South's hand is nothing special at all. The bid of 2♠ says "Pass or correct - if spades is your suit, pass it, if not, correct to hearts (3♥)." If in fact north does correct to 3♥, south will surely bid 4♥, as their hand is excellent with 4 card support, a singleton and 14 quality high card points.</p>

<h3>Example 2</h3>

<p>A common preemptive scenario</p>

${BD}

<p>Here south wanted to just get in the way and raise the preempt. Whatever major suit that north has for his 2♦ opening, south has support. The bid of 3♥ says "I'm happy to play in 3♥ if that is your suit, otherwise bid 3♠ and I have support for that also".</p>

<h2>How to defend against a 2♦ opening by the opponents</h2>

<p>There are a few main ideas.</p>

<p>1. Keep it simple, if you have a natural bid to make, do it. For example</p>

${BE}

<p>Simply bid 2♠, don't let thoughts like "what if spades is their suit" enter your mind. Just bid your hand normally.</p>

<p>2. If you don't have a clear bid, but have 12+ points, just double. Don't worry if you have both majors, you don't need both. So for example</p>

${BF}

<p>Simply start off with a double. It is not a good idea to pass with 12+ points because otherwise your side will never enter the auction. Double just says "I have 12-15 with no clear alternative natural bid (no long suit)".</p>

<p>One critical point, the next double is takeout, so for example.</p>

${BG}

<p>Partner has made a takeout double of 2♠, so you probably have a heart fit. You can simply bid 3♥ for now, showing that 12-15 you originally promised, and 4 hearts.</p>

<p>3. Bid 2NT with 16-18 points and balanced</p>

<p>This is just a normal NT bid, approximately 16-18. With 15 we would normally just double. You can use your judgement and decide to upgrade a good 15 if you like, to 2NT instead of X.</p>

<p>Overall 2♦ can be an intimidating bid when the opponents tell you it is a "multi", the best strategy is just to ignore it and bid your hand naturally. Remember you need to get in the auction with 12+ points, so often double will be the correct bid - that signals to partner that you have an opening hand but does not promise both majors. If you are thinking of playing a 2♦, go for it, its a matter of style but it certainly can work well!</p>

<p><strong>Read next:</strong> <a href="/learn/bidding/preempting-first-seat-bold">Preempting in First Seat: When to Be Bold</a> &middot; <a href="/learn/bidding/landy-and-multi-landy">Landy and Multi Landy</a> &middot; <a href="/learn/bidding/what-is-a-convention-best-to-play">What is a convention, and what conventions are the best to play?</a></p>

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
