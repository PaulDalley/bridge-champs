/**
 * Add MakeBoard diagrams (no bidding) to beginner declarer articles:
 * - 7nKvD5E5BYBrkAX1lmFS (finesses)
 * - nWtFr0FNRU0XbHDCFwBF (no-trump basics)
 *
 * Usage: node scripts/add-beginner-declarer-hand-diagrams.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPathCandidates = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
];
const keyPath = keyPathCandidates.find((p) => fs.existsSync(p));
if (!keyPath) {
  console.error("No Firebase service account key found.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const F = admin.firestore.FieldValue;

const NO_BID_DOUBLE =
  ' boardType="double" position="North/South" East="*S-*H-*D-*C-" West="*S-*H-*D-*C-" vuln="Nil Vul" bidding=""';

function bodyHtml(data) {
  if (!data || typeof data !== "object") return "";
  if (typeof data.text === "string") return data.text;
  if (data.body && typeof data.body === "object" && typeof data.body.text === "string") return data.body.text;
  return "";
}

function updateFinesseArticle(html) {
  let updated = html;

  const q73Board = `<p><MakeBoard${NO_BID_DOUBLE} North="*S-Q73*H-*D-*C-" South="*S-A64*H-*D-*C-" /></p>`;
  updated = updated.replace(
    '<Callout type="example"><p><strong>Dummy:</strong> Q 7 3<br/><strong>Hand:</strong> A 6 4</p></Callout>',
    q73Board
  );

  const aqxBoard = `<p><MakeBoard${NO_BID_DOUBLE} North="*S-AQx*H-*D-*C-" South="*S-xxx*H-*D-*C-" /></p>`;
  updated = updated.replace(
    /<pre>Dummy: AQx\s*\nYour hand: xxx<\/pre>/i,
    aqxBoard
  );

  const aj10Board = `<p><MakeBoard${NO_BID_DOUBLE} North="*S-AJ10*H-*D-*C-" South="*S-xxx*H-*D-*C-" /></p>`;
  updated = updated.replace(
    /<pre>One hand: AJ10\s*\nOther hand: xxx<\/pre>/i,
    aj10Board
  );

  return updated;
}

function updateNoTrumpArticle(html) {
  let updated = html;

  updated = updated.replace(/<code>KJ1087<\/code>/g, "KJ1087");
  updated = updated.replace(/<code>954<\/code>/g, "954");
  updated = updated.replace(/<code>KQJ10<\/code>/g, "KQJ10");
  updated = updated.replace(/<code>874<\/code>/g, "874");

  const diagrams = [
    `<p><MakeBoard${NO_BID_DOUBLE} North="*S-KJ1087*H-*D-*C-" South="*S-954*H-*D-*C-" /></p>`,
    `<p><MakeBoard${NO_BID_DOUBLE} North="*S-KQJ10*H-*D-*C-" South="*S-874*H-*D-*C-" /></p>`,
  ].join("");

  const marker = "</ol><Callout type=\"example\">";
  if (!updated.includes(marker)) {
    throw new Error("No-trump article: expected </ol> before example callout.");
  }
  if (updated.includes(diagrams)) {
    return updated;
  }
  updated = updated.replace(marker, `</ol>${diagrams}<Callout type="example">`);

  return updated;
}

async function apply(bodyId, transform, label) {
  const ref = db.collection("beginnerCardPlayBody").doc(bodyId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error(`Body doc not found: ${bodyId}`);

  const original = bodyHtml(snap.data() || {});
  if (!original) throw new Error(`Empty body: ${bodyId}`);

  const updated = transform(original);
  if (updated === original) {
    console.log(`SKIP (no changes): ${label} (${bodyId})`);
    return false;
  }

  await ref.set(
    {
      text: updated,
      body: { text: updated },
      updatedAt: F.serverTimestamp(),
    },
    { merge: true }
  );

  console.log(`OK: ${label} (${bodyId})`);
  return true;
}

async function run() {
  await apply("7nKvD5E5BYBrkAX1lmFS", updateFinesseArticle, "Finesses for Beginners");
  await apply("nWtFr0FNRU0XbHDCFwBF", updateNoTrumpArticle, "No-Trump Basics");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
