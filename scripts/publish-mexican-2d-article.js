/**
 * Publish '18-19 "Mexican" 2D opening' to Firestore as a live, free article in
 * the Conventions family. URL: /learn/bidding/mexican-2d-opening
 * Idempotent (matched by slug or title). Body is Paul Dalley's content verbatim
 * (spell-check only: suprising->surprising, artner->partner), with bid shorthand
 * rendered as suit symbols and headings/boards as structural markup.
 *
 * Usage: node scripts/publish-mexican-2d-article.js --apply
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

const TITLE = '18-19 "Mexican" 2D opening';
const SLUG = "mexican-2d-opening";
const TEASER =
  "I have recently adopted the 2D opening as 18-19 points and balanced. It shows 2+ diamonds, it can be any balanced shape.";
const META_DESCRIPTION = TEASER;
const PRIMARY_KEYWORD = "mexican 2d opening";
const RELATED_LINKS = ["/learn/bidding/multi-2d-opening", "/learn/bidding/conventions"].join("\n");

const EMPTY = "*S-*H-*D-*C-";
const board = (south, dealer, bidding) =>
  `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="${south}" West="${EMPTY}" vuln="Nil Vul" dealer="${dealer}" bidding="${bidding}" />`;

const B1 = board("*S-K103*H-A9*D-AQ54*C-KQ105", "South", "_/_/_/1♣/3♠/P/P/?");
const B2 = board("*S-A1084*H-72*D-KQ108*C-AKQ5", "South", "_/_/_/1♣/P/1♠/P/4♠");
const B3 = board("*S-1053*H-AK84*D-72*C-Q542", "North", "_/1♣/1♠/X/4♠/X/P/?");
const B4 = board("*S-K108*H-A5*D-AQ102*C-KQ94", "South", "_/_/_/2♦/P/3♣/P/3♦/P/3♥");
const B5 = board("*S-K1082*H-A5*D-AQ10*C-KQ94", "South", "_/_/_/2♦/P/3♣/P/3♠");
const B6 = board("*S-K10843*H-72*D-AJ52*C-94", "North", "_/2♦/P/2♥/P/2♠/P/3♦");

const BODY_HTML = `
<p>I have recently adopted the 2♦ opening as 18-19 points and balanced. It shows 2+ diamonds, it can be any balanced shape. I strongly recommend using it, and many of the most successful pairs in the world are using it. What are the advantages?</p>

<h2>1. Immediately show your hand in a single bid</h2>

<p>Put yourself in this position,</p>

${B1}

<p>What do you do here? Partner may expect you to only have 12 points. Do you risk bidding 3NT and find out your partner has no points? Do you double with only 2 hearts? Do you pass and hope you're not missing game?</p>

<p>This is only one example, but the benefits of showing your hand in a single bid are very big, partner knows from the start your combined strength and the likely contract(s).</p>

<h2>2. Unburdens the rest of your system</h2>

<p>Playing standard methods you open say 1♣ and then plan to rebid 2NT most of the time. Now you can use that bid for another purpose. Another bid that is quite notorious is the following example</p>

${B2}

<p>That bid is "okay" but it doesn't give the partnership much room to cue bid or investigate slam generally - partner doesn't know whether you have a "good" 18-19 or a "bad" one.</p>

<h2>3. Improve the clarity of your other bids</h2>

<p>When you open 1♣ partner now knows you are either 11-14 balanced or otherwise you are a hand with clubs. Take this auction for example.</p>

${B3}

<p>In this auction playing standard methods, perhaps partner could be 18-19 perhaps and is just doubling on high card points. Partner may still not even have more than 2+ or 3+ Clubs, whatever your methods are. However, if you play the prescribed 2♦ opening, here you are sure partner can't have 18-19 balanced so must have a good hand with clubs. Additionally partner should not be balanced (or else would've opened 1NT or 2♦). You can be confident that 5♣ is making.</p>

<h2>4. It puts pressure on the opponents to pass</h2>

<p>Most of the time when you open 18-19, the opponents will pass. It is very risky to step into the auction after that opening bid. If they do, you can find yourself enjoying a big penalty double.</p>

<h2>5. It can be preemptive</h2>

<p>Similar to the above point, since the opponents will be reluctant to step into the auction, sometimes they will miss their game. This is a surprising but fairly common added little bonus. In other words - should they take a big risk and enter the auction? If not, occasionally when it is their hand they will miss it.</p>

<h2>Overall recommendation</h2>

<p>I have really enjoyed adding this bid to my system, I think its been a big winner overall. My recommendation is at least to try it and see for yourself. One extra thing to note - the bid comes up a LOT. I am not sure statistically how often it comes up, but for me it seems much more frequent than a weak 2 in diamonds for example. I think that is a good sign - giving a bid a use that comes up frequently.</p>

<h2>System after partner opens 2♦</h2>

<p>I'll start by giving the exact system, but after that I'll explain maybe a more helpful and user friendly version that covers 95% of auctions that actually come up.</p>

<h3>The full system</h3>

<p><strong>Responses to 2♦ opening.</strong></p>

<ul>
<li><strong>2♥</strong> = 4+S.
<br />Then
<ul>
<li><strong>3♣/♦</strong> = 4S, 5+minor</li>
<li><strong>3♥</strong> = 5+spades</li>
<li><strong>3♠</strong> = 6 spades, balanced slam try</li>
<li><strong>4minor</strong> = 6S, splinter</li>
</ul>
</li>
<li><strong>2♠</strong> = transfer to 2NT, may have 4H unbalanced
<br />Then
<ul>
<li><strong>3♣</strong> = 4+H, 5+minor. Opener bids 3♦, then 3♥ = clubs, 3♠ = diamonds</li>
<li><strong>3♦</strong> = 5+H, opener must accept, may just be signoff</li>
<li><strong>3♥</strong> = 31(54)</li>
<li><strong>3♠</strong> = 13(54)</li>
</ul>
</li>
<li><strong>2NT</strong> = as over mini-NT</li>
<li><strong>3♣</strong> = (54) majors
<br />
<ul>
<li><strong>3♦</strong> asks for shorter major</li>
</ul>
</li>
<li><strong>3♦</strong> = 44M</li>
<li><strong>3♥</strong> = 4S, balanced, choice of game</li>
<li><strong>3♠</strong> = 4H, balanced, choice of game</li>
<li><strong>3NT</strong> = 55M.</li>
</ul>

<h3>Explanation of the most common auctions</h3>

<p><strong>1. Responding with a 3 level bid shows various major hands. This comes up a lot.</strong></p>

<p>After 2♦, all the 3 level bids show various hands typically with 4 card major(s) or with 5-4 in both majors.</p>

<p><strong>2♦ — response 3♣</strong> = 5/4 in the majors either way. Opener then bids 3♦ to ask which way. You bid your shortest major in response. So, for example.</p>

${B4}

<p>Here partner has shown 5 spades and 4 hearts (a bit like smolen, we bid the shorter one so the 2♦ opening can declare the major). If opener had a 4 card major, he can bid it immediately over 3♣, for example lets change the hand up slightly</p>

${B5}

<p>Here opener has said okay, well I have 4 spades, knowing there is a fit (since responder is 5-4 in the majors, so must have at least 4 spades).</p>

<p><strong>2♦ — response 3♦</strong> = 4-4 exactly in the majors. Opener can now bid their major if they have it, or else bid 3NT.</p>

<p><strong>2♦ — response 3♥</strong> = 4 spades exactly. Interested in either playing in spades (if opener has 4 or 5), otherwise opener just bids 3NT</p>

<p><strong>2♦ — response 3♠</strong> = 4 hearts exactly. Same idea. Notice that the 2♦ opener always will play the hand - its a good idea to make the strong high card point hand declarer.</p>

<p><strong>2♦ — response 3NT</strong> = 5-5 in both majors.</p>

<p><strong>2. Responding to show exactly 5 cards in one of the majors.</strong></p>

<p>You start off by bidding on the 2 level - the suit you don't have. You then bid on the 3 level, 1 bid before your actual suit. Easiest to show this in an example</p>

${B6}

<p>We have 5 card spades, so</p>

<ul>
<li>step 1 is to bid on the 2 level, the suit we DON'T have (2♥)</li>
<li>Step 2 is to bid 1 bid before our actual suit on the 3 level, so, 3♦.</li>
</ul>

<p>Hope that is digestible if you're interested in playing the system. If anything is unclear or you're finding it difficult, please feel free to email me with questions.</p>

<p><a href="mailto:paul.dalley@hotmail.com">paul.dalley@hotmail.com</a></p>

<p><strong>Read next:</strong> <a href="/learn/bidding/multi-2d-opening">Multi two (2D) opening: How to play it and how to defend against it.</a> &middot; <a href="/learn/bidding/transfers-over-1c">Transfers over 1C: How They Work</a> &middot; <a href="/learn/bidding/what-is-a-convention-best-to-play">What is a convention, and what conventions are the best to play?</a></p>

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
