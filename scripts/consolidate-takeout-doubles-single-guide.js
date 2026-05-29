/**
 * One canonical takeout-doubles guide (biddingBody) shown in Learn + Beginner.
 * Old URLs redirect via summary redirectTo or body.redirectTo.
 *
 *   node scripts/build-takeout-doubles-guide-draft.js
 *   node scripts/consolidate-takeout-doubles-single-guide.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPath = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
].find((p) => fs.existsSync(p));
if (!keyPath) throw new Error("No Firebase service account key found.");

const REVIEW_BODY_JS = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "review",
  "takeoutDoublesGuideDraftBody.js"
);

const CANONICAL_BODY_ID = "yt6au7gwYwPahTxQ4kd5";
const LEARN_SUMMARY_ID = "GbCIDHV4262cIbWMjIOU";
const BEGINNER_SUMMARY_ID = "Mwk1n0y9LI3j82OALhEq";
const OLD_BEGINNER_BODY_ID = "lpb7CbL5j8D4GuM8rFZ4";
const RESPONDING_SUMMARY_ID = "3L6JH3QtMyxLNeowf4RL";

const TITLE = "[Work in progress] Takeout Doubles in Bridge: Complete Guide";
const TEASER =
  "Combined guide in progress: making takeout doubles, responding, and sections still to expand.";
const META =
  "Takeout doubles in bridge — work-in-progress complete guide. When to double, how partner responds, and practical tips.";
const BEGINNER_URL = `/beginner/articles/bidding/${CANONICAL_BODY_ID}`;
const LEARN_URL = `/bidding/advanced/${CANONICAL_BODY_ID}`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

function loadDraftBody() {
  if (!fs.existsSync(REVIEW_BODY_JS)) {
    throw new Error(`Missing ${REVIEW_BODY_JS}. Run build-takeout-doubles-guide-draft.js first.`);
  }
  const raw = fs.readFileSync(REVIEW_BODY_JS, "utf8");
  const m = raw.match(/export const TAKEOUT_DOUBLES_GUIDE_DRAFT_BODY = (.+);\s*$/s);
  if (!m) throw new Error("Could not parse takeoutDoublesGuideDraftBody.js");
  return JSON.parse(m[1]);
}

function stripPublishBoilerplate(html) {
  return String(html)
    .replace(/<p><em>Draft:[\s\S]*?<\/em><\/p>\s*/i, "")
    .replace(/<h2>Part 1 —[\s\S]*?<\/h2>\s*<p><em>Source:[\s\S]*?<\/em><\/p>\s*/i, "")
    .replace(/<h2>Part 2 —[\s\S]*?<\/h2>\s*<p><em>Source:[\s\S]*?<\/em><\/p>\s*/i, "")
    .trim();
}

function makeMovedStubHtml(targetUrl, title) {
  return (
    `<h2>Article moved</h2>` +
    `<p>This topic is now part of one guide: <a href="${targetUrl}">${title}</a>.</p>` +
    `<h3>Where to next</h3>` +
    `<ul class="browser-default">` +
    `<li><a href="${targetUrl}">-> Continue to the takeout doubles guide</a></li>` +
    `</ul>`
  );
}

async function main() {
  const bodyHtml = stripPublishBoilerplate(loadDraftBody());
  const now = FieldValue.serverTimestamp();

  await db.collection("biddingBody").doc(CANONICAL_BODY_ID).set(
    {
      id: CANONICAL_BODY_ID,
      text: bodyHtml,
      body: { text: bodyHtml },
      isFree: true,
      freeUpdatedAt: now,
      updatedAt: now,
    },
    { merge: true }
  );

  const sharedSummaryFields = {
    title: TITLE,
    teaser: TEASER,
    metaDescription: META,
    primaryKeyword: "takeout double bridge",
    seoSubtopic: "Takeout Doubles",
    body: CANONICAL_BODY_ID,
    bodyCollection: "biddingBody",
    isFree: true,
    freeUpdatedAt: now,
    updatedAt: now,
  };

  await db.collection("bidding").doc(LEARN_SUMMARY_ID).set(
    {
      ...sharedSummaryFields,
      category: "Bidding",
      subcategory: "Competitive Bidding and Doubles",
      articleType: "bidding",
      difficulty: "3",
      ctaTarget: "/bidding/advanced",
      relatedLinks: [LEARN_URL, BEGINNER_URL, "/bidding/advanced"].join("\n"),
    },
    { merge: true }
  );

  await db.collection("beginnerBidding").doc(BEGINNER_SUMMARY_ID).set(
    {
      ...sharedSummaryFields,
      category: "Beginner Bidding",
      subcategory: "Competitive Bidding",
      articleType: "beginnerBidding",
      difficulty: "1",
      ctaTarget: "/beginner/articles/bidding",
      relatedLinks: [BEGINNER_URL, LEARN_URL, "/beginner/articles/bidding"].join("\n"),
    },
    { merge: true }
  );

  const oldBeginnerStub = makeMovedStubHtml(BEGINNER_URL, TITLE);
  await db.collection("beginnerBiddingBody").doc(OLD_BEGINNER_BODY_ID).set(
    {
      text: oldBeginnerStub,
      body: { text: oldBeginnerStub },
      redirectTo: BEGINNER_URL,
      updatedAt: now,
    },
    { merge: true }
  );

  await db.collection("bidding").doc(RESPONDING_SUMMARY_ID).set(
    {
      redirectTo: LEARN_URL,
      ctaTarget: "/bidding/advanced",
      relatedLinks: [LEARN_URL, BEGINNER_URL, "/bidding/advanced"].join("\n"),
      updatedAt: now,
    },
    { merge: true }
  );

  console.log("Canonical body:", CANONICAL_BODY_ID);
  console.log("Learn:", LEARN_URL);
  console.log("Beginner:", BEGINNER_URL);
  console.log("Old beginner URL redirects:", `/beginner/articles/bidding/${OLD_BEGINNER_BODY_ID}`);
  console.log("Responding article redirects:", `/bidding/advanced/${RESPONDING_SUMMARY_ID}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
