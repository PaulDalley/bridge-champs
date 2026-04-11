/**
 * System card menu — choices per group.
 * Paul choices are injected at runtime from systemPrescription; this file holds other presets.
 */

import { SYSTEM_TOPICS } from "./systemPrescription";
import { getMenuGroupById } from "./systemCardSchema";

/**
 * Non-Paul preset choices, keyed by menuGroupId.
 * Each choice: { id, label, textForAbf, sourceTag?, description? }
 */
export const PRESET_CHOICES = {
  opening_style: [
    { id: "preset-sayc", label: "SAYC style", textForAbf: "Standard American, 5-card majors, 2/1", sourceTag: "Common" },
    { id: "preset-minimal", label: "Minimal", textForAbf: "5-card majors, natural 2/1", sourceTag: "Common" },
  ],
  opening_1minor: [
    { id: "preset-short", label: "Short club", textForAbf: "1♣ 2+ (short club)", sourceTag: "Common" },
    { id: "preset-better", label: "Better minor", textForAbf: "1♣ 3+ (better minor)", sourceTag: "Common" },
  ],
  opening_2level: [
    { id: "preset-2c-gf", label: "2♣ game force", textForAbf: "2♣ Game force; 2♦ 18–19 balanced; 2M natural 6", sourceTag: "Common" },
    { id: "preset-2c-strong", label: "2♣ strong only", textForAbf: "2♣ Strong artificial; 2♦ multi or weak; 2M natural", sourceTag: "Common" },
  ],
  resp_1nt: [
    { id: "preset-stayman", label: "Stayman only", textForAbf: "2♣ Stayman; 2♦/2♥/2♠ transfers", sourceTag: "Common" },
    { id: "preset-four-transfer", label: "Four transfers", textForAbf: "2♣ Stayman; 2♦/2♥/2♠/2NT four transfers", sourceTag: "Common" },
    { id: "preset-puppet", label: "Puppet Stayman", textForAbf: "2♣ Stayman; 2♦/2♥/2♠/2NT transfers; 3♣ Puppet", sourceTag: "Common" },
  ],
  jacoby: [
    { id: "preset-jacoby-simple", label: "Jacoby 2NT", textForAbf: "Jacoby 2NT — shortness and strength", sourceTag: "Common" },
    { id: "preset-no-jacoby", label: "No Jacoby", textForAbf: "No Jacoby 2NT", sourceTag: "Common" },
  ],
  neg_double: [
    { id: "preset-thru-2h", label: "Thru 2♥", textForAbf: "Negative double thru 2♥", sourceTag: "Common" },
    { id: "preset-thru-2s", label: "Thru 2♠", textForAbf: "Negative double thru 2♠", sourceTag: "Common" },
    { id: "preset-thru-3h", label: "Thru 3♥", textForAbf: "Negative double thru 3♥", sourceTag: "Common" },
  ],
};

/** Build Paul choice from SYSTEM_TOPICS for a menu group */
function getPaulChoiceForGroup(group) {
  if (!group.topicId) return null;
  const topic = SYSTEM_TOPICS.find((t) => t.id === group.topicId);
  if (!topic) return null;

  let textForAbf = "";
  if (Array.isArray(topic.prescriptionLines) && topic.prescriptionLines.length > 0) {
    const texts = topic.prescriptionLines.filter((l) => !l.divider && l.text).map((l) => l.text);
    textForAbf = texts.join("; ");
  } else if (topic.prescription) {
    textForAbf = topic.prescription;
  } else {
    textForAbf = topic.title;
  }

  return {
    id: `paul:${topic.id}`,
    label: `Paul's recommendation`,
    textForAbf: textForAbf || topic.title,
    sourceTag: "Paul",
    topicId: topic.id,
    detailUrl: topic.detailUrl || "",
  };
}

/** All choices for a menu group (Paul first if present, then presets, custom always available) */
export function getChoicesForGroup(groupId) {
  const group = getMenuGroupById(groupId);
  if (!group) return [];

  const choices = [];
  const paul = getPaulChoiceForGroup(group);
  if (paul) choices.push(paul);

  const presets = PRESET_CHOICES[groupId] || [];
  choices.push(...presets);

  return choices;
}


/** Resolve user selection to final ABF text */
export function resolveChoiceText(choiceId, customText, choices, appendText) {
  if (choiceId === "custom") {
    return (customText || "").trim();
  }
  const choice = choices.find((c) => c.id === choiceId);
  const base = choice ? choice.textForAbf : "";
  const append = (appendText || "").trim();
  if (!append) return base;
  return base ? `${base}. ${append}` : append;
}

/** Paul choice id for a topic (for "Add to my card") */
export function getPaulChoiceIdForTopic(topicId) {
  return `paul:${topicId}`;
}
