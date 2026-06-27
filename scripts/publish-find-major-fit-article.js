/**
 * Rewrite "Find a Major Fit After 1NT: Stayman, Smolen, Puppet, Texas" — overwrites
 * the existing Firestore body (same slug/URL) with Paul Dalley's rewritten content.
 * Bid shorthand -> suit symbols; (ai give/make...) -> MakeBoard; section markers ->
 * <h2>; (ai link) -> internal links (Texas, Smolen). Three clear typos fixed
 * (opponentns->opponents, jsut->just, hte->the). Meta description drafted for Paul.
 * Usage: node scripts/publish-find-major-fit-article.js --apply
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
const TITLE = "Find a Major Fit After 1NT: Stayman, Smolen, Puppet, Texas";
const SLUG = "find-major-fit-after-1nt";
const TEASER = "Finding a major-suit fit after partner's 1NT: when to use Stayman, transfers, Texas, Smolen and Puppet Stayman, by your major-suit length — with worked examples.";
const PRIMARY_KEYWORD = "find major fit after 1nt";
const RELATED_LINKS = ["/learn/bidding/smolen-convention-show-5-4", "/learn/bidding/texas-transfers-transfer-directly-game", "/learn/bidding/conventions"].join("\n");

const E = "*S-*H-*D-*C-";
const mk = (south, bidding) => `<MakeBoard boardType="single" position="South" North="${E}" East="${E}" South="${south}" West="${E}" vuln="Nil Vul" dealer="North" bidding="${bidding}" />`;
const B1 = mk("*S-K10843*H-QJ54*D-A103*C-4", "_/1NT/P/?");
const B2 = mk("*S-K1084*H-A8*D-A543*C-983", "_/1NT/P/2♣");
const B3 = mk("*S-K10842*H-A8*D-A543*C-83", "_/1NT/P/2♥");
const B4 = mk("*S-K10842*H-A8*D-A543*C-83", "_/1NT/P/2♥/P/2♠/P/3NT");
const B5 = mk("*S-KQ108432*H-7*D-543*C-32", "_/1NT/P/4♦");
const B6 = mk("*S-AK10843*H-K103*D-6*C-J103", "_/1NT/P/2♥/P/2♠/P/4♦");
const B7 = mk("*S-K103*H-52*D-J8*C-AK10432", "_/1NT/P/3♣/P/3♠/P/4♠");
const B8 = mk("*S-K10843*H-KQ62*D-5*C-K103", "_/1NT/P/2♣/P/2♦/P/3♥");

const BODY_HTML = `
<p>When partner opens 1NT, often the first priority is to explore a major fit. There are a variety of ways to do it depending on the nature of your major suits. Stayman, Transfers, Texas transfers etc. So which do we use, and when?</p>

<p>The key step is to look at your major suits and look whether you have 4 card suit(s), 5 card, 6 card, or a combination. There is also something to do with 3 cards, (in case partner has 5). Lets look at examples.</p>

${B1}

<p>Partner has opened 1NT and you have both a 5 and 4 card major.</p>

<p>The key ideas are as follows</p>

<h2>Lets start off if you ONLY have 1 major, not both</h2>

<p>a) With a 4 card major - use stayman. For example</p>

${B2}

<p>We have 11 points, we are happy to play in 3NT, however first it looks sensible to find out whether we have a 4-4 spade fit. Simply bid stayman, 2♣, and then follow up with either putting partner in 3NT or 4♠.</p>

<p>b) With a 5 Card major - transfer</p>

${B3}

<p>Here we Transfer to spades. A transfer invariably should show 5 cards at least. Thats useful information for partner to have, the bidding would typically continue like this</p>

${B4}

<p>You have said to partner - I have 5 card spades, and am happy to play in 3NT. So now, partner with 3 or more spades, can bid 4♠. Note that there is no reason to avoid 3NT, thoughts like "I have nothing in clubs" is just destructive thinking - your side has say 26+ points, trust you will be fine in 3NT if 4♠ is not appropriate.</p>

<p>C) With a 6 card Major - Either Texas or regular transfer.</p>

<p>With 6 cards we can bid Texas transfers (see <a href="/learn/bidding/texas-transfers-transfer-directly-game">article on Texas</a>). Or alternatively we can sometimes just transfer.</p>

<p>a) With no slam interest, we can often just Texas transfer</p>

${B5}

<p>The 4♦ bid shows 6+ spades, and is a quick way to get to spades and hopefully shut out the opponents in case they have a big fit on. But make note - some players agree that Texas shows a slam try, if your partner is like that, then you cant bid like that as they might put you in slam with this weak hand!</p>

<p>b)With a shortage and a slam try, it may be better to transfer normally and then splinter, like this</p>

${B6}

<p>d) With 3 cards - puppet stayman</p>

<p>The modern way is to freely open 1NT with a 5 card major. We use puppet stayman to ask the NT opener if he has a 5 card major if it is appropriate for us. For example</p>

${B7}

<p>Here we have asked partner if they have a 5 card major. Partner said yes, 5 card spades, and we decided to play in 4♠ at the end - our hand looks useful for that, enough points and two doubletons.</p>

<h2>Lets now look when you have BOTH majors</h2>

<p>The main tool you will use with both majors is <a href="/learn/bidding/smolen-convention-show-5-4">Smolen</a></p>

<p>Smolen goes like this, you start by bidding stayman. If partner shows you a 4 card major, great you have found a fit (remember you have both majors to use smolen). IF partner does not have a 4 card major, you jump to the 3 level in the major you DONT have. Lets make this easy with an example</p>

${B8}

<p>In this auction we started off with stayman, hoping to find partner with a 4 card major and then just raise it to game. When that didn't happen, we bid 3♥ (the major we don't have) to show 5 card spades. Now the 1NT opener can bid spades, declaring it - that is the main reason for bidding the one we DONT have. Check out <a href="/learn/bidding/smolen-convention-show-5-4">the article</a> for a more comprehensive look at smolen.</p>

<h2>When to not look for a major fit at all</h2>

<p>The main time I would suggest is with 4333 shape. With that, forget about the major, and just play in NT at the appropriate level.</p>

<h2>Conclusion</h2>

<p>overall typically the most important thing we should do when partner opens 1NT is to look at our major suit holdings. If you can generally associate stayman with 4 card majors, transfers with 5 card majors, you will have overcome 90% of the battle. Try keep it simple, smile and enjoy the game.</p>
`.trim();

async function findExisting() {
  const bySlug = await db.collection(SUMMARY_COLLECTION).where("slug", "==", SLUG).limit(1).get();
  if (!bySlug.empty) return bySlug.docs[0];
  const byTitle = await db.collection(SUMMARY_COLLECTION).where("title", "==", TITLE).limit(1).get();
  if (!byTitle.empty) return byTitle.docs[0];
  return null;
}
async function main() {
  const existing = await findExisting();
  if (!existing) { console.error("Article not found by slug/title — aborting."); process.exit(1); }
  const bodyId = (existing.data() || {}).body;
  if (!bodyId) { console.error("No body ref — aborting."); process.exit(1); }
  const now = FieldValue.serverTimestamp();
  await existing.ref.set({ title: TITLE, slug: SLUG, teaser: TEASER, metaDescription: TEASER, primaryKeyword: PRIMARY_KEYWORD, relatedLinks: RELATED_LINKS, isHidden: false, isFree: true, updatedAt: now }, { merge: true });
  await db.collection(BODY_COLLECTION).doc(bodyId).set({ text: BODY_HTML, body: { text: BODY_HTML }, updatedAt: now }, { merge: true });
  console.log(`Updated body ${BODY_COLLECTION}/${bodyId} for ${SLUG}`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
