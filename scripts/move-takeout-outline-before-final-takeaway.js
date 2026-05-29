/**
 * Move outline h3 block to immediately before Final takeaway in canonical guide.
 * Usage: node scripts/move-takeout-outline-before-final-takeaway.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPath = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
].find((p) => fs.existsSync(p));
if (!keyPath) throw new Error("No Firebase service account key found.");

const CANONICAL_BODY_ID = "yt6au7gwYwPahTxQ4kd5";
const FINAL_TAKEAWAY_MARKER = "<h2>Final takeaway</h2>";
const PART2_START = "<p>This is a must know topic";
const OUTLINE_START = "<h3>Takeout double on the 1 level";

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

function moveOutlineBeforeFinalTakeaway(html) {
  const start = html.indexOf(OUTLINE_START);
  if (start === -1) {
    const markerIdx = html.indexOf(FINAL_TAKEAWAY_MARKER);
    if (markerIdx === -1) throw new Error("No outline block and no Final takeaway marker.");
    return html;
  }

  const outline = html.slice(start).trim();
  const withoutOutline = html.slice(0, start).trimEnd();
  let markerIdx = withoutOutline.indexOf(FINAL_TAKEAWAY_MARKER);
  if (markerIdx === -1) markerIdx = withoutOutline.indexOf(PART2_START);
  if (markerIdx === -1) {
    throw new Error("Neither Final takeaway nor Part 2 start found.");
  }

  if (withoutOutline.slice(markerIdx - outline.length - 20, markerIdx).includes(OUTLINE_START)) {
    console.log("Outline already before Final takeaway.");
    return html;
  }

  return `${withoutOutline.slice(0, markerIdx).trimEnd()}\n\n${outline}\n\n${withoutOutline.slice(markerIdx)}`;
}

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  const out = moveOutlineBeforeFinalTakeaway(text);
  if (out === text) {
    console.log("No change needed.");
    return;
  }
  await ref.set(
    { text: out, body: { text: out }, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  console.log("Updated biddingBody/" + CANONICAL_BODY_ID);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
