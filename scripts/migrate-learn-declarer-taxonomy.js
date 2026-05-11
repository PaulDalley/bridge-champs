const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");

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
const FieldValue = admin.firestore.FieldValue;

const updatesById = {
  mg8ccWM6OlSy2DPSNLhj: {
    title: "Declarer Play Basics: Build a Plan at Trick One",
    subcategory: "Counting and Planning",
    seoSubtopic: "Counting and Planning",
    primaryKeyword: "declarer play basics trick one plan",
    metaDescription:
      "Build a reliable declarer plan from trick one by counting likely winners, losers, and trick sources.",
  },
  SJa0H4VWgjBozArYe13y: {
    title: "Count Winners in No-Trump: Build a Trick Plan",
    subcategory: "Counting and Planning",
    seoSubtopic: "Counting and Planning",
    primaryKeyword: "count winners no trump declarer",
    metaDescription:
      "Learn to count winners in no-trump and build a clear declarer plan before defenders run their tricks.",
  },
  Qn2mSspgXwTep5kwklU7: {
    title: "Count Losers in Suit Contracts: Plan the Hand Early",
    subcategory: "Counting and Planning",
    seoSubtopic: "Counting and Planning",
    primaryKeyword: "count losers suit contracts declarer",
    metaDescription:
      "Use loser counting in suit contracts to choose a practical declarer plan and avoid avoidable losers.",
  },
  ZlXCKMXG07zUJ9NHTq6I: {
    title: "Count Winners in Trumps: Avoid Missed Tricks",
    subcategory: "Counting and Planning",
    seoSubtopic: "Counting and Planning",
    primaryKeyword: "count winners in trumps declarer",
    metaDescription:
      "Count likely trump winners early so you can choose better timing and avoid missing easy tricks.",
  },
  oHPgxDruulJC0A6dZT7M: {
    title: "Count Potential Losers: Spot Hidden Dangers Early",
    subcategory: "Counting and Planning",
    seoSubtopic: "Counting and Planning",
    primaryKeyword: "count potential losers declarer",
    metaDescription:
      "Spot potential losers early to reduce risk and improve declarer planning in competitive contracts.",
  },
  ci1rtvmTkBbdvO5pXLT2: {
    title: "Draw Trumps or Delay: Make the Right Plan",
    subcategory: "Trump Management",
    seoSubtopic: "Trump Management",
    primaryKeyword: "draw trumps or delay declarer",
    metaDescription:
      "Know when to draw trumps and when to delay, so you preserve entries and avoid losing valuable ruffs.",
  },
  QOKc4hA1mIY74AvAX2Nc: {
    title: "Draw Trumps with Purpose: Avoid Autopilot",
    subcategory: "Trump Management",
    seoSubtopic: "Trump Management",
    primaryKeyword: "draw trumps with purpose declarer",
    metaDescription:
      "Avoid autopilot trump play by making a clear plan for timing, entries, and side-suit development.",
  },
  ob1rNpXFCNuEoTjbu676: {
    title: "Use Entries Well: Reach the Right Hand at the Right Time",
    subcategory: "Entries and Communication",
    seoSubtopic: "Entries and Communication",
    primaryKeyword: "declarer entries and communication",
    metaDescription:
      "Use entries and communication efficiently so your winners are reachable when you need them most.",
  },
  ZzMWK4om0TCyAFvG4Bws: {
    title: "Duck to Preserve Communication: Set Up Your Long Suit",
    subcategory: "Entries and Communication",
    seoSubtopic: "Entries and Communication",
    primaryKeyword: "duck to preserve communication declarer",
    metaDescription:
      "Learn when to duck to preserve communication and establish long-suit winners without stranding tricks.",
  },
  T5B7s8NWKsBsZr1uK4VB: {
    title: "Take Every Chance: Create Extra Tricks Before Defence Settles",
    subcategory: "Suit Establishment and Timing",
    seoSubtopic: "Suit Establishment and Timing",
    primaryKeyword: "create extra tricks declarer timing",
    metaDescription:
      "Take every practical chance to create extra tricks before defenders organize and cash their winners.",
  },
  PGeE1RO8BQRhFTkSpQlC: {
    title: "Have a Backup Plan: Recover When Plan A Fails",
    subcategory: "Suit Establishment and Timing",
    seoSubtopic: "Suit Establishment and Timing",
    primaryKeyword: "declarer backup plan timing",
    metaDescription:
      "Build a backup declarer line so you can recover when your first plan does not go as expected.",
  },
  QMwyiycD3LeNLi5LT0nF: {
    title: "Cash Side-Suit Winners with Trumps Out: Avoid Ruff Risk",
    subcategory: "Suit Establishment and Timing",
    seoSubtopic: "Suit Establishment and Timing",
    primaryKeyword: "cash side suit winners with trumps out",
    metaDescription:
      "Learn when to cash side-suit winners while trumps remain out, and reduce the chance of defensive ruffs.",
  },
  "3FaNIpXgZwHW2m8Dg0p2": {
    title: "Count Trumps Accurately: Control the Contract",
    subcategory: "Suit Establishment and Timing",
    seoSubtopic: "Suit Establishment and Timing",
    primaryKeyword: "count trumps accurately declarer",
    metaDescription:
      "Count trumps accurately to improve timing decisions and keep better control of suit contracts.",
  },
  RM7ZCOS90h8LFoTD7Olp: {
    title: "Pattern Recognition 1: Ruffing Strategy in Dummy",
    subcategory: "Patterns and Technique",
    seoSubtopic: "Patterns and Technique",
    primaryKeyword: "ruffing strategy in dummy declarer",
    metaDescription:
      "Recognize ruffing patterns in dummy and turn shortness into practical extra tricks as declarer.",
  },
  gyOUBo3wKuMGXNnV3gvI: {
    title: "Pattern Recognition 2: Set Up Side Suits",
    subcategory: "Patterns and Technique",
    seoSubtopic: "Patterns and Technique",
    primaryKeyword: "set up side suits declarer",
    metaDescription:
      "Spot side-suit setup opportunities early and convert developing suits into dependable winners.",
  },
  mJfONQIciRoXf41Baqgk: {
    title: "Pattern Recognition 3: Find and Build Trick Sources",
    subcategory: "Patterns and Technique",
    seoSubtopic: "Patterns and Technique",
    primaryKeyword: "find trick sources declarer",
    metaDescription:
      "Identify likely trick sources quickly so your declarer plan targets the right suits and entries.",
  },
  nAZQ5ZenqcvqKQPFnVJa: {
    title: "Pattern Recognition 4: Avoid Creating Extra Losers",
    subcategory: "Patterns and Technique",
    seoSubtopic: "Patterns and Technique",
    primaryKeyword: "avoid creating extra losers declarer",
    metaDescription:
      "Avoid avoidable declarer errors by recognizing lines that create unnecessary extra losers.",
  },
  Dyvuk9wdIz8OplyFIlak: {
    title: "Bridge Shapes Fundamentals: Read Distribution Quickly",
    subcategory: "Patterns and Technique",
    seoSubtopic: "Patterns and Technique",
    primaryKeyword: "bridge shapes fundamentals distribution",
    metaDescription:
      "Understand common bridge shapes and distribution so your declarer planning becomes faster and clearer.",
  },
  Xe62w8MN5iiHUGIjVJEc: {
    title: "Understand Fourth-Highest Leads: Read the Defensive Picture",
    subcategory: "Patterns and Technique",
    seoSubtopic: "Patterns and Technique",
    primaryKeyword: "understand fourth highest leads",
    metaDescription:
      "Read fourth-highest opening leads more accurately to improve counting, timing, and declarer decisions.",
  },
  Ao36PbU7pzMOyVZVvz9F: {
    title: "Practice Hand 1: Plan Before You Play",
    subcategory: "Practice Hands",
    seoSubtopic: "Practice Hands",
    primaryKeyword: "declarer practice hand plan before play",
    metaDescription:
      "Work through a guided declarer practice hand and build a clear plan before playing to trick one.",
  },
  kDCEsitWIIITycGDi873: {
    title: "Practice Hand 2: Timing and Entries Under Pressure",
    subcategory: "Practice Hands",
    seoSubtopic: "Practice Hands",
    primaryKeyword: "declarer practice hand timing entries",
    metaDescription:
      "Practice declarer timing and entry management under pressure with a structured decision-making hand.",
  },
};

async function run() {
  const ids = Object.keys(updatesById);
  const summaryRef = db.collection("cardPlay");
  const snap = await summaryRef.get();
  const existingIds = new Set(snap.docs.map((doc) => doc.id));
  const missing = ids.filter((id) => !existingIds.has(id));
  if (missing.length > 0) {
    throw new Error(`Missing cardPlay doc ids: ${missing.join(", ")}`);
  }

  const batch = db.batch();
  ids.forEach((id) => {
    const next = updatesById[id];
    batch.set(
      summaryRef.doc(id),
      {
        category: "Declarer",
        subcategory: next.subcategory,
        seoSubtopic: next.seoSubtopic,
        primaryKeyword: next.primaryKeyword,
        metaDescription: next.metaDescription,
        title: next.title,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });
  await batch.commit();

  console.log(`Updated ${ids.length} Learn declarer articles.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
