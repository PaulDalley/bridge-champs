/**
 * Migrate the two component-based bidding articles (Jacoby 2NT, Reverses) into the
 * normal Firestore article format (bidding + biddingBody), so they render through the
 * standard template (indexable, consistent). Content transcribed verbatim from
 * JacobyConventionArticle.js / ReversesArticle.js (tables -> bullet lists; auction
 * diagrams -> plain-text auctions). Idempotent (matched by title).
 *
 * Usage: node scripts/publish-jacoby-reverses-articles.js
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

const ARTICLES = [
  {
    slug: "jacoby-2nt",
    title: "Worthwhile Conventions #1 — Jacoby 2NT",
    teaser: "Jacoby 2NT: at least 4-card support and game-forcing values, with opener's rebids and continuations.",
    metaDescription:
      "Jacoby 2NT: core structure, opener rebids, and continuation methods after 1♥/1♠ — 2NT.",
    primaryKeyword: "jacoby 2nt convention bridge",
    bodyHtml: `
<h2>Worthwhile Conventions #1 — Jacoby 2NT</h2>
<p>Start simple. After 1♥ or 1♠, a 2NT response is Jacoby: at least 4-card support and game-forcing values.</p>
<h3>Core meaning</h3>
<ul>
<li>1♥ / 1♠ — 2NT shows a 4+ card raise in opener's major.</li>
<li>Game force: the partnership is committed to game.</li>
<li>The auction now focuses on shape and strength.</li>
</ul>
<h3>Opener rebids after Jacoby 2NT</h3>
<ul>
<li><strong>3♣</strong> — minimum hand, typically 14 or fewer.</li>
<li><strong>3♦</strong> — non-minimum, no shortage.</li>
<li><strong>3♥</strong> — non-minimum with lowest shortage (clubs).</li>
<li><strong>3♠</strong> — non-minimum with middle shortage (diamonds).</li>
<li><strong>3NT</strong> — non-minimum with highest shortage, the other major: ♥ if you opened 1♠, ♠ if you opened 1♥.</li>
</ul>
<h3>Continuations after opener rebids 3♣ (minimum)</h3>
<p><strong>Option A: ask for shortage.</strong> Responder bids 3♦ to ask whether opener has a shortage.</p>
<ul>
<li><strong>3♥</strong> — no shortage.</li>
<li><strong>3♠</strong> — low shortage (clubs).</li>
<li><strong>3NT</strong> — middle shortage (diamonds).</li>
<li><strong>4♣</strong> — high shortage, the other major: ♥ if you opened 1♠, ♠ if you opened 1♥.</li>
</ul>
<p><strong>Option B: responder shows own shortage.</strong> Instead of the 3♦ ask, responder can bid directly over opener's 3♣ (minimum) to show their own shortage:</p>
<ul>
<li><strong>3♥</strong> — low shortage (clubs).</li>
<li><strong>3♠</strong> — middle shortage (diamonds).</li>
<li><strong>3NT</strong> — high shortage, the other major: ♥ if partner opened 1♠; ♠ if partner opened 1♥.</li>
</ul>
`.trim(),
  },
  {
    slug: "reverses",
    title: "Reverses in Bridge: How to Identify, Bid, and Respond",
    teaser: "A practical guide to reverses: how to identify one, reverse vs 1NT, weak-hand responses, and competing.",
    metaDescription:
      "Learn reverses in bridge with practical examples: requirements, 1NT vs reverse decisions, weak-hand responses, and competitive reverse adjustments.",
    primaryKeyword: "reverses bridge bidding how to identify",
    bodyHtml: `
<h2>Reverses in Bridge: How to Identify, Bid, and Respond</h2>
<p>A practical guide from stage 3 problems 11-15. In this series I look at everything to do with reverses, from how to identify one through to how to respond to one, and everything in between. These bids are often misunderstood and vaguely defined, and players should be confident using them.</p>
<h3>How to clearly identify a reverse</h3>
<ul>
<li>If partner wants to get back to your first suit and it requires going to the 3-level, you are in reverse territory.</li>
<li>Standard requirement: 16+ points and an unbalanced hand.</li>
</ul>
<ul>
<li><strong>1♣ P 1♠ P 2♥</strong> — reverse: returning to clubs now needs 3♣.</li>
<li><strong>1♥ P 1♠ P 2♣</strong> — not a reverse: partner can still return to hearts at 2♥.</li>
</ul>
<h3>Reverse or 1NT?</h3>
<p>Do not force a reverse just because the hand is close. Some 2-4-2-5 type hands are balanced-ish enough for 1NT (especially without a 5-card major).</p>
<p>Also focus on where your points are. If your points are stacked in short suits, that is often a strong indication that 1NT is right.</p>
<p>The flavour of a reverse is quality suits and quality values in those advertised suits. If you reverse, you really mean it.</p>
<h3>How to respond to partner's reverse with a weak hand</h3>
<p>Practical recommendation: after partner reverses, use 2NT to show a bad hand. It says: "With your 16+, I don't think we have enough for game unless you have extra."</p>
<ul>
<li><strong>1♦ P 1♠ P 2♥ P ?</strong> — bid 2NT with weak/limited values.</li>
<li><strong>1♦ P 1♠ P 2♥ P 2NT P 3♦ P ?</strong> — usually pass; opener has retreated to their first 5+ suit.</li>
</ul>
<p>This area is partnership agreement. Keep it simple, discuss it clearly, and be on the same page.</p>
<h3>When not to reverse</h3>
<p>If you do not have enough to reverse, do not fudge it. Be accountable. Partner should be able to rely on reverse promises.</p>
<p>In those close spots, a natural rebid (like 2♣) is often the disciplined action.</p>
<h3>Reverses in competition</h3>
<p>In competitive auctions, things are fast-paced. You often do not have the luxury of normal non-competitive standards.</p>
<p>Reverses in competition are more about quality suits and practical competing values, not always a mountain of points.</p>
<p>In 2026, auctions are hypercompetitive. If you have a distributional hand with good suits, you have to get into the auction, otherwise it will pass you by.</p>
<h3>Train this theme</h3>
<ul>
<li><a href="/bidding/practice?difficulty=3&problem=bid3-11">Reverses problem 11: Identify the reverse</a></li>
<li><a href="/bidding/practice?difficulty=3&problem=bid3-12">Reverses problem 12: Reverse vs 1NT</a></li>
<li><a href="/bidding/practice?difficulty=3&problem=bid3-13">Reverses problem 13: Responding with weak values</a></li>
<li><a href="/bidding/practice?difficulty=3&problem=bid3-14">Reverses problem 14: Not enough to reverse</a></li>
<li><a href="/bidding/practice?difficulty=3&problem=bid3-15">Reverses problem 15: Competition adjustment</a></li>
</ul>
<p>Related reading: <a href="/bidding/advanced">Bidding articles</a> · <a href="/bidding/advanced/jacoby-2nt">Worthwhile Conventions: Jacoby 2NT</a> · <a href="/bidding/basics">Bidding basics</a></p>
`.trim(),
  },
];

async function getNextArticleNumber() {
  const snapshot = await db.collection("bidding").get();
  const max = snapshot.docs.reduce((acc, doc) => {
    const n = Number((doc.data() || {}).articleNumber || 0);
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);
  return max + 1;
}

async function publishOne(article, articleNumberFallback) {
  const existing = await db.collection("bidding").where("title", "==", article.title).limit(1).get();
  const summaryRef = existing.empty ? db.collection("bidding").doc() : existing.docs[0].ref;
  const existingBodyId = existing.empty ? null : (existing.docs[0].data() || {}).body;
  const bodyRef = existingBodyId ? db.collection("biddingBody").doc(existingBodyId) : db.collection("biddingBody").doc();
  const now = FieldValue.serverTimestamp();
  const articleNumber = existing.empty
    ? String(articleNumberFallback)
    : String((existing.docs[0].data() || {}).articleNumber || articleNumberFallback);

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
}

async function main() {
  let n = await getNextArticleNumber();
  for (const a of ARTICLES) {
    await publishOne(a, n);
    n += 1;
  }
}

main().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
