export const LEARN_DECLARER_SUBCATEGORIES = [
  "Patterns and Technique",
  "Counting and Planning",
  "Trump Management",
  "Entries and Communication",
  "Suit Establishment and Timing",
  "Practice Hands",
];

export const LEARN_DEFENCE_SUBCATEGORIES = [
  "Recognizing Dummy Types and Patterns",
  "Defensive Planning Fundamentals",
  "Opening Leads and Positioning",
  "Trump Defence and Ruffing",
];

export const LEARN_BIDDING_SUBCATEGORIES = [
  "Core Bidding Fundamentals",
  "Hand Evaluation and Judgment",
  "Competitive Bidding and Doubles",
  "No-Trump Auctions and Decisions",
  "Conventions and Artificial Methods",
  "Preempting Strategy",
  "Partnership Style and Discipline",
];

export const LEARN_DECLARER_SUBCATEGORY_ALIASES = {
  "Counting and planning": "Counting and Planning",
  "Trump management": "Trump Management",
  "Entries and communication": "Entries and Communication",
  "Suit establishment and timing": "Suit Establishment and Timing",
  "Patterns and technique": "Patterns and Technique",
  "Practice hands": "Practice Hands",
};

export const LEARN_DEFENCE_SUBCATEGORY_ALIASES = {
  "Defensive planning fundamentals": "Defensive Planning Fundamentals",
  "Opening leads and positioning": "Opening Leads and Positioning",
  "Trump defence and ruffing": "Trump Defence and Ruffing",
  "Hand reading and counting": "Recognizing Dummy Types and Patterns",
  "Recognizing dummy types and patterns": "Recognizing Dummy Types and Patterns",
};

export const LEARN_BIDDING_SUBCATEGORY_ALIASES = {
  "Core bidding fundamentals": "Core Bidding Fundamentals",
  "Hand evaluation and judgment": "Hand Evaluation and Judgment",
  "Competitive bidding and doubles": "Competitive Bidding and Doubles",
  "No-trump auctions and decisions": "No-Trump Auctions and Decisions",
  "Conventions and artificial methods": "Conventions and Artificial Methods",
  "Preempting strategy": "Preempting Strategy",
  "Partnership style and discipline": "Partnership Style and Discipline",
};

export function getLearnSubcategoryPresetList(articleType) {
  switch (articleType) {
    case "cardPlay":
      return LEARN_DECLARER_SUBCATEGORIES;
    case "defence":
      return LEARN_DEFENCE_SUBCATEGORIES;
    case "bidding":
    case "biddingAdvanced":
    case "biddingBasics":
      return LEARN_BIDDING_SUBCATEGORIES;
    default:
      return null;
  }
}

export function getLearnSubcategoryAliasMap(articleType) {
  switch (articleType) {
    case "cardPlay":
      return LEARN_DECLARER_SUBCATEGORY_ALIASES;
    case "defence":
      return LEARN_DEFENCE_SUBCATEGORY_ALIASES;
    case "bidding":
    case "biddingAdvanced":
    case "biddingBasics":
      return LEARN_BIDDING_SUBCATEGORY_ALIASES;
    default:
      return {};
  }
}
