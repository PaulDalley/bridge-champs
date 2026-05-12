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

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const COLLECTIONS = [
  ["beginnerCardPlay", "beginnerCardPlayBody"],
  ["beginnerDefence", "beginnerDefenceBody"],
  ["beginnerBidding", "beginnerBiddingBody"],
];

const HEADING_RULES = [
  { heading: /common(?:\s+beginner)?\s+mistakes?/i, type: "mistake" },
  { heading: /(quick|simple|table|practical)\s+(decision\s+)?checklist/i, type: "checklist" },
  { heading: /final takeaway|final thought|final recap/i, type: "rule" },
  { heading: /important note|practical warning|core idea|key idea/i, type: "example" },
];

function wrapSectionByHeading(html, headingRegex, type) {
  const sectionRegex = /(<h3[^>]*>\s*([^<]+?)\s*<\/h3>)([\s\S]*?)(?=(<h3[^>]*>|$))/gi;
  return html.replace(sectionRegex, (full, h3Block, headingText, sectionBody, nextH3) => {
    if (!headingRegex.test(String(headingText || ""))) return full;
    if (/where to next/i.test(String(headingText || ""))) return full;
    if (String(sectionBody || "").includes("<Callout")) return full;
    const trimmedBody = String(sectionBody || "").trim();
    if (!trimmedBody) return full;
    return `${h3Block}\n<Callout type="${type}">\n${trimmedBody}\n</Callout>\n${nextH3 || ""}`;
  });
}

function ensureIntroCallout(html) {
  if (html.includes("<Callout")) return html;
  const introRegex = /(<h2[^>]*>[\s\S]*?<\/h2>)([\s\S]*?)(?=<h3[^>]*>|$)/i;
  return html.replace(introRegex, (full, h2Block, introBody) => {
    const body = String(introBody || "").trim();
    if (!body) return full;
    return `${h2Block}\n<Callout type="example">\n${body}\n</Callout>`;
  });
}

function normalizeCalloutSpacing(html) {
  return String(html || "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/<\/Callout>\s*(<h3)/g, "</Callout>\n\n$1");
}

function enhanceHtml(html) {
  let out = String(html || "");
  if (!out.trim()) return out;
  if (/^\s*<pre[\s>]/i.test(out)) return out;
  for (const rule of HEADING_RULES) {
    out = wrapSectionByHeading(out, rule.heading, rule.type);
  }
  out = ensureIntroCallout(out);
  out = normalizeCalloutSpacing(out);
  return out;
}

async function processCollection(summaryCollection, bodyCollection) {
  const summaries = await db.collection(summaryCollection).get();
  let updated = 0;
  let total = 0;
  for (const doc of summaries.docs) {
    const summary = doc.data() || {};
    const bodyId = summary.body;
    if (!bodyId) continue;
    total += 1;
    const bodyRef = db.collection(bodyCollection).doc(bodyId);
    const bodySnap = await bodyRef.get();
    if (!bodySnap.exists) continue;
    const bodyData = bodySnap.data() || {};
    const oldHtml = String(bodyData.text || bodyData.body?.text || "");
    const newHtml = enhanceHtml(oldHtml);
    if (!newHtml || newHtml === oldHtml) continue;
    await bodyRef.set(
      {
        text: newHtml,
        body: { text: newHtml },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    await doc.ref.set({ updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    updated += 1;
  }
  return { summaryCollection, bodyCollection, total, updated };
}

async function main() {
  const results = [];
  for (const [summaryCollection, bodyCollection] of COLLECTIONS) {
    // eslint-disable-next-line no-await-in-loop
    const result = await processCollection(summaryCollection, bodyCollection);
    results.push(result);
  }
  const totalUpdated = results.reduce((n, r) => n + r.updated, 0);
  results.forEach((r) =>
    console.log(`${r.summaryCollection}: updated ${r.updated}/${r.total}`)
  );
  console.log(`Done. Updated ${totalUpdated} beginner article bodies.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
