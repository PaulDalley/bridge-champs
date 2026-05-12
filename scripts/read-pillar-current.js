/**
 * Read-only: dump the current state of the major-fit-after-1NT pillar
 * (summary fields + body HTML) so we can see Paul's edits.
 *
 * Usage: node scripts/read-pillar-current.js --apply
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
  console.error("Refusing to run without --apply.");
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

const SUMMARY_ID = "At7zrVNseOY1Ymtn8uzZ";
const BODY_ID = "Czs8FCV33GJN6Jtchw8o";

async function run() {
  const summarySnap = await db.collection("bidding").doc(SUMMARY_ID).get();
  const bodySnap = await db.collection("biddingBody").doc(BODY_ID).get();

  const summary = summarySnap.exists ? summarySnap.data() : null;
  const body = bodySnap.exists ? bodySnap.data() : null;

  const text = String(body?.text || body?.body || "");
  const wordCount = text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const stubCount = (text.match(/\[STUB\]/g) || []).length;
  const stubMarkerCount = (text.match(/\[Paul to write/g) || []).length;

  const out = [];
  out.push("# Pillar — major-fit-after-1NT — current state");
  out.push("");
  out.push(`- Summary doc: bidding/${SUMMARY_ID}`);
  out.push(`- Body doc:    biddingBody/${BODY_ID}`);
  out.push(`- Title:       ${summary?.title || "(none)"}`);
  out.push(`- Teaser:      ${summary?.teaser || "(none)"}`);
  out.push(`- isHidden:    ${summary?.isHidden}`);
  out.push(`- isPillar:    ${summary?.isPillar}`);
  out.push(`- isFree:      ${summary?.isFree}`);
  out.push(`- ctaTarget:   ${summary?.ctaTarget || "(none)"}`);
  out.push(`- Word count:  ${wordCount}`);
  out.push(`- [STUB] markers remaining:        ${stubCount}`);
  out.push(`- [Paul to write] stubs remaining: ${stubMarkerCount}`);
  out.push("");
  out.push("## Body HTML");
  out.push("");
  out.push("```html");
  out.push(text);
  out.push("```");

  const outPath = path.join(__dirname, "..", "docs", "seo", "pillar-major-fit-after-1nt-current.md");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, out.join("\n"), "utf8");
  console.log(`Wrote -> ${path.relative(path.join(__dirname, ".."), outPath)}`);
  console.log(`Word count: ${wordCount}, stubs: ${stubCount + stubMarkerCount}`);
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error("Read failed:", err);
    process.exit(1);
  }
);
