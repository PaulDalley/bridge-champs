/**
 * Export all Firebase Auth user emails to a file.
 * Run: node scripts/export-user-emails.js
 *
 * Setup: Download a service account key from Firebase Console:
 *   1. Project Settings → Service accounts → Generate new private key
 *   2. Save as: bridge-champs/ishbridge-41/serviceAccountKey.json
 *   3. Add serviceAccountKey.json to .gitignore (never commit it!)
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Path to service account key - download from Firebase Console
const keyPath = path.join(__dirname, "..", "serviceAccountKey.json");

if (!fs.existsSync(keyPath)) {
  console.error(
    "\nMissing service account key. Steps:\n" +
      "1. Go to https://console.firebase.google.com\n" +
      "2. Select project 'bridgechampions'\n" +
      "3. Project Settings (gear) → Service accounts\n" +
      "4. Click 'Generate new private key'\n" +
      "5. Save the file as: bridge-champs/ishbridge-41/serviceAccountKey.json\n" +
      "6. Add serviceAccountKey.json to .gitignore\n"
  );
  process.exit(1);
}

const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(key) });

/** List all Auth users; if sinceMonthsAgo is set, only users created in the last N months. */
async function listAllUsers(sinceMonthsAgo = null) {
  const emails = [];
  let nextPageToken;
  const cutoff = sinceMonthsAgo != null
    ? new Date(Date.now() - sinceMonthsAgo * 30 * 24 * 60 * 60 * 1000)
    : null;

  do {
    const result = await admin.auth().listUsers(1000, nextPageToken);
    result.users.forEach((u) => {
      if (!u.email) return;
      if (cutoff) {
        const created = u.metadata?.creationTime ? new Date(u.metadata.creationTime) : null;
        if (!created || created < cutoff) return;
      }
      emails.push(u.email);
    });
    nextPageToken = result.pageToken;
  } while (nextPageToken);

  return emails;
}

async function main() {
  const sinceMonths = 6;
  const emails = await listAllUsers(sinceMonths);

  const commaList = emails.join(", ");
  const onePerLine = emails.join("\n");

  const outDir = path.join(__dirname, "..");
  fs.writeFileSync(path.join(outDir, "user-emails-comma.txt"), commaList);
  fs.writeFileSync(path.join(outDir, "user-emails-list.txt"), onePerLine);

  console.log(`Exported ${emails.length} emails (accounts created in the last ${sinceMonths} months).`);
  console.log(`  - user-emails-comma.txt  (paste into BCC)`);
  console.log(`  - user-emails-list.txt   (one per line)\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
