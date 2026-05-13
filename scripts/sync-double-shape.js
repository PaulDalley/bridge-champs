/**
 * Re-sync `body.text` to match `text` on every body doc that has both
 * fields and they have diverged.
 *
 * Background: improve-learn-*-seo-links.js (May 11) wrote to BOTH `text`
 * and `body.text` with identical content for safety. clean-stored-hrefs.js
 * (May 12, apply mode) then rewrote internal hrefs in `text` only,
 * leaving `body.text` carrying the old summary-ID hrefs. The front-end
 * reads `text` first so readers see the cleaned content — but the V2
 * editor (CreateArticleModern.js) reads `body.text` first, so saving
 * one of those articles would silently regress the cleanup.
 *
 * Strategy: copy the live `text` value into `body.text`. Cosmetic / safe
 * because both fields were intended to mirror each other; we are simply
 * propagating the more recent edit. A JSONL backup of every "before"
 * body.text is written to docs/seo/ first.
 *
 * Usage:
 *   node scripts/sync-double-shape.js --apply               # dry run only
 *   node scripts/sync-double-shape.js --apply --confirm     # actually write
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

const APPLY = process.argv.includes("--apply");
const CONFIRM = process.argv.includes("--confirm");

if (!APPLY) {
  console.error("Refusing to run without --apply (safety flag).");
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

const BODY_COLLECTIONS = [
  "cardPlayBody",
  "defenceBody",
  "biddingBody",
  "biddingAdvancedBody",
  "biddingBasicsBody",
  "countingBody",
  "beginnerCardPlayBody",
  "beginnerDefenceBody",
  "beginnerBiddingBody",
];

(async function run() {
  const today = new Date().toISOString().slice(0, 10);
  const docsDir = path.join(__dirname, "..", "docs", "seo");
  fs.mkdirSync(docsDir, { recursive: true });
  const backupPath = path.join(docsDir, `double-shape-sync-backup-${today}.jsonl`);
  const reportPath = path.join(docsDir, `double-shape-sync-${today}.md`);

  let backupStream = null;
  if (CONFIRM) {
    backupStream = fs.createWriteStream(backupPath, { flags: "w" });
  }

  const reportLines = [];
  reportLines.push(`# Double-shape sync — ${CONFIRM ? "APPLIED" : "DRY-RUN"} ${today}`);
  reportLines.push("");
  reportLines.push(
    CONFIRM
      ? `Backup of every prior body.text written to \`${path.relative(path.join(__dirname, ".."), backupPath)}\`.`
      : "Dry run only. Re-run with --apply --confirm to write."
  );
  reportLines.push("");

  let scanned = 0;
  let diverged = 0;
  let synced = 0;

  for (const col of BODY_COLLECTIONS) {
    const snap = await db.collection(col).get();
    const colDiverged = [];
    for (const doc of snap.docs) {
      scanned++;
      const d = doc.data() || {};
      const flat = typeof d.text === "string" ? d.text : null;
      const nested =
        d.body && typeof d.body === "object" && typeof d.body.text === "string"
          ? d.body.text
          : null;
      if (flat == null || nested == null) continue;
      if (flat === nested) continue;
      diverged++;
      colDiverged.push({ id: doc.id, flatLen: flat.length, nestedLen: nested.length });

      if (CONFIRM) {
        backupStream.write(
          JSON.stringify({
            ts: new Date().toISOString(),
            collection: col,
            docId: doc.id,
            previousNestedText: nested,
          }) + "\n"
        );
        await db
          .collection(col)
          .doc(doc.id)
          .update({
            "body.text": flat,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            doubleShapeSyncedAt: new Date().toISOString(),
          });
        synced++;
      }
    }
    if (colDiverged.length) {
      reportLines.push(`## \`${col}\` — ${colDiverged.length} doc(s) diverged`);
      reportLines.push("");
      reportLines.push("| Doc ID | flat len | nested len |");
      reportLines.push("|---|---:|---:|");
      for (const r of colDiverged) {
        reportLines.push(`| \`${r.id}\` | ${r.flatLen} | ${r.nestedLen} |`);
      }
      reportLines.push("");
    }
  }

  reportLines.unshift(
    `Scanned ${scanned} docs across ${BODY_COLLECTIONS.length} collections; ${diverged} diverged${
      CONFIRM ? `; ${synced} synced.` : "."
    }\n`
  );
  fs.writeFileSync(reportPath, reportLines.join("\n"), "utf8");
  console.log(`Report → ${path.relative(path.join(__dirname, ".."), reportPath)}`);
  console.log(
    `Scanned ${scanned}; diverged ${diverged}; ${CONFIRM ? `synced ${synced}` : "dry-run only"}`
  );

  if (backupStream) backupStream.end();
  process.exit(0);
})();
