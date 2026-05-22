const admin = require("firebase-admin");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { extractBodyHtml, buildPreservingBodyUpdate } = require("./lib/body-field");

function getArgValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return null;
  const v = process.argv[i + 1];
  if (!v || v.startsWith("-")) return null;
  return v;
}

function resolveServiceAccountPath() {
  const fromFlag = getArgValue("--key");
  if (fromFlag) return path.resolve(fromFlag);
  if (process.env.FIREBASE_SERVICE_ACCOUNT)
    return path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT);
  const downloadsSpaced = path.join(os.homedir(), "Downloads", "firebase key.json");
  if (fs.existsSync(downloadsSpaced)) return downloadsSpaced;
  const downloadsSdk = path.join(
    os.homedir(),
    "Downloads",
    "bridgechampions-firebase-adminsdk-fbsvc-a2157e530a.json"
  );
  if (fs.existsSync(downloadsSdk)) return downloadsSdk;
  const root = path.join(__dirname, "..", "serviceAccountKey.json");
  if (fs.existsSync(root)) return root;
  return null;
}

const PRIMARY_TITLE = "How to Improve at Bridge: A Practical Roadmap That Actually Works";
const PRIMARY_URL = "/beginner/articles/bidding/ZsSdKmV4CPegXfhMYSwy";

const SECONDARIES = [
  {
    collection: "beginnerDefence",
    bodyCollection: "beginnerDefenceBody",
    summaryId: "D7mWjqrNQn65ZIXEmbBQ",
    url: "/beginner/articles/defence/D7mWjqrNQn65ZIXEmbBQ",
  },
  {
    collection: "beginnerCardPlay",
    bodyCollection: "beginnerCardPlayBody",
    summaryId: "bSuA1sc9p15HkfFrkOMZ",
    url: "/beginner/articles/declarer/bSuA1sc9p15HkfFrkOMZ",
  },
];

function buildSecondaryStub(primaryUrl, primaryTitle) {
  return [
    `<p>This article has been combined with another in the same series. The full content has moved to <a href="${primaryUrl}">${primaryTitle} &rarr;</a>.</p>`,
    `<p>If your link brought you here, follow the link above &mdash; your browser should redirect automatically.</p>`,
  ].join("\n");
}

async function main() {
  const APPLY = process.argv.includes("--apply");
  const keyPath = resolveServiceAccountPath();
  if (!keyPath || !fs.existsSync(keyPath)) {
    console.error("No service account JSON found.");
    process.exit(1);
  }
  const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
  admin.initializeApp({ credential: admin.credential.cert(key) });
  const db = admin.firestore();
  const FieldValue = admin.firestore.FieldValue;

  console.log(`Mode: ${APPLY ? "APPLY" : "DRY-RUN"}`);
  console.log(`Primary (canonical): ${PRIMARY_URL}`);

  for (const sec of SECONDARIES) {
    const summaryRef = db.collection(sec.collection).doc(sec.summaryId);
    const summarySnap = await summaryRef.get();
    if (!summarySnap.exists) {
      console.error(`  ! ${sec.url} summary not found, skipping`);
      continue;
    }
    const summary = summarySnap.data() || {};
    const bodyId = summary.body;
    if (!bodyId) {
      console.error(`  ! ${sec.url} has no body id, skipping`);
      continue;
    }
    const bodyRef = db.collection(sec.bodyCollection).doc(bodyId);
    const bodySnap = await bodyRef.get();
    const bodyData = bodySnap.exists ? bodySnap.data() || {} : {};
    void extractBodyHtml; // keep import side-effect-free; helper used implicitly via buildPreservingBodyUpdate

    console.log(`- ${sec.url}`);
    console.log(`    will set redirectTo -> ${PRIMARY_URL}`);
    if (summary.redirectTo === PRIMARY_URL) {
      console.log(`    already redirected; will refresh stub`);
    }

    if (!APPLY) continue;

    const stubHtml = buildSecondaryStub(PRIMARY_URL, PRIMARY_TITLE);
    const bodyUpdate = buildPreservingBodyUpdate(bodyData, stubHtml);

    const batch = db.batch();
    batch.set(
      summaryRef,
      {
        redirectTo: PRIMARY_URL,
        mergedIntoAt: new Date().toISOString(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    batch.set(
      bodyRef,
      { ...bodyUpdate, updatedAt: FieldValue.serverTimestamp() },
      { merge: true }
    );
    await batch.commit();
    console.log(`    applied.`);
  }

  console.log(`Done. ${APPLY ? "Live in Firestore." : "Dry run only - re-run with --apply."}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
