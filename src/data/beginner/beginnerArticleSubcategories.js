/**
 * Preset subcategories for beginner pillar articles (Firestore field: subcategory).
 * beginnerCardPlay = Beginner Declarer article type in the app.
 */

export const BEGINNER_DECLARER_SUBCATEGORIES = [
  "Drawing trumps",
  "Low towards honors.",
  "Playing our long suits",
  "Ruff in dummy",
];

export const BEGINNER_DEFENCE_SUBCATEGORIES = [
  "Opening leads",
  "Second hand low",
  "Third hand high",
  "Lead through strength. Lead towards weakness.",
];

export const BEGINNER_BIDDING_SUBCATEGORIES = [
  "Opening bids",
  "Responder's first bid",
  "Opener's rebid",
  "1NT opening",
  "Competitive bidding.",
];

/** @returns {readonly string[] | null} */
export function getBeginnerSubcategoryPresetList(articleType) {
  switch (articleType) {
    case "beginnerCardPlay":
      return BEGINNER_DECLARER_SUBCATEGORIES;
    case "beginnerDefence":
      return BEGINNER_DEFENCE_SUBCATEGORIES;
    case "beginnerBidding":
      return BEGINNER_BIDDING_SUBCATEGORIES;
    default:
      return null;
  }
}
