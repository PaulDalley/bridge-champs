const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const keyPathCandidates = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
];
const keyPath = keyPathCandidates.find((p) => fs.existsSync(p));
if (!keyPath) throw new Error("No Firebase service account key found.");

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const HUB = "/bidding/advanced";
const PRACTICE = "/bidding/practice";

const bodyUpdates = {
  MCLoHJEfL6vlAnLeS2Ro: `
<h2>Bidding Quick Check: A Practical 10-Second Routine</h2>
<p>This topic is not a gimmick. It is one of the most useful ways to cut auction errors immediately.</p>
<p>When auctions speed up, many mistakes come from bidding before we check the obvious. A short routine protects your partnership from avoidable misunderstandings.</p>

<h3>The quick-check sequence</h3>
<ol>
  <li><strong>Strength:</strong> where am I in range for this auction?</li>
  <li><strong>Shape:</strong> what is my most important hand feature to communicate now?</li>
  <li><strong>Fit:</strong> do we have known fit or fit potential I should prioritize?</li>
  <li><strong>Forcing status:</strong> can partner pass this bid?</li>
  <li><strong>Partnership clarity:</strong> does this call make partner's next action easier?</li>
</ol>

<Callout type="checklist">
  <p>If your chosen bid fails two or more checks above, pause and reconsider.</p>
</Callout>

<h3>Why this routine works</h3>
<p>Bridge bidding is not just technical knowledge. It is decision hygiene under pressure. The quick-check routine gives you a repeatable structure so decisions stay stable when the auction gets noisy.</p>

<h3>Typical errors this prevents</h3>
<ul>
  <li>Bidding a call that partner can pass when you thought auction was forcing.</li>
  <li>Missing immediate fit information because you chased a side detail first.</li>
  <li>Choosing a call that hides shape and forces partner into guesswork.</li>
  <li>Making a "looks right" bid that does not match partnership agreements.</li>
</ul>

<h3>Table habit</h3>
<p>Use this quick check before every non-obvious call for one week of practice. You will feel your auctions become calmer and your partnership discussions become clearer.</p>

<h3>Final takeaway</h3>
<p>The strongest players are not rushing less because they are slower. They are rushing less because their process is better. Use the quick check and keep your auctions clean.</p>

<h3>Where to next</h3>
<ul>
  <li><a href="${PRACTICE}">Bidding Practice Trainer</a></li>
  <li><a href="${HUB}">Bidding Articles Hub</a></li>
</ul>
`.trim(),
  lBLD2dfoo8DVmAds5K6g: `
<h2>Preempts: Practical Strategy That Actually Works</h2>
<p>Preempting is not random aggression. It is controlled pressure.</p>
<p>Your preempt should consume opponent bidding space while still giving partner a realistic picture of your hand type.</p>

<h3>What a good preempt does</h3>
<ul>
  <li>Takes away room from the opponents.</li>
  <li>Describes long-suit intent clearly.</li>
  <li>Lets partner judge risk based on vulnerability and style.</li>
</ul>

<h3>Core practical rules</h3>
<ol>
  <li><strong>Respect vulnerability.</strong> At unfavorable vulnerability, tighten your standards.</li>
  <li><strong>Respect suit quality.</strong> Long and playable is better than long and weak.</li>
  <li><strong>Avoid shape lies.</strong> Do not preempt balanced trash and expect partner to recover.</li>
  <li><strong>Preempt with a plan.</strong> Know what partner actions you are inviting and what you are discouraging.</li>
</ol>

<Callout type="rule">
  <p>A good preempt makes opponents guess. A bad preempt makes partner guess.</p>
</Callout>

<h3>Common preempt mistakes</h3>
<ul>
  <li>Preempting because the hand feels "active" without enough suit texture.</li>
  <li>Ignoring seat and vulnerability context.</li>
  <li>Assuming preempt always means "bid more" later regardless of partner's action.</li>
  <li>Treating every long suit as automatic preempt territory.</li>
</ul>

<h3>When pass is better</h3>
<p>Passing a bad preempt hand is often the expert action. If your hand cannot support the story your bid tells, pass and wait for clearer information.</p>

<h3>Final takeaway</h3>
<p>Preempts are high-value weapons when disciplined. Use them to pressure opponents, not to gamble against your own partnership structure.</p>

<h3>Where to next</h3>
<ul>
  <li><a href="${PRACTICE}">Bidding Practice Trainer</a></li>
  <li><a href="${HUB}">Bidding Articles Hub</a></li>
</ul>
`.trim(),
};

async function main() {
  for (const [bodyId, html] of Object.entries(bodyUpdates)) {
    const summarySnap = await db.collection("bidding").where("body", "==", bodyId).limit(1).get();
    if (summarySnap.empty) {
      console.log(`Summary not found for body ${bodyId}`);
      continue;
    }
    await db.collection("biddingBody").doc(bodyId).set(
      {
        text: html,
        body: { text: html },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    await summarySnap.docs[0].ref.set(
      {
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    console.log(`Expanded body ${bodyId}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
