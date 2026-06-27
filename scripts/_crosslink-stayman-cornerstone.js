/**
 * Funnel link-equity into the Stayman cornerstone: insert a "Stayman Convention"
 * link as the FIRST "Read next" item in each sibling article's body (Firestore).
 * Nav-only edit — never touches bridge prose. Idempotent (skips if already links
 * the cornerstone). Backs up originals to scripts/_stayman-crosslink-backup.json.
 *
 * Dry-run:  node scripts/_crosslink-stayman-cornerstone.js
 * Apply:    node scripts/_crosslink-stayman-cornerstone.js --apply
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(path.join(__dirname, "..", "serviceAccountKey.json"), "utf8"))) });
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const APPLY = process.argv.includes("--apply");
const MARKER = "<strong>Read next:</strong> ";
const INSERT = '<a href="/learn/bidding/stayman-convention">Stayman Convention</a> &middot; ';
const SIBLINGS = [
  "find-major-fit-after-1nt",
  "puppet-stayman-check-5-card",
  "weak-stayman-know-helps",
  "smolen-convention-show-5-4",
  "1nt-transfers-stayman-use-each",
];

(async () => {
  const backup = {};
  const revalidate = [];
  for (const slug of SIBLINGS) {
    const snap = await db.collection("bidding").where("slug", "==", slug).limit(1).get();
    if (snap.empty) { console.log("SKIP (not found): " + slug); continue; }
    const d = snap.docs[0].data();
    const bodyId = d.body;
    const bd = await db.collection("biddingBody").doc(bodyId).get();
    const data = bd.data() || {};
    const text = data.text || (data.body && data.body.text) || "";
    if (text.includes("/learn/bidding/stayman-convention")) { console.log("SKIP (already links cornerstone): " + slug); continue; }
    if (!text.includes(MARKER)) { console.log("WARN (no Read-next marker): " + slug); continue; }
    const newText = text.replace(MARKER, MARKER + INSERT);
    backup[slug] = { bodyId, text };
    revalidate.push("/learn/bidding/" + slug);
    const i = newText.indexOf(MARKER);
    console.log("\n### " + slug + "  (body " + bodyId + ")");
    console.log("  NEW Read-next head: " + newText.slice(i, i + 240).replace(/\n/g, " "));
    if (APPLY) {
      const payload = { text: newText, updatedAt: FieldValue.serverTimestamp() };
      if (data.body && typeof data.body === "object") payload.body = { ...data.body, text: newText };
      await db.collection("biddingBody").doc(bodyId).set(payload, { merge: true });
      console.log("  -> WROTE");
    }
  }
  if (APPLY && Object.keys(backup).length) {
    fs.writeFileSync(path.join(__dirname, "_stayman-crosslink-backup.json"), JSON.stringify(backup, null, 2));
    console.log("\nBackup -> scripts/_stayman-crosslink-backup.json");
  }
  console.log("\n" + (APPLY ? "APPLIED. Revalidate:" : "(dry-run) would update:") + "\n" + revalidate.join("\n"));
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
