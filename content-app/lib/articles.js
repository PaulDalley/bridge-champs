import { db } from "./firestoreAdmin";

// New URL taxonomy: /learn/<category>/<slug>. Each category aggregates one or more
// Firestore summary/body collection pairs (kept in sync with the CRA app + the
// redirect map generator at scripts/gen-redirect-map.js).
export const CATEGORIES = ["bidding", "declarer", "defence", "beginner"];

const CATEGORY_COLLECTIONS = {
  bidding: [
    ["bidding", "biddingBody"],
    ["biddingAdvanced", "biddingAdvancedBody"],
    ["biddingBasics", "biddingBasicsBody"],
  ],
  declarer: [
    ["cardPlay", "cardPlayBody"],
    ["cardPlayBasics", "cardPlayBasicsBody"],
    ["counting", "countingBody"],
  ],
  defence: [
    ["defence", "defenceBody"],
    ["defenceBasics", "defenceBasicsBody"],
  ],
  beginner: [
    ["beginnerCardPlay", "beginnerCardPlayBody"],
    ["beginnerDefence", "beginnerDefenceBody"],
    ["beginnerBidding", "beginnerBiddingBody"],
  ],
};

const CATEGORY_LABEL = {
  bidding: "Bidding",
  declarer: "Declarer play",
  defence: "Defence",
  beginner: "Beginner",
};

export function categoryLabel(category) {
  return CATEGORY_LABEL[category] || category;
}

// Article body docs store the HTML under `text` or `body` (string, or {text}).
function extractBodyHtml(data) {
  if (!data) return "";
  const candidate = data.text != null ? data.text : data.body;
  if (typeof candidate === "string") return candidate;
  if (candidate && typeof candidate === "object" && typeof candidate.text === "string") {
    return candidate.text;
  }
  return "";
}

// Firestore Timestamp -> ISO string (safe for serialization + <time>).
export function toIso(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function isPublishable(meta) {
  if (!meta) return false;
  if (meta.isHidden === true) return false;
  if (typeof meta.redirectTo === "string" && meta.redirectTo.startsWith("/")) return false;
  if (!meta.slug || !String(meta.slug).trim()) return false;
  return true;
}

// Firestore reads on a cold Cloud Run instance (or a momentary hiccup) occasionally
// throw. Without a retry, the swallowed failure yields an empty list that then gets
// baked into the hour-long ISR cache — e.g. the homepage's "Recently added" block
// disappears for up to an hour. Retry a few times with backoff so transient
// failures recover; a genuinely persistent failure (no creds) still falls through.
async function withRetry(fn, attempts = 3, baseDelayMs = 250) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, baseDelayMs * (i + 1)));
    }
  }
  throw lastErr;
}

async function readCategory(category) {
  const pairs = CATEGORY_COLLECTIONS[category] || [];
  const out = [];
  for (const [summaryColl, bodyColl] of pairs) {
    let snap;
    try {
      snap = await withRetry(() => db().collection(summaryColl).get());
    } catch (_) {
      continue; // no creds / persistent failure — skip, build still succeeds
    }
    snap.forEach((doc) => {
      const meta = doc.data() || {};
      if (!isPublishable(meta)) return;
      out.push({
        category,
        slug: String(meta.slug).trim(),
        summaryColl,
        bodyColl,
        bodyId: meta.body || doc.id,
        title: meta.title || "",
        createdAt: toIso(meta.createdAt),
        updatedAt: toIso(meta.updatedAt) || toIso(meta.createdAt),
      });
    });
  }
  return out;
}

// Every publishable article across all categories. Used by generateStaticParams,
// the sitemap, and the category hubs. Never throws (returns [] on failure).
export async function listAllArticles() {
  try {
    const groups = await Promise.all(CATEGORIES.map(readCategory));
    return groups.flat();
  } catch (_) {
    return [];
  }
}

export async function listCategoryArticles(category) {
  if (!CATEGORY_COLLECTIONS[category]) return [];
  return readCategory(category);
}

// Resolve /learn/<category>/<slug> to { meta, bodyHtml }. null if not found.
export async function getArticle(category, slug) {
  const pairs = CATEGORY_COLLECTIONS[category];
  if (!pairs) return null;
  for (const [summaryColl, bodyColl] of pairs) {
    let snap;
    try {
      snap = await withRetry(() => db().collection(summaryColl).where("slug", "==", slug).limit(1).get());
    } catch (_) {
      continue;
    }
    if (snap.empty) continue;
    const meta = snap.docs[0].data() || {};
    if (!isPublishable(meta)) return null;
    const bodyId = meta.body || snap.docs[0].id;
    let bodyDoc;
    try {
      bodyDoc = await withRetry(() => db().collection(bodyColl).doc(bodyId).get());
    } catch (_) {
      return null;
    }
    return {
      category,
      slug,
      bodyId,
      meta,
      bodyHtml: extractBodyHtml(bodyDoc.exists ? bodyDoc.data() : null),
      createdAt: toIso(meta.createdAt),
      updatedAt: toIso(meta.updatedAt) || toIso(meta.createdAt),
    };
  }
  return null;
}
