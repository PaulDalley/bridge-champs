/**
 * Read-only: dump the title + body HTML of every article in the
 * "Stayman / Smolen / Puppet / Texas / Find a Major Fit" cluster so the
 * pillar author can lift exact paragraphs without paraphrasing.
 *
 * Output: docs/seo/stayman-cluster-source.md
 *
 * Usage: node scripts/dump-stayman-cluster.js --apply
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
  if (process.env.FIREBASE_SERVICE_ACCOUNT)
    return path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT);
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

if (!process.argv.includes("--apply")) {
  console.error("Refusing to run without --apply (read-only safety flag).");
  process.exit(1);
}

const keyPath = resolveServiceAccountPath();
if (!keyPath || !fs.existsSync(keyPath)) {
  console.error("No service account JSON found.");
  process.exit(1);
}
const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const TARGET_BODY_IDS = [
  { id: "U2h4h8kDjcgPT9k4YLq0", role: "Stayman base article" },
  { id: "AbPr2z4sByvVgT1U5Ehc", role: "Puppet Stayman article" },
  { id: "DcqQjNCQDyNMWk2fOvIO", role: "Smolen article" },
  { id: "imr5fXsuVBeMFItvoGY3", role: "Texas Transfers article" },
  { id: "QmadBtW2QFMGu3o51NNi", role: "Find a Major Fit as Responder (existing pillar candidate)" },
  { id: "uiRZXtZ2zjxVxq7e1lAb", role: "Transfers (general)" },
  { id: "i2CIdysS7cErPJYWBUDO", role: "Stayman vs Transfers" },
];

const SEARCH_COLLECTIONS = ["bidding", "biddingAdvanced"];

async function run() {
  const lines = [];
  lines.push("# Stayman cluster — source paragraphs");
  lines.push("");
  lines.push(
    "Read-only dump of the current title + body for every article relevant to the major-fit-after-1NT pillar. The pillar build script can lift any of these paragraphs verbatim, attributed via comments in the published body."
  );
  lines.push("");

  for (const target of TARGET_BODY_IDS) {
    let foundSummary = null;
    let summaryCollection = null;
    for (const coll of SEARCH_COLLECTIONS) {
      const snap = await db
        .collection(coll)
        .where("body", "==", target.id)
        .limit(1)
        .get();
      if (!snap.empty) {
        foundSummary = snap.docs[0];
        summaryCollection = coll;
        break;
      }
    }
    if (!foundSummary) {
      lines.push(`## ${target.role} — \`${target.id}\` — NOT FOUND`);
      lines.push("");
      continue;
    }
    const summaryData = foundSummary.data();
    const bodyCollection =
      summaryCollection === "biddingAdvanced" ? "biddingAdvancedBody" : "biddingBody";
    const bodyDoc = await db.collection(bodyCollection).doc(target.id).get();
    const bodyData = bodyDoc.exists ? bodyDoc.data() || {} : {};
    const bodyHtml = String(bodyData.text || bodyData.body || "");
    lines.push(`## ${target.role}`);
    lines.push("");
    lines.push(`- **Title**: ${summaryData.title || "(none)"}`);
    lines.push(`- **Body ID**: \`${target.id}\``);
    lines.push(`- **Summary collection**: \`${summaryCollection}\``);
    lines.push(`- **Body collection**: \`${bodyCollection}\``);
    lines.push(`- **Teaser**: ${summaryData.teaser || "(none)"}`);
    lines.push(`- **Primary keyword**: ${summaryData.primaryKeyword || "(none)"}`);
    lines.push(`- **CTA target**: ${summaryData.ctaTarget || "(none)"}`);
    lines.push("");
    lines.push("```html");
    lines.push(bodyHtml);
    lines.push("```");
    lines.push("");
  }

  const out = path.join(__dirname, "..", "docs", "seo", "stayman-cluster-source.md");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, lines.join("\n"), "utf8");
  console.log(`Wrote → ${path.relative(path.join(__dirname, ".."), out)}`);
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error("Dump failed:", err);
    process.exit(1);
  }
);
