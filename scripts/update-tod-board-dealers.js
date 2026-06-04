/**
 * Re-align takeout-doubles article boards: keep the same auction, change the
 * dealer / starting seat by setting `dealer` and the correct number of leading
 * blank `_` slots (West=0, North=1, East=2, South=3).
 *
 * Usage:
 *   node scripts/update-tod-board-dealers.js          (dry run)
 *   node scripts/update-tod-board-dealers.js --apply
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const os = require("os");

function keyPath() {
  const c = [
    process.env.FIREBASE_SERVICE_ACCOUNT,
    path.join(os.homedir(), "Downloads", "firebase key.json"),
    path.join(os.homedir(), "Downloads", "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"),
    path.join(__dirname, "..", "serviceAccountKey.json"),
  ]
    .filter(Boolean)
    .map((p) => path.resolve(p));
  return c.find((p) => fs.existsSync(p));
}

const CANONICAL_BODY_ID = "yt6au7gwYwPahTxQ4kd5";

// Identify each board by a unique South-hand signature, then set dealer+bidding.
const TARGETS = [
  { south: "*S-KQ102*H-4*D-A1084*C-K932", dealer: "East", bidding: "_/_/1♥/?" },
  { south: "*S-AQ10432*H-542*D-1043*C-2", dealer: "North", bidding: "_/1♣/2♦/?" },
  { south: "*S-AJ983*H-K103*D-A1042*C-3", dealer: "North", bidding: "_/1♣/2♠/?" },
  // Two boards share this South hand; disambiguate on current bidding.
  {
    south: "*S-K102*H-A93*D-J104*C-A1083",
    matchBidding: "_/1♣/P/1♠/2♦/?",
    dealer: "South",
    bidding: "_/_/_/1♣/P/1♠/2♦/?",
  },
  {
    south: "*S-K102*H-A93*D-J104*C-A1083",
    matchBidding: "_/1♣/P/1♥/2♠/?",
    dealer: "South",
    bidding: "_/_/_/1♣/P/1♥/2♠/?",
  },
  { south: "*S-2*H-KQ102*D-AJ43*C-K942", dealer: "East", bidding: "_/_/1♠/X/4♠/X/P/?" },
  { south: "*S-KQ104*H-1082*D-AK104*C-Q2", dealer: "West", bidding: "1♥/X/P/?" },
  { south: "*S-102*H-K103*D-AK42*C-K1042", dealer: "West", bidding: "1♠/X/2♠/X/3♠/P/P/X" },
  { south: "*S-K1042*H-A10*D-1042*C-AQ94", dealer: "West", bidding: "1♣/X/1♥/X/2♣/P/P/X" },
];

function rewriteTag(tag, dealer, bidding) {
  let out = tag;
  if (/dealer="[^"]*"/.test(out)) {
    out = out.replace(/dealer="[^"]*"/, `dealer="${dealer}"`);
  } else {
    out = out.replace(/\s*\/>$/, ` dealer="${dealer}" />`);
  }
  if (/bidding="[^"]*"/.test(out)) {
    out = out.replace(/bidding="[^"]*"/, `bidding="${bidding}"`);
  } else {
    out = out.replace(/\s*\/>$/, ` bidding="${bidding}" />`);
  }
  return out;
}

function transform(text) {
  const tagRe = /<MakeBoard[^>]*\/>/g;
  let changes = [];
  const out = text.replace(tagRe, (tag) => {
    const south = (tag.match(/South="([^"]*)"/) || [])[1];
    const bidding = (tag.match(/bidding="([^"]*)"/) || [])[1];
    const target = TARGETS.find(
      (t) =>
        t.south === south &&
        (t.matchBidding ? t.matchBidding === bidding : true)
    );
    if (!target) return tag;
    const next = rewriteTag(tag, target.dealer, target.bidding);
    if (next !== tag) changes.push({ south, from: bidding, to: target.bidding, dealer: target.dealer });
    return next;
  });
  return { out, changes };
}

async function runFirestore(apply) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath(), "utf8"))),
  });
  const db = admin.firestore();
  const FieldValue = admin.firestore.FieldValue;
  const ref = db.collection("biddingBody").doc(CANONICAL_BODY_ID);
  const text = (await ref.get()).data()?.text || "";
  const { out, changes } = transform(text);
  console.log("Firestore changes:");
  changes.forEach((c) =>
    console.log(`  ${c.south} | ${c.from} -> ${c.to} (dealer=${c.dealer})`)
  );
  if (!apply) {
    console.log("(dry run, Firestore not written)");
    return;
  }
  await ref.set(
    { text: out, body: { text: out }, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  console.log("Firestore updated biddingBody/" + CANONICAL_BODY_ID);
}

function runLocalFile(relPath, apply) {
  const p = path.join(__dirname, "..", relPath);
  if (!fs.existsSync(p)) {
    console.log(`(skip) ${relPath} not found`);
    return;
  }
  const raw = fs.readFileSync(p, "utf8");
  // JSON payload stores HTML with escaped quotes; transform after parse if JSON.
  if (relPath.endsWith(".json")) {
    const j = JSON.parse(raw);
    const key = Object.keys(j).find(
      (k) => typeof j[k] === "string" && j[k].includes("<MakeBoard")
    );
    if (!key) {
      console.log(`(skip) ${relPath}: no MakeBoard field`);
      return;
    }
    const { out, changes } = transform(j[key]);
    console.log(`${relPath} (${key}) changes: ${changes.length}`);
    if (apply && changes.length) {
      j[key] = out;
      fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n", "utf8");
      console.log(`  wrote ${relPath}`);
    }
    return;
  }
  const { out, changes } = transform(raw);
  console.log(`${relPath} changes: ${changes.length}`);
  if (apply && changes.length) {
    fs.writeFileSync(p, out, "utf8");
    console.log(`  wrote ${relPath}`);
  }
}

async function main() {
  const apply = process.argv.includes("--apply");
  await runFirestore(apply);
  runLocalFile("docs/article-drafts/takeout-doubles-complete-guide-body.html", apply);
  runLocalFile("docs/article-payloads/bcb-07-takeout-doubles.json", apply);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
