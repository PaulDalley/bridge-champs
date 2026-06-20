/**
 * One-off (round 2): apply Paul's further edits to the live Lebensohl body.
 * Backs up the current body first; each replacement must match exactly once.
 * Usage: node scripts/edit-lebensohl-body-2.js --apply
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

if (!process.argv.includes("--apply")) { console.error("Refusing to run without --apply."); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))) });
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const BODY_ID = "wsCt4ouPgZU1cB86fj2A";

const EDITS = [
  {
    name: "situation 2 intro",
    old: `<p>This is the other huge use case.</p>`,
    neu: `<p>This is another area where many partnerships agree to use Lebensohl. The idea is to distinguish between very weak hands (say 7 or fewer points), and intermediate hands (8-11).</p>`,
  },
  {
    name: "memory aid -> it goes like this",
    old: `<p>A very practical memory aid:</p>`,
    neu: `<p>It goes like this:</p>`,
  },
  {
    name: "great line + 8-card fit question",
    old: `<p>Great line to remember: <strong>We are fiercely determined to compete, except when they are in a bad contract.</strong></p>`,
    neu: `<p>Great line to remember: <strong>We are fiercely determined to compete, except when they are in a bad contract.</strong> One of the key questions is: do they have a known 8-card fit? If yes, it will often be a good idea to compete.</p>`,
  },
  {
    name: "final takeaway para 1",
    old: `  <p>Lebensohl gives you structure in competitive auctions.</p>`,
    neu: `  <p>Lebensohl gives you structure in two specific auctions: when the opponents bid over our 1NT opening, and when we make a takeout double of their weak 2.</p>`,
  },
  {
    name: "final takeaway para 2",
    old: `  <p>If you remember one line, remember this: <strong>2NT is usually the weak-hand route (the stop sign), and direct bids show more.</strong></p>`,
    neu: `  <p>If you remember one line, remember this: <strong>2NT is usually the weak-hand route (the stop sign), and direct bidding shows more</strong> (game-forcing if partner opened 1NT, and 8-11 if partner doubled a weak 2).</p>`,
  },
  {
    name: "drop 'compete with structure, not emotion' line",
    old: `\n  <p>Use Lebensohl to compete with structure, not emotion.</p>`,
    neu: ``,
  },
  {
    name: "drop 'Why?' + 3 takeout-double bullets",
    old: `\n<p>Why?</p>\n<ul>\n  <li>We don&apos;t let them play comfortably on the 2-level in a fit.</li>\n  <li>Partner already has useful strength range in many of these auctions.</li>\n  <li>Our shape might be ideal for takeout action.</li>\n</ul>`,
    neu: ``,
  },
];

(async () => {
  const ref = db.collection("biddingBody").doc(BODY_ID);
  const snap = await ref.get();
  if (!snap.exists) { console.error("body doc not found"); process.exit(1); }
  let txt = (snap.data() || {}).text || "";

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.writeFileSync(path.join(__dirname, `backup-lebensohl-body-${stamp}.json`), JSON.stringify({ bodyId: BODY_ID, text: txt }, null, 2), "utf8");
  console.log("backup written for", stamp);

  for (const e of EDITS) {
    const count = txt.split(e.old).length - 1;
    if (count !== 1) { console.error(`ABORT: "${e.name}" matched ${count} times (expected 1).`); process.exit(1); }
    txt = txt.replace(e.old, e.neu);
    console.log("applied:", e.name);
  }

  await ref.set({ text: txt, body: { text: txt }, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  console.log("UPDATED biddingBody/" + BODY_ID + " | new length", txt.length);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
