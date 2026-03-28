const AI_PARSE_ENDPOINT =
  "https://us-central1-bridgechampions.cloudfunctions.net/parseSystemCardAi";

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function parseJsonMaybe(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

function normalizeDetection(item, index) {
  const targetFields = toArray(item?.targetFields).map((v) => String(v || "").trim()).filter(Boolean);
  const text = String(item?.text || "").trim().slice(0, 120);
  if (!text || targetFields.length === 0) return null;
  return {
    id: String(item?.id || `ai-det-${index + 1}`),
    title: String(item?.title || "Detected agreement").trim() || "Detected agreement",
    text,
    targetFields,
    confidence: String(item?.confidence || "medium").trim() || "medium",
    rationale: String(item?.rationale || "").trim().slice(0, 220),
  };
}

function normalizeFollowUp(item, index) {
  const targetFields = toArray(item?.targetFields).map((v) => String(v || "").trim()).filter(Boolean);
  if (targetFields.length === 0) return null;
  const options = toArray(item?.options).map((v) => String(v || "").trim()).filter(Boolean).slice(0, 8);
  const question = String(item?.question || "").trim().slice(0, 140);
  if (!question || options.length === 0) return null;
  return {
    id: String(item?.id || `ai-q-${index + 1}`),
    question,
    options,
    targetFields,
    formatAnswer: (value) => String(value || "").trim().slice(0, 120),
  };
}

export async function parseSystemCardAiInput({ text, sectionTitle, allowedFields }) {
  const payload = {
    text: String(text || "").trim(),
    sectionTitle: String(sectionTitle || "").trim(),
    allowedFields: toArray(allowedFields).map((v) => String(v || "").trim()).filter(Boolean),
  };
  if (!payload.text) {
    return { detections: [], followUps: [] };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let res;
  try {
    res = await fetch(AI_PARSE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  const bodyText = await res.text();
  const parsed = parseJsonMaybe(bodyText);
  if (!res.ok) {
    const message =
      parsed?.error ||
      parsed?.message ||
      `AI parse request failed (${res.status})`;
    throw new Error(message);
  }

  const detections = toArray(parsed?.detections).map(normalizeDetection).filter(Boolean);
  const followUps = toArray(parsed?.followUps).map(normalizeFollowUp).filter(Boolean);
  return { detections, followUps };
}
