import { SYSTEM_TOPICS } from "./systemPrescription";
import { TOPIC_ID_TO_PDF_FIELDS } from "./systemCardAbfLayout";

const SECTION_BY_FIELD_PREFIX = [
  { sectionId: "sec_1", test: (f) => ["BasicSystem", "PlayerNo_A", "PlayerNo_B", "PlayerName_A", "PlayerName_B"].includes(f) },
  { sectionId: "sec_2", test: (f) => /^Open|^Resp1NT/.test(f) || f === "IsCanape" || /OneNTMayHave5Major/.test(f) },
  { sectionId: "sec_4", test: (f) => /NegXLimit|JumpOvercall|UnusualNT/.test(f) },
  { sectionId: "sec_5", test: (f) => /JumpRaiseMajor/.test(f) },
];

function inferSectionIdFromFields(fields) {
  for (const field of fields) {
    const hit = SECTION_BY_FIELD_PREFIX.find((rule) => rule.test(field));
    if (hit) return hit.sectionId;
  }
  return "";
}

export function getCuratedSuggestionsBySection(sectionId) {
  const suggestions = [];

  SYSTEM_TOPICS.forEach((topic) => {
    const fields = TOPIC_ID_TO_PDF_FIELDS[topic.id] || [];
    if (!fields.length) return;
    const inferred = inferSectionIdFromFields(fields);
    if (inferred !== sectionId) return;

    const lines = Array.isArray(topic.prescriptionLines)
      ? topic.prescriptionLines.filter((l) => !l.divider && l.text).map((l) => l.text)
      : [];
    const summary = lines.length ? lines.join("; ") : String(topic.prescription || topic.title);
    suggestions.push({
      id: `suggest-${topic.id}`,
      topicId: topic.id,
      title: topic.title,
      summary,
      notes: topic.notes || [],
      detailUrl: topic.detailUrl || "",
      targetFields: fields,
      source: "Curated",
    });
  });

  const generic = {
    sec_2: [
      {
        id: "s-open-common",
        title: "Common modern baseline",
        summary: "5-card majors, 15-17 1NT, weak twos in majors.",
        notes: ["Use this as a starting point, then customise agreements."],
        targetFields: ["BasicSystem", "Open1NT", "Open2H", "Open2S"],
        source: "BridgeChampions",
      },
    ],
    sec_4: [
      {
        id: "s-comp-negative",
        title: "Negative doubles baseline",
        summary: "Play negative doubles through 2S, then refine by style.",
        notes: ["Review jump overcalls and unusual NT as a pair after setting doubles."],
        targetFields: ["NegXLimit", "JumpOvercall", "UnusualNT"],
        source: "BridgeChampions",
      },
    ],
    sec_7: [
      {
        id: "s-slam-rkcb",
        title: "RKCB starter",
        summary: "Play RKCB 1430 with clear continuation notes.",
        notes: ["Document queen ask and king ask follow-ups in notes."],
        targetFields: ["RKCBStyle", "SlamNotes_1"],
        source: "BridgeChampions",
      },
    ],
  };

  return [...suggestions, ...(generic[sectionId] || [])];
}

export function applySuggestionToValues(suggestion, currentValues) {
  const next = { ...currentValues };
  const text = String(suggestion.summary || "").trim();
  if (!text) return next;
  (suggestion.targetFields || []).forEach((field) => {
    next[field] = text;
  });
  return next;
}
