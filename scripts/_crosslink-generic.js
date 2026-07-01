/**
 * Generic Read-next cross-linker. Inserts a link to --target as the FIRST
 * "Read next" item in each --into article (Firestore). Nav-only, idempotent.
 *
 *   node scripts/_crosslink-generic.js --apply \
 *     --target 2-over-1-game-forcing --title "2 over 1: Game forcing" \
 *     --into bidding-basics-build-clear-auction,two-way-checkback
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(path.join(__dirname, "..", "serviceAccountKey.json"), "utf8"))) });
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

function arg(flag) { const i = process.argv.indexOf(flag); return i >= 0 ? process.argv[i + 1] : null; }
const APPLY = process.argv.includes("--apply");
const TARGET = arg("--target");
const TITLE = arg("--title");
const INTO = (arg("--into") || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!TARGET || !TITLE || !INTO.length) { console.error("need --target <slug> --title <title> --into a,b,c"); process.exit(1); }

const MARKER = "<strong>Read next:</strong> ";
const INSERT = `<a href="/learn/bidding/${TARGET}">${TITLE}</a> &middot; `;

(async () => {
  const backup = {};
  const revalidate = [];
  for (const slug of INTO) {
    const snap = await db.collection("bidding").where("slug", "==", slug).limit(1).get();
    if (snap.empty) { console.log("SKIP (not found): " + slug); continue; }
    const d = snap.docs[0].data();
    const bodyId = d.body;
    const bd = await db.collection("biddingBody").doc(bodyId).get();
    const data = bd.data() || {};
    const text = data.text || (data.body && data.body.text) || "";
    if (text.includes(`/learn/bidding/${TARGET}`)) { console.log("SKIP (already links): " + slug); continue; }
    if (!text.includes(MARKER)) { console.log("WARN (no Read-next marker): " + slug); continue; }
    const newText = text.replace(MARKER, MARKER + INSERT);
    backup[slug] = { bodyId, text };
    revalidate.push("/learn/bidding/" + slug);
    console.log("### " + slug + "  ->  links " + TARGET);
    if (APPLY) {
      const payload = { text: newText, body: { ...(data.body || {}), text: newText }, updatedAt: FieldValue.serverTimestamp() };
      await db.collection("biddingBody").doc(bodyId).set(payload, { merge: true });
      console.log("  WROTE");
    }
  }
  if (APPLY && Object.keys(backup).length) {
    fs.writeFileSync(path.join(__dirname, `_crosslink-backup-${TARGET}.json`), JSON.stringify(backup, null, 2));
  }
  console.log("\n" + (APPLY ? "APPLIED. Revalidate:" : "(dry-run) would update:") + " " + revalidate.join(" "));
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
