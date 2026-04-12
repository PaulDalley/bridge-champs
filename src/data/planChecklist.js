/**
 * Plan / achievement checklist: exercises you want members to work through.
 * You control which items appear here. Completion is tracked per type:
 *
 * - practice: completed when user finishes the hand (localStorage key: bridgechamps_trainer_completed_<categoryKey>)
 *   Counting trainer uses categoryKey "counting"; CardPlay trainer uses "declarer".
 * - quiz: completed when user has a score (Firebase / Redux state.user.quizScores, keyed by quiz doc id)
 * - article: no completion tracking yet; always shows as to-do. id/path = counting article doc id or slug.
 *
 * Add or remove entries; order is the order shown. Title and path are what the user sees and where they go.
 */
export const PLAN_CHECKLIST_ITEMS = [
  // Counting Level 1 (10 problems) – path includes ?problem=id so the trainer opens that problem
  { type: "practice", id: "p1", categoryKey: "counting", title: "Two rounds of trumps, LHO shows out on round 2", path: "/counting/practice?problem=p1" },
  { type: "practice", id: "p1-3", categoryKey: "counting", title: "Defending: two rounds of hearts reveal 5-4-2-2", path: "/counting/practice?problem=p1-3" },
  { type: "practice", id: "p1-2", categoryKey: "counting", title: "Defending 4♠: count declarer's trumps after partner shows out", path: "/counting/practice?problem=p1-2" },
  { type: "practice", id: "p1-4", categoryKey: "counting", title: "Defending: three rounds of hearts, partner shows out on round 3", path: "/counting/practice?problem=p1-4" },
  { type: "practice", id: "p1-5", categoryKey: "counting", title: "Declaring: set up dummy's long suit (4-3 break)", path: "/counting/practice?problem=p1-5" },
  { type: "practice", id: "p1-6", categoryKey: "counting", title: "Declaring: drawing trumps — common splits (5332 / 5341)", path: "/counting/practice?problem=p1-6" },
  { type: "practice", id: "p1-7", categoryKey: "counting", title: "Counting trumps: we have 9, they have ? (clubs)", path: "/counting/practice?problem=p1-7" },
  { type: "practice", id: "p1-8", categoryKey: "counting", title: "Can you make 4 tricks? (diamonds)", path: "/counting/practice?problem=p1-8" },
  { type: "practice", id: "p1-9", categoryKey: "counting", title: "5 hearts opposite a void — can you make 4 tricks? (No Trump)", path: "/counting/practice?problem=p1-9" },
  { type: "practice", id: "p1-10", categoryKey: "counting", title: "3NT: counting points — how many does partner have?", path: "/counting/practice?problem=p1-10" },
  // Counting Level 2 (2 problems)
  { type: "practice", id: "p2-2", categoryKey: "counting", title: "4♠: set up the heart suit (two suits)", path: "/counting/practice?problem=p2-2" },
  { type: "practice", id: "p2-3", categoryKey: "counting", title: "4♠: set up hearts in 4♠ (two suits, no overruff)", path: "/counting/practice?problem=p2-3" },
  // Article – path = direct link: /counting/articles/BODY_ID (Firestore countingBody document id).
  { type: "article", id: "fundamentals-1-shapes", title: "Fundamentals #1 – understand bridge 'shapes'", path: "/counting/articles/aQcEPGFWdvVnDt2hn5oo" },
];

const PRACTICE_STORAGE_PREFIX = "bridgechamps_trainer_completed_";

/**
 * Returns which practice problem IDs are completed (from localStorage). Used as fallback only.
 * @param {string} categoryKey - e.g. "counting", "declarer"
 * @returns {Record<string, boolean>} id -> true if completed
 */
export function getPracticeCompletion(categoryKey) {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(PRACTICE_STORAGE_PREFIX + categoryKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Returns completion map for all plan items: { [itemId]: true if completed }.
 * Uses Firebase (completedPractice) for practice; quizScores for quizzes. Everyone starts with nothing in Firebase.
 * @param {typeof PLAN_CHECKLIST_ITEMS} items
 * @param {Record<string, number>} quizScores - Redux state.user.quizScores (quizId -> score)
 * @param {{ [categoryKey: string]: string[] }} completedPractice - Redux state.user.completedPractice (from Firebase)
 */
export function getPlanCompletion(items, quizScores = {}, completedPractice = {}) {
  const completed = {};

  items.forEach((item) => {
    if (item.type === "practice") {
      const key = item.categoryKey || "counting";
      const list = completedPractice[key];
      completed[item.id] = Array.isArray(list) && list.includes(item.id);
    } else if (item.type === "quiz") {
      completed[item.id] = item.id in quizScores;
    } else if (item.type === "article") {
      completed[item.id] = false; // no read tracking yet
    }
  });
  return completed;
}

export default PLAN_CHECKLIST_ITEMS;
