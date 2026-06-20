/**
 * Publish "Landy and Multi Landy" into the bidding articles (hub: NT conventions).
 * Modelled on publish-conventions-and-slam-articles.js. Idempotent (matched by title).
 * Usage: node scripts/publish-landy-article.js
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error("Missing serviceAccountKey.json");
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))) });

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;
const HUB_PATH = "/bidding/advanced";

const iterativelyReplace = (string, suit) => {
  let oldString = string;
  let newString = "";
  let indexOf = oldString.indexOf(suit);
  while (indexOf !== -1) {
    newString += oldString.slice(0, indexOf);
    oldString = oldString.slice(indexOf + 1);
    if (oldString.slice(0, 7) !== "</span>" && oldString[0] !== "/" && oldString[0] !== '"') {
      newString += `<span class="red-suit">${suit}</span>`;
    } else {
      newString += suit;
    }
    indexOf = oldString.indexOf(suit);
  }
  if (newString === "") return oldString;
  return newString + oldString;
};
const prepareArticleStringForSave = (html) => {
  const parts = html.split(/(<MakeBoard[^>]*\/>)/);
  return parts
    .map((p) => (p.includes("MakeBoard") ? p : iterativelyReplace(iterativelyReplace(p, "♥"), "♦")))
    .join("");
};

const board = (south, dealer, bidding) =>
  `<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="${south}" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="${dealer}" bidding="${bidding}" /></p>`;

const article = {
  slug: "landy-and-multi-landy",
  title: "Landy and Multi Landy",
  teaser:
    "Landy and Multi Landy: a popular way to overcall the opponents' 1NT. What each bid shows, which hands to act on, and how the auctions continue.",
  metaDescription:
    "Landy and Multi Landy explained: how to overcall a 1NT opening to show both majors (Landy 2♣) and single-suited or two-suited hands (Multi Landy), with worked examples and follow-up bids.",
  primaryKeyword: "landy multi landy 1nt overcall bridge",
  bodyHtml: `
<h2>Landy and Multi Landy</h2>
<p>This article is going to look at a very popular way of overcalling when the opponents open 1NT. I'll define exactly what the bids are so you can confidently use them, and also give some advice on what type of hands might or might not be a good idea to act on.</p>

<h3>What is Landy and Multi Landy?</h3>
<p>For starters, we are talking about when the opponents have opened 1NT and it is your turn to bid. This can be when the 1NT is opened on your right, or when it is opened on your left and followed by two passes — for example:</p>
${board("*S-AK104*H-KQ943*D-4*C-542", "West", "1NT/P/P/?")}
<p>In this context, 1NT was opened on your left and has been passed around to you. Wouldn't it be great if you had a bid to show both majors? :)</p>
<p>But contrast it ever so slightly:</p>
${board("*S-AK104*H-KQ943*D-4*C-542", "West", "1NT/P/2♣/?")}
<p>This time, responder to the 1NT bidder has bid Stayman. Landy and Multi Landy ONLY apply directly after the 1NT bid. If any other bidding has come after the 1NT opener (other than a pass) — such as Stayman, a transfer, or anything else — Multi Landy no longer applies!</p>

<h3>What is Landy?</h3>
<p>"Landy" is a convention that was popularised by a bridge player with the surname Landy. That seems to happen a lot — for example, Stayman was named the same way.</p>
<p>It simply refers to the overcall of 2♣ after a 1NT opener. This 2♣ bid shows both majors.</p>
<p>So, moving back to our previous example:</p>
${board("*S-AK104*H-KQ943*D-4*C-542", "West", "1NT/P/P/2♣")}
<p>Here South has shown both majors. It is slightly ambiguous because we don't know which major will be longer, but typically we have 5-5 in each major, or 5-4.</p>
<Callout type="expert">
<p>Helpful tip: it would be great if we could define it more exactly, but then it would be too restrictive. We prefer to have slightly looser requirements but bid it more frequently.</p>
</Callout>

<h3>Can Landy show 4-4 only in the majors, or does it have to be 5-4?</h3>
<p>The answer mostly depends on the <a href="/learn/bidding/vulnerability">vulnerability</a>. In modern partnerships, the style is to bid quite aggressively when not vulnerable, and many expert partnerships would consider taking a "gamble" and bidding it on 4-4 shape when not vulnerable.</p>
<p>When we are vulnerable, 5-4 is a good idea as a minimum. It gives us a greater likelihood of finding a fit — for example, if partner is 3-3 in the majors, we have an 8-card fit.</p>

<h3>Suit quality and hand quality</h3>
<p>Whether to bid Landy or not will often be a matter of judgement, which comes down to hand-evaluation skills. These are some key ideas that are universally worth knowing when thinking about whether to bid or not:</p>
<ul>
<li>Bid with distributional hands (singletons are a good start); do less and/or pass with balanced hands (think 4-4-3-2, or even 5-4-2-2). Shapes such as 5-4-3-1 or 4-4-4-1 are typically a lot better than the similar shapes mentioned above without a singleton.</li>
<li>Look at suit quality.</li>
</ul>
${board("*S-Q10942*H-KQ108*D-A54*C-2", "East", "1NT/?")}
<p>This hand is a great hand to bid. You have 5-4 shape, which is a nice start, but your suits are also good. You have nice cards in your majors, and the 10's, 9's and even 8's in those suits are good things. Contrast that hand with:</p>
${board("*S-Q7643*H-K642*D-K4*C-Q2", "East", "1NT/?")}
<p>This hand is not nearly as attractive to bid. The major suits are much more bare. The shape is worse (5-4-2-2 instead of 5-4-3-1), and half the points are in the short suits! (As a general rule, if you make a bid to show both majors, you want most of your points to be in both your majors.)</p>

<h3>Partner's response to 2♣ (which shows both majors)</h3>
<p>a) The most common response will be 2♥ or 2♠, which will be partner's longest major. It does not necessarily mean you have a fit, but for example:</p>
${board("*S-Q104*H-8*D-J943*C-A8542", "West", "1NT/2♣/P/2♠")}
<p>You just bid 2♠, hoping for an 8-card fit but acknowledging the clear possibility of a 7-card fit.</p>
<p>On a side note — do not pass 2♣ unless you have, say, 6-7 decent clubs. Expect partner to have 0-1 clubs if you pass it.</p>
<p>b) 2♦ response — "I'm equal length; let's play in your longest major." As discussed, Landy often shows 5-4 in the majors, either way. That means either hearts or spades could be the 5-card suit. When you bid 2♣ Landy and partner has 3-3 in both majors (or, unfortunately, 2-2), it is good if partner has a way to say "let's play in your longest major". That is exactly what 2♦ shows, so for example:</p>
${board("*S-Q104*H-854*D-A2*C-98743", "West", "1NT/2♣/P/2♦/P/2♥/P/P/P")}
<p>Here you have just asked partner to bid their longest major; they have told you that hearts is their longest, or that they are equal length (hopefully 5-5 if they are equal).</p>
<p>Overall, this gives you the best chance of finding your fit, or your best fit.</p>
<Callout type="mistake">
<p>Note: make sure to chat about the 2♦ response — it is otherwise a common source of confusion!</p>
</Callout>

<h3>Other bids</h3>
<p>Other bids are far less frequent than the ones mentioned above — so I highly recommend learning those first. Also, other bids are typically not as "standard" as the above; it is often a matter of partnership, and I have seen a lot of variance over the years. Here is a suggestion that is reasonably common.</p>
<p><strong>2NT.</strong> This is the main tricky one — a strong enquiry, "We might have game on". You want to have at least 3 cards in a major, but often 4+. Let's say your range for this is approximately 13 or 14+ points and a fit. Here is a suggestion for what your bids should mean after this:</p>
<ul>
<li>3♣ — any minimum hand. Partner can now sign off in a major if they wish.</li>
<li>3♦ — any maximum hand with 5 spades and 4 hearts.</li>
<li>3♥ — any maximum hand with 5 hearts and 4 spades.</li>
<li>3♠ — any maximum hand with 5-5 in both suits.</li>
</ul>
<p>The logic behind these bids is that partner always has the opportunity to leave the contract at 3♥ or 3♠ if they want, should your response not suit them. Unless you are 5-5 in both majors and a maximum — in which case partner is presumably happy and will bid on.</p>
<p>So, for example:</p>
${board("*S-AQ1084*H-AK542*D-74*C-2", "East", "1NT/2♣/P/2NT/P/3♠")}
<p>These two 5-card suits look quite reasonable, especially opposite partner's 14+ points. Show a maximum with two 5-card suits.</p>
<p><strong>3M.</strong> This shows a 4-card raise and a decent hand, inviting partner to game if they have extras — especially if you have hit a 5-card suit (so you have a 5-4 fit). For example:</p>
${board("*S-Q2*H-AQ54*D-5*C-1085432", "West", "1NT/2♣/P/3♥")}
<p>You have a very decent hand and 4-card support. If partner has 5 hearts and a good hand, you might be in business! You might also be tempted to try to buy the hand in 2♥. Perhaps — but the opponents likely have a big diamond fit (remember, partner has length in the majors and shortage in the minors), so they will probably compete to 3♦ anyway. Get in before they can!</p>
<p>By far the majority of hands are now taken care of. I've played the convention for decades, and against it for just as long, and I rarely (if ever) come across the need for auctions beyond that. It is worth having a chat to partner about, but as always, keep it simple.</p>

<h3>What about Multi Landy?</h3>
<p>Multi Landy adds a few more tools onto the 1NT overcall. They are:</p>
<ul>
<li>2♣ — both majors (as discussed above)</li>
<li>2♦ — a single major (typically 6 cards)</li>
<li>2♥ — 5 hearts and 4+ of either minor</li>
<li>2♠ — 5 spades and 4+ of either minor</li>
</ul>

<h3>Why this is a good idea</h3>
<p>It gives you a wide range of hands you can bid when the opponents open 1NT. But remember — always consider suit quality and vulnerability, as discussed earlier. It also gives you a safety net: if you bid 2♠, for example, and you hit partner with a singleton spade, they may have more cards in the minors, so you may have safety there.</p>

<h3>Follow-up bids — after 2♦, showing a single major</h3>
<p>2♥ / 2♠ / 3♥ / 3♠ / 4♥ — all of these are the same. They are pass-or-correct: asking partner either to pass if that is their suit, or to correct to their suit at the lowest available level.</p>
<p>For example, after 1NT (West) – 2♦ (partner) – P – 2♠ (you): you expect partner to have spades and pass in your 6-2 fit. BUT if they have hearts, you want partner to keep bidding, to at least the 3 level. In fact, you might even raise that to game with your 10-card fit and useful cards!</p>
<p>After 2♦, 2NT shows a strong enquiry — say 12+ points and a fit. On such a hand you would like to show strength, and at least a 6-2 fit. If partner has hearts you're in business; and if partner has extra length, shape, and/or strength, you might have enough for game in spades.</p>

<h3>After 1NT–2♥ or 1NT–2♠ (showing a 5-card major and 4+ minor)</h3>
<p>Firstly, by far the most frequent bid here is pass, so expect that, say, 70% of the time or more.</p>
<p>Otherwise, partner may want to retreat to their minor. 3♣ is pass-or-correct, which means "partner, pass this if you have clubs, or correct to diamonds if that is your second suit".</p>
${board("*S-2*H-A942*D-K842*C-Q973", "West", "1NT/2♠/P/3♣")}
<p>Here you are happy to play in your minor fit; no need to sit still in the 5-1 spade fit.</p>
<p>The final idea is that after you overcall 2♥ or 2♠, partner may respond 2NT with about 13+ points and at least a fit for one of the suits. Most of the time you will just bid your minor, unless you have, say, 12+ points. My suggestion is:</p>
<ul>
<li>3♥ — shows a good hand with clubs</li>
<li>3♠ — shows a good hand with diamonds</li>
</ul>
<p>So, for example:</p>
${board("*S-AK1042*H-7*D-KJ42*C-K53", "East", "1NT/2♠/P/2NT/P/3♠")}
<p>Here you have shown a good hand with diamonds as your second suit.</p>

<h3>Conclusion</h3>
<p>Overall, it is a good idea to play these conventions for a couple of reasons:</p>
<ul>
<li>It comes up a lot — the 1NT opening is very common, so it's good to still be able to compete, especially when you aren't vulnerable. It's also good to be able to show good hands when you are vulnerable, because sometimes you have game on despite the opponents starting with 1NT!</li>
<li>It makes the opponents' lives more difficult if you get in the way of their 1NT auction.</li>
<li>By playing this system you will often be safer than just bidding a single-suited bid.</li>
</ul>
<p>So, for example:</p>
${board("*S-AK1094*H-2*D-KQ102*C-543", "East", "1NT/?")}
<p>On this hand, with no methods you may bid 2♠, and partner could have a singleton (as shown in the earlier example); whereas with this system, you have communicated another feature of your hand — safer, and it leads to better contracts.</p>
<p>Enjoy being an active bidder and a pesky opponent — but always remember, don't overdo it, and consider suit quality, shape (singletons are good), and vulnerability.</p>
`.trim(),
};

async function getNextArticleNumber() {
  const snapshot = await db.collection("bidding").get();
  const max = snapshot.docs.reduce((acc, doc) => {
    const n = Number((doc.data() || {}).articleNumber || 0);
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);
  return max + 1;
}

async function main() {
  const existing = await db.collection("bidding").where("title", "==", article.title).limit(1).get();
  const summaryRef = existing.empty ? db.collection("bidding").doc() : existing.docs[0].ref;
  const existingBodyId = existing.empty ? null : (existing.docs[0].data() || {}).body;
  const bodyRef = existingBodyId ? db.collection("biddingBody").doc(existingBodyId) : db.collection("biddingBody").doc();
  const now = FieldValue.serverTimestamp();
  const articleNumber = existing.empty
    ? String(await getNextArticleNumber())
    : String((existing.docs[0].data() || {}).articleNumber || "");

  const processed = prepareArticleStringForSave(article.bodyHtml);

  const summaryPayload = {
    id: summaryRef.id,
    articleType: "bidding",
    difficulty: "4",
    articleNumber,
    slug: article.slug,
    title: article.title,
    category: "Bidding",
    subcategory: "Conventions and Artificial Methods",
    seoSubtopic: "Conventions and Artificial Methods",
    teaser: article.teaser,
    metaDescription: article.metaDescription,
    primaryKeyword: article.primaryKeyword,
    relatedLinks: HUB_PATH,
    ctaTarget: HUB_PATH,
    body: bodyRef.id,
    isFree: true,
    freeUpdatedAt: now,
    updatedAt: now,
  };
  if (existing.empty) summaryPayload.createdAt = now;

  await summaryRef.set(summaryPayload, { merge: true });
  await bodyRef.set({ id: bodyRef.id, text: processed, body: { text: processed }, updatedAt: now }, { merge: true });
  console.log(`Published "${article.title}" -> ${HUB_PATH}/${article.slug}  (summary ${summaryRef.id}, body ${bodyRef.id})`);
  console.log(`MakeBoards in body: ${(processed.match(/<MakeBoard/g) || []).length}; Callouts: ${(processed.match(/<Callout/g) || []).length}`);
}

main().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
