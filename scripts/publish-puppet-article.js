/**
 * Rewrite "Puppet Stayman" — overwrites the existing Firestore body (same slug/URL)
 * with Paul Dalley's rewritten content, and RETITLES it to "Puppet Stayman - All you
 * need to know" (slug unchanged -> no redirect needed; topicHubs + neighbor footers
 * synced separately). Bid shorthand -> suit symbols; (ai give/make...) -> MakeBoard;
 * section markers -> <h2>. One clear typo fixed (jsut->just). NOTE: the phrase "by the
 * bid of 4H" is kept VERBATIM (renders 4♥) — flagged to Paul as a likely 3H slip; not
 * silently changed (bridge content). Meta description drafted for Paul.
 * Usage: node scripts/publish-puppet-article.js --apply
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
const TITLE = "Puppet Stayman - All you need to know";
const SLUG = "puppet-stayman-check-5-card";
const TEASER = "Puppet Stayman explained: how 3C asks opener about 5-card and 4-card majors, the full response schedule, why experts use it over Stayman, and when to bid it.";
const PRIMARY_KEYWORD = "puppet stayman";
const RELATED_LINKS = ["/learn/bidding/smolen-convention-show-5-4", "/learn/bidding/find-major-fit-after-1nt", "/learn/bidding/conventions"].join("\n");

const E = "*S-*H-*D-*C-";
const mk = (south, bidding) => `<MakeBoard boardType="single" position="South" North="${E}" East="${E}" South="${south}" West="${E}" vuln="Nil Vul" dealer="North" bidding="${bidding}" />`;
const B1 = mk("*S-K103*H-52*D-43*C-AK10942", "_/1NT/P/3♣/P/3♠/P/4♠");
const B2 = mk("*S-K103*H-52*D-A1083*C-K1094", "_/1NT/P/3♣/P/3♠/P/4♠");
const B3 = mk("*S-K103*H-A1083*D-52*C-K1094", "_/1NT/P/3♣");
const B4 = mk("*S-K1084*H-72*D-KQ104*C-K93", "_/1NT/P/3♣/P/3♦/P/3♥/P/3NT");
const B5 = mk("*S-K1084*H-72*D-KQ104*C-K93", "_/1NT/P/2♣/P/2♥/P/3NT");
const B6 = mk("*S-K1084*H-72*D-KQ104*C-K93", "_/1NT/P/3♣/P/3♦/P/3♥/P/3NT");

const BODY_HTML = `
<p>Puppet stayman is a great convention, I highly recommend learning it. It does two things</p>

<p>1. Its main role - asks about 5 card majors. This is really useful when you have a type of hand that might play better in a 5-3 major fit than 3NT, for example</p>

${B1}

<p>I would be delighted to play in 4♠ instead of 3NT with the 2 small doubletons. Even something more balanced, such as this, qualifies</p>

${B2}

<p>Again 4♠ might be a fine contract here in a 5-3 fit with your small doubleton heart.</p>

<p>You also might have a 4 card major and a 3 card major to use it for example,</p>

${B3}

<p>Here you are looking for either a 5-3 spade fit or a 4-4 heart fit. I will talk just below about how to find a 4-4 fit using puppet.</p>

<p>2. Puppet stayman has another role, to ask about 4 card majors. There are a couple reasons for that</p>

<p>a) The example just above is a classic case where you want to know about 5 or 4 cards.</p>

<p>b) Experts are using it more and more often as a substitute for regular stayman when they only are interested in one 4 card major. Let me show you a couple of examples to convince you.</p>

${B4}

<p>On this bidding, the 1NT bidder said "No I don't have a 5 card major, by bidding 3♦. Responder then bid 3♥, saying - "I have 4 spades". The 1NT opener then bid 3NT denying 4 spades. It is unknown to the defence whether declarer has a 4 card heart suit or not - at the expert level that information is significant, for example the opponents don't know whether a heart lead is a great idea or if it is leading into declarer's heart suit!</p>

<p>Compare that with using Normal stayman which is more revealing, the auction would go like this</p>

${B5}

<p>On this auction we have advertised to the opponents that declarer has 4 hearts - that might be information that helps them beat the contract either by not leading it, or by knowing something during the play that makes a difference!</p>

<h2>What are the responses to puppet stayman</h2>

<p>I have sort of clarified them above in the examples, but to lay them out</p>

<p>After a 1NT opening, 3♣ is Puppet stayman.</p>

<ul>
<li>3♦ = no 5 card major</li>
<li>3♥ = 5 card hearts</li>
<li>3♠ = 5 card spades</li>
</ul>

<p>After 1NT 3♣ 3♦ - responder can ask about 4 card majors by bidding the major they DONT have, so for example on this hand that I gave a moment ago, responder has shown 4 spades by the bid of 3♥.</p>

${B6}

<h2>Recommendation</h2>

<p>Overall I strongly recommend playing Puppet stayman. It is a flexible tool that you can ask about 5 and/or 4 card majors, which often might be your best contract. A closing remark - if you have a 4-3-3-3, just bid 3NT rather than investigate a major game (4♥ or 4♠).</p>
`.trim();

async function findExisting() {
  const bySlug = await db.collection(SUMMARY_COLLECTION).where("slug", "==", SLUG).limit(1).get();
  if (!bySlug.empty) return bySlug.docs[0];
  return null;
}
async function main() {
  const existing = await findExisting();
  if (!existing) { console.error("Puppet article not found by slug — aborting."); process.exit(1); }
  const prev = existing.data() || {};
  const bodyId = prev.body;
  if (!bodyId) { console.error("No body ref — aborting."); process.exit(1); }
  console.log(`Old title: "${prev.title}"  ->  New title: "${TITLE}"`);
  const now = FieldValue.serverTimestamp();
  await existing.ref.set({ title: TITLE, slug: SLUG, teaser: TEASER, metaDescription: TEASER, primaryKeyword: PRIMARY_KEYWORD, relatedLinks: RELATED_LINKS, isHidden: false, isFree: true, updatedAt: now }, { merge: true });
  await db.collection(BODY_COLLECTION).doc(bodyId).set({ text: BODY_HTML, body: { text: BODY_HTML }, updatedAt: now }, { merge: true });
  console.log(`Updated body ${BODY_COLLECTION}/${bodyId} for ${SLUG}`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
