/**
 * Replace Part 3 placeholder headings in the canonical takeout doubles guide body.
 * Usage: node scripts/replace-takeout-part3-headings.js
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

const OLD = `<h2>Part 3 — Sections to add</h2>
<p><em>Placeholder headings for SEO and completeness. Delete any you do not need after merging Parts 1 and 2.</em></p>

<h3>Tips for takeout doubles</h3>
<p><!-- Paul --></p>

<h3>How to make a takeout double (quick checklist)</h3>
<p><!-- Paul --></p>

<h3>Takeout double requirements (shape, points, shortage)</h3>
<p><!-- Paul --></p>

<h3>When not to make a takeout double</h3>
<p><!-- Paul --></p>

<h3>Negative doubles after partner opens (competition)</h3>
<p><!-- Paul --></p>

<h3>Responding to partner's takeout double (simple bids, jumps, cue-bids)</h3>
<p><!-- Paul --></p>

<h3>Responder jumps: strength, not preempts</h3>
<p><!-- Paul --></p>

<h3>Balancing and reopening doubles</h3>
<p><!-- Paul --></p>

<h3>Takeout doubles at the two level and higher</h3>
<p><!-- Paul --></p>

<h3>Penalty doubles vs takeout doubles (partnership rule of thumb)</h3>
<p><!-- Paul --></p>

<h3>Common takeout double mistakes</h3>
<p><!-- Paul --></p>

<h3>Practice takeout doubles</h3>
<p><!-- Paul: link to bidding practice / relevant puzzles --></p>

<h3>Related reading</h3>
<ul>
  <li><!-- Paul: Lebensohl, overcalls, four-level doubles, etc. --></li>
</ul>`;

const NEW = `<h3>Takeout double on the 1 level - some specific things to know.</h3>
<p></p>

<h3>What to do if you want to penalty double but you are playing takeout doubles?</h3>
<p></p>

<h3>If they bid and raise a suit, always "takeout"</h3>
<p></p>

<h3>The 4 level and higher, often we leave in a "takeout" double.</h3>
<p></p>

<h3>After partner's takeout double - Cue bidding the enemy's suit</h3>
<p></p>

<h3>Double Double Double rule - 2 takeout doubles, 3rd double penalty.</h3>
<p></p>

<h3>Exceptions - when a double becomes penalty instead of takeout.</h3>
<p></p>

<h3>Double and secondary support for partner</h3>
<p></p>

<h3>Summary of common double mistakes.</h3>
<p></p>`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  if (!text.includes(OLD)) {
    if (text.includes("Takeout double on the 1 level")) {
      console.log("Already updated.");
      return;
    }
    throw new Error("Old Part 3 block not found in canonical body.");
  }
  const out = text.replace(OLD, NEW);
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
