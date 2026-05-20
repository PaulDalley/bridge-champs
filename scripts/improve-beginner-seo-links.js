const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const APPLY = process.argv.includes("--apply");

if (!APPLY) {
  console.error("Refusing to run without --apply.");
  process.exit(1);
}

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
    summaryCollection: "beginnerBidding",
    bodyCollection: "beginnerBiddingBody",
    hubPath: "/beginner/articles/bidding",
    hubLabel: "Beginner Bidding Articles Hub",
  },
  {
    summaryCollection: "beginnerDefence",
    bodyCollection: "beginnerDefenceBody",
    hubPath: "/beginner/articles/defence",
    hubLabel: "Beginner Defence Articles Hub",
  },
  {
    summaryCollection: "beginnerCardPlay",
    bodyCollection: "beginnerCardPlayBody",
    hubPath: "/beginner/articles/declarer",
    hubLabel: "Beginner Declarer Articles Hub",
  },
];

function sortByArticleNumberThenTitle(a, b) {
  const nA = Number(a?.articleNumber || 0);
  const nB = Number(b?.articleNumber || 0);
  if (nA !== nB) return nA - nB;
  return String(a?.title || "").localeCompare(String(b?.title || ""));
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

function isLiveArticle(article) {
  if (!article) return false;
  if (article.isHidden === true) return false;
  if (typeof article.redirectTo === "string" && article.redirectTo.startsWith("/")) return false;
  if (!String(article?.body || "").trim()) return false;
  return true;
}

function buildCollectionRing(liveArticles) {
  const ordered = [...liveArticles].sort(sortByArticleNumberThenTitle);
  if (ordered.length === 0) return [];

  return ordered.map((article, idx) => {
    const next = ordered[(idx + 1) % ordered.length];
    const related = ordered[(idx + 2) % ordered.length] || next;
    return { article, next, related };
  });
}

async function runForConfig(config) {
  const summaryRef = db.collection(config.summaryCollection);
  const bodyRef = db.collection(config.bodyCollection);
  const snap = await summaryRef.get();
  const all = snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() || {}) }));
  const live = all.filter(isLiveArticle);
  const ring = buildCollectionRing(live);

  let summaryUpdates = 0;
  let bodyUpdates = 0;

  for (const row of ring) {
    const { article, next, related } = row;
    const nextBodyId = String(next.body || "").trim();
    const relatedBodyId = String(related.body || "").trim();
    if (!nextBodyId || !relatedBodyId) continue;
    const nextPath = `${config.hubPath}/${nextBodyId}`;
    const relatedPath = `${config.hubPath}/${relatedBodyId}`;
    const relatedLinks = [nextPath, relatedPath, config.hubPath];

    await summaryRef.doc(article.id).set(
      {
        relatedLinks: relatedLinks.join("\n"),
        ctaTarget: config.hubPath,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    summaryUpdates += 1;

    const bodyId = String(article.body || "").trim();
    const bodyDoc = (await bodyRef.doc(bodyId).get()).data() || {};
    const originalHtml = String(bodyDoc.text || bodyDoc?.body?.text || "").trim();
    if (!originalHtml) continue;

    const baseHtml = stripTrailingNavigationSection(originalHtml);
    const navHtml = buildWhereToNextHtml(
      config.hubPath,
      nextPath,
      String(next.title || "Next article"),
      relatedPath,
      String(related.title || "Related article"),
      config.hubLabel
    );
    const updatedHtml = `${baseHtml}${navHtml}`;

    await bodyRef.doc(bodyId).set(
      {
        text: updatedHtml,
        body: { text: updatedHtml },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    bodyUpdates += 1;
  }

  return {
    summaryCollection: config.summaryCollection,
    totalArticles: all.length,
    liveArticles: live.length,
    summaryUpdates,
    bodyUpdates,
  };
}

async function run() {
  const out = [];
  for (const config of CONFIGS) {
    out.push(await runForConfig(config));
  }
  console.log(JSON.stringify(out, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
