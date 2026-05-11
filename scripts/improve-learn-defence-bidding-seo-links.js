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

const CONFIGS = [
  {
    summaryCollection: "defence",
    bodyCollection: "defenceBody",
    hubPath: "/defence/articles",
    subcategoryOrder: [
      "Recognizing Dummy Types and Patterns",
      "Defensive Planning Fundamentals",
      "Opening Leads and Positioning",
      "Trump Defence and Ruffing",
    ],
    stream: "defence",
  },
  {
    summaryCollection: "bidding",
    bodyCollection: "biddingBody",
    hubPath: "/bidding/advanced",
    subcategoryOrder: [
      "Core Bidding Fundamentals",
      "Hand Evaluation and Judgment",
      "Competitive Bidding and Doubles",
      "No-Trump Auctions and Decisions",
      "Conventions and Artificial Methods",
      "Preempting Strategy",
      "Partnership Style and Discipline",
    ],
    stream: "bidding",
  },
];

function sortByArticleNumberThenTitle(a, b) {
  const nA = Number(a?.articleNumber || 0);
  const nB = Number(b?.articleNumber || 0);
  if (nA !== nB) return nA - nB;
  return String(a?.title || "").localeCompare(String(b?.title || ""));
}

function makeTeaser(article, stream) {
  const title = String(article?.title || "").replace(/\s+/g, " ").trim();
  if (stream === "defence") {
    return `Defence focus: ${title}. Learn a practical defensive decision that helps you take more tricks and apply pressure.`;
  }
  return `Bidding focus: ${title}. Learn a practical auction decision to improve partnership accuracy and contract outcomes.`;
}

function stripTrailingNavigationSection(html) {
  if (!html) return html;
  return String(html).replace(
    /\s*<h3>\s*(Where to next|Related reading)\s*<\/h3>\s*<ul>[\s\S]*?<\/ul>\s*$/i,
    ""
  );
}

function buildWhereToNextHtml(hubPath, nextPath, nextTitle, relatedPath, relatedTitle, hubLabel) {
  return (
    `<h3>Where to next</h3>` +
    `<ul>` +
    `<li><a href="${nextPath}">-> Next: ${nextTitle}</a></li>` +
    `<li><a href="${relatedPath}">-> Related: ${relatedTitle}</a></li>` +
    `<li><a href="${hubPath}">-> Back to ${hubLabel}</a></li>` +
    `</ul>`
  );
}

async function runForConfig(config) {
  const summaryRef = db.collection(config.summaryCollection);
  const bodyRef = db.collection(config.bodyCollection);
  const snap = await summaryRef.get();
  const articles = snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() || {}) }));

  const bySub = new Map();
  for (const sub of config.subcategoryOrder) bySub.set(sub, []);
  for (const article of articles) {
    const sub = String(article.subcategory || "").trim();
    if (!bySub.has(sub)) bySub.set(sub, []);
    bySub.get(sub).push(article);
  }
  for (const list of bySub.values()) list.sort(sortByArticleNumberThenTitle);

  const summaryPatches = [];
  const bodyPatches = [];
  const hubLabel = config.stream === "defence" ? "Defence Articles Hub" : "Bidding Articles Hub";

  for (const article of articles) {
    const sub = String(article.subcategory || "").trim();
    const subList = bySub.get(sub) || [];
    const idx = subList.findIndex((a) => a.id === article.id);
    const sameSubSibling =
      idx >= 0 && subList.length > 1
        ? subList[(idx + 1) % subList.length]
        : subList.find((a) => a.id !== article.id) || article;

    const orderIdx = Math.max(0, config.subcategoryOrder.indexOf(sub));
    let adjacentSubArticle = null;
    for (let step = 1; step <= config.subcategoryOrder.length; step += 1) {
      const nextSub = config.subcategoryOrder[(orderIdx + step) % config.subcategoryOrder.length];
      const list = bySub.get(nextSub) || [];
      if (list.length > 0) {
        adjacentSubArticle = list[0];
        break;
      }
    }
    if (!adjacentSubArticle) adjacentSubArticle = sameSubSibling;

    const samePath = `${config.hubPath}/${sameSubSibling.id}`;
    const adjacentPath = `${config.hubPath}/${adjacentSubArticle.id}`;
    const relatedLinks = [samePath, adjacentPath, config.hubPath];

    const summaryPatch = {
      relatedLinks: relatedLinks.join("\n"),
      ctaTarget: config.hubPath,
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (!String(article.teaser || "").trim()) {
      summaryPatch.teaser = makeTeaser(article, config.stream);
    }
    summaryPatches.push({ id: article.id, patch: summaryPatch });

    const bodyId = String(article.body || "").trim();
    if (!bodyId) continue;
    const bodyDoc = (await bodyRef.doc(bodyId).get()).data() || {};
    const originalHtml = String(bodyDoc.text || bodyDoc?.body?.text || "").trim();
    if (!originalHtml) continue;

    const baseHtml = stripTrailingNavigationSection(originalHtml);
    const navHtml = buildWhereToNextHtml(
      config.hubPath,
      samePath,
      String(sameSubSibling.title || "Next article"),
      adjacentPath,
      String(adjacentSubArticle.title || "Related article"),
      hubLabel
    );
    const updatedHtml = `${baseHtml}${navHtml}`;
    bodyPatches.push({ bodyId, updatedHtml });
  }

  for (const row of summaryPatches) {
    await summaryRef.doc(row.id).set(row.patch, { merge: true });
  }
  for (const row of bodyPatches) {
    await bodyRef.doc(row.bodyId).set(
      {
        text: row.updatedHtml,
        body: { text: row.updatedHtml },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }

  return {
    collection: config.summaryCollection,
    summaryUpdates: summaryPatches.length,
    bodyUpdates: bodyPatches.length,
  };
}

async function run() {
  const results = [];
  for (const config of CONFIGS) {
    results.push(await runForConfig(config));
  }
  console.log(JSON.stringify(results, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
