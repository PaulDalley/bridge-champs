/**
 * Publish "System Over 1NT: Transfer Responses and Conventions" to Firestore as a
 * live, free article in the Conventions family.
 *
 * Creates: one summary doc in `bidding` + one body doc in `biddingBody`.
 * URL: /bidding/advanced/system-over-1nt-conventions  (slug set explicitly)
 *
 * Idempotent: re-running updates the existing doc (matched by slug or title)
 * in place rather than creating a duplicate.
 *
 * Body text is Paul Dalley's content, proofread for English only (no bridge
 * changes), formatted with the site's suit symbols + a Callout box.
 *
 * Usage:
 *   node scripts/publish-system-over-1nt-article.js --apply
 *   node scripts/publish-system-over-1nt-article.js --apply --key "C:\path\key.json"
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
  const downloadsSdk = path.join(
    os.homedir(),
    "Downloads",
    "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"
  );
  if (fs.existsSync(downloadsSdk)) return downloadsSdk;
  const root = path.join(__dirname, "..", "serviceAccountKey.json");
  if (fs.existsSync(root)) return root;
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

const TITLE = "System Over 1NT: Transfer Responses and Conventions";
const SLUG = "system-over-1nt-conventions";
const TEASER =
  "A summary of the modern system over 1NT played by expert pairs — four transfers, the 2♠ range-ask, and the three-level conventions.";
const META_DESCRIPTION =
  "A summary of the modern system over 1NT played by expert pairs: four transfers, the 2♠ range-ask, showing shortage over minor transfers, and three-level conventions.";
const PRIMARY_KEYWORD = "system over 1nt conventions";
const CTA_TARGET = "/bidding/practice?difficulty=3&problem=bid3-16";
const RELATED_LINKS = ["/learn/bidding/conventions"].join("\n");

const BODY_HTML = `
<p>This has become very widespread amongst expert pairs. I (Paul Dalley) play this, and know that many/most strong pairs are playing this or very slight variations of it.</p>

<h2>After 1NT, these are the bids</h2>
<ul>
  <li><strong>2♣</strong> = Stayman</li>
  <li><strong>2♦</strong> = Transfer to hearts</li>
  <li><strong>2♥</strong> = Transfer to spades</li>
  <li><strong>2♠</strong> = Transfer to clubs OR range ask</li>
  <li><strong>2NT</strong> = Transfer to diamonds</li>
</ul>
<p>The only slightly tricky part of the system is the 2♠ bid. It's easy once you get used to it, but it might feel intimidating at first.</p>

<h2>The 2♠ bid</h2>
<p>So, we have four transfers. If you want to simply invite, bid 2♠. This is how it works.</p>
<p>When responder bids 2♠, either they have a simple NT invite, say ~9 points, or they have clubs. Opener does not know immediately, but will quickly find out.</p>

<h3>If responder has the NT invite</h3>
<p>Let's assume for a moment that responder has the NT invite. After 2♠, opener bids 2NT with a minimum, which will be passed.</p>
<p>Or, with a maximum, bid 3♣ — that says absolutely nothing about opener's clubs, it just says they have a maximum (this is to accommodate a hand that wants to just play in clubs; remember, it's ambiguous what responder has initially). Partner will just bid 3NT over this when they had the NT invite hand — they have found out that opener was a maximum.</p>

<h3>If responder actually has clubs</h3>
<p>However, sometimes responder actually has clubs. So, let's look at what that looks like. After <strong>1NT – 2♠</strong>, if opener shows a minimum by bidding 2NT:</p>
<ul>
  <li>Responder can bid <strong>3♣</strong> — that says, "I just want to play here," the equivalent of transferring to clubs.</li>
  <li>Or, responder can bid something else — this indicates that responder is not the NT invite, because, remember, with that hand responder either passed 2NT or bid 3NT over 3♣.</li>
</ul>

<Callout type="rule">
  <p><strong>NB:</strong> Over minor-suit transfers, my recommendation is that the next bid by responder shows a shortage in that suit. So, for example:</p>
  <p><strong>1NT – 2♠ – 2NT – 3♥</strong> — let's summarise what that means:</p>
  <ul>
    <li><strong>2♠</strong> was ambiguous initially — either clubs or just an NT invite.</li>
    <li><strong>2NT</strong> — opener showed a minimum, not accepting an NT invite.</li>
    <li><strong>3♥</strong> — now responder doesn't have the NT invite hand; they in fact have clubs, and are showing a short heart.</li>
  </ul>
  <p>I recommend a similar thing after <strong>1NT – 2NT</strong>, which is a transfer to diamonds. After partner bids 3♦, bid a new suit to show shortage in that suit.</p>
</Callout>

<h2>Now let's look at the three level</h2>
<ul>
  <li><strong>3♣</strong> = Puppet Stayman</li>
  <li><strong>3♦</strong> = Both minors, 5+</li>
  <li><strong>3♥</strong> = Singleton heart, 3 spades — typically 31(54)</li>
  <li><strong>3♠</strong> = Singleton spade, 3 hearts — typically 13(54)</li>
</ul>

<p><em>An article coming very soon will give a variety of example hands and show how this versatile system is well equipped to handle them all.</em></p>
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
      ctaTarget: CTA_TARGET,
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

  // NB: logged-out users (and Googlebot) get access via the BODY doc's isFree
  // flag — the summary metadata can lag / be gated — so it MUST be set here too.
  await bodyRef.set(
    {
      id: bodyRef.id,
      text: BODY_HTML,
      body: { text: BODY_HTML },
      isFree: true,
      ctaTarget: CTA_TARGET,
      freeUpdatedAt: now,
      updatedAt: now,
      ...(existingBodyId ? {} : { createdAt: now }),
    },
    { merge: true }
  );

  console.log(`${existing ? "Updated" : "Published"}: ${SUMMARY_COLLECTION}/${summaryRef.id}`);
  console.log(`Body: ${BODY_COLLECTION}/${bodyRef.id}`);
  console.log(`Slug URL: /bidding/advanced/${SLUG}`);
  console.log(`Body-id URL: /bidding/advanced/${bodyRef.id}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
