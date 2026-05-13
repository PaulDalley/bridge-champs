/**
 * Read-only analysis of the href-cleanup backup file. Classifies every
 * "before" originalText as either:
 *   - "json-shape" (begins with {"text":) — means the script JSON-stringified
 *     a nested {text: "..."} object before writing, indicating CORRUPTION.
 *   - "html-shape" (begins with HTML or whitespace) — means the doc's
 *     primary string was a plain HTML body. Safe.
 */

const fs = require("fs");
const path = require("path");

const BACKUP = path.join("docs", "seo", "href-cleanup-backup-2026-05-12.jsonl");
const lines = fs
  .readFileSync(BACKUP, "utf8")
  .split(/\r?\n/)
  .filter(Boolean);

console.log(`Total backup rows: ${lines.length}`);

const byCol = {};
const jsonShape = [];
const htmlShape = [];

for (const l of lines) {
  let r;
  try {
    r = JSON.parse(l);
  } catch (e) {
    console.log("Bad JSON line, skipping");
    continue;
  }
  const col = r.collection || "?";
  byCol[col] = (byCol[col] || 0) + 1;
  const t = (r.originalText || "").slice(0, 60);
  // The corrupted-shape indicator: a JSON object literal of the form
  // {"text":" or {"text":\\"
  if (/^\s*\{\s*"text"\s*:/.test(t)) {
    jsonShape.push({ col, id: r.docId, field: r.field, head: t });
  } else {
    htmlShape.push({ col, id: r.docId, field: r.field, head: t });
  }
}

console.log("\nPer collection:");
for (const k of Object.keys(byCol).sort()) console.log("  ", k, byCol[k]);

console.log(`\nJSON-shape originalText (POTENTIALLY CORRUPTED): ${jsonShape.length}`);
for (const r of jsonShape.slice(0, 30)) {
  console.log(`   ${r.col}/${r.id}  field=${r.field}  head=${JSON.stringify(r.head)}`);
}

console.log(`\nHTML-shape originalText (safe): ${htmlShape.length}`);
for (const r of htmlShape.slice(0, 5)) {
  console.log(`   ${r.col}/${r.id}  field=${r.field}  head=${JSON.stringify(r.head)}`);
}
