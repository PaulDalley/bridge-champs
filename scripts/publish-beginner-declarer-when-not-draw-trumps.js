/**
 * Publish/update:
 * "When Not to Draw Trumps (Beginner Guide)"
 *
 * Usage:
 *   node scripts/publish-beginner-declarer-when-not-draw-trumps.js --apply
 *   node scripts/publish-beginner-declarer-when-not-draw-trumps.js --apply --key "C:\path\key.json"
 *
 * Notes:
 * - Keeps author wording intact, with only light typo/format cleanup.
 * - Upserts by title to avoid duplicate accidental publishes.
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
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
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

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const APPLY = process.argv.includes("--apply");
if (!APPLY) {
  console.error("Refusing to run without --apply");
  process.exit(1);
}

const keyPath = resolveServiceAccountPath();
if (!keyPath || !fs.existsSync(keyPath)) {
  console.error(
    "No service account JSON found. Use --key <path>, set FIREBASE_SERVICE_ACCOUNT, " +
      "add serviceAccountKey.json to project root, or place firebase key.json in Downloads."
  );
  process.exit(1);
}

const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(key) });

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const TITLE = "When Not to Draw Trumps (Beginner Guide)";
const TEASER =
  "Drawing trumps is right about 50% of the time, and it's something that pays to get right. Learn the three common situations where delaying trumps helps you make your contract.";
const META_DESCRIPTION =
  "Drawing trumps is a key beginner skill, but timing matters. Learn when to delay trumps and how to choose the right declarer plan.";
const CATEGORY = "Beginner Declarer";
const ARTICLE_TYPE = "beginnerCardPlay";
const SUBCATEGORY = "Trump Management";

async function lookupSiblingPaths(collectionName) {
  const snap = await db.collection(collectionName).get();
  let drawingTrumpsPath = null;
  let ruffInDummyPath = null;
  let sideSuitPath = null;

  snap.forEach((doc) => {
    const d = doc.data() || {};
    const title = String(d.title || "").toLowerCase();
    const subcategory = String(d.subcategory || "").toLowerCase();
    const pathForDoc = `/beginner/articles/declarer/${doc.id}`;
    if (!drawingTrumpsPath && (title.includes("drawing trumps") || subcategory.includes("drawing trumps"))) {
      drawingTrumpsPath = pathForDoc;
    }
    if (
      !ruffInDummyPath &&
      (title.includes("ruff in dummy") ||
        title.includes("ruffs in dummy") ||
        subcategory.includes("ruff in dummy"))
    ) {
      ruffInDummyPath = pathForDoc;
    }
    if (
      !sideSuitPath &&
      (title.includes("playing long suits") ||
        subcategory.includes("playing long suits") ||
        title.includes("build extra winners early"))
    ) {
      sideSuitPath = pathForDoc;
    }
  });

  return { drawingTrumpsPath, ruffInDummyPath, sideSuitPath };
}

function buildBodyHtml(links) {
  const drawingTrumpsHref = esc(links.drawingTrumps || "/beginner/articles/declarer");
  const ruffInDummyHref = esc(links.ruffInDummy || "/beginner/articles/declarer");
  const sideSuitHref = esc(links.sideSuit || "/beginner/articles/declarer");

  return `
<h2>When Not to Draw Trumps (Beginner Guide)</h2>
<p>A guiding principle will be - rebid 1NT with a balanced hand. With an unbalanced hand, rebid a suit. (A sure sign that the hand is unbalanced is having a singleton, but also with 5422 shape it is often good to rebid a suit. Also, if you have a 6+ card suit, that is not balanced and it is worth rebidding the suit rather than NT. </p>

<h3>The default rule</h3>
<p>In suit contracts, when we learn bridge, the default plan is:</p>
<ul>
  <li>Win the lead</li>
  <li>Draw opponents' trumps</li>
  <li>Then cash winners or set up side suits</li>
</ul>
<p>Often this works because the declaring side has more trumps than the defenders and can afford to play 2 or 3 rounds of the suit, and still have extra left for later. Lots of the time we don't actually have that luxury, and have to delay drawing trumps. We don't necessarily need to delay for long, maybe a trick or two.</p>
<p>So "draw trumps first" is a good starting point. But we need to develop some instincts around it, rather than just an inflexible rule.</p>

<h3>When you should delay drawing trumps</h3>
<p>There are three common situations where delaying trumps is right.</p>

<h3>1) Ruff losers in dummy</h3>
<p>One of my favourite rules - when dummy has a short suit (0, 1 or 2 cards in a suit), often you get ruffs by playing that suit, until dummy runs out, then ruff! Simple hey? And very effective. One of the cornerstone strategies in bridge.</p>
<p>If you draw trumps too early, dummy may run out of trumps and you lose the chance to ruff.</p>
<p>Read more: <a href="${ruffInDummyHref}">Ruff in dummy</a>.</p>

<h3>2) You must establish a side suit first</h3>
<p>Very often, probably 75% of the time if I have to give it a number, we want to set up our side suits BEFORE drawing trumps. Our side suits are often the most lucrative source of tricks.</p>
<p>The key concern: Trumps often act as entries, or they stop the enemy from cashing all their winners - because we can trump them. If we deplete dummy of trumps, sometimes we can't stop the enemy's attack.</p>
<p>Read more: <a href="${sideSuitHref}">Playing long suits</a>.</p>

<h3>3) You need to preserve entries and communication</h3>
<p>Some contracts fail because declarer draws trumps too fast and then cannot reach the right hand at the right time. Communication is just a fancy word for being able to get to a hand - for example, an Ace is a trick, but it is also a ticket to getting to the hand with the Ace in it. Think about taking a finesse, we need to be in the correct hand to do it, how do we get to the correct hand - perhaps the trump Ace? As perhaps you can start to imagine, trumnps are also good for moving from one hand to another at a critical moment.</p>
<p>Hot tip: It can take a while for a bridge player to start seeing trumps as "entries". One of the biggest resources in bridge is entries, we need to use them wisely.</p>
<p>If we don't have entries, we can't move between hands when we need to.</p>

<Callout type="checklist"><h3>Quick decision checklist: draw now or delay?</h3>
<p>At trick one, run this checklist:</p>
<ul>
  <li>Does dummy have a shortage which I can use to get ruffs?</li>
  <li>Do I have a side suit I can establish? (Often 5+ card suit that isn't trumps).</li>
  <li>Do I need to preserve entries between hand and dummy? (Usually yes when I have work to do in the side suits).</li>
</ul>
<p>If all answers are no, draw trumps now. If any answer is yes, delay trumps with a clear purpose.</p></Callout>

<Callout type="mistake"><h3>Common beginner mistake</h3>
<p>A frequent mistake is delaying trumps without a plan.</p>
<p>"Don't draw trumps yet" is only correct when you know exactly why:</p>
<ul>
  <li>ruff losers,</li>
  <li>build side-suit tricks,</li>
  <li>or protect entries.</li>
</ul>
<p>If you delay trumps without one of those reasons, defenders may score ruffs and defeat your contract.</p></Callout>

<Callout type="rule"><h3>Final takeaway</h3>
<p>Think of trump timing as a practical rule:</p>
<ul>
  <li>It is about 50/50 whether to draw trumps, so you have to have purpose with your play - come up with a reason, don't be afraid to be wrong! (Everyone is wrong a lot of the time in bridge!)</li>
  <li>Sometimes: delay trumps for a specific reason.</li>
  <li>Always: Try think of reasons or a plan at trick one, even attempting this will improve your bridge. That one habit will improve your declarer results quickly.</li>
</ul></Callout>

<h3>Related reading</h3>
<ul>
  <li><a href="${drawingTrumpsHref}">Drawing trumps</a></li>
  <li><a href="${ruffInDummyHref}">Ruff in dummy</a></li>
  <li><a href="/beginner/articles/declarer">Beginner declarer hub</a></li>
</ul>
`.trim();
}

async function getNextArticleNumber(summaryCollection) {
  const snap = await db.collection(summaryCollection).get();
  let maxNum = 0;
  snap.forEach((doc) => {
    const n = Number(doc.data()?.articleNumber || 0);
    if (Number.isFinite(n) && n > maxNum) maxNum = n;
  });
  return maxNum + 1;
}

async function upsertArticle() {
  const summaryCol = "beginnerCardPlay";
  const bodyCol = "beginnerCardPlayBody";
  const summaryRef = db.collection(summaryCol);
  const bodyRef = db.collection(bodyCol);

  const { drawingTrumpsPath, ruffInDummyPath, sideSuitPath } = await lookupSiblingPaths(summaryCol);

  const relatedLinksList = ["/beginner/articles/declarer"];
  if (drawingTrumpsPath) relatedLinksList.push(drawingTrumpsPath);
  if (ruffInDummyPath) relatedLinksList.push(ruffInDummyPath);
  if (sideSuitPath) relatedLinksList.push(sideSuitPath);

  const bodyHtml = buildBodyHtml({
    drawingTrumps: drawingTrumpsPath,
    ruffInDummy: ruffInDummyPath,
    sideSuit: sideSuitPath,
  });

  const existing = await summaryRef.where("title", "==", TITLE).limit(1).get();
  const now = FieldValue.serverTimestamp();
  const summaryBase = {
    articleType: ARTICLE_TYPE,
    title: TITLE,
    category: CATEGORY,
    subcategory: SUBCATEGORY,
    difficulty: "1",
    teaser_board: "",
    teaser: TEASER,
    hasVideo: false,
    videoUrl: "",
    seoSubtopic: "Trump Management",
    primaryKeyword: "when not to draw trumps bridge beginner",
    relatedLinks: relatedLinksList.join("\n"),
    ctaTarget: "/beginner/articles/declarer",
    metaDescription: META_DESCRIPTION,
    isFree: true,
    updatedAt: now,
  };

  if (!existing.empty) {
    const summaryDoc = existing.docs[0];
    const summaryData = summaryDoc.data() || {};
    const bodyId = summaryData.body;
    if (!bodyId) {
      throw new Error(`Existing summary ${summaryDoc.id} has no body reference`);
    }

    const batch = db.batch();
    batch.update(summaryDoc.ref, summaryBase);
    batch.set(
      bodyRef.doc(bodyId),
      {
        text: bodyHtml,
        body: { text: bodyHtml },
        isFree: true,
        updatedAt: now,
      },
      { merge: true }
    );
    await batch.commit();

    console.log(`Updated existing article: ${summaryDoc.id}`);
    console.log(`URL: https://bridgechampions.com/beginner/articles/declarer/${summaryDoc.id}`);
    return;
  }

  const articleNumber = await getNextArticleNumber(summaryCol);
  const newSummaryDoc = summaryRef.doc();
  const newBodyDoc = bodyRef.doc();
  const batch = db.batch();

  batch.set(newSummaryDoc, {
    ...summaryBase,
    articleNumber,
    body: newBodyDoc.id,
    createdAt: now,
  });

  batch.set(newBodyDoc, {
    text: bodyHtml,
    body: { text: bodyHtml },
    isFree: true,
    createdAt: now,
    updatedAt: now,
  });

  await batch.commit();
  console.log(`Created new article: ${newSummaryDoc.id}`);
  console.log(`URL: https://bridgechampions.com/beginner/articles/declarer/${newSummaryDoc.id}`);
}

upsertArticle()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to publish article:", err.message);
    process.exit(1);
  });
