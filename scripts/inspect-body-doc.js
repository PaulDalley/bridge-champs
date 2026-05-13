/**
 * Read-only: dump the FULL contents of a body doc so we can see which
 * field the article body actually lives in. Helps when a backfill script
 * reports 2 words but the live page has full content (it usually means
 * the body is stored in a field other than `text` / `body`).
 *
 * Usage:
 *   node scripts/inspect-body-doc.js --collection beginnerCardPlayBody --id CHceqeWpWsRcHIFnGA1N --apply
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

const collection = getArgValue("--collection");
const docId = getArgValue("--id");
if (!collection || !docId) {
  console.error("Required: --collection <name> --id <docId>");
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

function summariseValue(v, depth = 0) {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  const t = typeof v;
  if (t === "string") {
    return `string(${v.length} chars): ${JSON.stringify(v.slice(0, 200))}${v.length > 200 ? "…" : ""}`;
  }
  if (t === "number" || t === "boolean") return `${t}: ${v}`;
  if (Array.isArray(v)) {
    return `array(${v.length})${
      v.length && depth < 2 ? " — first item: " + summariseValue(v[0], depth + 1) : ""
    }`;
  }
  if (t === "object") {
    if (typeof v.toDate === "function") return "Timestamp";
    const keys = Object.keys(v);
    return `object {${keys.join(", ")}}`;
  }
  return t;
}

async function run() {
  const doc = await db.collection(collection).doc(docId).get();
  if (!doc.exists) {
    console.log(`Doc ${collection}/${docId} does not exist.`);
    return;
  }
  const data = doc.data() || {};
  console.log(`# ${collection}/${docId}`);
  console.log("");
  console.log("Top-level fields and shapes:");
  for (const k of Object.keys(data).sort()) {
    console.log(`  - ${k}: ${summariseValue(data[k])}`);
  }
  console.log("");
  // Dump the most likely "long-form" fields completely.
  const candidates = ["text", "body", "html", "content", "richText", "richBody", "blocks", "rich"];
  for (const f of candidates) {
    if (!(f in data)) continue;
    const v = data[f];
    console.log(`---- field "${f}" full value ----`);
    if (typeof v === "string") {
      console.log(v);
    } else {
      console.log(JSON.stringify(v, null, 2));
    }
    console.log("---- end ----");
    console.log("");
  }
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error("Inspect failed:", err);
    process.exit(1);
  }
);
