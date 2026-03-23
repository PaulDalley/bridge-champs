import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/** Flat sample / legacy template (overlay summary). Used on production host. */
const LEGACY_TEMPLATE_URL = "/system-card/Dalley_Nunn.pdf";

/** Official ABF fillable form — only used when `isAcroFormExportEnabled()` is true (localhost). */
const FILLABLE_TEMPLATE_URL = "/system-card/ABF_System_Card_fillable.pdf";

/**
 * AcroForm export is localhost-only so a broken fill never ships to the live site.
 * Production keeps the legacy “summary overlay” on Dalley_Nunn.pdf.
 */
export function isAcroFormExportEnabled() {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
}

/**
 * Legacy menu group id → PDF fields (v1 `selections` shape). Used for migration + fallback Acro fill.
 */
export const LEGACY_GROUP_ID_TO_PDF_FIELDS = {
  opening_style: ["BasicSystem"],
  opening_1minor: ["Open1C", "Open1D"],
  opening_2level: ["Open2C", "Open2D", "Open2H", "Open2S", "OpenOther"],
  resp_1nt: ["Resp1NT2CStyle", "Resp1NT2D", "Resp1NT2H", "Resp1NT2S", "Resp1NT2NT"],
  jacoby: ["JumpRaiseMajor"],
  neg_double: ["NegXLimit"],
};

function toLines(entries) {
  return entries.map(([label, text]) => `${label}: ${text}`);
}

function normalizeForWinAnsi(input) {
  return String(input || "")
    .replace(/♣/g, "C")
    .replace(/♦/g, "D")
    .replace(/♥/g, "H")
    .replace(/♠/g, "S")
    .replace(/–/g, "-")
    .replace(/—/g, "-")
    .replace(/’/g, "'")
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/\u00A0/g, " ");
}

function splitForPages(lines) {
  const mid = Math.ceil(lines.length / 2);
  return [lines.slice(0, mid), lines.slice(mid)];
}

function wrapLine(text, font, size, maxWidth) {
  const words = normalizeForWinAnsi(text).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const out = [];
  let current = words[0];
  for (let i = 1; i < words.length; i += 1) {
    const candidate = `${current} ${words[i]}`;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      out.push(current);
      current = words[i];
    }
  }
  out.push(current);
  return out;
}

function drawSummaryBox(page, lines, font, title) {
  const { width, height } = page.getSize();
  const margin = 24;
  const boxHeight = Math.min(height * 0.42, 260);
  const x = margin;
  const y = margin;
  const boxWidth = width - margin * 2;

  page.drawRectangle({
    x,
    y,
    width: boxWidth,
    height: boxHeight,
    color: rgb(1, 1, 1),
    opacity: 0.92,
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 1,
  });

  page.drawText(normalizeForWinAnsi(title), {
    x: x + 10,
    y: y + boxHeight - 18,
    size: 11,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });

  let cursorY = y + boxHeight - 34;
  const textSize = 8.6;
  const lineStep = 10.4;
  const maxWidth = boxWidth - 20;

  lines.forEach((line) => {
    const wrapped = wrapLine(line, font, textSize, maxWidth);
    wrapped.forEach((w) => {
      if (cursorY < y + 8) return;
      page.drawText(normalizeForWinAnsi(w), {
        x: x + 10,
        y: cursorY,
        size: textSize,
        font,
        color: rgb(0.05, 0.05, 0.05),
      });
      cursorY -= lineStep;
    });
  });
}

function setAcroFormFieldsFromGroupTexts(pdf, groupTexts) {
  const form = pdf.getForm();
  Object.entries(LEGACY_GROUP_ID_TO_PDF_FIELDS).forEach(([groupId, fieldNames]) => {
    const raw = groupTexts[groupId];
    if (!raw || !String(raw).trim()) return;
    const text = normalizeForWinAnsi(raw).trim();
    fieldNames.forEach((name) => {
      try {
        form.getTextField(name).setText(text);
      } catch (e) {
        console.warn(`[systemCardPdf] skip field ${name}:`, e?.message || e);
      }
    });
  });
}

/** Fill every non-empty key in `abfValues` that exists as a text field on the form. */
function setAcroFormFieldsFromAbfValues(pdf, abfValues) {
  const form = pdf.getForm();
  Object.entries(abfValues).forEach(([name, raw]) => {
    if (!raw || !String(raw).trim()) return;
    const text = normalizeForWinAnsi(raw).trim();
    try {
      form.getTextField(name).setText(text);
    } catch (e) {
      console.warn(`[systemCardPdf] skip field ${name}:`, e?.message || e);
    }
  });
}

async function finalizeAcroFormPdf(pdf) {
  try {
    const form = pdf.getForm();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    form.updateFieldAppearances(font);
  } catch (e) {
    console.warn("[systemCardPdf] updateFieldAppearances skipped:", e?.message || e);
  }
  return pdf.save({ useObjectStreams: false });
}

async function exportAcroFormFromAbfValues(abfValues, filename) {
  const res = await fetch(FILLABLE_TEMPLATE_URL);
  if (!res.ok) {
    throw new Error("Could not load ABF fillable template (localhost export).");
  }
  const bytes = await res.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  setAcroFormFieldsFromAbfValues(pdf, abfValues);
  const out = await finalizeAcroFormPdf(pdf);
  triggerDownload(out, filename);
}

async function exportAcroFormSystemCardLegacyGroups(groupTexts, filename) {
  const res = await fetch(FILLABLE_TEMPLATE_URL);
  if (!res.ok) {
    throw new Error("Could not load ABF fillable template (localhost export).");
  }
  const bytes = await res.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  setAcroFormFieldsFromGroupTexts(pdf, groupTexts);
  const out = await finalizeAcroFormPdf(pdf);
  triggerDownload(out, filename);
}

/** @param {Uint8Array} out */
function triggerDownload(out, filename) {
  const blob = new Blob([out], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function exportLegacyOverlaySystemCard(entries, filename) {
  const res = await fetch(LEGACY_TEMPLATE_URL);
  if (!res.ok) {
    throw new Error("Could not load ABF template PDF.");
  }

  const bytes = await res.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const lines = toLines(entries);
  const [p1, p2] = splitForPages(lines);
  const pages = pdf.getPages();
  if (!pages[0]) throw new Error("Template PDF has no pages.");

  drawSummaryBox(pages[0], p1, font, "BridgeChampions system summary (page 1)");
  if (pages[1]) {
    drawSummaryBox(pages[1], p2, font, "BridgeChampions system summary (page 2)");
  } else if (p2.length > 0) {
    drawSummaryBox(pages[0], p2, font, "Additional agreements");
  }

  const out = await pdf.save();
  triggerDownload(out, filename);
}

/**
 * @param {Array<[string, string]>} entries - [label, text] for legacy overlay (production)
 * @param {string} filename
 * @param {{ abfValues?: Record<string, string>, groupTexts?: Record<string, string> }} [options]
 */
export async function exportSystemCardPdf(entries, filename = "my-system-card.pdf", options = {}) {
  const { abfValues = {}, groupTexts = {} } = options;

  const hasAbfValues = Object.keys(abfValues).some((k) => String(abfValues[k] || "").trim());

  if (isAcroFormExportEnabled() && hasAbfValues) {
    await exportAcroFormFromAbfValues(abfValues, filename);
    return;
  }

  if (isAcroFormExportEnabled()) {
    const hasGroupText = Object.keys(groupTexts).some((k) => String(groupTexts[k] || "").trim());
    if (hasGroupText) {
      await exportAcroFormSystemCardLegacyGroups(groupTexts, filename);
      return;
    }
  }

  await exportLegacyOverlaySystemCard(entries, filename);
}
