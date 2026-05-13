/**
 * Read-only: print a unified-style diff of `text` vs `body.text` for a
 * specific doc, so we can see what's diverged.
 *
 *   node scripts/diff-double-shape.js --collection cardPlayBody --id 3V3x21Bxdo3kJYZ9OBQd --apply
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

(async function run() {
  const doc = await db.collection(collection).doc(docId).get();
  if (!doc.exists) {
    console.log("No such doc.");
    process.exit(0);
  }
  const d = doc.data();
  const flat = d.text || "";
  const nested = (d.body && d.body.text) || "";
  console.log(`flat length:    ${flat.length}`);
  console.log(`nested length:  ${nested.length}`);
  console.log(`identical:      ${flat === nested}`);

  if (flat === nested) {
    console.log("Identical content.");
    process.exit(0);
  }

  // Walk char-by-char to find the first divergence.
  const len = Math.min(flat.length, nested.length);
  let i = 0;
  for (; i < len; i++) {
    if (flat.charCodeAt(i) !== nested.charCodeAt(i)) break;
  }
  console.log(`first divergence at char ${i}`);
  const ctx = 80;
  console.log(`  flat:   ...${JSON.stringify(flat.slice(Math.max(0, i - ctx), i + ctx))}...`);
  console.log(`  nested: ...${JSON.stringify(nested.slice(Math.max(0, i - ctx), i + ctx))}...`);

  // Also count occurrences of /declarer/articles/ etc in each so we can
  // confirm the pattern (nested has old summary-id hrefs, flat has cleaned).
  const articleRefRe = /\/(?:declarer|defence|counting|beginner\/articles\/(?:declarer|defence|bidding)|bidding\/(?:advanced|basics))\/[A-Za-z0-9_-]+/g;
  const flatRefs = flat.match(articleRefRe) || [];
  const nestedRefs = nested.match(articleRefRe) || [];
  console.log(`\nArticle refs in flat:   ${flatRefs.length}`);
  console.log(`Article refs in nested: ${nestedRefs.length}`);
  const diff = flatRefs.filter((x, idx) => x !== nestedRefs[idx]);
  if (diff.length) {
    console.log("First few diverging refs (flat → nested):");
    for (let j = 0; j < Math.min(5, flatRefs.length); j++) {
      if (flatRefs[j] !== nestedRefs[j]) {
        console.log(`  flat[${j}]:   ${flatRefs[j]}`);
        console.log(`  nested[${j}]: ${nestedRefs[j]}`);
      }
    }
  }
  process.exit(0);
})();
