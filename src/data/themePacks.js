export const THEME_PACKS = [
  {
    id: "bidding-matchpoint",
    title: "Theme: Matchpoint Bidding Decisions",
    description: "",
    to: { pathname: "/bidding/practice", search: "?difficulty=2&problem=bid2-1" },
    categoryKey: "bidding",
    themeTint: "matchpoints",
    starterProblemId: "bid2-1",
    handIds: ["bid2-1", "bid2-2", "bid2-3", "bid2-4", "bid2-5"],
    icon: "campaign",
    introVideoUrl: "",
    introVideoVersion: 1,
  },
  {
    id: "enemy-five",
    title: "Theme: The enemy's 5 card suit",
    description: "",
    to: { pathname: "/defence/practice", search: "?problem=df1-9" },
    categoryKey: "defence",
    themeTint: "enemyFive",
    starterProblemId: "df1-9",
    handIds: ["df1-9", "df1-10", "df1-11", "df1-12"],
    icon: "security",
    introVideoUrl: "",
    introVideoVersion: 1,
  },
  {
    id: "drawing-trumps",
    title: "Theme: Drawing and not drawing trumps",
    description: "",
    to: { pathname: "/cardPlay/practice", search: "?problem=cp1-7" },
    categoryKey: "declarer",
    themeTint: "drawTrumps",
    starterProblemId: "cp1-7",
    handIds: ["cp1-7", "cp1-8", "cp1-9"],
    icon: "insights",
    introVideoUrl: "",
    introVideoVersion: 1,
  },
];

export const TRIAL_STARTER_IDS_BY_CATEGORY = THEME_PACKS.reduce((acc, pack) => {
  if (!pack.categoryKey || !pack.starterProblemId) return acc;
  acc[pack.categoryKey] = pack.starterProblemId;
  return acc;
}, {});

/**
 * Free problems for non-members by category.
 * If a category key is present, ONLY listed IDs are free (empty array = none free in that category).
 * If a category is omitted, legacy rules apply (trial starter + first problem per difficulty as preview).
 */
export const FREE_PROBLEM_IDS_BY_CATEGORY = {
  /** Bidding: d1 problems 1 & 6; d2 problems 1–5 (promotion — keep in sync with marketing). */
  bidding: ["bid1-1", "bid1-6", "bid2-1", "bid2-2", "bid2-3", "bid2-4", "bid2-5"],
  declarer: [],
  defence: [],
  counting: [],
};

export const THEME_INTRO_BY_TINT = THEME_PACKS.reduce((acc, pack) => {
  if (!pack?.themeTint) return acc;
  acc[pack.themeTint] = {
    url: pack.introVideoUrl || "",
    version: Number(pack.introVideoVersion || 1),
    title: pack.title || "",
  };
  return acc;
}, {});
