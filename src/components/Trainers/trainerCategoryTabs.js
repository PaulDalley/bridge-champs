/**
 * Top trainer category tabs (Declarer | Defence | Counting | Bidding | Treadmill).
 * Single source for CountingTrumpsTrainer and standalone pages (e.g. Treadmill).
 * (Just Play was promoted to its own top-level nav card — see Nav.js.)
 */
export const TRAINER_CATEGORY_TABS = [
  { key: "declarer", label: "Declarer", path: "/declarer/practice" },
  { key: "defence", label: "Defence", path: "/defence/practice" },
  { key: "counting", label: "Counting", path: "/counting/practice" },
  { key: "bidding", label: "Bidding", path: "/bidding/practice" },
  { key: "beginner", label: "Fundamentals", path: "/beginner/practice", new: true },
  { key: "treadmill", label: "Treadmill", path: "/treadmill/practice", new: true },
];
