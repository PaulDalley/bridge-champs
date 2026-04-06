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
    id: "using-entries",
    title: "Theme: Using entries productively",
    description: "",
    to: { pathname: "/cardPlay/practice", search: "?difficulty=2&problem=cp2-6" },
    categoryKey: "declarer",
    themeTint: "entriesProductive",
    starterProblemId: "cp2-6",
    handIds: ["cp2-6", "cp2-7", "cp2-8", "cp2-9", "cp2-10"],
    icon: "swap_horiz",
    introVideoUrl: "",
    introVideoVersion: 1,
  },
];

// Keep this list separate so beginner mode can show its own homepage packs.
// Intentionally empty for now until beginner packs are added.
export const BEGINNER_THEME_PACKS = [];

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
  /** Declarer: difficulty 2 problem 6 — first free hand in the “entries” series (videos unlocked for everyone on this id). */
  declarer: ["cp2-6"],
  defence: [],
  counting: ["p1-15"],
};

export const THEME_INTRO_BY_TINT = (() => {
  const acc = {
    // Legacy: declarer d1 problems 7–9 still use promptThemeTint "drawTrumps" but are not a homepage pack.
    drawTrumps: {
      url: "",
      version: 1,
      title: "Theme: Drawing and not drawing trumps",
    },
  };
  THEME_PACKS.forEach((pack) => {
    if (!pack?.themeTint) return;
    acc[pack.themeTint] = {
      url: pack.introVideoUrl || "",
      version: Number(pack.introVideoVersion || 1),
      title: pack.title || "",
    };
  });
  return acc;
})();
