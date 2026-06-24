/**
 * Publish "DONT convention: Interfering over No Trump" to Firestore as a live,
 * free article in the Conventions family (NT conventions).
 *
 * Creates: one summary doc in `bidding` + one body doc in `biddingBody`.
 * URL: /learn/bidding/dont-convention-interfering-over-1nt
 * Idempotent: re-running updates the existing doc (matched by slug or title).
 *
 * Body is Paul Dalley's content, verbatim — bid shorthand rendered as suit
 * symbols, list structure as <ol>/<ul>, one clear typo fixed (judgmenet ->
 * judgement) per his standing OK to fix typos. The meta description is a draft
 * for Paul to replace if he prefers.
 *
 * Usage: node scripts/publish-dont-article.js --apply
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

function getArgValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return null;
  const v = process.argv[i + 1];
  if (!v || v.startsWith("-")) return null;
  return v;
}
function resolveServiceAccountPath() {
  const fromFlag = getArgValue("--key");
  if (fromFlag) return path.resolve(fromFlag);
  if (process.env.FIREBASE_SERVICE_ACCOUNT) return path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT);
  const downloadsSpaced = path.join(os.homedir(), "Downloads", "firebase key.json");
  if (fs.existsSync(downloadsSpaced)) return downloadsSpaced;
  const root = path.join(__dirname, "..", "serviceAccountKey.json");
  if (fs.existsSync(root)) return root;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  return null;
}

if (!process.argv.includes("--apply")) {
  console.error("Refusing to run without --apply.");
  process.exit(1);
}
const keyPath = resolveServiceAccountPath();
if (!keyPath || !fs.existsSync(keyPath)) {
  console.error("No service account JSON found.");
  process.exit(1);
}
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))) });
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const SUMMARY_COLLECTION = "bidding";
const BODY_COLLECTION = "biddingBody";

const TITLE = "DONT convention: Interfering over No Trump";
const SLUG = "dont-convention-interfering-over-1nt";
const TEASER =
  "DONT (Disturb the Opponent's No Trump): how to interfere over a 1NT opening — the double and 2-level overcalls, when it's worth playing, with worked hands.";
const META_DESCRIPTION = TEASER;
const PRIMARY_KEYWORD = "dont convention disturb opponents no trump";
const RELATED_LINKS = ["/learn/bidding/landy-and-multi-landy", "/learn/bidding/conventions"].join("\n");

const EMPTY = "*S-*H-*D-*C-";
const BOARD1 = `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="*S-AK104*H-J83*D-2*C-Q10543" West="${EMPTY}" vuln="Nil Vul" dealer="West" bidding="1NT/2♦/P/?" />`;
const BOARD2 = `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="*S-8432*H-KQJ108*D-7*C-A93" West="${EMPTY}" vuln="Nil Vul" dealer="East" bidding="_/_/1NT/?" />`;

const BODY_HTML = `
<p>DONT stands for (D)isturb the (O)pponent's (N)o (T)rump. Some people enjoy playing it as it potentially is more disruptive than other methods. It also allows you to overcall on a very wide range of hands.</p>

<p>Before going into the specifics of how it works I would consider the following</p>

<ol>
<li>Always be mindful of vulnerability, if you are vulnerable make sure you have a very sound hand, two well textured suits or otherwise a single 6+ card well textured suit. Don't overcall on balanced hands such as 4432 shape, 5431 at vulnerable or perhaps 5422 with two very good suits.</li>
<li>When you aren't vulnerable it is a time to have a bit more fun and be a bit more aggressive, overcalling more liberally.</li>
<li>Bridge is supposed to be fun - if you or your partner enjoy using this system, go for it. Is it the absolute best? Maybe not. It is designed to be destructive. It has the obvious flaw of partner not knowing what your suits are (knows one at most) at the time of overcalling, so while it might make the opponent's lives more difficult, it also hinders your side's ability to find a fit quickly. It is for that reason that a lot of experts don't like using it.</li>
</ol>

<p>How it works. It is quite simple</p>

<p>After the opponents open 1NT, these are the bids</p>

<p>X (double) - shows a single suiter, any single suiter. Partner is supposed to bid 2♣, allowing you to either pass (if that is your suit) or correct to whatever your 6+ card suit is.</p>

<p>All the other bids follow the same pattern, that suit + any higher ranking suit. So,</p>

<ul>
<li>2♣ - Clubs + any higher ranking suit</li>
<li>2♦ - Diamonds + any higher ranking suit</li>
<li>2♥ - Hearts + Spades (the only higher ranking suit).</li>
<li>2♠ - the one exception, since there aren't any higher ranking suits, it can be used to show whatever you want, like a spare bid. The most common way to treat it is to show 6+ spades (but if you wish to double with that, then you can free 2♠ up to show whatever you want).</li>
</ul>

<p>It is worth resolving a couple auctions with partner before diving in, what would you do with this hand?</p>

${BOARD1}

<p>Partner has shown diamonds and a higher suit, so one of the majors. We don't want to play in diamonds clearly, so we should bid 2♥, which is pass or correct (pass if that is your second suit, or else correct to spades which must be your second suit).</p>

<p>Rule: Bidding 1 step higher has the meaning "Pass or correct", pass this if it is your second suit, or otherwise just bid your second suit.</p>

<p>Note, there might sometimes be times where you can decide which way to go, for example</p>

${BOARD2}

<p>Would you like to show this as both majors, or just a single suited heart hand? You will double to show a single suited hand, or you will bid 2♥ to show hearts and spades - your call? Since there is such a great discrepancy between the quality of the hearts and spades, I might just treat this as a single suited hand. These questions are a matter of hand judgement and valuation rather than strictly system. The point is, you will have some flexibility in the way you bid.</p>

<p>Overall DONT can be quite fun, and certainly effective. I would say try it if you're drawn to it, but otherwise don't push to play it, as more simple and straight forward methods are often the choice of many expert pairs. If you are looking for an alternative, consider Landy or Multi Landy, you will see the link to those at the bottom of the page.</p>

<p><strong>Read next:</strong> <a href="/learn/bidding/landy-and-multi-landy">Landy and Multi Landy</a> &middot; <a href="/learn/bidding/system-over-1nt-conventions">System Over 1NT: Transfer Responses and Conventions</a> &middot; <a href="/learn/bidding/find-major-fit-after-1nt">Find a Major Fit After 1NT: Stayman, Smolen, Puppet, Texas</a></p>

<p><a href="/learn/bidding/conventions">Browse all conventions &rarr;</a></p>
`.trim();

async function getNextArticleNumber() {
  const snap = await db.collection(SUMMARY_COLLECTION).get();
  return (
    snap.docs.reduce((max, doc) => {
      const n = Number((doc.data() || {}).articleNumber || 0);
      return Number.isFinite(n) ? Math.max(max, n) : max;
    }, 0) + 1
  );
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
  const bodyRef = existingBodyId
    ? db.collection(BODY_COLLECTION).doc(existingBodyId)
    : db.collection(BODY_COLLECTION).doc();

  const now = FieldValue.serverTimestamp();
  const articleNumber = existing
    ? String((existing.data() || {}).articleNumber || (await getNextArticleNumber()))
    : String(await getNextArticleNumber());

  await summaryRef.set(
    {
      id: summaryRef.id,
      title: TITLE,
      slug: SLUG,
      teaser: TEASER,
      metaDescription: META_DESCRIPTION,
      primaryKeyword: PRIMARY_KEYWORD,
      category: "Bidding",
      subcategory: "Conventions and Artificial Methods",
      seoSubtopic: "Conventions and Artificial Methods",
      relatedLinks: RELATED_LINKS,
      articleType: "bidding",
      difficulty: "3",
      articleNumber,
      body: bodyRef.id,
      isHidden: false,
      isFree: true,
      freeUpdatedAt: now,
      updatedAt: now,
      ...(existing ? {} : { createdAt: now }),
    },
    { merge: true }
  );

  await bodyRef.set(
    {
      id: bodyRef.id,
      text: BODY_HTML,
      body: { text: BODY_HTML },
      isFree: true,
      freeUpdatedAt: now,
      updatedAt: now,
      ...(existingBodyId ? {} : { createdAt: now }),
    },
    { merge: true }
  );

  console.log(`${existing ? "Updated" : "Published"}: ${SUMMARY_COLLECTION}/${summaryRef.id}`);
  console.log(`Body: ${BODY_COLLECTION}/${bodyRef.id}`);
  console.log(`Learn URL: /learn/bidding/${SLUG}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
