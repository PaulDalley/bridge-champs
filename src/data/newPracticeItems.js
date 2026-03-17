/**
 * New practice problems from the trainers (CardPlay, Counting).
 * Each has newUntil: show in "New for you" until this date (YYYY-MM-DD).
 * Keep in sync with newUntil in CardPlayTrainer.js and CountingTrumpsTrainer.js.
 */
export const NEW_PRACTICE_ITEMS = [
  // Declarer (CardPlay). handPreview = one hand { S, H, D, C } for mini diagram.
  { id: "cp1-4", title: "1NT: which suit creates no extra losers?", path: "/cardPlay/practice", label: "Declarer", newUntil: "2026-03-25", contract: "1NT", preview: "You declare", handPreview: { S: "876", H: "KT9", D: "", C: "" } },
  { id: "cp1-5", title: "1NT: focus on spades — knock out the Ace and King", path: "/cardPlay/practice", label: "Declarer", newUntil: "2026-03-25", contract: "1NT", preview: "You declare", handPreview: { S: "76", H: "5432", D: "AJ98", C: "AKQ" } },
  { id: "cp1-6", title: "3NT: heart lead — what suit do you play?", path: "/cardPlay/practice", label: "Declarer", newUntil: "2026-04-15", contract: "3NT", preview: "Lead: ♥", handPreview: { S: "A32", H: "KT987", D: "AK2", C: "32" } },
  { id: "cp1-10", title: "4♥: Ruffing a lot (cross ruffing)", path: "/cardPlay/practice", label: "Declarer", newUntil: "2026-04-30", contract: "4♥", preview: "Lead: ♥", handPreview: { S: "", H: "KJT97", D: "A5432", C: "Q32" } },
  { id: "cp1-11", title: "5♦: can I just draw trumps?", path: "/cardPlay/practice", label: "Declarer", newUntil: "2026-04-30", contract: "5♦", preview: "Lead: ♣", handPreview: { S: "65", H: "A93", D: "KQJ75", C: "KJ6" } },
  { id: "cp2-4", title: "4♠: club lead — what's the key theme?", path: "/cardPlay/practice", label: "Declarer", newUntil: "2026-04-01", contract: "4♠", preview: "Lead: ♣", handPreview: { S: "QJT73", H: "43", D: "AKJ4", C: "K3" } },
  // Counting
  { id: "p1-10", title: "3NT: counting points — how many does partner have?", path: "/counting/practice", label: "Counting", newUntil: "2026-04-15", contract: "3NT", preview: "You're West on lead", handPreview: { S: "KJ953", H: "876", D: "43", C: "762" } },
  { id: "p2-2", title: "4♠: set up the heart suit (two suits)", path: "/counting/practice", label: "Counting", newUntil: "2026-03-25", contract: "4♠", preview: "You declare", handPreview: { S: "2356", H: "2", D: "", C: "" } },
  { id: "p2-3", title: "4♠: set up hearts in 4♠ (two suits, no overruff)", path: "/counting/practice", label: "Counting", newUntil: "2026-03-25", contract: "4♠", preview: "You declare", handPreview: { S: "JT932", H: "K2", D: "", C: "" } },
];

/** Return items that are still "new" (newUntil >= today). */
export function getNewPracticeItems() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return NEW_PRACTICE_ITEMS.filter((item) => {
    const until = new Date(item.newUntil);
    until.setHours(0, 0, 0, 0);
    return until >= today;
  }).map((item) => ({
    ...item,
    from: "practice",
    sortDate: new Date(item.newUntil),
  }));
}
