/**
 * One-off: Fourth Suit Forcing article — new title + Paul's opening/ending text
 * edits. Boards and all middle text are left exactly as-is. Backs up first;
 * each replacement must match exactly once.
 * Usage: node scripts/edit-fourth-suit-forcing.js --apply
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

if (!process.argv.includes("--apply")) { console.error("Refusing to run without --apply."); process.exit(1); }
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"))) });
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const SUMMARY_ID = "wcufsE8Z04lwB3g90Dy1";
const BODY_ID = "kjsnezFNbXA1WsfvFEl4";
const NEW_TITLE = "Fourth suit Forcing: Introduction";

const EDITS = [
  {
    name: "opening (heading + trimmed lead)",
    old: `<p>Two conventions that are very important are <strong>fourth suit forcing </strong>&nbsp;and <strong>checkback. </strong>I am hoping by the end of the articles it will be clear why I have grouped them together.</p>\n<p><br></p>\n<p>Lets start with <strong>fourth suit forcing. </strong>In my partnerships I prefer to call it <strong>fourth suit game forcing. </strong>It is much more simple to play it as game forcing, to eliminate any misunderstandings or subsequent bidding issues that may arise. While the convention is simple enough, its good to properly understand the other options available in such auctions. The simple characteristics are:</p>`,
    neu: `<h3>Fourth Suit Forcing</h3>\n<p>In my partnerships I prefer to call it <strong>fourth suit game forcing. </strong>It is much more simple to play it as game forcing, to eliminate any misunderstandings or subsequent bidding issues that may arise.</p>\n<p><br></p>\n<p>So, the key characteristics are:</p>`,
  },
  {
    name: "ending (to be continued -> next-article note)",
    old: `<p>To be continued.</p>`,
    neu: `<p>The next article on fourth suit forcing will cover the responses in more detail. You will notice that the bids are mostly very intuitive and natural.</p>`,
  },
];

(async () => {
  // Title (summary doc)
  await db.collection("bidding").doc(SUMMARY_ID).set({ title: NEW_TITLE, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  console.log("title ->", NEW_TITLE);

  // Body
  const ref = db.collection("biddingBody").doc(BODY_ID);
  const snap = await ref.get();
  let txt = (snap.data() || {}).text || "";
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  fs.writeFileSync(path.join(__dirname, `backup-fourth-suit-body-${stamp}.json`), JSON.stringify({ bodyId: BODY_ID, text: txt }, null, 2), "utf8");
  console.log("backup written");

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
