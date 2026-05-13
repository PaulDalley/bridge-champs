/**
 * Robust extractor + writer for article body HTML across all collections.
 *
 * Body documents in Firestore use one of three shapes depending on which
 * editor (legacy or V2) created them:
 *
 *   - flat-text: { text: "<p>..." }
 *   - flat-body: { body: "<p>..." }
 *   - nested:    { body: { text: "<p>..." } }
 *
 * Old scripts that did `data.text || data.body` blew up on the nested shape:
 * `data.body` is an object truthy value, then String() on it produced
 * "[object Object]" — exactly the symptom that caused the SEO audit to
 * report Drawing Trumps / Ruff in Dummy / Low Towards Honors as 2-word
 * articles when they actually had hundreds of words of content.
 *
 * Use these helpers everywhere we need to read or write the body HTML.
 */

function extractBodyHtml(data) {
  if (!data || typeof data !== "object") return { html: "", shape: "missing" };
  if (typeof data.text === "string" && data.text.length > 0) {
    return { html: data.text, shape: "flat-text" };
  }
  if (typeof data.body === "string" && data.body.length > 0) {
    return { html: data.body, shape: "flat-body" };
  }
  if (data.body && typeof data.body === "object" && typeof data.body.text === "string") {
    return { html: data.body.text, shape: "nested" };
  }
  return { html: "", shape: "missing" };
}

/**
 * Given the previously-detected shape and a new HTML string, return a
 * partial update object that writes the HTML to the same field path the
 * doc originally used. This preserves shape so the front-end keeps
 * rendering the article correctly.
 *
 * For shape="missing" we default to the modern flat-text shape.
 */
function buildBodyUpdate(shape, newHtml) {
  switch (shape) {
    case "flat-text":
      return { text: newHtml };
    case "flat-body":
      return { body: newHtml };
    case "nested":
      // Use a Firestore field-path update so we don't clobber siblings of
      // body.text. Caller can spread this into their .update() / .set().
      return { "body.text": newHtml };
    case "missing":
    default:
      return { text: newHtml };
  }
}

/**
 * Many older docs were written with BOTH a flat `text` field AND a nested
 * `body.text` field carrying the same content (legacy belt-and-suspenders).
 * Writing only to the primary shape leaves the sibling stale. Pass the
 * raw bodyData to this helper to get an update that writes to whichever
 * field(s) the doc currently uses, keeping them in lockstep.
 */
function buildPreservingBodyUpdate(bodyData, newHtml) {
  const { shape } = extractBodyHtml(bodyData);
  const update = buildBodyUpdate(shape, newHtml);
  const hasNestedSibling =
    !!bodyData &&
    !!bodyData.body &&
    typeof bodyData.body === "object" &&
    typeof bodyData.body.text === "string";
  if (shape === "flat-text" && hasNestedSibling) {
    update["body.text"] = newHtml;
  }
  const hasFlatSibling = !!bodyData && typeof bodyData.text === "string";
  if (shape === "nested" && hasFlatSibling) {
    update.text = newHtml;
  }
  return update;
}

module.exports = { extractBodyHtml, buildBodyUpdate, buildPreservingBodyUpdate };
