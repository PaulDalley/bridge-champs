/**
 * Move "responding to takeout double" examples under How partner should respond (briefly).
 * Usage: node scripts/move-takeout-responding-under-partner-section.js
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

const PARTNER_TAIL_OLD = `</ul><p>There's room for a separate article on responding to takeout doubles in more depth.</p><h2>Common takeout double mistakes</h2>`;

const RESPONDING_START = "<p>The opponents bid 1";
const TAIL_REMOVE_START = "<p>This is a must know topic";

function fixHandTwoParagraphHtml(html) {
  return html.replace(
    /Simply 2 <strong>♠<\/strong> conveys the simple message "I'm better than bidding 1 <strong>♠"\. This bid is not forcing\.<\/strong><\/p>/,
    'Simply 2 <strong>♠</strong> conveys the simple message "I\'m better than bidding 1 <strong>♠</strong>". This bid is not forcing.</p>'
  );
}

function extractRespondingBlock(text) {
  const start = text.indexOf(RESPONDING_START);
  if (start === -1) throw new Error("Responding block start not found.");
  const summaryStart = text.indexOf("<p>In summary, if you jump", start);
  if (summaryStart === -1) throw new Error("In summary paragraph not found.");
  const summaryEnd = text.indexOf("</p>", summaryStart) + 4;
  return fixHandTwoParagraphHtml(text.slice(start, summaryEnd));
}

function applyMove(text) {
  const respondingBlock = extractRespondingBlock(text);
  const partnerIdx = text.indexOf("How partner should respond");
  const mistakesIdx = text.indexOf("<h2>Common takeout double mistakes</h2>");
  const respondingIdx = text.indexOf(RESPONDING_START);
  const alreadyUnderPartner =
    partnerIdx !== -1 &&
    mistakesIdx !== -1 &&
    respondingIdx !== -1 &&
    respondingIdx > partnerIdx &&
    respondingIdx < mistakesIdx;

  let out = text;

  if (!alreadyUnderPartner) {
    if (!out.includes(PARTNER_TAIL_OLD)) {
      throw new Error("Partner section tail pattern not found.");
    }
    out = out.replace(
      PARTNER_TAIL_OLD,
      `</ul>\n\n${respondingBlock}\n\n<h2>Common takeout double mistakes</h2>`
    );
  }

  if (out.includes(TAIL_REMOVE_START)) {
    const tailStart = out.indexOf(TAIL_REMOVE_START);
    const summaryStart = out.indexOf("<p>In summary, if you jump", tailStart);
    const summaryEnd = summaryStart === -1 ? tailStart : out.indexOf("</p>", summaryStart) + 4;
    out = (out.slice(0, tailStart) + out.slice(summaryEnd)).trim();
  }

  const dupStart = out.lastIndexOf(respondingBlock);
  const firstStart = out.indexOf(respondingBlock);
  if (dupStart !== -1 && dupStart !== firstStart) {
    out = out.slice(0, dupStart) + out.slice(dupStart + respondingBlock.length);
  }

  return out.replace(/\n{3,}/g, "\n\n").trim();
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const snap = await ref.get();
  const text = snap.data()?.text || "";
  const out = applyMove(text);

  await ref.set(
    { text: out, body: { text: out }, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  console.log("Updated biddingBody/" + CANONICAL_BODY_ID);

  const bcb = JSON.parse(fs.readFileSync(BCB07, "utf8"));
  if (bcb.bodyHtml.includes("There's room for a separate article")) {
    const respondingBlock = extractRespondingBlock(text);
    bcb.bodyHtml = bcb.bodyHtml.replace(
      PARTNER_TAIL_OLD,
      `</ul>\n\n${respondingBlock}\n\n<h2>Common takeout double mistakes</h2>`
    );
    fs.writeFileSync(BCB07, JSON.stringify(bcb, null, 2) + "\n", "utf8");
    console.log("Updated", BCB07);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
