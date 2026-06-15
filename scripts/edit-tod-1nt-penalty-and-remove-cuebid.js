/**
 * Two edits to the live takeout-doubles guide body (biddingBody/TEz36PbeqPpyQ2aXX1R0):
 *  A) Remove the empty "responding to a takeout double by cue bidding the opponent's
 *     suit" <h3> (it has a dedicated section later).
 *  B) Under "In competition the opponents bid 1NT, double is typically penalty.",
 *     insert the user's verbatim text + two MakeBoard diagrams.
 *
 * Strict: validates every anchor, builds the new body in memory, asserts the result,
 * backs up the current body, then writes once. Idempotent (skips already-applied edits).
 *
 * Usage: node scripts/edit-tod-1nt-penalty-and-remove-cuebid.js
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error("Missing serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const BODY_COL = "biddingBody";
const BODY_ID = "TEz36PbeqPpyQ2aXX1R0";

const H3_PENALTY =
  "<h3>In competition the opponents bid 1NT, double is typically penalty.</h3>";
const CUE_HEADING_MARK = "responding to a takeout double by cue bidding";
const H2_MISTAKES = '<h2 id="common-takeout-double-mistakes">';

// User's verbatim text (spell-fixes only: confusion, partner's, separate, altogether).
// House style: manual numbering with <strong>N.</strong>, boards wrapped in <p>.
const CONTENT = [
  "<p>This is just a simple matter of agreement. I would suggest that when BOTH players have bid, a double of natural 1NT becomes penalty.</p>",
  "<p>Things to note to avoid confusion:</p>",
  "<p><strong>1.</strong> for people playing support double - partner's double of a natural 1NT is penalty - so it shows a good hand well beyond just a regular opening hand. One important point - the double is not a support double, so lets take this example</p>",
  '<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-A109*H-x*D-KQ10*C-AKJ984" West="*S-*H-*D-*C-" vuln="Vul East/West" dealer="South" bidding="_/_/_/1♣/1♦/1♥/1NT/X" /></p>',
  "<p>In this context, especially since the opponents are vulnerable (a good time for penalty doubles, where 2 off doubled scores better than a Non-vul game), you can show you have a good hand by doubling, you should be quite happy to defend 1NT doubled if that is the final contract. *As mentioned, make sure partner knows that this is a good hand, and not a support double. You are not showing anything about your number of hearts when you double, likely you do not have 4 or else you would raise partner.</p>",
  "<p><strong>2.</strong> If partner hasn't bid - it should typically be takeout, for example</p>",
  '<p><MakeBoard boardType="single" position="South" North="*S-*H-*D-*C-" East="*S-*H-*D-*C-" South="*S-2*H-AK104*D-K1084*C-Q972" West="*S-*H-*D-*C-" vuln="Nil Vul" dealer="West" bidding="1♠/P/1NT/?" /></p>',
  "<p>Here you can double, it should show just a typical takeout of spades. We want to get partner in the bidding, and takeout of the opponent's suit. Your side could easily have a big fit, and possibly a big heart fit. The key difference to the penalty double above is that partner hasn't yet bid, your sides first double is takeout even if it is of 1NT (however, an exception check immediately below)</p>",
  "<p><strong>3.</strong> Double of their 1NT opening. This is a separate idea altogether and is subject to partnership agreement. My suggestion as both the most effective and simplest is to just play double as showing a strong hand (16+ points).</p>",
].join("\n");

const SOUTH_1 = 'South="*S-A109*H-x*D-KQ10*C-AKJ984"';
const SOUTH_2 = 'South="*S-2*H-AK104*D-K1084*C-Q972"';
const countBoards = (s) => (s.match(/<MakeBoard[^>]*\/>/g) || []).length;

(async () => {
  const ref = db.collection(BODY_COL).doc(BODY_ID);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Body missing: " + BODY_COL + "/" + BODY_ID);
  const data = snap.data() || {};
  const before = data.text || data.body?.text || "";
  if (!before) throw new Error("Body text empty.");

  // Pre-edit backup
  fs.writeFileSync(
    path.join(__dirname, "backup-tod-body-preedit-" + BODY_ID + ".json"),
    JSON.stringify({ collection: BODY_COL, id: BODY_ID, text: before }, null, 2),
    "utf8"
  );

  let out = before;
  const boardsBefore = countBoards(before);

  // ---- Edit A: remove the empty cue-bidding <h3> ----
  if (out.includes(CUE_HEADING_MARK)) {
    const h3Start = out.lastIndexOf("<h3>", out.indexOf(CUE_HEADING_MARK));
    const h2Start = out.indexOf(H2_MISTAKES);
    if (h3Start === -1 || h2Start === -1 || h2Start <= h3Start) {
      throw new Error("Edit A: could not bound the cue-bidding heading block.");
    }
    const removed = out.slice(h3Start, h2Start);
    if (countBoards(removed) !== 0) throw new Error("Edit A: removal would drop a board! Aborting.");
    // Keep the blank line that already separates the preceding </p> from the <h2>.
    out = out.slice(0, h3Start) + out.slice(h2Start);
    console.log("Edit A: removed cue-bidding heading block (", removed.length, "chars ).");
  } else {
    console.log("Edit A: cue-bidding heading already absent — skipping.");
  }

  // ---- Edit B: fill the empty <p></p> under the 1NT-penalty <h3> ----
  if (out.includes(SOUTH_1) || out.includes(SOUTH_2)) {
    console.log("Edit B: content already present — skipping.");
  } else {
    const i = out.indexOf(H3_PENALTY);
    if (i === -1) throw new Error("Edit B: 1NT-penalty <h3> anchor not found.");
    if (out.indexOf(H3_PENALTY, i + 1) !== -1) throw new Error("Edit B: 1NT-penalty <h3> not unique.");
    const afterH3 = i + H3_PENALTY.length;
    const pStart = out.indexOf("<p></p>", afterH3);
    if (pStart === -1) throw new Error("Edit B: empty <p></p> slot not found after h3.");
    const gap = out.slice(afterH3, pStart);
    if (gap.trim() !== "") throw new Error("Edit B: unexpected content between h3 and its <p></p>: " + JSON.stringify(gap));
    const pEnd = pStart + "<p></p>".length;
    out = out.slice(0, afterH3) + "\n" + CONTENT + out.slice(pEnd);
    console.log("Edit B: inserted user content + 2 diagrams.");
  }

  // ---- Assertions on the final body ----
  const problems = [];
  if (out.includes(CUE_HEADING_MARK)) problems.push("cue-bidding heading still present");
  if (!out.includes(H3_PENALTY)) problems.push("1NT-penalty h3 missing");
  if (!out.includes("This is just a simple matter of agreement")) problems.push("intro sentence missing");
  if (!out.includes(SOUTH_1)) problems.push("diagram 1 hand missing");
  if (!out.includes(SOUTH_2)) problems.push("diagram 2 hand missing");
  if (!out.includes('vuln="Vul East/West"')) problems.push("EW vulnerability missing");
  if (!out.includes("Double of their 1NT opening")) problems.push("item 3 missing");
  const boardsAfter = countBoards(out);
  if (boardsAfter !== boardsBefore + 2) problems.push(`board count ${boardsBefore} -> ${boardsAfter} (expected +2)`);
  if (problems.length) throw new Error("ASSERTIONS FAILED:\n - " + problems.join("\n - "));

  if (out === before) { console.log("No change (already up to date)."); return; }

  if (process.env.DRY) {
    fs.writeFileSync(path.join(__dirname, "tmp-tod-body-after.html"), out, "utf8");
    console.log("\nDRY RUN ok — assertions passed. Wrote preview to scripts/tmp-tod-body-after.html (NOT Firestore).");
    console.log("length", before.length, "->", out.length, "| boards", boardsBefore, "->", boardsAfter);
    return;
  }

  await ref.set(
    { text: out, body: { text: out }, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  console.log("\nWROTE " + BODY_COL + "/" + BODY_ID);
  console.log("length", before.length, "->", out.length, "| boards", boardsBefore, "->", boardsAfter);
})().catch((e) => { console.error("\n" + e.message); process.exit(1); });
