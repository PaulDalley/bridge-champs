/**
 * Insert bid-and-raise section + classic-penalty rule callout in penalty section.
 * Usage: node scripts/insert-takeout-bid-raise-section.js
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error("Missing serviceAccountKey.json");

const CANONICAL_BODY_ID = "yt6au7gwYwPahTxQ4kd5";

const PENALTY_OLD = `<h2>What to do if you want to penalty double but you are playing takeout doubles?</h2>
<p>So lets say you've been dealt a hand that you would love to penalty double with`;

const PENALTY_NEW = `<h2>What to do if you want to penalty double but you are playing takeout doubles?</h2>
<Callout type="rule"><p><strong>Rule:</strong> When we have a classic penalty double hand, usually we need to pass (in tempo). And rely on partner making a takeout double.</p></Callout>
<p>So lets say you've been dealt a hand that you would love to penalty double with`;

const BID_RAISE_OLD = `<h2>If they bid and raise a suit, always "takeout"</h2>
<p></p>

<h2>The 4 level and higher, often we leave in a "takeout" double.</h2>`;

const BID_RAISE_NEW = `<h2>If they bid and raise a suit, always "takeout"</h2>
<Callout type="expert"><p>When the opponents bid and raise a suit, doubles are for takeout.</p></Callout>
<p>This is a highly recommended rule to have. When they have shown a fit, its very infrequent that we will be dealth 4-5 good cards in their suit, the much more likely situation is that we want to compete or find our game, and we need the double as the tool to move the auction forward, when we don't have a clear natural bid to make (typically we have a balanced'ish hand, and no long suit to bid).</p>
<p> But then the question, as always (in a day where penalty doubles seem to be extinct), what do I do if I want to penalty them? Once again you have to pass, and rely on partner to double for takeout. (Whent hey have an 8 + card fit, and you want to peanlty them with say 4+ good cards in their suit, partner will have 0-1 in their suit and should certainly be thinking about making a takeout double).</p>
<p></p>

<h2>The 4 level and higher, often we leave in a "takeout" double.</h2>`;

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  let text = (await ref.get()).data()?.text || "";

  if (text.includes("When the opponents bid and raise a suit, doubles are for takeout.")) {
    console.log("Bid-and-raise section already inserted.");
  } else {
    if (!text.includes(BID_RAISE_OLD)) throw new Error("Bid-and-raise target block not found.");
    text = text.replace(BID_RAISE_OLD, BID_RAISE_NEW);
    console.log("Inserted bid-and-raise section.");
  }

  if (text.includes("When we have a classic penalty double hand, usually we need to pass (in tempo).")) {
    console.log("Classic penalty rule callout already inserted.");
  } else {
    if (!text.includes(PENALTY_OLD)) throw new Error("Penalty section target block not found.");
    text = text.replace(PENALTY_OLD, PENALTY_NEW);
    console.log("Inserted classic penalty rule callout.");
  }

  await ref.set(
    { text, body: { text }, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  console.log("Updated biddingBody/" + CANONICAL_BODY_ID);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
