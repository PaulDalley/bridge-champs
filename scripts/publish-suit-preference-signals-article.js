/**
 * Create / update the Defence > Signals article
 *   "Suit preference signals (McKenney, Lavinthal)"
 * in the live `defence` / `defenceBody` collections.
 *
 * Content is the user's verbatim text (spell/typing fixes only). Structure,
 * diagrams (MakeBoard) and callouts are scaffolding. Alt names (McKenney,
 * Lavinthal) are carried in the title, slug and meta fields for SEO.
 *
 *   node scripts/publish-suit-preference-signals-article.js        # publish (live)
 *   DRY=1 node scripts/publish-suit-preference-signals-article.js  # validate only
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error("Missing serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const SUMMARY_COL = "defence";
const BODY_COL = "defenceBody";
const SLUG = "suit-preference-signals-mckenney-lavinthal";
const TITLE = "Suit preference signals (McKenney, Lavinthal)";

// --- Three full 4-seat boards: East = dummy, South = you, N/W hidden. ---
const BOARD_TRUMP =
  '<MakeBoard boardType="full" position="full" North="*S-*H-*D-*C-" East="*S-AKQ*H-KJ9*D-942*C-KJ94" South="*S-985*H-AQ108*D-Q83*C-1082" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="East" bidding="_/_/1NT/P/4♠/P/P/P" />';
const BOARD_LENGTH =
  '<MakeBoard boardType="full" position="full" North="*S-*H-*D-*C-" East="*S-10842*H-1083*D-KJ4*C-KJ8" South="*S-9*H-KQ952*D-AQ109*C-542" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="South" bidding="_/_/_/1♥/1♠/3♥/4♠/P/P/P" />';
const BOARD_AK =
  '<MakeBoard boardType="full" position="full" North="*S-*H-*D-*C-" East="*S-KQ4*H-10853*D-KQ*C-10863" South="*S-10*H-AK42*D-A842*C-7542" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="West" bidding="1♠/P/2♠/P/4♠/P/P/P" />';

const RED_H = '<span class="red-suit">♥</span>';

const BODY = [
  "<p>Bridge today is very competitive. Expert pairs are doing everything they can to get any extra edge, and one area where experts are exploiting is suit preference signals.</p>",
  "<p>But before we look at it, lets be clear - good signalling is all about simplicity and clarity. Two very important things that I like to clarify</p>",
  "<p><strong>1.</strong> On partner's lead, set a signal. My suggestion is high or low to encourage, whichever you prefer. However, DO NOT treat this as a suit preference signal, be clear and simple, it is an attitude signal</p>",
  '<Callout type="mistake"><h3>Important note</h3><p>One big area where players go wrong is they give a suit preference signal when partner is expecting an attitude signal.</p></Callout>',
  '<p><strong>2.</strong> On your first discard, make it clear what that is - I suggest attitude signal again. So lets say you\'re playing low encourage - if you discard the 2 of spades on your first discard, you are encouraging spades - simple but important! Do not say to partner later "I thought my 2 of spades was asking for a club". NO - it is low to encourage (or high encourage if you are playing that).</p>',
  "<p>So, only after getting out of the way the important organisational skills needed for a good partnership - knowing what signal applies at what time, can we look at some excellent times where suit preference should apply. There are an enormous amount of times where suit preference can apply when both players start thinking along these lines, I'm going to highlight a few of the main ones.</p>",
  '<h2 id="play-of-the-trump-suit-in-defence">Play of the trump suit in defence</h2>',
  "<p>" + BOARD_TRUMP + "</p>",
  "<p>On this hand partner leads a diamond, your Queen is taken by declarer's Ace. Declarer then plays three rounds of spades. Have a look at your hand, if partner was on lead, what suit would you want partner to play? A heart of course, so signal the highest suit by playing your 9 of spades, then the 8, then the 5. Playing your trumps from highest to lowest should strongly indicate that you want the highest suit.</p>",
  "<p>Summary: Play your small trump cards meaningfully - convey to partner whether you want the high suit or low suit when they get on lead.</p>",
  '<h2 id="when-declarers-length-in-a-suit-is-known">When declarer\'s length in a suit is known</h2>',
  "<p>A very typical time is when you have bid and raised a suit.</p>",
  "<p>" + BOARD_LENGTH + "</p>",
  "<p>Partner's bid of 3" + RED_H + " showed a 4 card heart raise. Partner now leads the Ace of hearts - it should be clear to you that declarer has only a singleton heart - partner has 4, so the distribution is 4351. It is in this time that players tend to use their heart cards as suit preference. You would love a diamond, so play your highest heart - the K or the Q should do it. Whereas, if you wanted a club, you could play the 3 - your absolute lowest. (Experts go so far as to play the 9 showing ambivalence or tolerance for either switch - I suggest starting off simple and working up towards more nuanced signalling eventually, don't try to do too much with signalling if you're not used to it as it can take a big toll on your mental energy).</p>",
  '<h2 id="when-you-have-the-ace-and-king">When you have the Ace and King</h2>',
  "<p>This is a very common time, lets look at an example</p>",
  "<p>" + BOARD_AK + "</p>",
  '<p>Partner leads the 9 of hearts which looks like a singleton or a doubleton. From your perspective the next three tricks are certain, your ace and king will win them and then you\'ll give partner a ruff. Why not at the same time make partner\'s life easier, send the message "Come back the high suit when you are in, not the low suit!".</p>',
  "<p>Win the Ace, then cash the King, then give your partner a ruff - partner should get used to this idea - why did you win the Ace then play the King, not the other way around? - it should convey a suit preference signal.</p>",
  '<Callout type="expert"><p>Overall: There are many places to start inserting suit preference signals. The key is to not confuse moments where attitude signals apply, and then as a partnership evolve into noticing the moments where suit preference may apply - the main leap is to start noticing.</p></Callout>',
  '<h3>Where to next</h3><ul><li><a href="/beginner/articles/defence/bridge-signals-beginners-attitude-count">-> Related: Bridge Signals: Attitude, Count, and Suit Preference</a></li><li><a href="/learn/defence/signals">-> Back to Defence: Signals</a></li></ul>',
].join("\n");

const summaryFields = {
  title: TITLE,
  slug: SLUG,
  teaser:
    "Defence focus: Suit preference signals (McKenney, Lavinthal). Learn a practical defensive decision that helps you take more tricks and apply pressure.",
  metaDescription:
    "Defence article: Suit preference signals (McKenney, Lavinthal). Learn a practical defensive signalling concept and apply it at the table with confidence.",
  primaryKeyword: "suit preference signals",
  seoSubtopic: "Suit Preference Signals",
  category: "Defence",
  subcategory: "Signals",
  ctaTarget: "/defence/articles",
  relatedLinks: [
    "/beginner/articles/defence/bridge-signals-beginners-attitude-count",
    "/beginner/articles/defence/odds-evens-discarding-bridge-should",
    "/defence/articles",
  ].join("\n"),
  articleType: "defence",
  difficulty: "2",
  isFree: true,
};

// Parse a MakeBoard hand string ("*S-AKQ*H-KJ9*D-942*C-KJ94") into {suit,rank} cards.
function parseHand(handStr) {
  const cards = [];
  String(handStr).split("*").slice(1).forEach((seg) => {
    if (!seg) return;
    const suit = seg[0];
    const body = seg.slice(2); // strip "S-"
    if (!body) return;
    body.replace(/10/g, "T").split("").forEach((t) => cards.push({ suit, rank: t === "T" ? "10" : t }));
  });
  return cards;
}

// Sanity: each filled hand has 13 cards and NO card appears twice across the board.
function checkBoards() {
  const boards = [["trump", BOARD_TRUMP], ["length", BOARD_LENGTH], ["ace-king", BOARD_AK]];
  for (const [name, b] of boards) {
    const seen = new Map();
    for (const seat of ["North", "East", "South", "West"]) {
      const m = b.match(new RegExp(seat + '="([^"]*)"'));
      const cards = parseHand(m ? m[1] : "");
      if (cards.length && cards.length !== 13) {
        throw new Error(`Board "${name}" ${seat} has ${cards.length} cards (expected 13): ${m[1]}`);
      }
      for (const c of cards) {
        const key = c.suit + "-" + c.rank;
        if (seen.has(key)) {
          throw new Error(`Board "${name}": DUPLICATE ${c.rank}${c.suit} in ${seat} and ${seen.get(key)}`);
        }
        seen.set(key, seat);
      }
    }
  }
  console.log("Board check OK: filled hands = 13 cards, no duplicate card across any board.");
}

async function main() {
  checkBoards();

  const existing = await db.collection(SUMMARY_COL).where("slug", "==", SLUG).limit(1).get();
  const summaryRef = existing.empty ? db.collection(SUMMARY_COL).doc() : existing.docs[0].ref;
  const existingBodyId = existing.empty ? null : (existing.docs[0].data() || {}).body;
  const bodyRef = existingBodyId
    ? db.collection(BODY_COL).doc(existingBodyId)
    : db.collection(BODY_COL).doc();

  // Next article number (only when creating new).
  let articleNumber = existing.empty ? null : String((existing.docs[0].data() || {}).articleNumber || "");
  if (existing.empty) {
    const snap = await db.collection(SUMMARY_COL).get();
    const max = snap.docs.reduce((m, d) => Math.max(m, Number((d.data() || {}).articleNumber || 0) || 0), 0);
    articleNumber = String(max + 1);
  }

  const learnUrl = `/defence/articles/${SLUG}`;
  console.log(existing.empty ? "CREATE" : "UPDATE", SUMMARY_COL + "/" + summaryRef.id, "body", BODY_COL + "/" + bodyRef.id);
  console.log("articleNumber:", articleNumber, "| url:", learnUrl, "| body length:", BODY.length);

  if (process.env.DRY) {
    fs.writeFileSync(path.join(__dirname, "tmp-suit-pref-body.html"), BODY, "utf8");
    console.log("\nDRY RUN — wrote body preview to scripts/tmp-suit-pref-body.html (NOT Firestore).");
    return;
  }

  const now = FieldValue.serverTimestamp();
  await summaryRef.set(
    {
      id: summaryRef.id,
      ...summaryFields,
      articleNumber,
      body: bodyRef.id,
      bodyCollection: BODY_COL,
      freeUpdatedAt: now,
      updatedAt: now,
      ...(existing.empty ? { createdAt: now } : {}),
    },
    { merge: true }
  );
  await bodyRef.set(
    {
      id: bodyRef.id,
      text: BODY,
      body: { text: BODY },
      isFree: true,
      freeUpdatedAt: now,
      updatedAt: now,
    },
    { merge: true }
  );

  console.log("\nDONE. Live at https://bridgechampions.com" + learnUrl);
}

main().then(() => process.exit(0)).catch((e) => { console.error("\n" + e.message); process.exit(1); });
