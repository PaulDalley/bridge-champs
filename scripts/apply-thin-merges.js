/**
 * Apply the thin-article merges defined in scripts/plan-thin-merges.js.
 * For each pair:
 *   1. Strip trailing "Where to next" / "Try this..." nav blocks from both
 *      bodies so the merged article doesn't end up with two nav sections.
 *   2. Build merged HTML: primary body + secondary body's H2 sections (the
 *      H2 acts as the section divider in the merged article). Append a
 *      single "Where to next" block at the bottom built from both
 *      bodies' nav links (deduped).
 *   3. Update primary summary: title := proposedMergedTitle (if user
 *      didn't already rename), updatedAt bumped, mergedFromAt timestamp.
 *   4. Update primary body: writes back to the same shape the body was
 *      already using (flat-text or nested) via buildBodyUpdate.
 *   5. Update secondary summary: redirectTo = primary URL, plus a small
 *      flag mergedIntoAt for forensics.
 *   6. Replace secondary body with a one-line "this article moved →"
 *      stub. Same shape preserved.
 *
 * Backups: every prior summary AND body for both members of each pair is
 * appended to docs/seo/thin-merges-backup-<date>.jsonl BEFORE any write.
 *
 * Idempotent: re-running detects already-merged pairs (secondary has
 * redirectTo set + body looks like the stub) and skips them.
 *
 *   node scripts/apply-thin-merges.js                  # dry-run report only
 *   node scripts/apply-thin-merges.js --apply          # confirm via flag
 *   node scripts/apply-thin-merges.js --apply --confirm  # actually write
 *   node scripts/apply-thin-merges.js --apply --confirm --pairs 1   # only pair #1 (1-indexed)
 */

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

const APPLY = process.argv.includes("--apply");
const CONFIRM = process.argv.includes("--confirm");
const PAIRS_FILTER_RAW = getArgValue("--pairs");
const PAIRS_FILTER = PAIRS_FILTER_RAW
  ? PAIRS_FILTER_RAW.split(",").map((x) => parseInt(x.trim(), 10)).filter((n) => !Number.isNaN(n))
  : null;

if (!APPLY) {
  console.error("Refusing to run without --apply. Add --confirm to actually write.");
  process.exit(1);
}

const keyPath = resolveServiceAccountPath();
if (!keyPath || !fs.existsSync(keyPath)) {
  console.error("No service account JSON found.");
  process.exit(1);
}
const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const COLLECTION_INFO = {
  beginnerBidding: {
    body: "beginnerBiddingBody",
    pathPrefix: "/beginner/articles/bidding",
  },
  beginnerCardPlay: {
    body: "beginnerCardPlayBody",
    pathPrefix: "/beginner/articles/declarer",
  },
  beginnerDefence: {
    body: "beginnerDefenceBody",
    pathPrefix: "/beginner/articles/defence",
  },
};

// Mirror the pair list from plan-thin-merges.js. The "primary" key marks
// which member of the pair survives (URL preserved). If "primary" is "a",
// member a is the surviving URL; otherwise b.
const PAIRS = [
  {
    cluster: "1NT Opening basics",
    proposedMergedTitle: "Opening 1NT for Beginners: When to Open and When Not to",
    primary: "a", // 233w, equal inbound
    a: { collection: "beginnerBidding", bodyId: "f4BeQ2lU5niFCt0ecmnv" }, // When Not to
    b: { collection: "beginnerBidding", bodyId: "0gF8pSxK8GB2bhguAqD3" }, // What it Promises
  },
  {
    cluster: "Opening bids: shape decisions",
    proposedMergedTitle: "Opening Bids for Beginners: Balanced Hands and the 5-Card Major Rule",
    primary: "a",
    a: { collection: "beginnerBidding", bodyId: "tRq9HH7X05xnHb8Xk5vM" }, // Balanced Hands (4 inbound)
    b: { collection: "beginnerBidding", bodyId: "LGe2nLZP7N7kjOW5TCL3" }, // 5-Card Major
  },
  {
    cluster: "Responder's first bid",
    proposedMergedTitle: "Responder's First Bid for Beginners: Raise, New Suit, or No-Trump",
    primary: "a",
    a: { collection: "beginnerBidding", bodyId: "CP4GjQyfwNbuvq2tNpl8" }, // New Suit / NT (3 inbound)
    b: { collection: "beginnerBidding", bodyId: "rdpqzrboMvy6WBYmkUFT" }, // Raise Partner
  },
  {
    cluster: "Opener's rebid",
    proposedMergedTitle: "Opener's Rebid for Beginners: Choosing Suit, NT, or Strength",
    primary: "a",
    a: { collection: "beginnerBidding", bodyId: "5fUXLlFamO5mJ3toLQIu" }, // Min/Invite/Game (494w)
    b: { collection: "beginnerBidding", bodyId: "go3GF9ek5LqYpVIG5lUj" }, // 1NT or Second Suit
  },
  {
    cluster: "Direction of opening lead",
    proposedMergedTitle: "Opening Lead Direction for Beginners: Towards Weakness or Through Strength",
    primary: "a",
    a: { collection: "beginnerDefence", bodyId: "cz1pE4MdKTEAGpY7jPwf" }, // Through Strength (446w)
    b: { collection: "beginnerDefence", bodyId: "RLX0PHnm8aAxyoNXJwEp" }, // Towards Weakness
  },
  {
    cluster: "Third Hand High",
    proposedMergedTitle: "Third Hand High for Beginners: When to Play Your Best Card",
    primary: "a",
    a: { collection: "beginnerDefence", bodyId: "Y5xcpnE2hne3WbJph2JX" }, // Why Best Card (2 inbound)
    b: { collection: "beginnerDefence", bodyId: "Aqr7mZBvcZqR0plKtB3Y" }, // When/Hold Up
  },
  {
    cluster: "Opening leads (NT vs trumps)",
    proposedMergedTitle: "Opening Leads for Beginners: Top of a Sequence and Longest Suit in No-Trump",
    primary: "a",
    a: { collection: "beginnerDefence", bodyId: "AjesFBfz7ew7gIXm0DLT" }, // Longest Suit NT (3 inbound)
    b: { collection: "beginnerDefence", bodyId: "TiXM47rVH87RqmyCzQaU" }, // Top of Sequence
  },
  {
    cluster: "Second Hand Low",
    proposedMergedTitle: "Second Hand Low for Beginners: The Default and Its Exceptions",
    primary: "a",
    a: { collection: "beginnerDefence", bodyId: "NjEmZETCrS6FtvJyRp4O" }, // Why Low (456w)
    b: { collection: "beginnerDefence", bodyId: "icK5fldwl4EBZbqRV5Sm" }, // Exceptions
  },
  {
    cluster: "Finesses",
    proposedMergedTitle: "Finesses for Beginners: Single, Double, and Leading Low Toward Honors",
    primary: "a",
    a: { collection: "beginnerCardPlay", bodyId: "7nKvD5E5BYBrkAX1lmFS" }, // Low Towards Honors (2 inbound)
    b: { collection: "beginnerCardPlay", bodyId: "3u1r8dH5sFpYnELlOM5l" }, // Finesse and Double
  },
];

function findSummaryDocByBodyId(collection, bodyId) {
  return db
    .collection(collection)
    .where("body", "==", bodyId)
    .get()
    .then(async (qs) => {
      if (!qs.empty) return qs.docs[0];
      const direct = await db.collection(collection).doc(bodyId).get();
      if (direct.exists) return direct;
      return null;
    });
}

async function fetchOne({ collection, bodyId }) {
  const cfg = COLLECTION_INFO[collection];
  const summaryDoc = await findSummaryDocByBodyId(collection, bodyId);
  if (!summaryDoc) {
    return { missing: true, bodyId, collection };
  }
  const summary = summaryDoc.data() || {};
  const bodySnap = await db.collection(cfg.body).doc(bodyId).get();
  const bodyData = bodySnap.exists ? bodySnap.data() || {} : {};
  const { html, shape } = extractBodyHtml(bodyData);
  // Track whether the doc carries the legacy double-shape so writes can
  // mirror to both fields and not leave a stale copy behind.
  const hasNestedSibling =
    !!bodyData.body && typeof bodyData.body === "object" && typeof bodyData.body.text === "string";
  return {
    collection,
    bodyCollection: cfg.body,
    pathPrefix: cfg.pathPrefix,
    summaryId: summaryDoc.id,
    bodyId,
    summary,
    bodyData,
    bodyHtml: html,
    bodyShape: shape,
    hasNestedSibling,
    url: `${cfg.pathPrefix}/${bodyId}`,
  };
}


// The original beginner HTML has a recurring authoring bug: two consecutive
// opening <h3> tags before each section heading (e.g. "<h3>\n<h3>Practical
// checklist</h3>"). Collapse those down to a single open tag.
function fixDoubleOpenH3(html) {
  if (!html) return html;
  return String(html).replace(/<h3[^>]*>\s*(<h3[^>]*>)/gi, "$1");
}

// Strip the trailing "Where to next" / "Try this at the table" / "Drill it
// in the trainer" sections so we can append a single deduped block at the
// bottom of the merged article. Match starts at an <h3> or <h2> with
// matching heading text and grabs everything from there to end-of-string.
function stripTrailingNav(html) {
  if (!html) return html;
  // Run double-h3 cleanup first so the regex below doesn't trip on a bare
  // <h3> that has no text inside.
  const cleaned = fixDoubleOpenH3(html);
  const re =
    /<(h2|h3)[^>]*>\s*(?:where to next|where next|read next|try this at the table|drill it in the trainer)[\s\S]*$/i;
  const out = cleaned.replace(re, "").trim();
  return out;
}

// Extract the trailing nav block (links list) from a body so we can merge
// nav sections across both halves.
function extractTrailingNavList(html) {
  if (!html) return [];
  const navMatch = html.match(
    /<(h2|h3)[^>]*>\s*(?:where to next|where next|read next|drill it in the trainer)[^<]*<\/\1>\s*([\s\S]*?)(?=<(?:h2|h3)\b|$)/i
  );
  if (!navMatch) return [];
  const ulMatch = navMatch[2].match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
  if (!ulMatch) return [];
  const items = [];
  const li = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m;
  while ((m = li.exec(ulMatch[1]))) {
    items.push(m[1].trim());
  }
  return items;
}

function buildMergedNav(itemsA, itemsB, hubPath, selfUrls = []) {
  const seen = new Set();
  const out = [];
  for (const url of selfUrls) {
    if (url) seen.add(url); // pre-block self-references
  }
  for (const it of [...itemsA, ...itemsB]) {
    const m = it.match(/href=["']([^"']+)["']/i);
    const key = (m && m[1]) || it.toLowerCase();
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  if (hubPath && !seen.has(hubPath)) {
    out.push(`<a href="${hubPath}">Back to all articles</a>`);
    seen.add(hubPath);
  }
  return out;
}

function looksLikeAlreadyMerged(secondaryHtml) {
  return /this article (has\s+)?moved/i.test(String(secondaryHtml || ""));
}

function buildSecondaryStub(primaryUrl, primaryTitle) {
  return [
    `<p>This article has been combined with another in the same series. The full content has moved to <a href="${primaryUrl}">${primaryTitle} →</a>.</p>`,
    `<p>If your link brought you here, follow the link above — your browser should redirect automatically.</p>`,
  ].join("\n");
}

function buildMergedBody({ primary, secondary, hubPath }) {
  const primaryNavItems = extractTrailingNavList(primary.bodyHtml);
  const secondaryNavItems = extractTrailingNavList(secondary.bodyHtml);

  const primaryStripped = stripTrailingNav(primary.bodyHtml);
  const secondaryStripped = stripTrailingNav(secondary.bodyHtml);

  const mergedNavItems = buildMergedNav(
    primaryNavItems,
    secondaryNavItems,
    hubPath,
    [primary.url, secondary.url]
  );
  const navList = mergedNavItems.length
    ? `<ul>\n${mergedNavItems.map((it) => `<li>${it}</li>`).join("\n")}\n</ul>`
    : "";

  // The two halves: primary keeps its own structure; secondary gets prefixed
  // with a transition note so the reader knows where the new section starts.
  const secondaryIntro = `<p><em>The next section was originally a separate beginner article on the same topic — combined here for easier reading.</em></p>`;
  return [
    primaryStripped.trim(),
    secondaryIntro,
    secondaryStripped.trim(),
    `<h3>Where to next</h3>`,
    navList,
  ]
    .filter(Boolean)
    .join("\n");
}

async function processPair(pair, idx) {
  const a = await fetchOne(pair.a);
  const b = await fetchOne(pair.b);
  if (a.missing || b.missing) {
    return { skipped: true, reason: "missing", pair };
  }

  const primary = pair.primary === "a" ? a : b;
  const secondary = pair.primary === "a" ? b : a;

  // Idempotence guard: if the secondary already redirects to the primary,
  // we've already merged this pair. Skip.
  if (
    secondary.summary.redirectTo === primary.url &&
    looksLikeAlreadyMerged(secondary.bodyHtml)
  ) {
    return { skipped: true, reason: "already-merged", pair };
  }

  const hubPath = primary.pathPrefix;
  const mergedBody = buildMergedBody({ primary, secondary, hubPath });
  const secondaryStub = buildSecondaryStub(primary.url, pair.proposedMergedTitle);

  return {
    pair,
    idx,
    primary,
    secondary,
    mergedBody,
    secondaryStub,
    summaryUpdatePrimary: {
      title: pair.proposedMergedTitle,
      mergedFromAt: new Date().toISOString(),
    },
    summaryUpdateSecondary: {
      redirectTo: primary.url,
      mergedIntoAt: new Date().toISOString(),
    },
  };
}

async function run() {
  const today = new Date().toISOString().slice(0, 10);
  const outDir = path.join(__dirname, "..", "docs", "seo");
  fs.mkdirSync(outDir, { recursive: true });
  const reportPath = path.join(
    outDir,
    `thin-merges-${CONFIRM ? "applied" : "dry-run"}-${today}.md`
  );
  const backupPath = path.join(outDir, `thin-merges-backup-${today}.jsonl`);

  let backupStream = null;
  if (CONFIRM) backupStream = fs.createWriteStream(backupPath, { flags: "w" });

  const reportLines = [];
  reportLines.push(
    `# Thin merges — ${CONFIRM ? "APPLIED" : "DRY-RUN"} ${today}`,
    "",
    CONFIRM
      ? `Backup of every prior summary + body written to \`${path.relative(
          path.join(__dirname, ".."),
          backupPath
        )}\`.`
      : "Dry run only. Re-run with --apply --confirm to write.",
    ""
  );

  let processed = 0;
  let skipped = 0;
  let written = 0;

  for (let i = 0; i < PAIRS.length; i++) {
    const oneIndexed = i + 1;
    if (PAIRS_FILTER && !PAIRS_FILTER.includes(oneIndexed)) continue;
    const pair = PAIRS[i];
    const r = await processPair(pair, oneIndexed);

    if (r.skipped) {
      skipped++;
      reportLines.push(`## ${oneIndexed}. ${pair.cluster}\n\nSkipped — ${r.reason}.\n`);
      continue;
    }

    processed++;
    const { primary, secondary, mergedBody, secondaryStub } = r;

    reportLines.push(`## ${oneIndexed}. ${pair.cluster}`);
    reportLines.push("");
    reportLines.push(
      `- Primary (kept) — \`${primary.url}\` "${primary.summary.title || ""}"`
    );
    reportLines.push(
      `- Secondary (redirects to primary) — \`${secondary.url}\` "${
        secondary.summary.title || ""
      }"`
    );
    reportLines.push(
      `- New title for primary: **${pair.proposedMergedTitle}**`
    );
    reportLines.push(
      `- Primary body before: ${primary.bodyHtml.length} chars; after merge: ${mergedBody.length} chars`
    );
    reportLines.push(
      `- Secondary body replaced with redirect stub (${secondaryStub.length} chars)`
    );
    reportLines.push("");

    if (CONFIRM) {
      // Backup BEFORE any write so we can roll back from a single file.
      backupStream.write(
        JSON.stringify({
          ts: new Date().toISOString(),
          pair: pair.cluster,
          primary: {
            collection: primary.collection,
            bodyCollection: primary.bodyCollection,
            summaryId: primary.summaryId,
            bodyId: primary.bodyId,
            url: primary.url,
            previousSummary: primary.summary,
            previousBodyShape: primary.bodyShape,
            previousBodyHtml: primary.bodyHtml,
          },
          secondary: {
            collection: secondary.collection,
            bodyCollection: secondary.bodyCollection,
            summaryId: secondary.summaryId,
            bodyId: secondary.bodyId,
            url: secondary.url,
            previousSummary: secondary.summary,
            previousBodyShape: secondary.bodyShape,
            previousBodyHtml: secondary.bodyHtml,
          },
        }) + "\n"
      );

      // Primary: title + body update preserving body shape (and mirroring
      // any legacy double-shape body.text sibling).
      const primaryBodyUpdate = buildPreservingBodyUpdate(primary.bodyData, mergedBody);
      await db
        .collection(primary.collection)
        .doc(primary.summaryId)
        .update({
          title: r.summaryUpdatePrimary.title,
          mergedFromAt: r.summaryUpdatePrimary.mergedFromAt,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      await db
        .collection(primary.bodyCollection)
        .doc(primary.bodyId)
        .update({
          ...primaryBodyUpdate,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      // Secondary: redirectTo on summary, stub on body.
      const secondaryBodyUpdate = buildPreservingBodyUpdate(secondary.bodyData, secondaryStub);
      await db
        .collection(secondary.collection)
        .doc(secondary.summaryId)
        .update({
          redirectTo: r.summaryUpdateSecondary.redirectTo,
          mergedIntoAt: r.summaryUpdateSecondary.mergedIntoAt,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      await db
        .collection(secondary.bodyCollection)
        .doc(secondary.bodyId)
        .update({
          ...secondaryBodyUpdate,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      written++;
      reportLines.push(`Status: WROTE.\n`);
    } else {
      reportLines.push(`Status: would write (dry-run).\n`);
      reportLines.push("### Merged primary HTML preview\n");
      reportLines.push("```html");
      reportLines.push(mergedBody);
      reportLines.push("```\n");
      reportLines.push("### Secondary stub preview\n");
      reportLines.push("```html");
      reportLines.push(secondaryStub);
      reportLines.push("```\n");
    }
  }

  reportLines.unshift(
    `Processed: ${processed}, skipped: ${skipped}, written: ${written}\n`
  );
  fs.writeFileSync(reportPath, reportLines.join("\n"), "utf8");

  if (backupStream) backupStream.end();
  console.log(`Report → ${path.relative(path.join(__dirname, ".."), reportPath)}`);
  console.log(
    `Processed ${processed}, skipped ${skipped}, written ${written}`
  );
}

run().then(
  () => process.exit(0),
  (err) => {
    console.error("Apply failed:", err);
    process.exit(1);
  }
);
