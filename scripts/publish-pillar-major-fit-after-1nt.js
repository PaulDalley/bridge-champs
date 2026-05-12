/**
 * Publish the FIRST pillar draft to Firestore as a HIDDEN article.
 *
 * Topic: "How to find a major-suit fit after 1NT — Stayman, Smolen, Puppet & Texas".
 *
 * Output: one new summary doc in `bidding` + one new body doc in `biddingBody`,
 *         both marked `isHidden: true` and `isPillar: true`. After running you
 *         can visit /pillars (admin only) to read/edit/publish the draft.
 *
 * Safe to re-run: if a pillar with the same slug exists already it will be
 * updated in place. The script never touches existing public articles.
 *
 * Usage:
 *   node scripts/publish-pillar-major-fit-after-1nt.js --apply
 *   node scripts/publish-pillar-major-fit-after-1nt.js --apply --key "C:\path\key.json"
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
  if (process.env.FIREBASE_SERVICE_ACCOUNT)
    return path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT);
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
const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const SUMMARY_COLLECTION = "bidding";
const BODY_COLLECTION = "biddingBody";
const PILLAR_SLUG = "pillar-major-fit-after-1nt";

const PILLAR_TITLE =
  "How to find a major-suit fit after 1NT: Stayman, Smolen, Puppet & Texas (complete guide)";

const PILLAR_TEASER =
  "The complete decision tree for finding 4-4, 5-3, and 6-card major fits after partner opens 1NT. When to use Stayman, transfers, Smolen, Puppet and Texas — and when to keep it simple.";

const PILLAR_PRIMARY_KEYWORD =
  "find major fit after 1nt stayman smolen puppet texas transfer";

const PILLAR_CTA_TARGET = "/bidding/practice";

// Article IDs (canonical body IDs after the href cleanup pass).
const STAYMAN_ID = "U2h4h8kDjcgPT9k4YLq0";
const PUPPET_ID = "AbPr2z4sByvVgT1U5Ehc";
const SMOLEN_ID = "DcqQjNCQDyNMWk2fOvIO";
const TEXAS_ID = "imr5fXsuVBeMFItvoGY3";
const TRANSFERS_ID = "uiRZXtZ2zjxVxq7e1lAb";
const STAYMAN_VS_TRANSFERS_ID = "i2CIdysS7cErPJYWBUDO";

const PILLAR_BODY_HTML = `
<!--
  PILLAR DRAFT — major-fit-after-1NT
  =====================================
  This is the first pillar build for review. Each section is one of:

    LIFTED  — exact paragraphs from an existing live article. Keep them
              unless you decide a tighter version belongs in the pillar.
              The full deep-dive on each sub-convention stays at its
              existing URL; this pillar links DOWN to it.

    [STUB]  — a heading where Paul needs to write 1-3 paragraphs in his
              own voice. The structure is suggested but the prose is not.
              Open this article via /pillars to edit it inline.

    DECISION TREE — the unique value of this pillar versus any one
              sub-article. Keep this section authoritative; it is what
              the high-intent searcher came for.
-->

<p>
  When partner opens 1NT, your job as responder is to translate your hand
  into the right contract. For most responder hands that means asking one
  question first: <strong>is there a major-suit fit?</strong> A 4-4 or
  5-3 major fit is usually a better game than 3NT, and an 8-card major fit
  at the 4-level often beats 3NT even when notrump looks fine on paper.
</p>

<p>
  Modern partnerships have four standard tools for finding that fit, and
  the question stops being "which convention is best?" and starts being
  "which one fits the hand in front of me?" This guide is the decision
  tree. Each section links to the deep-dive article for the convention
  if you want the full mechanics.
</p>

<h2>The decision tree: which tool, when</h2>

<p>
  Before reaching for a convention name, walk down this list. It covers
  about 95% of 1NT responder decisions in standard methods.
</p>

<ol>
  <li>
    <strong>Have a 5-card or longer major?</strong>
    Start with a transfer. Show length first, fill in strength second.
    (Texas is the special case: 6+ in a major <em>and</em> straight game
    values — jump to game via a Texas transfer.)
  </li>
  <li>
    <strong>4 cards in a major (and not 5-card the other)?</strong>
    Use Stayman. You are checking for a 4-4 fit.
  </li>
  <li>
    <strong>Both 4-card majors?</strong>
    Use Stayman. Either fit is a win.
  </li>
  <li>
    <strong>5-4 in the majors with game values?</strong>
    Start with Stayman. If opener shows a major you have a fit; if opener
    denies a major you describe the 5-4 via Smolen.
  </li>
  <li>
    <strong>Want opener's 5-card major shown, not just their 4-card major?</strong>
    Some partnerships add Puppet Stayman (most often after 2NT openings).
    Optional — only if your partnership has the agreement and the
    follow-ups solid.
  </li>
  <li>
    <strong>No 4+ card major at all?</strong>
    Skip the fit-finding tools. Choose your NT level directly (pass / 2NT / 3NT)
    based on points.
  </li>
</ol>

<Callout type="rule">
  <p><strong>One rule that prevents almost every disaster here:</strong></p>
  <p>
    Transfers <em>always</em> show 5+ cards in that major.
    Stayman <em>always</em> asks about 4-card majors.
    Don't mix the two roles, and don't reach for the more exotic
    conventions (Smolen, Puppet, Texas) until basic Stayman + transfers
    are second nature.
  </p>
</Callout>

<h2>Stayman: the 4-4 fit finder</h2>

<!-- LIFTED from /bidding/advanced/${STAYMAN_ID} (Stayman Convention) -->
<p>Stayman is a simple convention with a huge payoff.</p>

<p>
  At the top level, most pairs are using <em>simple</em> Stayman, not extended
  Stayman. Without going into a long debate about the advantages, I
  recommend just using simple Stayman.
</p>

<Callout type="example">
  <p>After partner opens 1NT, you often want to know: do we have a 4-4 fit
  in hearts or spades?</p>
  <p><strong>Pro tip:</strong> it's almost always a good idea to find a major
  fit if you have one.</p>
</Callout>

<h3>How Stayman works</h3>
<p>After 1NT from partner:</p>
<ul>
  <li>2C = Stayman (artificial, asks for a 4-card major)</li>
</ul>
<p>Common opener replies:</p>
<ul>
  <li>2D = no 4-card major</li>
  <li>2H = has 4 hearts (may also have 4 spades)</li>
  <li>2S = has 4 spades (typically denies 4 hearts in basic methods)</li>
</ul>

<p>
  <a href="/bidding/advanced/${STAYMAN_ID}"><strong>Read the full Stayman guide →</strong></a>
</p>

<h2>Transfers: show length first, decide later</h2>

<!-- LIFTED from /bidding/advanced/${TRANSFERS_ID} (Transfers) -->
<p>Transfers are a core 1NT convention. They make major-suit auctions cleaner and often protect your strong hand.</p>

<h3>How transfers work</h3>
<p>After partner opens 1NT:</p>
<ul>
  <li>2D = transfer to hearts</li>
  <li>2H = transfer to spades</li>
</ul>

<p>
  Opener accepts the transfer (1NT-2D-2H, 1NT-2H-2S). Responder uses the
  artificial bid first, then opener declares the major if that ends up
  being the final contract. That keeps opener's stronger NT hand hidden
  from the opening lead, and it gives responder room to invite or
  describe a stronger hand on the second bid.
</p>

<Callout type="rule">
  <p><strong>Important:</strong> opener <em>always</em> accepts the transfer
  in standard methods. Just because opener accepts doesn't mean we've
  reached our final contract — responder is the captain.</p>
</Callout>

<p>
  <a href="/bidding/advanced/${TRANSFERS_ID}"><strong>Read the full transfers guide →</strong></a>
</p>

<h2>Smolen: showing 5-4 majors when opener denies a major</h2>

<!-- LIFTED from /bidding/advanced/${SMOLEN_ID} (Smolen Convention) -->
<p>
  Smolen is a convention used after a Stayman start. It solves a specific
  problem: responder has 5-4 in the majors and wants to show it
  efficiently.
</p>

<h3>The typical setup</h3>
<p>
  Partner opens 1NT and you have 5-4 in the majors and enough points for
  game (or slam).
</p>
<ul>
  <li>1NT - 2C (Stayman)</li>
  <li>2D (opener denies a 4-card major)</li>
</ul>
<p>
  Now responder jumps in the major they do <em>not</em> have 5 cards in.
  This is the main tricky part of Smolen — and it works like a
  pseudo-transfer.
</p>

<p>Example: 1NT - 2C - 2D - <strong>3S</strong> shows 5 hearts and 4 spades
(jump in the other major).</p>

<p>
  <a href="/bidding/advanced/${SMOLEN_ID}"><strong>Read the full Smolen guide →</strong></a>
</p>

<h2>Texas Transfer: 6+ major with game values, no exploration needed</h2>

<!-- LIFTED from /bidding/advanced/${TEXAS_ID} (Texas Transfers) -->
<p>Texas transfers are designed for game-level major decisions after NT openings.</p>

<p>
  When game in a major is already clear, Texas simplifies the auction,
  gets you to 4M quickly, and stops the opponents from bidding at lower
  levels.
</p>

<h3>Texas is usually right when</h3>
<ul>
  <li>You know you want game in a major.</li>
  <li>You hold 6+ cards in that major.</li>
  <li>You don't need lower-level exploration first.</li>
</ul>

<p>
  If you still need to investigate slam or shape details, another route
  (start with Stayman or a Jacoby transfer) is usually better.
</p>

<p>
  <a href="/bidding/advanced/${TEXAS_ID}"><strong>Read the full Texas transfers guide →</strong></a>
</p>

<h2>Puppet Stayman: optional, asks about opener's 5-card majors</h2>

<!-- LIFTED from /bidding/advanced/${PUPPET_ID} (Puppet Stayman) -->
<p>Puppet Stayman is a more advanced extension of Stayman.</p>

<p>
  Its main job is to investigate whether the NT opener has a 5-card
  major. After 1NT, it also asks about 4-card majors as a follow-up; after
  2NT, many partnerships play Puppet as their primary major-finding tool.
</p>

<p>
  Common setup: <em>1NT - 2C</em> is normal Stayman, <em>1NT - 3C</em> is
  Puppet Stayman. After 2NT, many pairs play 3C as Puppet by default.
</p>

<Callout type="mistake">
  <p>
    <strong>Practical warning:</strong> Puppet is a convention where
    system memory matters. If partnership agreements are fuzzy, mistakes
    multiply fast. Only add Puppet when both players know the exact
    responses and continuations and can execute under time pressure.
    Simple Stayman is the safer default.
  </p>
</Callout>

<p>
  <a href="/bidding/advanced/${PUPPET_ID}"><strong>Read the full Puppet Stayman guide →</strong></a>
</p>

<h2>Common mistakes across the family</h2>

<!--
  This section is partly LIFTED across the four sub-articles and partly
  consolidates them into a single "watch out for these" block. Tighten or
  rephrase any of the items if they don't sound like you.
-->

<ul>
  <li>
    <strong>Using Stayman with a clear 5-card major.</strong> If you have
    5 hearts, transfer. Stayman is for 4-card majors.
  </li>
  <li>
    <strong>Skipping Stayman with two 4-card majors.</strong> A 4-4 fit is
    almost always better than 3NT — don't bury it.
  </li>
  <li>
    <strong>Forgetting that transfers show 5+ cards, full stop.</strong>
    Strength comes from the follow-up, not the transfer itself.
  </li>
  <li>
    <strong>Reaching for Smolen / Puppet / Texas without partnership notes.</strong>
    These conventions only pay off when both players know the exact
    follow-ups. If in doubt, stay with Stayman + transfers.
  </li>
  <li>
    <strong>Using Texas too early.</strong> Texas commits you to game.
    If you still need to invite or explore slam, choose a slower route.
  </li>
</ul>

<h2>[STUB] When NOT to look for a major fit at all</h2>

<!--
  [STUB] — 1 or 2 paragraphs in your voice on the hands where responder
  should NOT chase a major. e.g. balanced 8-9 with no 4+ major (just
  raise to 2NT), or 4333 with values. Use this section to short-circuit
  the most common mistake: responder reaches for Stayman on a hand with
  no major to find.
-->

<p>
  <em>[Paul to write: 1-2 paragraphs in your own voice on the hands where
  responder should not chase a major after 1NT. Examples that come to
  mind: balanced 8-9 with no 4+ major (just raise to 2NT), 4333 game-force
  hands where 3NT is fine, hands with a minor singleton where you want
  to keep it quiet, etc.]</em>
</p>

<h2>[STUB] Memory hook: the four-question script</h2>

<!--
  [STUB] — your voice. A "what runs through your head at the table"
  cheat-sheet. The four questions in order:
    1. Do I have a 5-card major?
    2. Do I have a 4-card major?
    3. Do I have 5-4 majors and game values?
    4. Do I have 6-card major + game values?
  Each answer triggers a different tool. This is the section that turns
  this pillar from a list of conventions into a USABLE checklist.
-->

<p>
  <em>[Paul to write: the four-question script you actually run in your
  head at the table before bidding after partner's 1NT. Use plain
  language, one sentence per question, one sentence per "if yes → do X".
  This is the section that makes the pillar memorable rather than
  encyclopaedic.]</em>
</p>

<h2>Drill it in the trainer</h2>

<p>
  Reading helps, but trainer reps are what make these decisions automatic
  under pressure. Use the bidding trainer to lock the decision tree in:
</p>

<ul>
  <li>
    <a href="/bidding/practice"><strong>Bidding trainer →</strong></a>
    work through the 1NT response problems.
  </li>
  <li>
    <a href="/bidding/advanced/${STAYMAN_VS_TRANSFERS_ID}"><strong>Stayman vs Transfers: a simple decision rule →</strong></a>
  </li>
</ul>

<h3>Where to next</h3>
<ul>
  <li><a href="/bidding/advanced/${STAYMAN_ID}">Stayman Convention: Find a 4-4 Major Fit After 1NT</a></li>
  <li><a href="/bidding/advanced/${TRANSFERS_ID}">Transfers: A must-have tool for NT openings</a></li>
  <li><a href="/bidding/advanced/${SMOLEN_ID}">Smolen Convention: Show 5-4 Majors After Stayman</a></li>
  <li><a href="/bidding/advanced/${TEXAS_ID}">Texas Transfers: Transfer Directly to Game</a></li>
  <li><a href="/bidding/advanced/${PUPPET_ID}">Puppet Stayman: How to Check for 5-Card Majors</a></li>
  <li><a href="/bidding/advanced">Back to Bidding Articles Hub</a></li>
</ul>
`.trim();

async function run() {
  // Look for an existing pillar with the same slug.
  const existingSnap = await db
    .collection(SUMMARY_COLLECTION)
    .where("pillarSlug", "==", PILLAR_SLUG)
    .limit(1)
    .get();

  const now = admin.firestore.FieldValue.serverTimestamp();
  if (!existingSnap.empty) {
    const existingSummary = existingSnap.docs[0];
    const existingData = existingSummary.data() || {};
    const bodyId = (existingData.body && typeof existingData.body === "string"
      ? existingData.body
      : null) || existingSummary.id;
    console.log(`Updating existing pillar draft: ${existingSummary.id} (body: ${bodyId})`);
    await db.collection(BODY_COLLECTION).doc(bodyId).set(
      {
        text: PILLAR_BODY_HTML,
        updatedAt: now,
      },
      { merge: true }
    );
    await existingSummary.ref.set(
      {
        title: PILLAR_TITLE,
        teaser: PILLAR_TEASER,
        primaryKeyword: PILLAR_PRIMARY_KEYWORD,
        seoSubtopic: "1NT response major fit",
        ctaTarget: PILLAR_CTA_TARGET,
        isHidden: true,
        isPillar: true,
        pillarSlug: PILLAR_SLUG,
        isFree: true,
        updatedAt: now,
      },
      { merge: true }
    );
    console.log(`OK  Pillar at /bidding/advanced/${bodyId} (hidden draft)`);
    return;
  }

  // No existing draft — create body first, then summary with body ref.
  const bodyRef = db.collection(BODY_COLLECTION).doc();
  const bodyId = bodyRef.id;
  await bodyRef.set({
    text: PILLAR_BODY_HTML,
    createdAt: now,
    updatedAt: now,
  });
  const summaryRef = db.collection(SUMMARY_COLLECTION).doc();
  await summaryRef.set({
    title: PILLAR_TITLE,
    teaser: PILLAR_TEASER,
    primaryKeyword: PILLAR_PRIMARY_KEYWORD,
    seoSubtopic: "1NT response major fit",
    ctaTarget: PILLAR_CTA_TARGET,
    body: bodyId,
    isHidden: true,
    isPillar: true,
    pillarSlug: PILLAR_SLUG,
    isFree: true,
    difficulty: 3,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`OK  Created pillar draft.`);
  console.log(`    Summary doc: ${SUMMARY_COLLECTION}/${summaryRef.id}`);
  console.log(`    Body doc:    ${BODY_COLLECTION}/${bodyId}`);
  console.log(`    Preview URL: /bidding/advanced/${bodyId} (admin only)`);
  console.log(`    Index page:  /pillars`);
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error("Pillar publish failed:", err);
    process.exit(1);
  }
);
