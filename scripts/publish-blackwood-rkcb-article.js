/**
 * Publish "Blackwood and Roman Key Card Blackwood (RKCB)" to Firestore as a
 * live, free article in the Conventions family (Slam Bidding).
 *
 * Creates: one summary doc in `bidding` + one body doc in `biddingBody`.
 * URL: /learn/bidding/blackwood-rkcb (slug set explicitly; old /bidding/advanced
 * redirects to /learn).
 *
 * Idempotent: re-running updates the existing doc (matched by slug or title).
 *
 * Body text is Paul Dalley's content, verbatim except the spelling/wording fixes
 * he explicitly approved (Lets->Let's, its->it's, How->Now, "is sign off"->"it is
 * sign off", "we are play"->"we play"). No other bridge changes.
 *
 * Usage: node scripts/publish-blackwood-rkcb-article.js --apply
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
  const sdk = path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json");
  if (fs.existsSync(sdk)) return sdk;
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

const TITLE = "Blackwood and Roman Key Card Blackwood (RKCB)";
const SLUG = "blackwood-rkcb";
const TEASER = "RKCB and Blackwood - what you need to know";
const META_DESCRIPTION = "RKCB and Blackwood - what you need to know";
const PRIMARY_KEYWORD = "roman key card blackwood rkcb";
const RELATED_LINKS = ["/learn/bidding/conventions"].join("\n");

const SOUTH = "*S-KQ1084*H-K52*D-1032*C-K5";
const EMPTY = "*S-*H-*D-*C-";
const BOARD1 = `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="${SOUTH}" West="${EMPTY}" vuln="Nil Vul" dealer="South" bidding="_/_/_/1♠/P/2NT/P/4♠/P/4NT/P/?" />`;
const BOARD2 = `<MakeBoard boardType="single" position="South" North="${EMPTY}" East="${EMPTY}" South="${SOUTH}" West="${EMPTY}" vuln="Nil Vul" dealer="South" bidding="_/_/_/1♠/P/2NT/P/4♠/P/4NT/P/5♣/P/5♦/P/?" />`;

const BODY_HTML = `
<p>Blackwood has always been one of the most important tools for bidding slams and grand slams. Another way of looking at it - it is a tool for keeping you out of slam or grand slam!</p>

<p><strong>The key idea: Don't go to slam missing two aces - that will typically mean 1 off.</strong></p>

<p><strong>How it works: Traditionally the bid of 4NT said "How many aces do you have". Partner would respond 5♣ with none, 5♦ with 1, 5♥ with 2, 5♠ with 3, 5NT with 4.</strong></p>

<p>Blackwood is simple and still has its place in modern bridge, there are certain auctions where experts have agreed that 4NT is still the traditional Ace ask, for example often 1♠ 4NT - an immediate 4NT there is often simply Ace ask, responder may have a hand like this ♠5 ♥AKQJ1043 ♦K2 ♣AKQ, and just wants to ask about Aces.</p>

<h2>Roman Key Card Blackwood (RKCB)</h2>
<p>This has become the almost standard tool that intermediate or better partnerships are using. It has replaced the traditional Ace ask with a tool that asks for Aces, the King of trumps and the Queen of trumps. It asks for Keycards, there are 5 keycards - four aces and the king of trumps.</p>

${BOARD1}

<p>On this hand south opened 1♠, partner bid 2NT Jacoby which shows 4+ card spade support and is game forcing. The subsequent 4NT is RKCB with spades agreed.</p>

<p>NB: One thing that is subject to agreement, decide with partner whether you are playing 14/30 or 30/14. Let's assume we play 14/30 and see how it works.</p>

<p>Responses to 4NT:</p>
<ul>
  <li>5♣ - 1 or 4 keycards (so because we are playing 14/30, 5♣ shows 1 or 4. If you were playing the other way around, 5♣ would show 0 or 3 - discuss with partner which you are playing).</li>
  <li>5♦ - 0 or 3 keycards</li>
  <li>5♥ - 2 without the queen of trumps</li>
  <li>5♠ - 2 with the queen of trumps</li>
</ul>

<p>What you may notice is that 5♣ and 5♦ responses do not specify whether the player has the queen of trumps. There is a way to still ask about that though, the player just bids the next highest suit (not including the trump suit - If the key card bidder bids the trump suit at the 5 level it is sign off).</p>

<p>So, let's continue and also look at how to ask for the Queen of trumps in that auction,</p>

${BOARD2}

<p>Here we have shown 1 or 4 keycards, (partner will know it's 1 - we showed a weak hand over 2NT, and also he is probably looking at 3 or 4 of them!). Now partner has bid the next highest suit, 5♦. This says - do you have the Queen?</p>

<p>We respond as follows</p>

<p>If we do NOT have the queen, we simply sign off, by bidding 5♠.</p>

<p>If we do have the queen, we do NOT sign off. We either bid 5NT, or, even better, bid your lowest King. So, over 5♦, we could bid 5♥ which says: I am not signing off because I do indeed have the Queen (without it I would sign off to show you), and I am also bidding my nearest King, which is in hearts.</p>

<p>That is hopefully a good introduction that will cover almost all of your auctions. I will do a further article to look at a few more details and finer points. Including further follow ups, what auctions are RKCB and what might be "quantitative 4NT", as well as other issues</p>
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
  console.log(`Slug URL: /bidding/advanced/${SLUG}`);
  console.log(`Learn URL: /learn/bidding/${SLUG}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
