/**
 * Wrap ♥ and ♦ in red-suit spans for a Firestore article body (same logic as prepareArticleString).
 * Usage: node scripts/color-red-suits-in-article-body.js [bodyDocId]
 * Default: yt6au7gwYwPahTxQ4kd5 (takeout doubles guide)
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (!fs.existsSync(keyPath)) throw new Error("Missing serviceAccountKey.json");

const bodyId = process.argv[2] || "yt6au7gwYwPahTxQ4kd5";

const iterativelyReplace = (string, suit) => {
  let oldString = string;
  let newString = "";
  let indexOf = oldString.indexOf(suit);
  while (indexOf !== -1) {
    newString += oldString.slice(0, indexOf);
    oldString = oldString.slice(indexOf + 1);
    if (oldString.slice(0, 7) !== "</span>" && oldString[0] !== "/" && oldString[0] !== '"') {
      newString += `<span class="red-suit">${suit}</span>`;
    } else {
      newString += suit;
    }
    indexOf = oldString.indexOf(suit);
  }
  if (newString === "") return oldString;
  return newString + oldString;
};

const replaceSuitMacros = (substr) => {
  switch (substr) {
    case "!c":
    case "!C":
      return "♣";
    case "!d":
    case "!D":
      return "♦";
    case "!h":
    case "!H":
      return "♥";
    case "!s":
    case "!S":
      return "♠";
    default:
      return substr;
  }
};

const replaceDiamondsAndHearts = (substr) => {
  if (substr.includes("MakeBoard")) return substr;
  let newStr = iterativelyReplace(substr, "♥");
  newStr = iterativelyReplace(newStr, "♦");
  return newStr;
};

const prepareArticleString = (article) =>
  article
    .split("&gt;")
    .join(">")
    .split("&lt;")
    .join("<")
    .split(/(![shcdSHCD])/)
    .map((substr) => replaceSuitMacros(substr))
    .join("")
    .split(/(<MakeBoard .* \/>)/)
    .map((substr) => replaceDiamondsAndHearts(substr))
    .join("");

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(fs.readFileSync(keyPath, "utf8"))),
});

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

async function main() {
  const ref = db.collection("biddingBody").doc(bodyId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("biddingBody/" + bodyId + " not found");
  const text = snap.data()?.text || "";
  const out = prepareArticleString(text);
  if (out === text) {
    console.log("No changes (hearts/diamonds already styled or none found).");
    return;
  }
  await ref.set(
    { text: out, body: { text: out }, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );
  console.log("Updated biddingBody/" + bodyId + " with red hearts/diamonds.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
