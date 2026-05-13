/**
 * No-Firestore smoke test for scripts/lib/body-field.js. Run locally to
 * confirm the extractor and writer handle every shape correctly.
 *
 *   node scripts/test-body-field.js
 */

const { extractBodyHtml, buildBodyUpdate, buildPreservingBodyUpdate } = require("./lib/body-field");

let pass = 0;
let fail = 0;
function check(name, ok, extra) {
  if (ok) {
    pass++;
    console.log(`  ok    ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name}` + (extra ? ` :: ${extra}` : ""));
  }
}

console.log("extractBodyHtml:");
{
  const r = extractBodyHtml({ text: "<p>hi</p>" });
  check("flat-text shape", r.shape === "flat-text" && r.html === "<p>hi</p>");
}
{
  const r = extractBodyHtml({ body: "<p>flat body string</p>" });
  check("flat-body shape", r.shape === "flat-body" && r.html === "<p>flat body string</p>");
}
{
  const r = extractBodyHtml({ body: { text: "<p>nested</p>" } });
  check("nested shape", r.shape === "nested" && r.html === "<p>nested</p>");
}
{
  const r = extractBodyHtml({});
  check("empty doc → missing", r.shape === "missing" && r.html === "");
}
{
  // both shapes present: prefer flat-text (mirrors front-end DisplayCategoryArticle)
  const r = extractBodyHtml({ text: "FLAT", body: { text: "NESTED" } });
  check("both shapes → flat wins", r.shape === "flat-text" && r.html === "FLAT");
}
{
  const r = extractBodyHtml({ text: "" }); // empty string = treat as missing
  check("empty string text → missing", r.shape === "missing" && r.html === "");
}
{
  const r = extractBodyHtml(null);
  check("null doc → missing", r.shape === "missing");
}

console.log("\nbuildBodyUpdate:");
{
  const u = buildBodyUpdate("flat-text", "<p>x</p>");
  check("flat-text writes to text", u.text === "<p>x</p>" && !("body" in u));
}
{
  const u = buildBodyUpdate("flat-body", "<p>x</p>");
  check("flat-body writes to body", u.body === "<p>x</p>" && !("text" in u));
}
{
  const u = buildBodyUpdate("nested", "<p>x</p>");
  check(
    "nested writes to body.text dotted path",
    u["body.text"] === "<p>x</p>" && !("text" in u) && !("body" in u)
  );
}
{
  const u = buildBodyUpdate("missing", "<p>x</p>");
  check("missing → defaults to flat-text", u.text === "<p>x</p>");
}

console.log("\nbuildPreservingBodyUpdate:");
{
  const u = buildPreservingBodyUpdate({ text: "<p>old</p>" }, "<p>new</p>");
  check("flat only → writes text", u.text === "<p>new</p>" && !("body.text" in u));
}
{
  const u = buildPreservingBodyUpdate({ body: { text: "<p>old</p>" } }, "<p>new</p>");
  check(
    "nested only → writes body.text",
    u["body.text"] === "<p>new</p>" && !("text" in u)
  );
}
{
  // Double-shape: should mirror to both fields
  const u = buildPreservingBodyUpdate(
    { text: "<p>old</p>", body: { text: "<p>old</p>" } },
    "<p>new</p>"
  );
  check(
    "double-shape → writes both",
    u.text === "<p>new</p>" && u["body.text"] === "<p>new</p>"
  );
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
