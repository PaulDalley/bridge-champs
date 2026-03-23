/**
 * ABF System Card schema — menu groups, ABF field mapping, resolve helpers.
 * Menu choices (Paul + other presets) come from systemCardMenu.js + systemPrescription.js.
 */

/** ABF section IDs (sections 1–10) for grouping */
export const ABF_SECTIONS = [
  { id: "opening", title: "Opening structure", abfSection: 1 },
  { id: "responses", title: "Responses & raises", abfSection: 4 },
  { id: "competition", title: "Competitive", abfSection: 3 },
  { id: "play", title: "Play conventions", abfSection: 5 },
  { id: "other", title: "Other", abfSection: 10 },
];

/**
 * Menu groups — each maps to one or more ABF fields.
 * topicId: SYSTEM_TOPICS id for Paul's choice (optional)
 */
export const MENU_GROUPS = [
  {
    id: "opening_style",
    label: "General style",
    sectionId: "opening",
    abfKeys: ["basicSystem"],
    topicId: "open-general-style",
  },
  {
    id: "opening_1minor",
    label: "1 minor opening",
    sectionId: "opening",
    abfKeys: ["openingBids_1c", "openingBids_1d"],
    topicId: "open-1minor",
  },
  {
    id: "opening_2level",
    label: "2-level openings",
    sectionId: "opening",
    abfKeys: ["openingBids_2c", "openingBids_2d", "openingBids_2h", "openingBids_2s"],
    topicId: "open-2level",
  },
  {
    id: "resp_1nt",
    label: "Responding to 1NT",
    sectionId: "responses",
    abfKeys: ["1ntResponses"],
    topicId: "resp-1nt",
  },
  {
    id: "jacoby",
    label: "Jacoby 2NT",
    sectionId: "responses",
    abfKeys: ["jumpRaisesMajors"],
    topicId: "jacoby",
  },
  {
    id: "neg_double",
    label: "Negative double",
    sectionId: "competition",
    abfKeys: ["negativeDblThru"],
    topicId: "neg-double",
  },
];

export function getMenuGroups() {
  return MENU_GROUPS;
}

export function getMenuGroupById(id) {
  return MENU_GROUPS.find((g) => g.id === id);
}

export function getMenuGroupByTopicId(topicId) {
  return MENU_GROUPS.find((g) => g.topicId === topicId);
}

export function getMenuGroupsBySection(sectionId) {
  return MENU_GROUPS.filter((g) => g.sectionId === sectionId);
}
