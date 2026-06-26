/**
 * Publish "Stayman Convention" — the cornerstone / base article for the Stayman
 * cluster — to Firestore as a live, free article.
 * URL: /learn/bidding/stayman-convention   (hub lives at /learn/bidding/stayman)
 * Idempotent (matched by slug or title). Body is Paul Dalley's content verbatim
 * (unambiguous typos fixed — see PR note); bid shorthand rendered as suit symbols,
 * headings/boards/callout as structural markup only.
 *
 * Usage: node scripts/publish-stayman-base-article.js --apply
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

const TITLE = "Stayman Convention";
const SLUG = "stayman-convention";
// Teaser = Paul's own opening sentence (verbatim) — replace if a custom meta is wanted.
const TEASER = "Stayman is one of the most commonly used conventions out there, so much so that in many countries you do not even need to alert it.";
const META_DESCRIPTION = TEASER;
const PRIMARY_KEYWORD = "stayman convention";
const RELATED_LINKS = [
  "/learn/bidding/weak-stayman-know-helps",
  "/learn/bidding/smolen-convention-show-5-4",
  "/learn/bidding/puppet-stayman-check-5-card",
  "/learn/bidding/stayman",
].join("\n");

const EMPTY = "*S-*H-*D-*C-";
const single = (south, dealer, bidding) =>
  `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="${south}" West="${EMPTY}" vuln="Nil Vul" dealer="${dealer}" bidding="${bidding}" />`;

// Board 1 — what it is: 1NT(S)-P-2C, opener's hand (4 spades).
const B1 = single("*S-AK104*H-76*D-AQ104*C-K83", "South", "_/_/_/1NT/P/2♣");
// Board 2 — simply bid your major: ...2C-P-2S.
const B2 = single("*S-AK104*H-76*D-AQ104*C-K83", "South", "_/_/_/1NT/P/2♣/P/2♠");
// Board 3 — both majors -> bid 2H.
const B3 = single("*S-AK104*H-AQ104*D-76*C-K83", "South", "_/_/_/1NT/P/2♣/P/2♥");
// Board 4 — no major -> bid 2D.
const B4 = single("*S-76*H-K83*D-AK104*C-AQ104", "South", "_/_/_/1NT/P/2♣/P/2♦");
// Board 5 — weak hand, no plan after 2D (South to act).
const B5 = single("*S-KQ104*H-83*D-10943*C-872", "North", "_/1NT/P/2♣/P/2♦/P");
// Board 6 — invitational, 2NT backup after 2D.
const B6 = single("*S-KQ104*H-83*D-10943*C-A87", "North", "_/1NT/P/2♣/P/2♦/P/2NT");
// Board 7 — 5-card major: transfer, don't Stayman (South to act).
const B7 = single("*S-KQ1084*H-76*D-A542*C-75", "North", "_/1NT/P");
// Board 8 — 5-4 majors: Smolen (South to act).
const B8 = single("*S-KQ1084*H-A542*D-76*C-75", "North", "_/1NT/P");
// Board 9 — Puppet Stayman: 1NT(S)-P-3C-P-3S.
const B9 = single("*S-AQ1084*H-98*D-KQ10*C-A53", "South", "_/_/_/1NT/P/3♣/P/3♠");

const BODY_HTML = `
<h2>What is it</h2>

${B1}

<p>Stayman is one of the most commonly used conventions out there, so much so that in many countries you do not even need to alert it! As shown in the auction above, after a player opens 1NT, 2♣ is completely artificial, asking the opener whether they have a 4 card major. It is so simple and useful, that almost all pairs use it.</p>

<h2>Responses to Stayman</h2>

<h3>1. Simply bid your major</h3>

${B2}

<p>As you can see, bidding your major is straight forward and natural.</p>

<h3>1a. What about if you have both majors?</h3>

<p>Lets change the hand slightly</p>

${B3}

<p>With both majors the correct way is to bid 2♥.</p>

<Callout type="expert">A good way to remember it is the same as if partner opens 1♣ and you have 4 cards in both of the majors, you should start with hearts</Callout>

<p>So, if you glance back up to the first example where the player responded 2♠, that will deny 4 card hearts! Whereas, a 2♥ response will show 4 hearts, and may or may not have 4 spades as well.</p>

<h3>1b. What about if I don't have any majors?</h3>

<p>Once again lets change the hand slightly,</p>

${B4}

<p>The artificial bid of 2♦ says "I do not have a 4 card major". Some players ask - why not just bid 2NT without both majors? There are various follow ups that make it important to bid 2♦, for example <a href="/learn/bidding/weak-stayman-know-helps">Garbage stayman</a>.</p>

<h2>When should I use stayman and Is there a strength requirement?</h2>

<p>If partner opens 1NT, there are a few requirements for you to bid Stayman:</p>

<p>1. Firstly you need one or two 4 card majors, unless you are exactly 4-3-3-3 shape. With that shape the recommendation is to just play in NT, your hand is very balanced opposite a balanced opener - 3NT will often be a better game than 4♥ or 4♠ (you only need to make 9 tricks in 3NT).</p>

<p>2. Typically you need to be invitational strength or better. Lets look at why it is a bad idea otherwise.</p>

${B5}

<p>With the above hand the player has gone wrong by bidding stayman, they should have just passed 1NT. Why? Because what is she supposed to do after partner bids 2♦ or 2♥. We need to think 1 step ahead, we need a follow up plan. Let me show you what I mean with a further example.</p>

${B6}

<p>On this hand stayman was fine, basically we can look at it like this "I hope I find a spade fit, but if not, I'll just bid 2NT invitational to 3NT". In other words, there was a back up plan, which is why typically you need to be invitational strength or better.</p>

<p>There is a common exception and that is <a href="/learn/bidding/weak-stayman-know-helps">garbage stayman</a> can be bid with both majors and a weak hand.</p>

<h2>When should I avoid stayman?</h2>

<p>The main times to avoid stayman are mostly already discussed, but lets just list them</p>

<ol>
<li>When you are weak. In order to bid stayman you need to be invitational strength or better, unless you have both majors (garbage stayman time!).</li>
<li>If you are 4-3-3-3</li>
<li>If you do not have at least 1 4 card major.</li>
</ol>

${B7}

<p>For example on this hand, we should <a href="/learn/bidding/transfers-must-have-tool-nt">transfer</a> by bidding 2♥. It would be a mistake to bid stayman with a 5 card major (unless you have 4 in the other major, see below).</p>

<h2>Where does Smolen fit in?</h2>

<p>This is an area which trips up a lot of players. Smolen is the bid you make when you have a 4 card major, and 5 or more in the other major. So, for example</p>

${B8}

<p>On this hand we have 5 spades and 4 hearts. Should we transfer, should we stayman? The answer is <a href="/learn/bidding/smolen-convention-show-5-4">Smolen</a> which we have a full article on. One important thing, this is not a given or automatic agreement, make sure to discuss with partner "Do you know what smolen is / do you want to play smolen?"</p>

<h2>What is extended stayman and should I use it?</h2>

<p>Extended stayman is the topic for another article. I personally do not recommend it. It has extra bids to show range and 5 card majors. It has its positives and negatives.</p>

<h2>What is puppet stayman?</h2>

<p>In the standard NT arsenal, a lot of people play 3♣ response to 1NT as puppet stayman. That bid asks about 5 card majors. For example</p>

${B9}

<p>On this hand responder has asked "Do you have a 5 card major". We simply bid it if we do, or otherwise bid 3♦ saying no. There is a full article on <a href="/learn/bidding/puppet-stayman-check-5-card">puppet stayman</a> as well.</p>

<h2>Summary and recommendation</h2>

<p>Stayman is one of the most common and arguably essential conventions. I recommend it strongly for its simplicity, and because most players who have been playing a little while will already know it, so your chance of having a misunderstanding is lower. I would stay away from extended stayman, but strongly consider playing "garbage stayman" so you have more flexibility to bid with weak hands as well.</p>

<p><strong>Read next:</strong> <a href="/learn/bidding/weak-stayman-know-helps">Garbage stayman: Stayman with weak hands</a> &middot; <a href="/learn/bidding/smolen-convention-show-5-4">Smolen Convention: Show 5-4 Majors After Stayman</a> &middot; <a href="/learn/bidding/puppet-stayman-check-5-card">Puppet Stayman: How to Check for 5-Card Majors</a></p>

<p><a href="/learn/bidding/stayman">Browse all Stayman &rarr;</a></p>
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
