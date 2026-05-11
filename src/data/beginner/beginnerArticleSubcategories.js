/**
 * Preset subcategories for beginner pillar articles (Firestore field: subcategory).
 * beginnerCardPlay = Beginner Declarer article type in the app.
 */

export const BEGINNER_DECLARER_SUBCATEGORIES = [
  "Trump Management",
  "Honor Combinations and Finesses",
  "Establishing Side-Suit Winners",
  "Suit Contract Strategies",
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

/**
 * Legacy -> canonical beginner subcategory aliases.
 * Keeps older articles grouped under current parent labels.
 */
export const BEGINNER_SUBCATEGORY_ALIASES = {
  beginnerCardPlay: {
    "Drawing trumps": "Trump Management",
    "Low towards honors.": "Honor Combinations and Finesses",
    "Low towards honors": "Honor Combinations and Finesses",
    "Playing our long suits": "Establishing Side-Suit Winners",
    "Ruff in dummy": "Suit Contract Strategies",
  },
};

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

/** @returns {Readonly<Record<string, string>>} */
export function getBeginnerSubcategoryAliasMap(articleType) {
  return BEGINNER_SUBCATEGORY_ALIASES[articleType] || {};
}
