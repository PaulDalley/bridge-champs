/**
 * Preset subcategories for beginner pillar articles (Firestore field: subcategory).
 * beginnerCardPlay = Beginner Declarer article type in the app.
 */

export const BEGINNER_DECLARER_SUBCATEGORIES = [
  "Trump Management",
  "Honor Combinations and Finesses",
  "Establishing Side-Suit Winners",
  "Suit Contract Strategies",
  "No-Trump Strategies",
];

export const BEGINNER_DEFENCE_SUBCATEGORIES = [
  "Opening Leads",
  "Second Hand Low",
  "Third Hand High",
  "Lead Through Strength, Lead Towards Weakness",
];

export const BEGINNER_BIDDING_SUBCATEGORIES = [
  "Opening Bids",
  "Responder's First Bid",
  "Opener's Rebid",
  "1NT opening",
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
  beginnerDefence: {
    "Opening leads": "Opening Leads",
    "Opening lead": "Opening Leads",
    "Second hand low": "Second Hand Low",
    "Third hand high": "Third Hand High",
    "Lead through strength. Lead towards weakness.": "Lead Through Strength, Lead Towards Weakness",
    "Lead through strength, lead towards weakness": "Lead Through Strength, Lead Towards Weakness",
  },
  beginnerBidding: {
    "Opening bids": "Opening Bids",
    "Responder's first bid": "Responder's First Bid",
    "Opener's rebid": "Opener's Rebid",
    "Competitive bidding.": "Competitive Bidding",
    "Competitive bidding": "Competitive Bidding",
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
