/**
 * Audit every article linked from the /learn hubs (topicHubs.js) against the
 * failure modes that stop an article ranking or appearing on Google.
 * Read-only. Usage: node scripts/audit-learn-articles.js
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))) });
const db = admin.firestore();

// URL prefix -> [summary collection, body collection]
const PREFIX = [
  ["/declarer/articles/", "cardPlay", "cardPlayBody"],
  ["/defence/articles/", "defence", "defenceBody"],
  ["/bidding/advanced/", "bidding", "biddingBody"],
  ["/bidding/advanced/", "biddingAdvanced", "biddingAdvancedBody"],
  ["/bidding/basics/", "biddingBasics", "biddingBasicsBody"],
  ["/counting/articles/", "counting", "countingBody"],
  ["/beginner/articles/declarer/", "beginnerCardPlay", "beginnerCardPlayBody"],
  ["/beginner/articles/defence/", "beginnerDefence", "beginnerDefenceBody"],
  ["/beginner/articles/bidding/", "beginnerBidding", "beginnerBiddingBody"],
];

function plainLen(html) {
  return String(html || "").replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim().length;
}

async function findArticle(url) {
  // try each collection whose prefix matches the URL; match by slug or body id
  const slug = url.split("/").filter(Boolean).pop();
  for (const [pfx, col, bodyCol] of PREFIX) {
    if (!url.startsWith(pfx)) continue;
    let snap = await db.collection(col).where("slug", "==", slug).limit(1).get();
    let doc = snap.empty ? null : snap.docs[0];
    if (!doc) { const direct = await db.collection(col).doc(slug).get(); if (direct.exists) doc = direct; }
    if (doc) {
      const d = doc.data() || {};
      const bodyId = d.body || doc.id;
      const bodySnap = await db.collection(bodyCol).doc(bodyId).get();
      const bd = bodySnap.exists ? bodySnap.data() : null;
      return { col, bodyCol, doc, d, bodyExists: !!bd, bd: bd || {} };
    }
  }
  return null;
}

(async () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "src", "data", "topicHubs.js"), "utf8");
  const re = /\{\s*title:\s*"((?:[^"\\]|\\.)*)",\s*to:\s*"([^"]+)"/g;
  const links = [];
  let m; while ((m = re.exec(src))) links.push({ title: m[1], to: m[2] });
  console.log(`Auditing ${links.length} /learn hub article links...\n`);

  const issues = { broken: [], hidden: [], noBody: [], placeholder: [], thin: [], bodyNotFree: [], noSlug: [], redirect: [], noMeta: [], titleMismatch: [] };

  for (const { title, to } of links) {
    const found = await findArticle(to);
    if (!found) { issues.broken.push(to + "  (hub title: " + title + ")"); continue; }
    const { d, bd, bodyExists } = found;
    const tag = to + "  \"" + (d.title || "") + "\"";
    if (d.isHidden === true) issues.hidden.push(tag);
    if (!bodyExists) { issues.noBody.push(tag); }
    else {
      const html = bd.text || (bd.body && bd.body.text) || "";
      if (/being rewritten|sorry these articles/i.test(html)) issues.placeholder.push(tag);
      else if (plainLen(html) < 200) issues.thin.push(tag + "  (" + plainLen(html) + " chars)");
      if (bd.isFree !== true && d.isFree === true) issues.bodyNotFree.push(tag);
    }
    if (!d.slug) issues.noSlug.push(tag);
    if (typeof d.redirectTo === "string" && d.redirectTo) issues.redirect.push(tag + " -> " + d.redirectTo);
    if (!d.metaDescription && !d.teaser) issues.noMeta.push(tag);
    if (d.title && d.title.trim() !== title.trim()) issues.titleMismatch.push(to + "  hub=\"" + title + "\"  page=\"" + d.title + "\"");
  }

  const label = {
    broken: "BROKEN hub link (no matching article)",
    hidden: "HIDDEN (won't appear)",
    noBody: "NO body doc",
    placeholder: "PLACEHOLDER body (being rewritten)",
    thin: "THIN body (<200 chars)",
    bodyNotFree: "BODY missing isFree (Googlebot -> /membership)",
    noSlug: "NO slug (URL falls back to hash id)",
    redirect: "redirectTo set (page bounces)",
    noMeta: "NO meta description / teaser",
    titleMismatch: "title differs hub vs page (cosmetic)",
  };
  let total = 0;
  for (const k of Object.keys(issues)) {
    if (!issues[k].length) continue;
    total += issues[k].length;
    console.log(`### ${label[k]} — ${issues[k].length}`);
    issues[k].forEach((x) => console.log("   " + x));
    console.log("");
  }
  console.log(total === 0 ? "✅ No issues found." : `Total flagged: ${total} (note: 'title differs' is cosmetic; some hubs intentionally relabel).`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
