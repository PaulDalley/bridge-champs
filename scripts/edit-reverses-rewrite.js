/**
 * Rewrite the Reverses article body with Paul's new content (was placeholder).
 * - Title -> "Reverse bids in Bridge"
 * - Body: author's text (proofread for English only), 5 auctions as <MakeBoard>.
 *   NB: in the first example the prose "2S" is rendered "2♥" to match the auction
 *   (taking opener back to the first suit, hearts) — flagged to Paul.
 * Backs up the current body first.
 * Usage: node scripts/edit-reverses-rewrite.js --apply
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

if (!process.argv.includes("--apply")) { console.error("Refusing to run without --apply."); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))) });
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const SUMMARY_ID = "5cFCzz6EWhVg6MUcXxHS";
const BODY_ID = "5b2H7ZtIj26hmOHW4cka";
const NEW_TITLE = "Reverse bids in Bridge";

const HID = '*S-*H-*D-*C-';
const board = (south, dealer, bidding) =>
  `<MakeBoard boardType="single" position="South" North="${HID}" East="${HID}" South="${south}" West="${HID}" vuln="Nil Vul" dealer="${dealer}" bidding="${bidding}" />`;

const BODY = `<h3>Introduction</h3>
<p>Reverse bids are a natural bid of a second suit by opener, which shows extra strength. The difficulty for some people is to know what a reverse bid looks like in contrast to just a simple natural bid of a second suit. Let's look at examples and then come up with a simple rule.</p>
${board('*S-104*H-KQ1084*D-52*C-AK1082', 'South', '_/_/_/1♥/P/1♠/P/2♣/P/2♥')}
<p>This is a simple bid of a second suit, as we all know. One key characteristic I like to point out, in contrast to a reverse (example coming in a moment): responder can take you back to your first suit on the 2 level. As you can see in the above example, responder can just bid 2♥ if they don't want to stay in 2♣.</p>
<p>Let's contrast that with a reverse auction:</p>
${board('*S-104*H-AKQ8*D-6*C-AKQ943', 'South', '_/_/_/1♣/P/1♠/P/2♥/P/?')}
<p>On this hand, you have bid 2♥ as your second suit. This is a reverse and should show 17+ points. Let's say partner wanted to take you back to your first suit — they would have to go to 3♣. Can you see the contrast with the previous example where you could bail out on the 2 level?</p>
<p>If you think about that logically, you should need extra points to force to the 3 level!</p>

<h3>Criteria of a reverse</h3>
<ol>
  <li>16 or 17+ points. A lot of people lately have lowered the bar to 16+ points, which is okay. Discuss with your partner what your standards are; I recommend 16 or 17 points as a minimum — don't reverse with 15 points!</li>
  <li>An unbalanced hand. Typically a singleton, but a 5422 shape hand is also okay. Don't have a 4432 hand. These hands are either a 1NT opening or a 2NT rebid.</li>
</ol>
<p>On that note, let's consider this auction:</p>
${board('*S-A108*H-K932*D-KQ*C-AQ92', 'South', '_/_/_/1♣/P/1♠/P/?')}
<p>On this auction a 2NT rebid is appropriate, showing 18-19 balanced. It is not the right hand for a reverse of 2♥, which should show an unbalanced hand.</p>

<h3>What to do after a reverse?</h3>
<p>I recommend a very simple approach, with one main bid to remember.</p>
<p><strong>Key bid — 2NT.</strong> I suggest 2NT shows a weak hand (say less than 7 points). Basically saying to partner, I have a hand that isn't good enough to game-force opposite your 17 points.</p>
<p>That frees you up, because now every other bid you make is game-forcing. So, for example:</p>
${board('*S-AQ104*H-KQ10*D-98*C-10842', 'North', '_/1♣/P/1♠/P/2♥/P/3♣')}
<p>Here you can keep the bidding low and start off by showing partner you have a fit in clubs, without worrying he will pass.</p>

<h3>Hands that aren't strong enough to reverse</h3>
<p>There are some hands that would work perfectly for a reverse except they don't meet the point-count requirement. For example:</p>
${board('*S-1043*H-7*D-AK104*C-AK972', 'South', '_/_/_/1♣/P/1♥/P/?')}
<p>Here you would love to bid 2♦ to show your second suit, but it shows reverse strength! So you have to simply rebid 2♣. Rebidding your first suit will be a very common thing to do when you don't have the strength for a reverse.</p>

<h3>Final words</h3>
<p>Reverses are a very useful and natural way to bid a two-suited strong hand. I highly recommend keeping your standard of it showing 16 or 17+ high card points, and not doing it any time you have a two-suiter.</p>
<p>A key idea is to remember that responder bids 2NT as artificial to say "I have a bad hand, maybe we don't have enough for game", which frees up all other bids to be natural and game-forcing.</p>`;

(async () => {
  await db.collection("bidding").doc(SUMMARY_ID).set({ title: NEW_TITLE, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  console.log("title ->", NEW_TITLE);

  const ref = db.collection("biddingBody").doc(BODY_ID);
  const snap = await ref.get();
  const prev = (snap.data() || {}).text || "";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.writeFileSync(path.join(__dirname, `backup-reverses-body-rewrite-${stamp}.json`), JSON.stringify({ bodyId: BODY_ID, text: prev }, null, 2), "utf8");
  console.log("backup written (prev length", prev.length + ")");

  await ref.set({ text: BODY, body: { text: BODY }, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  console.log("UPDATED biddingBody/" + BODY_ID + " | new length", BODY.length);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
