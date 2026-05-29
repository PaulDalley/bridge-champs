/**
 * Remove Final takeaway section; fix partner-response list bullets (browser-default).
 * Usage: node scripts/replace-takeout-remove-final-fix-partner-list.js
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
const BCB07 = path.join(__dirname, "..", "docs", "article-payloads", "bcb-07-takeout-doubles.json");

const PARTNER_LIST_OLD = `<ul><li>bid their longest unbid suit, even with very few points,</li><li>jump in a suit with a stronger hand,</li><li>pass only if they can punish opponents with great trumps in the doubled suit (rare).</li><li>Cue bid the opponent's suit, with strength but no 5+ card major. More on this later.</li></ul>`;

const PARTNER_LIST_NEW = `<ul class="browser-default"><li>bid their longest unbid suit, even with very few points,</li><li>jump in a suit with a stronger hand,</li><li>pass only if they can punish opponents with great trumps in the doubled suit (rare).</li><li>Cue bid the opponent's suit, with strength but no 5+ card major. More on this later.</li></ul>`;

const FINAL_TAKEAWAY_BLOCK = `<h2>Final takeaway</h2><p>The takeout double is one of the most valuable bidding tools in modern bridge. The typical pattern is simple: shortage in their suit, support for the others, enough strength to handle partner's response, and no better bid available. Get this right and you'll find your side landing in better contracts more consistently.</p>`;

function applyPatches(html) {
  let out = html;
  if (out.includes(PARTNER_LIST_OLD)) {
    out = out.replace(PARTNER_LIST_OLD, PARTNER_LIST_NEW);
  } else if (out.includes(PARTNER_LIST_NEW)) {
    /* already fixed */
  } else {
    throw new Error("Partner response list block not found.");
  }
  if (out.includes(FINAL_TAKEAWAY_BLOCK)) {
    out = out.replace(FINAL_TAKEAWAY_BLOCK, "");
  }
  return out.replace(/\n{3,}/g, "\n\n").trim();
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const bcb = JSON.parse(fs.readFileSync(BCB07, "utf8"));
  bcb.bodyHtml = applyPatches(bcb.bodyHtml);
  fs.writeFileSync(BCB07, JSON.stringify(bcb, null, 2) + "\n", "utf8");
  console.log("Updated", BCB07);

  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  const out = applyPatches(text);
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
