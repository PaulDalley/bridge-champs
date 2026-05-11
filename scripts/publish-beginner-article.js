/**
 * Publish (or update) a beginner article from a JSON payload.
 *
 * Usage:
 *   node scripts/publish-beginner-article.js --input "docs/article-payloads/example-beginner-article.json" --apply
 *   node scripts/publish-beginner-article.js --input "docs/article-payloads/example-beginner-article.json" --apply --key "C:\path\key.json"
 *
 * Workflow:
 * 1) Copy docs/article-payloads/example-beginner-article.json
 * 2) Fill title/teaser/meta/bodyHtml + seo fields
 * 3) Run with --apply
 *
 * Guardrails:
 * - Upserts by title (avoids accidental duplicate docs).
 * - Writes BOTH body.text and text so renderer always sees latest.
 * - Enforces semantic/callout body HTML (rejects class= wrappers by default).
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

function requireApplyFlag() {
  if (!process.argv.includes("--apply")) {
    console.error("Refusing to run without --apply");
    process.exit(1);
  }
}

function readPayload() {
  const input = getArgValue("--input");
  if (!input) {
    console.error("Missing --input <path-to-json>");
    process.exit(1);
  }
  const fullPath = path.resolve(input);
  if (!fs.existsSync(fullPath)) {
    console.error(`Input file not found: ${fullPath}`);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (err) {
    console.error(`Invalid JSON in ${fullPath}: ${err.message}`);
    process.exit(1);
  }
}

function validatePayload(payload) {
  const required = [
    "title",
    "teaser",
    "metaDescription",
    "articleType",
    "category",
    "subcategory",
    "seoSubtopic",
    "primaryKeyword",
    "bodyHtml",
  ];
  const missing = required.filter((k) => !payload[k] || String(payload[k]).trim() === "");
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}`);
  }

  const allowedArticleTypes = ["beginnerCardPlay", "beginnerDefence", "beginnerBidding"];
  if (!allowedArticleTypes.includes(payload.articleType)) {
    throw new Error(
      `articleType must be one of: ${allowedArticleTypes.join(", ")} (got ${payload.articleType})`
    );
  }

  // Key guardrail from rendering pipeline:
  // semantic tags + Callout tags are reliable, custom class wrappers are not.
  if (String(payload.bodyHtml).includes('class="') || String(payload.bodyHtml).includes("class='")) {
    if (!process.argv.includes("--allow-classes")) {
      throw new Error(
        "bodyHtml contains class= wrappers. Use semantic HTML + <Callout ...> tags only, or pass --allow-classes explicitly."
      );
    }
  }
}

function collectionNamesForType(articleType) {
  if (articleType === "beginnerCardPlay") {
    return {
      summary: "beginnerCardPlay",
      body: "beginnerCardPlayBody",
      defaultCta: "/beginner/articles/declarer",
      defaultCategory: "Beginner Declarer",
    };
  }
  if (articleType === "beginnerDefence") {
    return {
      summary: "beginnerDefence",
      body: "beginnerDefenceBody",
      defaultCta: "/beginner/articles/defence",
      defaultCategory: "Beginner Defence",
    };
  }
  return {
    summary: "beginnerBidding",
    body: "beginnerBiddingBody",
    defaultCta: "/beginner/articles/bidding",
    defaultCategory: "Beginner Bidding",
  };
}

async function resolveRelatedLinks(summaryCol, basePath, payload) {
  const out = [];
  if (Array.isArray(payload.relatedLinks) && payload.relatedLinks.length > 0) {
    payload.relatedLinks.forEach((x) => {
      if (typeof x === "string" && x.trim()) out.push(x.trim());
    });
  }

  if (Array.isArray(payload.relatedLinkTitles) && payload.relatedLinkTitles.length > 0) {
    const snap = await db.collection(summaryCol).get();
    const byTitleLower = new Map();
    snap.forEach((doc) => {
      const t = String(doc.data()?.title || "").trim().toLowerCase();
      if (t) byTitleLower.set(t, `${basePath}/${doc.id}`);
    });
    payload.relatedLinkTitles.forEach((title) => {
      const key = String(title || "").trim().toLowerCase();
      const pathFromTitle = byTitleLower.get(key);
      if (pathFromTitle) out.push(pathFromTitle);
    });
  }

  // Deduplicate, preserve order
  return [...new Set(out)];
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

requireApplyFlag();
const payload = readPayload();
validatePayload(payload);

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

async function upsertFromPayload() {
  const collections = collectionNamesForType(payload.articleType);
  const summaryRef = db.collection(collections.summary);
  const bodyRef = db.collection(collections.body);
  const basePath = collections.defaultCta;

  const relatedLinksResolved = await resolveRelatedLinks(collections.summary, basePath, payload);
  const ctaTarget = payload.ctaTarget || collections.defaultCta;

  const summaryBase = {
    articleType: payload.articleType,
    title: payload.title,
    category: payload.category || collections.defaultCategory,
    subcategory: payload.subcategory,
    difficulty: "1",
    teaser_board: payload.teaserBoard || "",
    teaser: payload.teaser,
    hasVideo: payload.hasVideo === true,
    videoUrl: payload.videoUrl || "",
    seoSubtopic: payload.seoSubtopic,
    primaryKeyword: payload.primaryKeyword,
    relatedLinks: relatedLinksResolved.join("\n"),
    ctaTarget,
    metaDescription: payload.metaDescription,
    isFree: payload.isFree !== false,
    updatedAt: FieldValue.serverTimestamp(),
  };

  const bodyText = String(payload.bodyHtml).trim();
  const bodyBase = {
    text: bodyText,
    body: { text: bodyText },
    isFree: payload.isFree !== false,
    updatedAt: FieldValue.serverTimestamp(),
  };

  const existing = await summaryRef.where("title", "==", payload.title).limit(1).get();
  if (!existing.empty) {
    const summaryDoc = existing.docs[0];
    const bodyId = summaryDoc.data()?.body;
    if (!bodyId) throw new Error(`Existing summary ${summaryDoc.id} has no body reference`);
    const batch = db.batch();
    batch.update(summaryDoc.ref, summaryBase);
    batch.set(bodyRef.doc(bodyId), bodyBase, { merge: true });
    await batch.commit();
    console.log(`Updated existing article: ${summaryDoc.id}`);
    console.log(`URL: https://bridgechampions.com${basePath}/${summaryDoc.id}`);
    return;
  }

  const articleNumber = await getNextArticleNumber(collections.summary);
  const newSummaryDoc = summaryRef.doc();
  const newBodyDoc = bodyRef.doc();
  const batch = db.batch();
  batch.set(newSummaryDoc, {
    ...summaryBase,
    articleNumber,
    body: newBodyDoc.id,
    createdAt: FieldValue.serverTimestamp(),
  });
  batch.set(newBodyDoc, {
    ...bodyBase,
    createdAt: FieldValue.serverTimestamp(),
  });
  await batch.commit();
  console.log(`Created new article: ${newSummaryDoc.id}`);
  console.log(`URL: https://bridgechampions.com${basePath}/${newSummaryDoc.id}`);
}

upsertFromPayload()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Publish failed:", err.message);
    process.exit(1);
  });
