/**
 * This month's theme / focus. Change each month to highlight a topic.
 *
 * - key: used to filter practice (label) and articles
 * - label: display name (e.g. "Counting", "Declarer")
 * - tagline: optional one-line description under the theme name
 * - collectionKeys: Firestore collections for articles (e.g. ["counting"], or ["cardPlay", "cardPlayBasics"] for Declarer)
 *
 * Example for next month (Declarer):
 *   key: "cardPlay", label: "Declarer", tagline: "Plan the play.", collectionKeys: ["cardPlay", "cardPlayBasics"]
 */
export const MONTHLY_THEME = {
  key: "counting",
  label: "Counting",
  tagline: "Trumps, points, shape.",
  collectionKeys: ["counting"],
};

export default MONTHLY_THEME;
