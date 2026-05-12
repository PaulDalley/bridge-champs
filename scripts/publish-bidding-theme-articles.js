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

const TRAINER_PATH = path.join(__dirname, "..", "src", "components", "Bidding", "BiddingTrainer.js");
const HUB_PATH = "/bidding/advanced";
const PRACTICE_PATH = "/bidding/practice";

const THEME_COPY_OVERRIDES = {
  "opening hand evaluation": {
    title: "Do You Open the Bidding? Problems 1-5 Explained",
    teaser:
      "Practical opening decisions from the first five trainer problems. Learn a clear opening baseline you can trust at the table.",
    metaDescription:
      "Learn opening hand evaluation through practical bidding problems 1-5. Build reliable opening decisions and avoid random openings.",
  },
  "responding to partner": {
    title: "Responding to Partner: Problems 6-10 Explained",
    teaser:
      "Use trainer problems 6-10 to sharpen your responder decisions and show your hand clearly from the first response.",
    metaDescription:
      "Learn responder decisions from bidding problems 6-10. Improve fit finding, response structure, and auction clarity.",
  },
  "the modern 1nt opening": {
    title: "The Modern 1NT Opening: Problems 11-16 Explained",
    teaser:
      "Work through trainer problems 11-16 to build a clean modern 1NT opening style with better partnership clarity.",
    metaDescription:
      "Learn the modern 1NT opening through practical bidding problems 11-16. Improve range discipline and partnership communication.",
  },
};

function parseTrainerRows(fileText) {
  const lines = fileText.split(/\r?\n/);
  const rows = [];
  let current = null;

  const pushCurrent = () => {
    if (!current || !current.id || !current.themeLabel) return;
    rows.push(current);
  };

  for (const line of lines) {
    const idMatch = line.match(/id:\s*"([^"]+)"/);
    if (idMatch && /^bid\d+-\d+$/i.test(idMatch[1])) {
      pushCurrent();
      current = { id: idMatch[1] };
      continue;
    }
    if (!current) continue;

    const difficultyMatch = line.match(/difficulty:\s*(\d+)/);
    if (difficultyMatch) current.difficulty = Number(difficultyMatch[1]);

    const titleMatch = line.match(/title:\s*"([^"]+)"/);
    if (titleMatch && !current.title) current.title = titleMatch[1];

    const contractMatch = line.match(/contractLabel:\s*"([^"]+)"/);
    if (contractMatch && !current.contractLabel) current.contractLabel = contractMatch[1];

    const themeMatch = line.match(/themeLabel:\s*"([^"]+)"/);
    if (themeMatch && !current.themeLabel) current.themeLabel = themeMatch[1];
  }
  pushCurrent();
  return rows;
}

function normalizeTheme(rawTheme) {
  return String(rawTheme || "").replace(/^Theme:\s*/i, "").trim();
}

function parseIdNumber(id) {
  const match = String(id || "").match(/^bid(\d+)-(\d+)$/i);
  if (!match) return { group: 999, item: 999 };
  return { group: Number(match[1]), item: Number(match[2]) };
}

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "-");
}

function pickSubcategory(theme) {
  const t = theme.toLowerCase();
  if (t.includes("lebensohl") || t.includes("splinter") || t.includes("forcing")) {
    return "Conventions and Artificial Methods";
  }
  if (t.includes("overcall") || t.includes("double") || t.includes("pass")) {
    return "Competitive Bidding and Doubles";
  }
  if (t.includes("1nt") || t.includes("no-trump")) {
    return "No-Trump Auctions and Decisions";
  }
  if (t.includes("slam") || t.includes("evaluation") || t.includes("judgment") || t.includes("duplicate")) {
    return "Hand Evaluation and Judgment";
  }
  return "Core Bidding Fundamentals";
}

function buildThemeArticle(theme, rows) {
  const key = theme.toLowerCase();
  const override = THEME_COPY_OVERRIDES[key];
  const subcategory = pickSubcategory(theme);
  const sorted = [...rows].sort((a, b) => {
    const pa = parseIdNumber(a.id);
    const pb = parseIdNumber(b.id);
    if (pa.group !== pb.group) return pa.group - pb.group;
    return pa.item - pb.item;
  });
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const idRangeLabel = first && last ? `${first.id} to ${last.id}` : "trainer set";
  const problemList = sorted.slice(0, 6).map((r) => `<li>${r.title || r.id}</li>`).join("\n");
  const contractLabel = sorted.find((r) => r.contractLabel)?.contractLabel || theme;

  const title = override?.title || `${theme}: Practical Trainer Lessons Across Levels`;
  const teaser =
    override?.teaser ||
    `Key lessons from the ${theme} trainer set. Build practical habits that hold up under pressure.`;
  const metaDescription =
    override?.metaDescription ||
    `Learn ${theme.toLowerCase()} through practical trainer problems. Build repeatable bidding habits with clear decision structure.`;

  const bodyHtml = `
<h2>${title}</h2>
<p>This article converts your bidding trainer material on <strong>${theme}</strong> into one practical reference you can review quickly before or after training.</p>
<p>The source set for this article runs from <strong>${idRangeLabel}</strong>, and the same patterns apply across levels.</p>

<h3>What this trainer block is teaching</h3>
<p>The training focus is simple: make clean, repeatable decisions in auctions where the pressure is high and time is short.</p>
<p>Primary context used in this block: <strong>${contractLabel}</strong>.</p>

<h3>Core practice problems included</h3>
<ul>
${problemList}
</ul>

<h3>How to use this at the table</h3>
<ul>
  <li>Start with the default action that matches your system agreements.</li>
  <li>Only deviate when hand shape, strength, or auction context clearly justifies it.</li>
  <li>Prioritize clarity to partner over cleverness.</li>
  <li>After each hand, review whether your bid described both strength and shape accurately.</li>
</ul>

<h3>Trainer-first habit builder</h3>
<p>Use our trainer and train your mind. The fastest way to improve is to repeat the same decision patterns until they become automatic habits.</p>

<h3>Where to next</h3>
<ul>
  <li><a href="${PRACTICE_PATH}">Bidding Practice Trainer</a></li>
  <li><a href="${HUB_PATH}">Bidding Articles Hub</a></li>
  <li><a href="/bidding/advanced/3rcWPkKTvaD90WRyRdMg">Lebensohl Convention: Compete Smart After Interference</a></li>
</ul>
`.trim();

  return {
    title,
    teaser,
    metaDescription,
    primaryKeyword: `${slugify(theme).replace(/-/g, " ")} bidding trainer`,
    category: "Bidding",
    subcategory,
    seoSubtopic: subcategory,
    ctaTarget: PRACTICE_PATH,
    relatedLinks: [PRACTICE_PATH, HUB_PATH, "/bidding/advanced/3rcWPkKTvaD90WRyRdMg"].join("\n"),
    bodyHtml,
    isFree: true,
  };
}

async function getExistingMaxArticleNumber() {
  const snapshot = await db.collection("bidding").get();
  return snapshot.docs.reduce((max, doc) => {
    const n = Number((doc.data() || {}).articleNumber || 0);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);
}

async function upsertArticle(article, articleNumber) {
  const existing = await db
    .collection("bidding")
    .where("title", "==", article.title)
    .limit(1)
    .get();

  const summaryRef = existing.empty ? db.collection("bidding").doc() : existing.docs[0].ref;
  const existingBodyId = existing.empty ? null : (existing.docs[0].data() || {}).body;
  const bodyRef = existingBodyId
    ? db.collection("biddingBody").doc(existingBodyId)
    : db.collection("biddingBody").doc();

  const now = FieldValue.serverTimestamp();
  const summaryPayload = {
    id: summaryRef.id,
    articleType: "bidding",
    difficulty: "3",
    articleNumber: String(articleNumber),
    title: article.title,
    category: article.category,
    subcategory: article.subcategory,
    teaser: article.teaser,
    metaDescription: article.metaDescription,
    primaryKeyword: article.primaryKeyword,
    seoSubtopic: article.seoSubtopic,
    relatedLinks: article.relatedLinks,
    ctaTarget: article.ctaTarget,
    body: bodyRef.id,
    isFree: article.isFree,
    freeUpdatedAt: now,
    updatedAt: now,
  };
  if (existing.empty) summaryPayload.createdAt = now;

  await summaryRef.set(summaryPayload, { merge: true });
  await bodyRef.set(
    {
      id: bodyRef.id,
      text: article.bodyHtml,
      body: { text: article.bodyHtml },
      updatedAt: now,
    },
    { merge: true }
  );

  return { summaryId: summaryRef.id, title: article.title };
}

async function main() {
  const trainerText = fs.readFileSync(TRAINER_PATH, "utf8");
  const rows = parseTrainerRows(trainerText);
  const grouped = new Map();

  for (const row of rows) {
    const theme = normalizeTheme(row.themeLabel);
    if (!theme) continue;
    if (!grouped.has(theme)) grouped.set(theme, []);
    grouped.get(theme).push(row);
  }

  const themeEntries = [...grouped.entries()].sort((a, b) => {
    const aFirst = a[1].sort((x, y) => parseIdNumber(x.id).item - parseIdNumber(y.id).item)[0];
    const bFirst = b[1].sort((x, y) => parseIdNumber(x.id).item - parseIdNumber(y.id).item)[0];
    const pa = parseIdNumber(aFirst?.id);
    const pb = parseIdNumber(bFirst?.id);
    if (pa.group !== pb.group) return pa.group - pb.group;
    return pa.item - pb.item;
  });

  let nextNumber = (await getExistingMaxArticleNumber()) + 1;
  const results = [];

  for (const [theme, themeRows] of themeEntries) {
    const article = buildThemeArticle(theme, themeRows);
    const saved = await upsertArticle(article, nextNumber);
    results.push(saved);
    nextNumber += 1;
  }

  console.log(`Published/updated ${results.length} bidding theme articles.`);
  for (const item of results) {
    console.log(`${item.summaryId} | ${item.title}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
