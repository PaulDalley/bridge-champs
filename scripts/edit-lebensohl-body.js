/**
 * One-off: apply Paul's edits to the live Lebensohl article body (biddingBody).
 * Backs up the current body to scripts/backup-lebensohl-body-<ts>.json first.
 * Each replacement must match exactly once or the script aborts.
 *
 * Usage: node scripts/edit-lebensohl-body.js --apply
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

if (!process.argv.includes("--apply")) {
  console.error("Refusing to run without --apply.");
  process.exit(1);
}
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))) });
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const BODY_ID = "wsCt4ouPgZU1cB86fj2A";

const EDITS = [
  {
    name: "intro 2nd paragraph",
    old: `<p>At heart, this is about partscore battles. Partscore battles are one of the most important parts of bridge bidding, and Lebensohl gives us a clean structure so we can compete without confusion.</p>`,
    neu: `<p>At heart, this is about partscore battles. Partscore battles are one of the most important parts of bridge bidding. Lebensohl is a convention that helps us in a couple of very specific scenarios, the main one being when our side opens 1NT and the opponents overcall on the 2-level — Lebensohl helps us just compete with a weak hand (say 7 or fewer points). Basically, Lebensohl lets us distinguish between hands we just want to compete with, and hands we want to force to game.</p>`,
  },
  {
    name: "you bid 2NT (bold + alert note)",
    old: `  <li>You bid <strong>2NT</strong>, saying: &quot;I have a suit I want to bid, just to compete.&quot;</li>`,
    neu: `  <li><strong>You bid 2NT.</strong> This is a completely artificial bid — it needs to be alerted. It communicates to partner: &quot;I have a suit I want to bid, just to compete.&quot;</li>`,
  },
  {
    name: "why 2NT -> the big point of 2NT",
    old: `<p>Why 2NT? Because often we are not strong enough to bid 3 of our suit directly and force partner onward, but we also can&apos;t afford to pass.</p>`,
    neu: `<p>So what is the big point of 2NT? The key point is, if we do not bid 2NT — so say we bid 3♣ directly — partner knows we have a good forcing hand. In other words, we have two options: bid our suits directly as a game-forcing natural bid, or bid 2NT, saying &quot;I just want to compete.&quot;</p>`,
  },
  {
    name: "critical detail -> new heading + body",
    old: `<p>Critical detail: after Lebensohl, partner should bid <strong>3♣</strong>. That gives you room to pass 3♣ if clubs is your suit, or correct to your actual suit at the 3-level.</p>`,
    neu: `<h3>After the 2NT bid, partner is forced to bid 3♣</h3>\n<p>As the heading says, the NT opener always has to bid 3♣ after Lebensohl is bid. Essentially, responder has a long suit (usually 5-6 cards) and just wants to compete and play there. Opener has no idea which suit — it could be clubs or a different suit.</p>\n<p>So either responder is going to pass the 3♣, or they are going to correct it to their real suit.</p>`,
  },
  {
    name: "that's the whole beauty -> summary callout",
    old: `<p>That&apos;s the whole beauty: you compete with structure, not panic.</p>`,
    neu: `<Callout type="rule">\n  <p><strong>Summary:</strong> always bid 3♣ after 2NT (Lebensohl).</p>\n</Callout>`,
  },
];

(async () => {
  const ref = db.collection("biddingBody").doc(BODY_ID);
  const snap = await ref.get();
  if (!snap.exists) { console.error("body doc not found:", BODY_ID); process.exit(1); }
  let txt = (snap.data() || {}).text || "";

  // Backup
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(__dirname, `backup-lebensohl-body-${stamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify({ bodyId: BODY_ID, text: txt }, null, 2), "utf8");
  console.log("backup written:", backupPath);

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
