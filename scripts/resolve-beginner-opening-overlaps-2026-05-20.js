const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

const APPLY = process.argv.includes("--apply");
if (!APPLY) {
  console.error("Refusing to run without --apply.");
  process.exit(1);
}

const keyPathCandidates = [
  path.join(__dirname, "..", "serviceAccountKey.json"),
  path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
];
const keyPath = keyPathCandidates.find((p) => fs.existsSync(p));
if (!keyPath) {
  throw new Error("No Firebase service account key found.");
}

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const F = admin.firestore.FieldValue;

const ACTIONS = [
  {
    collection: "beginnerBidding",
    bodyCollection: "beginnerBiddingBody",
    secondaryBodyId: "AjV6y8EGwcSvjv0y0YZS",
    primaryUrl: "/beginner/articles/bidding/CP4GjQyfwNbuvq2tNpl8",
    primaryTitle: "Responder's First Bid for Beginners: Raise, New Suit, or No-Trump",
  },
  {
    collection: "beginnerBidding",
    bodyCollection: "beginnerBiddingBody",
    secondaryBodyId: "LDff5emBJdRETTyHMH7h",
    primaryUrl: "/beginner/articles/bidding/tRq9HH7X05xnHb8Xk5vM",
    primaryTitle: "Opening Bids for Beginners: Balanced Hands and the 5-Card Major Rule",
  },
];

function makeStubHtml(primaryUrl, primaryTitle) {
  return (
    `<h2>Article moved</h2>` +
    `<p>This beginner topic has been merged into a stronger canonical guide.</p>` +
    `<p>Please continue here: <a href="${primaryUrl}">${primaryTitle} -></a>.</p>` +
    `<h3>Where to next</h3>` +
    `<ul>` +
    `<li><a href="${primaryUrl}">-> Continue to merged article</a></li>` +
    `<li><a href="/beginner/articles/bidding">-> Back to Beginner Bidding Articles Hub</a></li>` +
    `</ul>`
  );
}

async function resolveSummaryDocByBodyId(collection, bodyId) {
  const snap = await db.collection(collection).where("body", "==", bodyId).limit(1).get();
  if (snap.empty) return null;
  return snap.docs[0];
}

async function run() {
  const output = [];
  for (const action of ACTIONS) {
    const summaryDoc = await resolveSummaryDocByBodyId(action.collection, action.secondaryBodyId);
    if (!summaryDoc) {
      output.push({
        secondaryBodyId: action.secondaryBodyId,
        status: "skipped",
        reason: "summary doc not found for body id",
      });
      continue;
    }

    const summaryId = summaryDoc.id;
    const stubHtml = makeStubHtml(action.primaryUrl, action.primaryTitle);

    await db.collection(action.collection).doc(summaryId).set(
      {
        redirectTo: action.primaryUrl,
        ctaTarget: "/beginner/articles/bidding",
        relatedLinks: [action.primaryUrl, "/beginner/articles/bidding"].join("\n"),
        updatedAt: F.serverTimestamp(),
      },
      { merge: true }
    );

    await db.collection(action.bodyCollection).doc(action.secondaryBodyId).set(
      {
        text: stubHtml,
        body: { text: stubHtml },
        updatedAt: F.serverTimestamp(),
      },
      { merge: true }
    );

    output.push({
      summaryId,
      secondaryBodyId: action.secondaryBodyId,
      redirectTo: action.primaryUrl,
      status: "applied",
    });
  }

  console.log(JSON.stringify(output, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
