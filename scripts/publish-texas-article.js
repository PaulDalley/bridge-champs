/**
 * Rewrite "Texas Transfers: Transfer Directly to Game" — overwrites the existing
 * Firestore article body (same slug/URL) with Paul Dalley's rewritten content.
 * Bid shorthand -> suit symbols; (ai make board ...) -> MakeBoard; two clear typos
 * fixed (oppoennts->opponents, juust->just). Meta description drafted for Paul.
 * Usage: node scripts/publish-texas-article.js --apply
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
const TITLE = "Texas Transfers: Transfer Directly to Game";
const SLUG = "texas-transfers-transfer-directly-game";
const TEASER = "Texas transfers show a 6+ card major opposite 1NT and set trumps at the 4-level — why they help, the two common versions, and when to use them.";
const PRIMARY_KEYWORD = "texas transfers bridge";
const RELATED_LINKS = ["/learn/bidding/1nt-transfers-stayman-use-each", "/learn/bidding/conventions"].join("\n");

const E = "*S-*H-*D-*C-";
const B1 = `<MakeBoard boardType="single" position="South" North="${E}" East="${E}" South="*S-AK109732*H-KQ2*D-52*C-7" West="${E}" vuln="Nil Vul" dealer="North" bidding="_/1NT/P/4♦/P/4♠/P/4NT" />`;
const B2 = `<MakeBoard boardType="single" position="South" North="${E}" East="${E}" South="*S-QJ108743*H-5*D-J874*C-2" West="${E}" vuln="Nil Vul" dealer="North" bidding="_/1NT/P/4♦" />`;
const B3 = `<MakeBoard boardType="single" position="South" North="${E}" East="${E}" South="*S-K104*H-AQ10843*D-73*C-K8" West="${E}" vuln="Nil Vul" dealer="North" bidding="_/1NT/P/4♣/P/4♦/P/?" />`;
const B4 = `<MakeBoard boardType="single" position="South" North="${E}" East="${E}" South="*S-AK10843*H-K103*D-6*C-J103" West="${E}" vuln="Nil Vul" dealer="North" bidding="_/1NT/P/2♥/P/2♠/P/4♦" />`;
const B5 = `<MakeBoard boardType="single" position="South" vuln="Nil Vul" dealer="North" bidding="_/1NT/P/2♦/P/2♥/P/4♥" />`;

const BODY_HTML = `
<p>Texas transfers are a bid you can make opposite a 1NT opening to immediately show 6+ cards in a major. That sets trumps (because basically always has 2+ cards in the suit, so you have a fit). Lets look at why it is a good idea</p>

<p>1. It sets the trump suit immediately, so there is no confusion about the meaning of 4NT It is Keycard in that suit, so for example</p>

${B1}

<p>Here responder just wanted to set spades and then bid blackwood.</p>

<p>2. It is quick and can shut the opponents out</p>

${B2}

<p>On this auction we get to 4♠ very quickly, in fact a possible alternative is to just bid 4♠ here instead of 4♦, if that is natural in your system (which I recommend it is). The reason is to shut the opponents out, its possible that they have a big fit and are making for example 5♣!</p>

<p>3. Using Texas as a slam try</p>

<p>As mentioned below there are different versions, but if you play version 1 you can use it as a slam try, so</p>

${B3}

<p>Here you have made a slam try saying "I have good hearts, 6+, and slam interest. Partner's 4♦ shows interest, whereas 4♥ would say "not today".</p>

<h2>Two Styles</h2>

<p>I've seen two different versions of this commonly used, once again make sure you and partner are on the same page:</p>

<p><strong>Version 1</strong></p>
<ul>
<li>4♣ = transfers to 4♥ (two bids below 4♥)</li>
<li>4♦ = transfers to 4♠ (two bids below 4♠)</li>
</ul>

<p><strong>Version 2</strong></p>
<ul>
<li>4♦ = transfer to 4♥ (one bid below)</li>
<li>4♥ = transfer to 4♠ (one bid below)</li>
</ul>

<p>As always, discuss with partner what you are playing, don't just say "Texas".</p>

<h2>When Texas is usually right</h2>

<p>6+ cards in a major is the main starting point. If you are using it as a slam try, it probably is best only if you do not have a shortage. If you had a shortage, I would prefer to transfer and then splinter, for example</p>

${B4}

<p>Here south has shown spades and then has splintered in diamonds. That is a more effective way to slam try with a shortage than using Texas.</p>

<h2>Common mistakes</h2>

<p>The main issues are forgetting system, which version you play, or accidentally thinking it is natural - this is particularly likely if you have played bridge a long time without Texas transfers. I do not think they are essential, you can do fine without them, so if you are worried you are going to forget them, perhaps leave them out.</p>

<p>Another main mistake is clarifying with partner whether you definitely have a slam try in order to use them, or whether its possible you just want to be in game. Ask this to partner - what is the difference if I Texas transfer, or if instead, I just transfer on the 2 level and then raise to game, for example</p>

${B5}

<p>How does that auction vary from a Texas auction. Expert pairs typically treat one of them as slam try, and the other not - if that is the case, decide with your partner which (if any) is a slam try.</p>
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
  if (!existing) { console.error("Texas article not found by slug/title — aborting (won't create a duplicate)."); process.exit(1); }
  const summaryRef = existing.ref;
  const bodyId = (existing.data() || {}).body;
  if (!bodyId) { console.error("No body ref on the summary doc — aborting."); process.exit(1); }
  const bodyRef = db.collection(BODY_COLLECTION).doc(bodyId);
  const now = FieldValue.serverTimestamp();
  await summaryRef.set({ title: TITLE, slug: SLUG, teaser: TEASER, metaDescription: TEASER, primaryKeyword: PRIMARY_KEYWORD, relatedLinks: RELATED_LINKS, isHidden: false, isFree: true, updatedAt: now }, { merge: true });
  await bodyRef.set({ text: BODY_HTML, body: { text: BODY_HTML }, updatedAt: now }, { merge: true });
  console.log(`Updated body ${BODY_COLLECTION}/${bodyId} for ${SLUG}`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
