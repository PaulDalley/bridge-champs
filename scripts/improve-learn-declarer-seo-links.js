const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPathCandidates = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
];
const keyPath = keyPathCandidates.find((p) => fs.existsSync(p));
if (!keyPath) {
  throw new Error("No Firebase service account key found.");
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const SUBCATEGORY_ORDER = [
  "Patterns and Technique",
  "Counting and Planning",
  "Trump Management",
  "Entries and Communication",
  "Suit Establishment and Timing",
  "Practice Hands",
];

const HUB_PATH = "/declarer/articles";

function sortByArticleNumberThenTitle(a, b) {
  const nA = Number(a?.articleNumber || 0);
  const nB = Number(b?.articleNumber || 0);
  if (nA !== nB) return nA - nB;
  return String(a?.title || "").localeCompare(String(b?.title || ""));
}

function makeTeaser(article) {
  const title = String(article?.title || "").replace(/\s+/g, " ").trim();
  const sub = String(article?.subcategory || "").trim();
  if (sub === "Patterns and Technique") {
    return `Practical declarer pattern lesson: ${title}. Learn a clear technique you can apply at the table right away.`;
  }
  if (sub === "Counting and Planning") {
    return `Declarer planning focus: ${title}. Build a cleaner trick plan by counting winners, losers, and timing early.`;
  }
  if (sub === "Trump Management") {
    return `Trump timing focus: ${title}. Learn practical decisions for drawing trumps without damaging your overall plan.`;
  }
  if (sub === "Entries and Communication") {
    return `Entry management focus: ${title}. Keep communication working so your established winners remain reachable.`;
  }
  if (sub === "Suit Establishment and Timing") {
    return `Timing focus: ${title}. Learn how to establish and cash side-suit winners at the right moment.`;
  }
  if (sub === "Practice Hands") {
    return `Guided declarer practice: ${title}. Apply planning, timing, and counting habits in a practical full hand.`;
  }
  return `Declarer technique article: ${title}. Learn a practical concept to improve consistency at the table.`;
}

function stripTrailingNavigationSection(html) {
  if (!html) return html;
  return String(html).replace(
    /\s*<h3>\s*(Where to next|Related reading)\s*<\/h3>\s*<ul>[\s\S]*?<\/ul>\s*$/i,
    ""
  );
}

function buildWhereToNextHtml(nextPath, nextTitle, relatedPath, relatedTitle) {
  return (
    `<h3>Where to next</h3>` +
    `<ul>` +
    `<li><a href="${nextPath}">-> Next: ${nextTitle}</a></li>` +
    `<li><a href="${relatedPath}">-> Related: ${relatedTitle}</a></li>` +
    `<li><a href="${HUB_PATH}">-> Back to Declarer Articles Hub</a></li>` +
    `</ul>`
  );
}

async function run() {
  const summaryRef = db.collection("cardPlay");
  const bodyRef = db.collection("cardPlayBody");
  const snap = await summaryRef.get();
  const articles = snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() || {}) }));

  const bySub = new Map();
  for (const sub of SUBCATEGORY_ORDER) bySub.set(sub, []);
  for (const article of articles) {
    const sub = String(article.subcategory || "").trim();
    if (!bySub.has(sub)) bySub.set(sub, []);
    bySub.get(sub).push(article);
  }
  for (const list of bySub.values()) list.sort(sortByArticleNumberThenTitle);

  const updates = [];
  const bodyUpdates = [];

  for (const article of articles) {
    const sub = String(article.subcategory || "").trim();
    const subList = bySub.get(sub) || [];
    const idx = subList.findIndex((a) => a.id === article.id);
    const sameSubSibling =
      idx >= 0 && subList.length > 1
        ? subList[(idx + 1) % subList.length]
        : subList.find((a) => a.id !== article.id) || article;

    const subOrderIdx = Math.max(0, SUBCATEGORY_ORDER.indexOf(sub));
    let adjacentSubArticle = null;
    for (let step = 1; step <= SUBCATEGORY_ORDER.length; step += 1) {
      const nextSub = SUBCATEGORY_ORDER[(subOrderIdx + step) % SUBCATEGORY_ORDER.length];
      const list = bySub.get(nextSub) || [];
      if (list.length > 0) {
        adjacentSubArticle = list[0];
        break;
      }
    }
    if (!adjacentSubArticle) adjacentSubArticle = sameSubSibling;

    const samePath = `${HUB_PATH}/${sameSubSibling.id}`;
    const adjacentPath = `${HUB_PATH}/${adjacentSubArticle.id}`;
    const relatedLinks = [samePath, adjacentPath, HUB_PATH];

    const summaryPatch = {
      relatedLinks: relatedLinks.join("\n"),
      ctaTarget: HUB_PATH,
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (!String(article.teaser || "").trim()) {
      summaryPatch.teaser = makeTeaser(article);
    }
    updates.push({ id: article.id, patch: summaryPatch });

    const bodyId = String(article.body || "").trim();
    if (!bodyId) continue;
    const bodyDoc = (await bodyRef.doc(bodyId).get()).data() || {};
    const originalHtml = String(bodyDoc.text || bodyDoc?.body?.text || "").trim();
    if (!originalHtml) continue;
    const baseHtml = stripTrailingNavigationSection(originalHtml);
    const navHtml = buildWhereToNextHtml(
      samePath,
      String(sameSubSibling.title || "Next article"),
      adjacentPath,
      String(adjacentSubArticle.title || "Related article")
    );
    const updatedHtml = `${baseHtml}${navHtml}`;
    bodyUpdates.push({ bodyId, updatedHtml });
  }

  for (const row of updates) {
    await summaryRef.doc(row.id).set(row.patch, { merge: true });
  }
  for (const row of bodyUpdates) {
    await bodyRef.doc(row.bodyId).set(
      {
        text: row.updatedHtml,
        body: { text: row.updatedHtml },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }

  console.log(
    JSON.stringify(
      {
        summaryUpdates: updates.length,
        bodyUpdates: bodyUpdates.length,
      },
      null,
      2
    )
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
