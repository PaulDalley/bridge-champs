/**
 * Helper to keep each topic pack terse. Difficulty drives the deep-link `?difficulty=` param.
 */
const themePack = ({ id, title, categoryKey, difficulty, starter, handIds, tint, icon }) => ({
  id,
  title,
  description: "",
  to: {
    pathname: `/${categoryKey}/practice`,
    search: `?difficulty=${difficulty}&problem=${starter}`,
  },
  categoryKey,
  themeTint: tint || "",
  starterProblemId: starter,
  handIds,
  icon: icon || "auto_stories",
  introVideoUrl: "",
  introVideoVersion: 1,
});

export const THEME_PACKS = [
  // Existing homepage packs (kept first so the default three are unchanged).
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
    to: { pathname: "/declarer/practice", search: "?difficulty=2&problem=cp2-6" },
    categoryKey: "declarer",
    themeTint: "entriesProductive",
    starterProblemId: "cp2-6",
    handIds: ["cp2-6", "cp2-7", "cp2-8", "cp2-9", "cp2-10"],
    icon: "swap_horiz",
    introVideoUrl: "",
    introVideoVersion: 1,
  },

  // Bidding — Stage 1
  themePack({ id: "bidding-opening-eval", title: "Theme: Opening hand evaluation", categoryKey: "bidding", difficulty: 1, starter: "bid1-1", handIds: ["bid1-1", "bid1-2", "bid1-3", "bid1-4", "bid1-5"], tint: "points", icon: "calculate" }),
  themePack({ id: "bidding-responding", title: "Theme: Responding to partner", categoryKey: "bidding", difficulty: 1, starter: "bid1-6", handIds: ["bid1-6", "bid1-7", "bid1-8", "bid1-9", "bid1-10"], tint: "respond", icon: "forum" }),
  themePack({ id: "bidding-1nt", title: "Theme: The modern 1NT opening", categoryKey: "bidding", difficulty: 1, starter: "bid1-11", handIds: ["bid1-11", "bid1-12", "bid1-13", "bid1-14", "bid1-15", "bid1-16"], tint: "1nt", icon: "looks_one" }),
  themePack({ id: "bidding-overcalls-1", title: "Theme: 1-level overcalls", categoryKey: "bidding", difficulty: 1, starter: "bid1-17", handIds: ["bid1-17", "bid1-18", "bid1-19", "bid1-20"], tint: "active", icon: "campaign" }),
  themePack({ id: "bidding-overcalls-2", title: "Theme: 2-level overcalls", categoryKey: "bidding", difficulty: 1, starter: "bid1-22", handIds: ["bid1-22", "bid1-24", "bid1-25", "bid1-26", "bid1-27"], tint: "twoLevel", icon: "campaign" }),
  themePack({ id: "bidding-preempts", title: "Theme: Preempts", categoryKey: "bidding", difficulty: 1, starter: "bid1-29", handIds: ["bid1-29", "bid1-30", "bid1-31", "bid1-32", "bid1-33"], tint: "preempt", icon: "bolt" }),
  themePack({ id: "bidding-forcing", title: "Theme: Is this forcing?", categoryKey: "bidding", difficulty: 1, starter: "bid1-34", handIds: ["bid1-34", "bid1-35", "bid1-36", "bid1-37", "bid1-38"], tint: "newColour", icon: "help_outline" }),

  // Bidding — Stage 2
  themePack({ id: "bidding-adv-eval", title: "Theme: Advanced hand evaluation", categoryKey: "bidding", difficulty: 2, starter: "bid2-6", handIds: ["bid2-6", "bid2-7", "bid2-8"], tint: "handEval", icon: "insights" }),
  themePack({ id: "bidding-doubles", title: "Theme: Doubles", categoryKey: "bidding", difficulty: 2, starter: "bid2-9", handIds: ["bid2-9", "bid2-10", "bid2-11", "bid2-12", "bid2-13"], tint: "doubles", icon: "gavel" }),
  themePack({ id: "bidding-respond-double", title: "Theme: Responding to a double", categoryKey: "bidding", difficulty: 2, starter: "bid2-14", handIds: ["bid2-14", "bid2-15", "bid2-16", "bid2-17", "bid2-18"], tint: "respondToDouble", icon: "reply" }),
  themePack({ id: "bidding-power-pass", title: "Theme: The Power of Pass", categoryKey: "bidding", difficulty: 2, starter: "bid2-19", handIds: ["bid2-19", "bid2-20", "bid2-21", "bid2-22", "bid2-23"], tint: "showHand", icon: "pan_tool" }),
  themePack({ id: "bidding-slam", title: "Theme: Slam judgment", categoryKey: "bidding", difficulty: 2, starter: "bid2-24", handIds: ["bid2-24", "bid2-25", "bid2-26", "bid2-27", "bid2-28"], tint: "slamJudgment", icon: "emoji_events" }),
  themePack({ id: "bidding-high-doubles", title: "Theme: High level doubles", categoryKey: "bidding", difficulty: 2, starter: "bid2-29", handIds: ["bid2-29", "bid2-30", "bid2-31", "bid2-32", "bid2-33"], tint: "respondToDouble", icon: "gavel" }),

  // Bidding — Stage 3
  themePack({ id: "bidding-splinters", title: "Theme: Splinters", categoryKey: "bidding", difficulty: 3, starter: "bid3-1", handIds: ["bid3-1", "bid3-2", "bid3-3", "bid3-4", "bid3-5"], tint: "splinters", icon: "call_split" }),
  themePack({ id: "bidding-lebensohl", title: "Theme: Lebensohl", categoryKey: "bidding", difficulty: 3, starter: "bid3-6", handIds: ["bid3-6", "bid3-7", "bid3-8", "bid3-9", "bid3-10"], tint: "1nt", icon: "swap_vert" }),
  themePack({ id: "bidding-reverses", title: "Theme: Reverses", categoryKey: "bidding", difficulty: 3, starter: "bid3-11", handIds: ["bid3-11", "bid3-12", "bid3-13", "bid3-14", "bid3-15"], tint: "reverses", icon: "swap_horiz" }),
  themePack({ id: "bidding-4sf", title: "Theme: 4th suit forcing", categoryKey: "bidding", difficulty: 3, starter: "bid3-16", handIds: ["bid3-16", "bid3-17", "bid3-18", "bid3-19", "bid3-20"], tint: "preempt", icon: "filter_4" }),

  // Declarer — Stage 1
  themePack({ id: "declarer-knock-ace", title: "Theme: Knocking out the Ace", categoryKey: "declarer", difficulty: 1, starter: "cp1-3", handIds: ["cp1-3", "cp1-4", "cp1-5", "cp1-6"], tint: "knockAce", icon: "sports_mma" }),
  themePack({ id: "declarer-draw-trumps", title: "Theme: Drawing and not drawing trumps", categoryKey: "declarer", difficulty: 1, starter: "cp1-7", handIds: ["cp1-7", "cp1-8", "cp1-9"], tint: "drawTrumps", icon: "style" }),
  themePack({ id: "declarer-cross-ruff", title: "Theme: Ruffing a lot (cross ruffing)", categoryKey: "declarer", difficulty: 1, starter: "cp1-10", handIds: ["cp1-10", "cp1-11"], tint: "ruffingLot", icon: "shuffle" }),
  themePack({ id: "declarer-see-43", title: "Theme: See the 4-3", categoryKey: "declarer", difficulty: 1, starter: "cp1-12", handIds: ["cp1-12", "cp1-13", "cp1-14", "cp1-15", "cp1-16"], tint: "see43", icon: "visibility" }),

  // Defence — Stage 1
  themePack({ id: "defence-dummy-types", title: "Theme: Recognising dummy types", categoryKey: "defence", difficulty: 1, starter: "df1-1", handIds: ["df1-1", "df1-2", "df1-3", "df1-4"], tint: "", icon: "remove_red_eye" }),
  themePack({ id: "defence-active-passive", title: "Theme: Go active or stay passive?", categoryKey: "defence", difficulty: 1, starter: "df1-5", handIds: ["df1-5", "df1-6", "df1-7", "df1-8"], tint: "active", icon: "directions_run" }),
  themePack({ id: "defence-forcing-declarer", title: "Theme: Forcing declarer", categoryKey: "defence", difficulty: 1, starter: "df1-13", handIds: ["df1-13", "df1-14", "df1-15", "df1-16", "df1-17"], tint: "drawTrumps", icon: "fitness_center" }),
  themePack({ id: "defence-deadly-duck", title: "Theme: Deadly Duck", categoryKey: "defence", difficulty: 1, starter: "df1-18", handIds: ["df1-18", "df1-19", "df1-20", "df1-21", "df1-22"], tint: "deadlyDuck", icon: "block" }),
  themePack({ id: "defence-opening-leads", title: "Theme: Opening Leads", categoryKey: "defence", difficulty: 1, starter: "df1-23", handIds: ["df1-23", "df1-24", "df1-25", "df1-26", "df1-27"], tint: "openingLead", icon: "first_page" }),

  // Counting — Stage 1
  themePack({ id: "counting-8593", title: "Theme: 8 + 5, 9 + 4", categoryKey: "counting", difficulty: 1, starter: "p1-15", handIds: ["p1-15", "p1-16", "p1-17", "p1-18", "p1-19"], tint: "enemyFive", icon: "calculate" }),
  themePack({ id: "counting-losers", title: "Theme: Counting losers", categoryKey: "counting", difficulty: 1, starter: "p1-20", handIds: ["p1-20", "p1-21", "p1-22", "p1-23", "p1-24"], tint: "handEval", icon: "exposure_neg_1" }),
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
  /** Bidding: includes 4th-suit-forcing sample hand (bid3-16) and high-level-doubles sample hand (bid2-29) for newsletter promos. */
  bidding: ["bid1-1", "bid1-6", "bid2-1", "bid2-2", "bid2-3", "bid2-4", "bid2-5", "bid2-29", "bid3-1", "bid3-16"],
  /** Declarer: difficulty 2 problem 6 — first free hand in the “entries” series (videos unlocked for everyone on this id). */
  declarer: ["cp2-6"],
  /** Defence: includes opening-leads sample hand (df1-23) for newsletter promos. */
  defence: ["df1-23"],
  counting: ["p1-15", "p1-24", "p1-25", "p1-26", "p1-27"],
};

/** Problem rail “theme pack” intro video metadata. The trainer uses this only when a puzzle sets `promptOptions.useThemePackIntro: true` and a matching `promptOptions.promptThemeTint`. */
export const THEME_INTRO_BY_TINT = (() => {
  const acc = {
    // Legacy: declarer d1 problems 7–9 still use promptThemeTint "drawTrumps" but are not a homepage pack.
    drawTrumps: {
      url: "",
      version: 1,
      title: "Theme: Drawing and not drawing trumps",
    },
    defenceTrumpCount: {
      url: "",
      version: 1,
      title: "Theme: Quickly Counting Trumps in Defence",
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
