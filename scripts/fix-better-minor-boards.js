/**
 * Fix the "Better minor or short club?" article:
 *  - Convert 6 broken JSX-style <MakeBoard> tags to the string-attribute format
 *    the content-app renderer actually understands (same format as cue-bidding).
 *  - Restore board 2 to the user's specified hand (AK84 872 KQ103 54) — it had
 *    been wrongly duplicated from the 3-3 minors hand.
 *  - Replace 2 broken read-next links with verified live opening-bid articles.
 * All prose preserved verbatim.
 *
 * Usage: APPLY=1 node scripts/fix-better-minor-boards.js
 */
const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");
const https = require("https");

const keyPath = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
].find((p) => fs.existsSync(p));
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))) });
const db = admin.firestore();
const APPLY = process.env.APPLY === "1";

// Single-hand board template matching the working cue-bidding format.
function board(hand, bid) {
  return (
    `<MakeBoard boardType="single" position="South" ` +
    `North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="${hand}" West="*S-*H-*D-*C-" ` +
    `vuln="Nil Vul" dealer="South" bidding="_/_/_/${bid}" />`
  );
}

// 6 boards in document order, hands EXACTLY as the user specified.
const B1 = board("*S-AK104*H-KQ92*D-873*C-54", "1♣");   // short club, no 4cd major/diamond
const B2 = board("*S-AK84*H-872*D-KQ103*C-54", "1♣");   // balanced 4432 short club (RESTORED)
const B3 = board("*S-AK84*H-872*D-KQ103*C-54", "1♦");   // same hand, better minor -> 1D
const B4 = board("*S-AK84*H-872*D-K103*C-K54", "1♣");   // 3-3 in minors
const B5 = board("*S-AK104*H-KQ92*D-873*C-54", "1♦");   // reproduce board 1, opens 1D
const B6 = board("*S-AK104*H-KQ92*D-54*C-873", "1♣");   // minors swapped, opens 1C

const BODY = `<h2>Two ways to play 1 of a minor</h2>

<p>There are basically three common ways of playing a 1 of a minor opening. It's important to know these so you can decide what system best suits you, but also so you can understand what your opponents are doing.</p>

<h3>Short club</h3>

<p>A 1♣ opening shows 2+ clubs if you are playing short club.</p>

<p>In the past players opened 4 card majors and simply opened 1♥. These days, since 5 card majors are by far the most common way of playing, we cannot open 1♥ or 1♠. Short club goes like this: a 1♦ opening always shows 4. If I don't have a 5 card major, and don't have a 4 card diamond suit, I open 1♣.</p>

<p>${B1}</p>

<p>Within the umbrella of short club, there is a slight variation which is fairly popular: players open all balanced hands 1♣ (all 4432 and 4333). For players that do that, 1♦ would show two things:</p>

<ol>
  <li>4+ diamonds</li>
  <li>An unbalanced hand (since all balanced hands open 1♣)</li>
</ol>

<p>For example, on this hand some short club players would open 1♣, since the hand is balanced (4432):</p>

<p>${B2}</p>

<p>That might look quite unusual to some players, but for others it might seem normal. If you don't like that style, the main thing is to understand what your opponents might be doing.</p>

<h3>Better minor</h3>

<p>The title almost fully describes it: when we can't open a major (we don't have a 5 card major) we open our better minor. That's normally very straightforward.</p>

<p>${B3}</p>

<p>It's fairly straightforward to notice that our diamonds are better.</p>

<p>One source of confusion is on these type of hands:</p>

<p>${B4}</p>

<p>With 3-3 in both minors, I recommend just opening 1♣. Why? If you are playing better minor, about 95% of the time you can rely on 1♦ being a 4 card suit, the only exact time when it is not is on this type of hand:</p>

<p>${B5}</p>

<p>1♦ is only 3 cards on one occasion: when we are exactly 4-4 majors and 3-2 in the minors like that. This is relatively uncommon.</p>

<p>1♣ however, is let's say "often 4 cards", but it can be 3 a bit more often. It is only when we have exactly 4-4 in the majors, but a bit more frequently than the 1♦ example. Let's look at why. We'll start by changing the above example slightly:</p>

<p>${B6}</p>

<p>I changed the minors around: this time we open 1♣ and it is 3 cards.</p>

<p>And also, if you follow my recommendation of opening 1♣ when you are 4333, that is the other time when 1♣ will be opened with 3 cards.</p>

<p>In summary: if you play better minor, 1♦ is normally 4 unless you're exactly 4432. 1♣ is often 4, but sometimes 3 (4423 or 4333).</p>

<h3>Advantages and disadvantages</h3>

<p><strong>Better minor advantages:</strong></p>

<ul>
  <li>You can generally rely on the opening bid as showing length in that suit more often than not.</li>
</ul>

<p><strong>Short club advantages:</strong></p>

<ul>
  <li>When you open 1♦, you know partner has 4 for sure.</li>
  <li>The second version of short club mentioned has the advantage of knowing that when partner opens 1♦, she always has 4 cards and is always unbalanced: that's quite useful information to know straight away.</li>
</ul>

<p><strong>Better minor disadvantages:</strong></p>

<ul>
  <li>We can't be sure a 1 minor opening is 4: it can be 3.</li>
  <li>We don't know whether it is balanced or unbalanced.</li>
</ul>

<p><strong>Short club disadvantages:</strong></p>

<ul>
  <li>1♣ is "nebulous": we don't really know about partner's 4 card suits yet. We just know that the 1♣ bidder is probably balanced.</li>
</ul>

<h3>Which should you play?</h3>

<p>I think it is a matter of style and what you get used to. I prefer playing 1♣ as showing any balanced hand, and 1♦ as being unbalanced with 4+ diamonds (discussed above as one of the options under short club). But that has its drawbacks as mentioned.</p>

<p>I think for an improving pair, better minor might be better so you can keep it simple. Have simple auctions like opening 1♦ and raising it. Especially in competition it's useful to know what suits partner has, as you often don't have time to clarify when the opponents interfere.</p>

<p>I have seen lots of very successful pairs play each method. There is no need to play one or the other: both can work at all levels. Find one you enjoy and feel comfortable with, but also, be aware what your opponents are doing. Mainly remember: if they are playing short club they could have 4 diamonds and 2 clubs when they open 1♣!</p>

<p><strong>Read next:</strong> <a href="/learn/bidding/transfers-over-1c">Transfers over 1C: How They Work</a> &middot; <a href="/learn/bidding/third-seat-openings-practical-aggression">Third Seat Openings: Practical Aggression</a> &middot; <a href="/learn/bidding/opening-2c-avoid-whenever-possible">Opening 2C: When (Not) to Use It</a></p>

<p><a href="/learn/bidding">Browse all Bidding conventions &rarr;</a></p>`;

(async () => {
  const snap = await db.collection("bidding").where("slug", "==", "better-minor-or-short-club").limit(1).get();
  if (snap.empty) throw new Error("Article not found");
  const bodyId = snap.docs[0].data().body;
  const ref = db.collection("biddingBody").doc(bodyId);

  console.log(`Article body: ${bodyId}`);
  console.log(`New body length: ${BODY.length} chars`);
  console.log(`MakeBoard tags: ${(BODY.match(/<MakeBoard/g) || []).length}`);

  if (!APPLY) {
    fs.writeFileSync(path.join(__dirname, "_better-minor-body-NEW.html"), BODY, "utf8");
    console.log("\n[DRY-RUN] Preview written to scripts/_better-minor-body-NEW.html");
    console.log("To apply: APPLY=1 node scripts/fix-better-minor-boards.js");
    return;
  }

  await ref.set({ text: BODY, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  console.log("✓ Firestore updated");
})().catch((e) => { console.error(e); process.exit(1); });
