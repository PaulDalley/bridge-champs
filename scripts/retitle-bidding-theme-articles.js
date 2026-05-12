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

const PRACTICE = "/bidding/practice";
const HUB = "/bidding/advanced";

const UPDATES = {
  "1-level overcalls: Practical Trainer Lessons Across Levels": {
    title: "When Should You Make a 1-Level Overcall?",
    teaser:
      "Learn when a 1-level overcall helps your side and when discipline says pass.",
    metaDescription:
      "Practical guide to 1-level overcalls: suit quality, vulnerability, and partnership clarity.",
  },
  "2-level overcalls: Practical Trainer Lessons Across Levels": {
    title: "When Is a 2-Level Overcall Worth the Risk?",
    teaser:
      "A practical framework for deciding when to enter at the two level and when to stay quiet.",
    metaDescription:
      "Learn disciplined 2-level overcalls with risk control, suit quality, and vulnerability context.",
  },
  "Advanced hand evaluation: Practical Trainer Lessons Across Levels": {
    title: "How Should You Evaluate a Hand Beyond Raw Points?",
    teaser:
      "Upgrade and downgrade hands the practical way using shape, controls, and fit quality.",
    metaDescription:
      "Advanced hand evaluation in bridge: move beyond points and judge controls, shape, and fit.",
  },
  "Do You Open the Bidding? Problems 1-5 Explained": {
    title: "Should You Open the Bidding? 5 Practical Decisions",
    teaser:
      "Build opening discipline with five practical decisions that improve partnership trust.",
    metaDescription:
      "Learn when to open and when to pass with practical opening hand evaluation decisions.",
  },
  "Doubles: Practical Trainer Lessons Across Levels": {
    title: "When Is Double the Right Call?",
    teaser:
      "Use this practical structure to handle doubles without partnership confusion.",
    metaDescription:
      "Practical bridge doubles guide: know when double is right and what it promises partner.",
  },
  "Duplicate bidding: Practical Trainer Lessons Across Levels": {
    title: "What Does Disciplined Duplicate Bidding Look Like?",
    teaser:
      "Learn the consistency habits that score over a full duplicate session.",
    metaDescription:
      "Duplicate bidding discipline: clearer partnership communication and fewer costly misunderstandings.",
  },
  "Is this forcing?: Practical Trainer Lessons Across Levels": {
    title: "Is This Auction Forcing? How to Tell Quickly",
    teaser:
      "A practical forcing-status checklist to prevent expensive partnership mistakes.",
    metaDescription:
      "Learn how to identify forcing auctions quickly and avoid non-forcing misunderstandings.",
  },
  "Lebensohl: Practical Trainer Lessons Across Levels": {
    title: "How Does Lebensohl Help in Competitive Auctions?",
    teaser:
      "Understand when Lebensohl improves structure and when simple actions are still best.",
    metaDescription:
      "Practical Lebensohl decisions: weak-hand routes, direct bids, and partnership clarity.",
  },
  "Preempts: Practical Trainer Lessons Across Levels": {
    title: "When Should You Preempt and When Should You Pass?",
    teaser:
      "Use practical preempt discipline so your pressure bids help partner, not hurt partner.",
    metaDescription:
      "Learn practical preempt strategy: vulnerability, suit quality, and when pass is best.",
  },
  "Quick check: Practical Trainer Lessons Across Levels": {
    title: "What Quick Checks Should You Run Before Every Bid?",
    teaser:
      "Use this short routine to make clearer decisions under pressure.",
    metaDescription:
      "Bridge bidding quick-check routine for strength, shape, forcing status, and partnership clarity.",
  },
  "Responding to a double: Practical Trainer Lessons Across Levels": {
    title: "How Should You Respond After Partner Doubles?",
    teaser:
      "A practical responder framework after partner's double: show shape first, then strength.",
    metaDescription:
      "Learn practical responses after partner doubles with clearer shape and value communication.",
  },
  "Responding to Partner: Problems 6-10 Explained": {
    title: "How Should You Respond to Partner's Opening Bid?",
    teaser:
      "Improve first responses by showing fit, shape, and intent clearly.",
    metaDescription:
      "Practical first-response guide: when to raise, bid a new suit, or choose no-trump.",
  },
  "Slam judgment: Practical Trainer Lessons Across Levels": {
    title: "How Do You Know When to Bid Slam?",
    teaser:
      "A practical slam-judgment framework using controls, fit quality, and hand texture.",
    metaDescription:
      "Bridge slam judgment made practical: when to push and when to stop below slam.",
  },
  "Splinters: Practical Trainer Lessons Across Levels": {
    title: "When Is a Splinter Bid the Right Tool?",
    teaser:
      "Learn when splinters clarify slam direction and when they overstate your hand.",
    metaDescription:
      "Practical splinter bidding guide: fit confirmation, shortness meaning, and follow-up judgment.",
  },
  "The Modern 1NT Opening: Problems 11-16 Explained": {
    title: "What Does a Modern 1NT Opening Really Promise?",
    teaser:
      "Keep your 1NT promises accurate so responder decisions stay clear and effective.",
    metaDescription:
      "Modern 1NT opening discipline: range accuracy, balanced shape, and partnership trust.",
  },
  "The Power of Pass: Practical Trainer Lessons Across Levels": {
    title: "When Is Pass the Strongest Bid?",
    teaser:
      "Learn when disciplined pass gives better results than forced competition.",
    metaDescription:
      "The power of pass in bridge bidding: practical spots where pass is the winning action.",
  },
};

function stripOldCtaSections(html) {
  return String(html || "")
    .replace(/<h3>\s*Trainer-first habit builder\s*<\/h3>[\s\S]*?(?=<h3>|$)/gi, "")
    .replace(/<h3>\s*Where to next\s*<\/h3>[\s\S]*$/gi, "")
    .trim();
}

function appendGentleCta(html) {
  return `${html}

<h3>Practice this when you are ready</h3>
<p>If you want this decision pattern to become automatic, run a few focused reps in the trainer. Habit beats theory.</p>
<ul>
  <li><a href="${PRACTICE}">Bidding Practice Trainer</a></li>
  <li><a href="${HUB}">Bidding Articles Hub</a></li>
</ul>`.trim();
}

async function main() {
  const titles = Object.keys(UPDATES);
  let count = 0;
  for (const oldTitle of titles) {
    const update = UPDATES[oldTitle];
    const snap = await db.collection("bidding").where("title", "==", oldTitle).limit(1).get();
    if (snap.empty) continue;
    const doc = snap.docs[0];
    const data = doc.data() || {};
    const bodyId = data.body;
    if (!bodyId) continue;
    const bodyRef = db.collection("biddingBody").doc(bodyId);
    const bodySnap = await bodyRef.get();
    const bodyData = bodySnap.data() || {};
    const existingHtml = String(bodyData.text || bodyData.body?.text || "");

    let nextHtml = existingHtml;
    nextHtml = nextHtml.replace(/<h2>[\s\S]*?<\/h2>/i, `<h2>${update.title}</h2>`);
    nextHtml = appendGentleCta(stripOldCtaSections(nextHtml));

    await doc.ref.set(
      {
        title: update.title,
        teaser: update.teaser,
        metaDescription: update.metaDescription,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    await bodyRef.set(
      {
        text: nextHtml,
        body: { text: nextHtml },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    count += 1;
    console.log(`Retitled: ${oldTitle} -> ${update.title}`);
  }
  console.log(`Updated ${count} titles/articles.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
