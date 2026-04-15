/**
 * Top trainer category tabs (Declarer | Defence | Counting | Bidding | Treadmill).
 * Single source for CountingTrumpsTrainer and standalone pages (e.g. Treadmill).
 */
export const TRAINER_CATEGORY_TABS = [
  { key: "declarer", label: "Declarer", path: "/cardPlay/practice" },
  { key: "defence", label: "Defence", path: "/defence/practice" },
  { key: "counting", label: "Counting", path: "/counting/practice" },
  { key: "bidding", label: "Bidding", path: "/bidding/practice" },
  { key: "treadmill", label: "Treadmill", path: "/treadmill/practice", new: true },
];
