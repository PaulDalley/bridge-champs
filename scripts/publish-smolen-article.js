/**
 * Rewrite "Smolen Convention" — overwrites the existing Firestore body (same slug/URL)
 * with Paul Dalley's rewritten content. TITLE PRESERVED (not retitled — the author's
 * top line was garbled/ambiguous; kept the existing title). Bid shorthand -> suit
 * symbols; (ai give/make...) -> MakeBoard; section markers -> <h2>; (ai link) ->
 * garbage-stayman link. Three clear typos fixed (THe->The, DOn't->Don't, bothy->both).
 * NOTE: "when you both majors" left VERBATIM (missing word, flagged — not edited).
 * Usage: node scripts/publish-smolen-article.js --apply
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
const SLUG = "smolen-convention-show-5-4";
const TEASER = "Smolen: after 1NT-Stayman-2D, bid the 3-level major you don't have to show 5-4 majors and let opener declare. When to use it, common mistakes, and the alternative.";
const PRIMARY_KEYWORD = "smolen convention";
const RELATED_LINKS = ["/learn/bidding/find-major-fit-after-1nt", "/learn/bidding/weak-stayman-know-helps", "/learn/bidding/conventions"].join("\n");

const E = "*S-*H-*D-*C-";
const mk = (south, bidding) => `<MakeBoard boardType="single" position="South" North="${E}" East="${E}" South="${south}" West="${E}" vuln="Nil Vul" dealer="North" bidding="${bidding}" />`;
const B1 = mk("*S-K10843*H-AK42*D-7*C-653", "_/1NT/P/2♣/P/?");
const B2 = mk("*S-K10843*H-AK42*D-7*C-653", "_/1NT/P/2♣/P/2♦/P/3♥");
const B3 = mk("*S-AK104*H-K1053*D-543*C-42", "_/1NT/P/2♣/P/2♦/P/3NT");
const B4 = mk("*S-AK104*H-K10843*D-542*C-2", "_/1NT/P/2♦/P/2♥/P/2♠/P/2NT/P/3NT");

const BODY_HTML = `
<p>The key context for when Smolen applies is when you both majors. More specifically, when you have 5-4 in the majors, or even 6-4. Lets just start with the basics</p>

<h2>So lets look at how it works</h2>

${B1}

<p>If North bids either of the majors, your search is over, you have a 4-4 or a 5-4 fit, and you can just simply raise it to game. Smolen comes in when partner responds with 2♦, denying a 4 card major.</p>

<p>Lets continue the bidding</p>

${B2}

<p>After partner denies a 4 card major, we bid the major we DON'T have on the 3 level. Think of it a bit like a transfer. The main point is to allow the 1NT opener to declare the hand, which is generally considered to be an advantage for a couple reasons</p>

<p>1. The stronger hand receives the lead (the lead goes around to the strong hand)</p>

<p>2. The enemy can't see the strong hand, whereas they could if the strong hand was dummy. Since most of our High card points are held by the 1NT opener, its better if the opponents are left guessing about those!</p>

<h2>Lets clarify a few wrong ideas</h2>

<p>1. With 4-4 in the majors, just bid stayman and then raise the major or bid NT, for example</p>

${B3}

<p>Here we looked for a major fit, and just simply bid 3NT after we didn't find one. There is no use for Smolen here, we don't have a 5 card major.</p>

<p>2. Don't assume your partner plays it. It is a very specifically agreed upon convention, I suggest going through the above examples and making sure you are on the same page as your partner with the responses.</p>

<p>3. You need enough to go to game when you bid smolen, with a weaker hand and both majors consider either just transferring or bidding <a href="/learn/bidding/weak-stayman-know-helps">garbage stayman</a>. On that note, you can't either invite with Smolen, it is totally game forcing, there's no stopping half way.</p>

<h2>Overall recommendation</h2>

<p>I do use and recommend using smolen, its become a fairly mainstream tool for most bridge partnerships at the higher levels. Can you live without it? Definitely, and I wouldn't stress about adding it to your system. If you don't play it, you can simply transfer and then bid the other major, for example.</p>

${B4}

<p>This is a perfectly sensible auction where you've shown both majors. I think pairs can comfortably live without Smolen. There are a few small advantages at the expert level, and I would recommend that the ambitious improver consider using it.</p>
`.trim();

async function findExisting() {
  const bySlug = await db.collection(SUMMARY_COLLECTION).where("slug", "==", SLUG).limit(1).get();
  return bySlug.empty ? null : bySlug.docs[0];
}
async function main() {
  const existing = await findExisting();
  if (!existing) { console.error("Smolen article not found by slug — aborting."); process.exit(1); }
  const prev = existing.data() || {};
  const bodyId = prev.body;
  if (!bodyId) { console.error("No body ref — aborting."); process.exit(1); }
  console.log(`Title preserved (NOT changed): "${prev.title}"`);
  const now = FieldValue.serverTimestamp();
  // NOTE: title intentionally omitted from the merge so the existing title is preserved.
  await existing.ref.set({ slug: SLUG, teaser: TEASER, metaDescription: TEASER, primaryKeyword: PRIMARY_KEYWORD, relatedLinks: RELATED_LINKS, isHidden: false, isFree: true, updatedAt: now }, { merge: true });
  await db.collection(BODY_COLLECTION).doc(bodyId).set({ text: BODY_HTML, body: { text: BODY_HTML }, updatedAt: now }, { merge: true });
  console.log(`Updated body ${BODY_COLLECTION}/${bodyId} for ${SLUG}`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
