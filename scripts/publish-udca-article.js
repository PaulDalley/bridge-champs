/**
 * Publish "UDCA signals" into the defence articles (hub: Defence > Signals).
 * Defence summary collection `defence` + body `defenceBody`; URL /defence/articles/<slug>.
 * Idempotent (matched by title). Usage: node scripts/publish-udca-article.js
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error("Missing serviceAccountKey.json");
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))) });

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;
const SUMMARY = "defence";
const BODY = "defenceBody";
const HUB_PATH = "/learn/defence/signals";

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

const article = {
  slug: "udca-signals",
  title: "UDCA signals",
  teaser:
    "UDCA (upside-down count and attitude) explained: what each signal means, when it applies, and the alternatives — so you always know what \"we play UDCA\" means at the table.",
  metaDescription:
    "UDCA signals in bridge (upside-down count and attitude): low = like, high = discourage, reverse count (high from odd), when it applies on lead and on discards, plus alternatives.",
  primaryKeyword: "udca signals bridge upside down count attitude",
  bodyHtml: `
<h2>UDCA signals</h2>
<p>UDCA — what it actually means. UDCA stands for "upside down count and attitude". Let's have a look at the main things you need to know for when your opponents or partner say "I play UDCA". Also, let's look at the advantages, disadvantages and alternatives.</p>

<h3>The main things you need to know</h3>
<p>1. On the opening lead, expect your opponents to be giving upside-down attitude. That means that if they like the lead, they will play the lowest card they have.</p>
<Callout type="expert"><p>A lot of people use the memorable rhyme "Low = like".</p></Callout>
<p>2. One slightly confusing thing about the opening lead: it's often normal to signal low from a doubleton against a suit contract — so with, say, the 8 and 2 of a suit, to play the 2. So in summary, low = I like the suit, or I have a doubleton (and want to ruff).</p>
<p>3. On the opening lead, if the player thinks attitude is not relevant or is already clear, they may signal count: they will play low from even, high from odd. So, for example:</p>
<p>North (dummy) holds ♠KQJ10 and East holds ♠943. On this hand a spade is led, and East will typically contribute the 9, showing an odd number of cards.</p>

<h3>When else does UDCA apply?</h3>
<p>The most important time to watch out for UDCA is when a player discards — meaning they don't follow suit, so they play a card of a different suit.</p>
<p>For example, you are declaring 4♠ and you play 3 rounds of trumps; one opponent doesn't follow to the third round and plays the 2 of clubs. The normal way to play that is low = like, high = discourage. However, some partnerships may be showing count, in which case the 2 of clubs will show an even number of cards (think 2, 4, 6).</p>
<Callout type="expert"><p>It is always a good idea to ask your opponents more specifically — for example, you can say "What does your first discard show?", or check their system card.</p></Callout>
<p>Another significant time it applies is when you (declarer) are playing your own suit. For example, in 3NT the opponents lead their suit, you win it, and you play your long club suit. The opponents may be giving count here, again low from even, high from odd.</p>

<h3>Advantages, disadvantages and alternatives</h3>
<p>You will get people telling you about the reasons why UDCA is better than natural signals. (Natural signals are basically the same thing except the other way around: high = encourage, low = discourage; also high from even, low from odd.)</p>
<p>The truth is there have been, and continue to be, many successful pairs that play both types of signals. There are situations where I can give examples of natural signals being much better, and vice versa. My honest opinion is that it is more a matter of taste and preference, with very little or no difference in terms of one having an advantage over the other.</p>

<h4>Alternatives</h4>
<p>1. Some people like playing odds and evens, but this is normally ONLY for the first discard — it does not apply to the signal to partner's opening lead (see <a href="/beginner/articles/defence/odds-evens-discarding-bridge-should">Odds and Evens Discarding</a>). I don't particularly recommend using it, but again, the main point is to enjoy bridge — so if you enjoy using it, go for it.</p>
<p>2. Some people play more suit preference than count, so they don't really play UDCA most of the time, but perhaps they will still say "I play UDCA" when relevant. In other words: if I am giving count it is upside down, and if I am giving attitude it is reverse. Again, for these partnerships, if they are experienced together, it might be best to actually ask them on a given trick what their agreement is in that particular situation.</p>
<p>3. Some people only give count, so then your question should be: reverse count or natural count? (Does high show even — natural count — or does high show odd — reverse count?)</p>

<h3>Overall</h3>
<p>I think it's best not to worry too much about which one is better. Players have won world championships playing both, so you can get to the top level of bridge with either.</p>
<p>The main thing is to know what your opponents are talking about when they say "we play UDCA". And the TLDR message is:</p>
<Callout type="rule"><p>UDCA means low = like, high = discourage. And reverse count: high from odd, low from even. The best idea is to ask them in a specific trick which of those signals apply — "Hey, that card your partner just played, would it be attitude or count?"</p></Callout>
<p>One small tip: don't ask your opponent to interpret the signal. For example, if they play the 4 of clubs, don't say "was that low or high?", but you can say "is that attitude or count?".</p>
`.trim(),
};

async function getNextArticleNumber() {
  const snapshot = await db.collection(SUMMARY).get();
  const max = snapshot.docs.reduce((acc, doc) => {
    const n = Number((doc.data() || {}).articleNumber || 0);
    return Number.isFinite(n) ? Math.max(acc, n) : acc;
  }, 0);
  return max + 1;
}

async function main() {
  const existing = await db.collection(SUMMARY).where("title", "==", article.title).limit(1).get();
  const summaryRef = existing.empty ? db.collection(SUMMARY).doc() : existing.docs[0].ref;
  const existingBodyId = existing.empty ? null : (existing.docs[0].data() || {}).body;
  const bodyRef = existingBodyId ? db.collection(BODY).doc(existingBodyId) : db.collection(BODY).doc();
  const now = FieldValue.serverTimestamp();
  const articleNumber = existing.empty
    ? String(await getNextArticleNumber())
    : String((existing.docs[0].data() || {}).articleNumber || "");

  const processed = prepareArticleStringForSave(article.bodyHtml);
  const summaryPayload = {
    id: summaryRef.id,
    articleType: "defence",
    difficulty: "2",
    articleNumber,
    slug: article.slug,
    title: article.title,
    category: "Defence",
    subcategory: "Signals",
    seoSubtopic: "Defensive Signals",
    teaser: article.teaser,
    metaDescription: article.metaDescription,
    primaryKeyword: article.primaryKeyword,
    relatedLinks: HUB_PATH,
    ctaTarget: HUB_PATH,
    body: bodyRef.id,
    bodyCollection: BODY,
    isFree: true,
    freeUpdatedAt: now,
    updatedAt: now,
  };
  if (existing.empty) summaryPayload.createdAt = now;

  await summaryRef.set(summaryPayload, { merge: true });
  await bodyRef.set({ id: bodyRef.id, text: processed, body: { text: processed }, updatedAt: now }, { merge: true });
  console.log(`Published "${article.title}" -> /defence/articles/${article.slug}  (summary ${summaryRef.id}, body ${bodyRef.id})`);
  console.log(`Callouts: ${(processed.match(/<Callout/g) || []).length}`);
}

main().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
