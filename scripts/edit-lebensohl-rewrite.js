/**
 * Rewrite the Lebensohl article body with Paul's new content (was placeholder).
 * - Title -> "Lebensohl"
 * - Body: author's text (proofread for English only), with 5 auctions rebuilt as
 *   <MakeBoard>. Auction layout uses W-N-E-S columns + leading "_" per dealer
 *   (West:0, North:1, East:2, South:3) — confirmed from Bidding.js.
 * Backs up the current body first.
 * Usage: node scripts/edit-lebensohl-rewrite.js --apply
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

if (!process.argv.includes("--apply")) { console.error("Refusing to run without --apply."); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))) });
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const SUMMARY_ID = "fI7DC63YopLtZy9fIobM";
const BODY_ID = "wsCt4ouPgZU1cB86fj2A";
const NEW_TITLE = "Lebensohl";

const HID = '*S-*H-*D-*C-'; // hidden hand
const board = (south, dealer, bidding) =>
  `<MakeBoard boardType="single" position="South" North="${HID}" East="${HID}" South="${south}" West="${HID}" vuln="Nil Vul" dealer="${dealer}" bidding="${bidding}" />`;

const BODY = `<h3>Introduction to Lebensohl</h3>
<p>Always make sure to think about WHEN it applies. This is very important. It is not something we use in any/every auction — it only applies in 1 or 2 specific situations, subject to partnership agreement.</p>
<p>There are two times it applies.</p>

<p><strong>Firstly — after your side has bid 1NT, and the opponents interfere.</strong></p>
<p>For example:</p>
${board('*S-102*H-5*D-QJ108432*C-643', 'West', '1♥/1NT/2♥/?')}
<p>Here it would be nice to be able to compete to your 7-card suit, especially since you have a singleton in the opponents' suit. Defending 2♥ here doesn't seem like a very good idea. However, is a bid of 3♦ by you forcing? How will partner know that you have 3 points and not 10 points?</p>
<p>The way Lebensohl works in the above situation is, a direct bid of 3♦ is forcing. Whereas, if you want to compete to the 3 level with a bad hand, you start with the bid of 2NT. 2NT is completely artificial — it just says to partner "I have a weak hand, I'm just competing". Now partner knows not to just let you play in your long suit.</p>
<p>What does partner do over the 2NT bid? Partner is forced to bid 3♣, without even looking at their hand. This allows you to pass 3♣ if that is your suit, or otherwise bid your own suit. So with the hand above, the auction would continue:</p>
${board('*S-102*H-5*D-QJ108432*C-643', 'West', '1♥/1NT/2♥/2NT/P/3♣/P/3♦/P/P/P')}
<p>So, you have managed to eventually bid 3♦, but you started with the bid of 2NT which simply said "I have a weak hand where I just want to compete".</p>

<Callout type="rule"><p><strong>Rule:</strong> When the opponents bid over your 1NT, a bid of 2NT is artificial and means "I have a weak hand that I want to compete on the 3 level with".</p></Callout>

<p><strong>Secondly — after the opponents have opened a weak 2, and partner makes a takeout double.</strong></p>
<p>This seems like a rather specific situation, but because it comes up quite frequently, Lebensohl is used to solve a very specific problem. Let me put you in the shoes of the takeout doubler.</p>
${board('*S-2*H-A943*D-KQ5*C-AK1084', 'East', '_/_/2♠/X/P/3♦/P/?')}
<p>You have made a takeout double and partner has bid 3♦. Do you bid on? What if partner has 0 points — is it a good idea to? Probably not. What if they have, say, 8-11 points? Then surely it is a good idea?</p>
<p>Hopefully you can see the problem. This is the way Lebensohl works.</p>
<p>In that context (the opponents open a weak 2 and partner doubles), a bid of 2NT says "I have a very weak hand (0-7 points)". Once again, partner must always bid 3♣, so you can either play in clubs or correct to your longer suit.</p>
<p>Therefore, if responder to the double doesn't bid 2NT, and instead bids 3♦ directly as in the above example, it shows 8-11 points. Now partner doesn't need to worry, like we did in the example above, "what if he has very few points".</p>
<p>Lastly, if you have a game-forcing hand — often just bid game. So for example:</p>
${board('*S-104*H-KQ943*D-A1042*C-K10', 'West', '2♠/X/P/4♥')}
<p>Here we just bid 4♥, simple. However, sometimes we have more ambiguous hands — for example only a 4-card major (and partner only promises 3 hearts for the double typically). In such cases we can start by cue-bidding the opponents' suit. For example:</p>
${board('*S-104*H-KQ93*D-A1042*C-K108', 'West', '2♠/X/P/3♠')}
<p>Here partner will typically bid 3NT with a stopper, or otherwise often get the message that you have 4 hearts but not 5.</p>
<p><em>(Note: in future articles I will look at a slightly more sophisticated way to play Lebensohl where you can show this exact hand — 4 hearts with or without a stopper.)</em></p>

<h3>Compare and contrast the situations where Lebensohl applies</h3>
<p>There are some key differences and similarities that are worth thinking about in order to better understand how it works.</p>
<ol>
  <li>2NT is always the "I have a weak hand" bid. That is helpful for your memory!</li>
  <li>In the situation where a player opens (or overcalls) 1NT, the range of the hand is tightly defined — 15-17, say. So the idea is that responder knows whether they want to just compete (say 2-8 points) or want to bid game (say 9+ points).</li>
</ol>
<p>Contrast that to the situation where partner doubles the opponents' weak 2 — their range is, say, 12-25 points. That is why we need to be able to show intermediate hands (8-11) or bad hands. We don't have the luxury of looking at our hand and knowing whether our combined value is good enough just to compete or to bid game — partner's strength is unknown.</p>
<p>Overall, it's important to have the tools to be able to compete efficiently without going overboard. The Lebensohl 2NT bid — telling partner to STOP, I've got a weak hand — is extremely helpful when it comes to stopping in partscore when appropriate.</p>`;

(async () => {
  await db.collection("bidding").doc(SUMMARY_ID).set({ title: NEW_TITLE, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  console.log("title ->", NEW_TITLE);

  const ref = db.collection("biddingBody").doc(BODY_ID);
  const snap = await ref.get();
  const prev = (snap.data() || {}).text || "";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.writeFileSync(path.join(__dirname, `backup-lebensohl-body-rewrite-${stamp}.json`), JSON.stringify({ bodyId: BODY_ID, text: prev }, null, 2), "utf8");
  console.log("backup written (prev length", prev.length + ")");

  await ref.set({ text: BODY, body: { text: BODY }, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  console.log("UPDATED biddingBody/" + BODY_ID + " | new length", BODY.length);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
