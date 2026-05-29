/**
 * Publish the combined takeout doubles guide draft to bidding / biddingBody.
 *
 * Usage: node scripts/build-takeout-doubles-guide-draft.js
 *        node scripts/publish-takeout-doubles-guide-draft.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPathCandidates = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
];
const keyPath = keyPathCandidates.find((p) => fs.existsSync(p));
if (!keyPath) throw new Error("No Firebase service account key found.");

const REVIEW_BODY_JS = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "review",
  "takeoutDoublesGuideDraftBody.js"
);

const HUB_PATH = "/bidding/advanced";
const TITLE = "[Work in progress] Takeout Doubles in Bridge: Complete Guide";

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

function loadDraftBody() {
  if (!fs.existsSync(REVIEW_BODY_JS)) {
    throw new Error(
      `Missing ${REVIEW_BODY_JS}. Run: node scripts/build-takeout-doubles-guide-draft.js`
    );
  }
  const raw = fs.readFileSync(REVIEW_BODY_JS, "utf8");
  const m = raw.match(/export const TAKEOUT_DOUBLES_GUIDE_DRAFT_BODY = (.+);\s*$/s);
  if (!m) throw new Error("Could not parse takeoutDoublesGuideDraftBody.js");
  return JSON.parse(m[1]);
}

const payload = {
  title: TITLE,
  teaser:
    "Combined guide in progress: making takeout doubles, responding, and outline sections to expand.",
  metaDescription:
    "Takeout doubles in bridge — work-in-progress complete guide. When to double, how partner responds, and practical tips.",
  category: "Bidding",
  subcategory: "Competitive Bidding and Doubles",
  seoSubtopic: "Takeout Doubles",
  primaryKeyword: "takeout double bridge",
  ctaTarget: HUB_PATH,
  relatedLinks: [
    "/bidding/advanced/bAld6xJ0zVd2NRekKXND",
    "/beginner/articles/bidding/lpb7CbL5j8D4GuM8rFZ4",
    "/bidding/advanced/5Qfpe6aZR56KKA6ECAw1",
    "/bidding/advanced/wsCt4ouPgZU1cB86fj2A",
    HUB_PATH,
  ].join("\n"),
  articleType: "bidding",
  difficulty: "3",
  isFree: true,
};

async function getNextArticleNumber() {
  const snap = await db.collection("bidding").get();
  return (
    snap.docs.reduce((max, doc) => {
      const n = Number((doc.data() || {}).articleNumber || 0);
      return Number.isFinite(n) ? Math.max(max, n) : max;
    }, 0) + 1
  );
}

async function main() {
  const bodyHtml = loadDraftBody();
  const existing = await db.collection("bidding").where("title", "==", TITLE).limit(1).get();

  const summaryRef = existing.empty ? db.collection("bidding").doc() : existing.docs[0].ref;
  const existingBodyId = existing.empty ? null : (existing.docs[0].data() || {}).body;
  const bodyRef = existingBodyId
    ? db.collection("biddingBody").doc(existingBodyId)
    : db.collection("biddingBody").doc();

  const now = FieldValue.serverTimestamp();
  const articleNumber = existing.empty
    ? String(await getNextArticleNumber())
    : String((existing.docs[0].data() || {}).articleNumber || "");

  await summaryRef.set(
    {
      id: summaryRef.id,
      title: payload.title,
      teaser: payload.teaser,
      metaDescription: payload.metaDescription,
      primaryKeyword: payload.primaryKeyword,
      category: payload.category,
      subcategory: payload.subcategory,
      seoSubtopic: payload.seoSubtopic,
      ctaTarget: payload.ctaTarget,
      relatedLinks: payload.relatedLinks,
      articleType: payload.articleType,
      difficulty: payload.difficulty,
      articleNumber,
      body: bodyRef.id,
      isFree: payload.isFree,
      freeUpdatedAt: now,
      updatedAt: now,
      ...(existing.empty ? { createdAt: now } : {}),
    },
    { merge: true }
  );

  const canonicalBodyId = bodyRef.id;

  await bodyRef.set(
    {
      id: canonicalBodyId,
      text: bodyHtml,
      body: { text: bodyHtml },
      isFree: payload.isFree,
      freeUpdatedAt: now,
      updatedAt: now,
    },
    { merge: true }
  );

  const sharedBodyFields = {
    body: canonicalBodyId,
    bodyCollection: "biddingBody",
    title: payload.title,
    teaser: payload.teaser,
    metaDescription: payload.metaDescription,
    primaryKeyword: payload.primaryKeyword,
    seoSubtopic: payload.seoSubtopic,
    isFree: payload.isFree,
    freeUpdatedAt: now,
    updatedAt: now,
  };

  const learnUrl = `/bidding/advanced/${canonicalBodyId}`;
  const beginnerUrl = `/beginner/articles/bidding/${canonicalBodyId}`;

  await db.collection("beginnerBidding").doc("Mwk1n0y9LI3j82OALhEq").set(
    {
      ...sharedBodyFields,
      category: "Beginner Bidding",
      subcategory: "Competitive Bidding",
      articleType: "beginnerBidding",
      difficulty: "1",
      ctaTarget: "/beginner/articles/bidding",
      relatedLinks: [beginnerUrl, learnUrl, "/beginner/articles/bidding"].join("\n"),
    },
    { merge: true }
  );

  console.log(`Published body: ${canonicalBodyId}`);
  console.log(`Learn summary: ${summaryRef.id}`);
  console.log(`Learn: http://localhost:3000${learnUrl}`);
  console.log(`Beginner: http://localhost:3000${beginnerUrl}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
