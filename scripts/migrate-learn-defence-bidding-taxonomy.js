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

const defenceUpdates = {
  q5g6uTHBizW4qeYiDDSP: {
    title: "Defence Basics: Build a Plan at Trick One",
    subcategory: "Defensive Planning Fundamentals",
  },
  k4Siyl0vaWfH6kibCvOl: {
    title: "The Hammer in Defence: Take Tricks Before Declarer Settles",
    subcategory: "Defensive Planning Fundamentals",
  },
  t4xhOiKUTdztSeL5rHa1: {
    title: "Taking Tricks in Defence: Timing and Purpose",
    subcategory: "Defensive Planning Fundamentals",
  },
  "5mOnVwE8WqOF2I2Vy8as": {
    title: "Duck a Winner in Defence: Timing the Hold Up",
    subcategory: "Defensive Planning Fundamentals",
  },
  kP5DWmaT6PbsI2hlosXN: {
    title: "Danger Hand Awareness: Keep the Dangerous Opponent Off Lead",
    subcategory: "Defensive Planning Fundamentals",
  },
  FCj0REiwmBL0qaGgjCCz: {
    title: "The Trump Lead: When It Kills Ruffing Plans",
    subcategory: "Opening Leads and Positioning",
  },
  bdEvadsW5B7z84j2Ozbm: {
    title: "Lead Positioning: Dummy on Your Right with Small Cards",
    subcategory: "Opening Leads and Positioning",
  },
  sFqwOPA0FDS798RuWpD4: {
    title: "The Forcing Defence: Drain Declarer's Trumps",
    subcategory: "Trump Defence and Ruffing",
  },
  "4BGYsuC6Y8dmJQNLgK31": {
    title: "Ruffing in Defence: Turn Shortness into Tricks",
    subcategory: "Trump Defence and Ruffing",
  },
  "4vhmEtYIkmruZ2NzN2mF": {
    title: "Count Trumps in Defence: Prevent Surprise Ruffing",
    subcategory: "Trump Defence and Ruffing",
  },
  xqiQvLGiTddFjaTmUKus: {
    title: "Dummy Type 1: Limited Entries and How to Pressure It",
    subcategory: "Recognizing Dummy Types and Patterns",
  },
  YguUoNznwusCxapxpM9c: {
    title: "Dummy Type 2: Strong Trick Source and How to Disrupt It",
    subcategory: "Recognizing Dummy Types and Patterns",
  },
  xjG903ttN4p1ethnBJe3: {
    title: "Dummy Type 3: Ruffing Dummy and How to Counter It",
    subcategory: "Recognizing Dummy Types and Patterns",
  },
  "6Bpu7T1I4bwN6HDilvSh": {
    title: "Dummy Type 4: Passive Dummy and Active Defence",
    subcategory: "Recognizing Dummy Types and Patterns",
  },
  Cm0CbXoVNY9iXzr6ciYo: {
    title: "Count the Unseen Hand: Read Distribution in Defence",
    subcategory: "Recognizing Dummy Types and Patterns",
  },
};

const biddingUpdates = {
  cA7uXxJsTo1WfsouWBI8: {
    title: "Bidding Basics: Build a Clear Auction Plan",
    subcategory: "Core Bidding Fundamentals",
  },
  veGdT6XFSNm9idFl7cYQ: {
    title: "Bid Your Third Suit Naturally: Keep the Auction Clear",
    subcategory: "Core Bidding Fundamentals",
  },
  igJLHpNko8TPW0fNsTBj: {
    title: "Bidding as a Conversation: Share Information Efficiently",
    subcategory: "Core Bidding Fundamentals",
  },
  SCXMMqrnOLajYMPRm5bF: {
    title: "Loser Count for Bidding: Judge Contracts Better",
    subcategory: "Hand Evaluation and Judgment",
  },
  lc9QnUaPPhQaZVU9W2s5: {
    title: "Hand Evaluation 1: Card Texture Matters",
    subcategory: "Hand Evaluation and Judgment",
  },
  KnGm6qfaAqUe0Zhp5lgC: {
    title: "Hand Evaluation 2: Re-Evaluate as the Auction Develops",
    subcategory: "Hand Evaluation and Judgment",
  },
  ua2BVlWgOIZcrQ7xd0Xv: {
    title: "Hand Evaluation 3: Do More with a Good Suit",
    subcategory: "Hand Evaluation and Judgment",
  },
  Bt7HuZIwgXP7qw3lkNL9: {
    title: "Hand Evaluation 4: Do Less with a Weak Trump Suit",
    subcategory: "Hand Evaluation and Judgment",
  },
  "3L6JH3QtMyxLNeowf4RL": {
    title: "Responding to a Takeout Double: Keep It Practical",
    subcategory: "Competitive Bidding and Doubles",
  },
  "7j0BG9Wt18GLDm4L8sBm": {
    title: "Four-Level Doubles: What to Do Next",
    subcategory: "Competitive Bidding and Doubles",
  },
  tOQN4XCluSp7H2HuBtNo: {
    title: "Misfit Auctions: Put the Brakes On Early",
    subcategory: "Competitive Bidding and Doubles",
  },
  eL5bgaXfLfRNuCNQWsAq: {
    title: "Second Suit in Competition: Compete with Purpose",
    subcategory: "Competitive Bidding and Doubles",
  },
  UjUzxI7TG4fu4MaTdyCA: {
    title: "After 1NT: Respond More on Balanced Hands",
    subcategory: "No-Trump Auctions and Decisions",
  },
  "4xkjwz80clibm6no0ZNn": {
    title: "1NT with a Six-Card Suit: When It Still Works",
    subcategory: "No-Trump Auctions and Decisions",
  },
  ozQAgAMV1aTFZd6DJhCN: {
    title: "Just Bid 3NT: Recognize the Right Auctions",
    subcategory: "No-Trump Auctions and Decisions",
  },
  "4tWDTc1AHHRB4HsCIobB": {
    title: "After Partner Opens 1NT: Pass or Invite",
    subcategory: "No-Trump Auctions and Decisions",
  },
  "1eU7FebzVCI81tWYyho8": {
    title: "Should You Invite with 11? Practical Guide",
    subcategory: "No-Trump Auctions and Decisions",
  },
  "2xKO3QCyeCRvi1tMvk7J": {
    title: "Find a Major Fit as Responder: Mainstream Methods",
    subcategory: "Conventions and Artificial Methods",
  },
  o1s8DCOUJ7Ou692M9nv5: {
    title: "Weak Stayman: Know When It Helps",
    subcategory: "Conventions and Artificial Methods",
  },
  P4hZVOgw9G6akUmRGc2u: {
    title: "5NT Pick a Slam: Practical Partnership Agreements",
    subcategory: "Conventions and Artificial Methods",
  },
  wcufsE8Z04lwB3g90Dy1: {
    title: "Fourth Suit Forcing and Checkback: Core Structures",
    subcategory: "Conventions and Artificial Methods",
  },
  VGhITDTn4HKgMLVZNVhi: {
    title: "Vulnerable Preempting: Risk and Reward",
    subcategory: "Preempting Strategy",
  },
  HtiWk1Q2DlFTl5vMl5xu: {
    title: "Non-Vulnerable Preempting: Apply Maximum Pressure",
    subcategory: "Preempting Strategy",
  },
  Jpho9a9wQxMzQQWQDfTE: {
    title: "Preempting in First Seat: When to Be Bold",
    subcategory: "Preempting Strategy",
  },
  SkOyvIXccCvPReiItLmX: {
    title: "Vulnerable Auctions: Why Too Careful Can Be Costly",
    subcategory: "Preempting Strategy",
  },
  areP0ptmUH6H3wXJ8pUe: {
    title: "Third Seat Openings: Practical Aggression",
    subcategory: "Preempting Strategy",
  },
  K39TnRbajEPwy07Cmn06: {
    title: "KISS 1: Do Not Double Automatically",
    subcategory: "Partnership Style and Discipline",
  },
  eZMgUogaOhnkXRBe7SmR: {
    title: "KISS 2: Consider Passing More Often",
    subcategory: "Partnership Style and Discipline",
  },
  hqmUGZhih4awPU7oQVci: {
    title: "KISS 3: Support Partner as a Priority",
    subcategory: "Partnership Style and Discipline",
  },
  SQavob1QvQpowBPxNZzP: {
    title: "KISS 4: Do Not Save by Default",
    subcategory: "Partnership Style and Discipline",
  },
};

function toKeyword(title = "") {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 8)
    .join(" ");
}

function metaFor(subcategory, title, stream) {
  const t = String(title || "").replace(/\s+/g, " ").trim();
  if (stream === "defence") {
    return `Defence article: ${t}. Learn a practical ${subcategory.toLowerCase()} concept and apply it at the table with confidence.`;
  }
  return `Bidding article: ${t}. Learn a practical ${subcategory.toLowerCase()} concept and make clearer auction decisions.`;
}

async function applyCollection(collectionName, updates, categoryName, stream) {
  const ref = db.collection(collectionName);
  const snap = await ref.get();
  const existing = new Set(snap.docs.map((d) => d.id));
  const ids = Object.keys(updates);
  const missing = ids.filter((id) => !existing.has(id));
  if (missing.length) {
    throw new Error(`${collectionName} missing ids: ${missing.join(", ")}`);
  }

  const batch = db.batch();
  ids.forEach((id) => {
    const next = updates[id];
    batch.set(
      ref.doc(id),
      {
        category: categoryName,
        subcategory: next.subcategory,
        seoSubtopic: next.subcategory,
        primaryKeyword: toKeyword(next.title),
        metaDescription: metaFor(next.subcategory, next.title, stream),
        title: next.title,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });
  await batch.commit();
  return ids.length;
}

async function run() {
  const defenceCount = await applyCollection(
    "defence",
    defenceUpdates,
    "Defence",
    "defence"
  );
  const biddingCount = await applyCollection(
    "bidding",
    biddingUpdates,
    "Bidding",
    "bidding"
  );
  console.log(`Updated defence: ${defenceCount}, bidding: ${biddingCount}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
