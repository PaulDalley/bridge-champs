import { PDFDocument, PDFName, PDFBool } from "pdf-lib";

/** Official ABF fillable convention-card form (committed in public/system-card/). */
const FILLABLE_TEMPLATE_URL = "/system-card/ABF_System_Card_fillable.pdf";

/**
 * Legacy menu group id → PDF fields (v1 `selections` shape). Kept only for the
 * old data-migration path in SystemCardEditor; not used by PDF export anymore.
 */
export const LEGACY_GROUP_ID_TO_PDF_FIELDS = {
  opening_style: ["BasicSystem"],
  opening_1minor: ["Open1C", "Open1D"],
  opening_2level: ["Open2C", "Open2D", "Open2H", "Open2S", "OpenOther"],
  resp_1nt: ["Resp1NT2CStyle", "Resp1NT2D", "Resp1NT2H", "Resp1NT2S", "Resp1NT2NT"],
  jacoby: ["JumpRaiseMajor"],
  neg_double: ["NegXLimit"],
};

/** Replace suit glyphs / smart punctuation so WinAnsi fonts can render the text. */
function normalizeForWinAnsi(input) {
  return String(input || "")
    .replace(/♣/g, "C")
    .replace(/♦/g, "D")
    .replace(/♥/g, "H")
    .replace(/♠/g, "S")
    .replace(/–/g, "-")
    .replace(/—/g, "-")
    .replace(/…/g, "...")
    .replace(/’/g, "'")
    .replace(/‘/g, "'")
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/·/g, "-")
    .replace(/ /g, " ");
}

/** Fetch a template and confirm it's actually a PDF (a missing file returns the SPA HTML). */
async function loadPdfTemplate(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not load the system-card template (${res.status}).`);
  const bytes = await res.arrayBuffer();
  const head = new TextDecoder().decode(bytes.slice(0, 5));
  if (head !== "%PDF-") {
    throw new Error("The system-card PDF template is missing or invalid.");
  }
  return bytes;
}

/** Fill every non-empty key in `abfValues` that exists as a text field on the form. */
function setAcroFormFieldsFromAbfValues(pdf, abfValues) {
  const form = pdf.getForm();
  Object.entries(abfValues || {}).forEach(([name, raw]) => {
    if (!raw || !String(raw).trim()) return;
    const text = normalizeForWinAnsi(raw).trim();
    try {
      form.getTextField(name).setText(text);
    } catch (e) {
      // Field isn't a text field (checkbox/radio) or doesn't exist on this form — skip.
    }
  });
}

/**
 * Tell PDF viewers (Adobe Reader, Chrome, macOS Preview) to render the field
 * values themselves. This is cheap and reliable, unlike pdf-lib's
 * updateFieldAppearances(), which can be extremely slow or hang in the browser
 * on a large AcroForm (this ABF form has ~690 fields).
 */
function setNeedAppearances(pdf) {
  try {
    pdf.getForm().acroForm.dict.set(PDFName.of("NeedAppearances"), PDFBool.True);
  } catch (e) {
    // Non-fatal: worst case some minimal viewers won't render filled values.
  }
}

function triggerDownload(bytes, filename) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Download the user's system card as the official ABF fillable PDF form.
 * Works everywhere the template ships (public/system-card). Empty values simply
 * yield a blank official card, which is still useful to print and fill by hand.
 *
 * @param {Array} _entries       kept for call-site compatibility (unused)
 * @param {string} filename
 * @param {{ abfValues?: Record<string, string> }} [options]
 */
export async function exportSystemCardPdf(_entries, filename = "my-system-card.pdf", options = {}) {
  const { abfValues = {} } = options;
  const templateBytes = await loadPdfTemplate(FILLABLE_TEMPLATE_URL);
  const pdf = await PDFDocument.load(templateBytes, { ignoreEncryption: true, updateMetadata: false });
  setAcroFormFieldsFromAbfValues(pdf, abfValues);
  setNeedAppearances(pdf);
  const out = await pdf.save({ useObjectStreams: false });
  triggerDownload(out, filename);
}
