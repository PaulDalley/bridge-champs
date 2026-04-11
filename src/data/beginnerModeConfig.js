const DEFAULT_BEGINNER_DIFFICULTY_LEVELS = [1];

export const BEGINNER_TRAINER_CONFIG = {
  counting: {
    allowedDifficultyLevels: [1],
    featuredProblemIds: ["p1-15", "p1-16", "p1-17", "p1-18", "p1-19"],
  },
  declarer: {
    allowedDifficultyLevels: DEFAULT_BEGINNER_DIFFICULTY_LEVELS,
    featuredProblemIds: ["cp1-1", "cp1-2", "cp1-3", "cp1-4", "cp1-5"],
  },
  defence: {
    allowedDifficultyLevels: DEFAULT_BEGINNER_DIFFICULTY_LEVELS,
    featuredProblemIds: ["df1-1", "df1-2", "df1-3", "df1-4", "df1-5"],
  },
  bidding: {
    allowedDifficultyLevels: DEFAULT_BEGINNER_DIFFICULTY_LEVELS,
    featuredProblemIds: ["bid1-1", "bid1-2", "bid1-3", "bid1-4", "bid1-5"],
  },
};

export const BEGINNER_ARTICLE_CONFIG = {
  cardPlay: { allowedDifficultyLevels: [1] },
  cardPlayBasics: { allowedDifficultyLevels: [1] },
  defence: { allowedDifficultyLevels: [1] },
  defenceBasics: { allowedDifficultyLevels: [1] },
  bidding: { allowedDifficultyLevels: [1] },
  biddingBasics: { allowedDifficultyLevels: [1] },
  biddingAdvanced: { allowedDifficultyLevels: [1] },
  counting: { allowedDifficultyLevels: [1] },
};

const toDifficultyNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 1;
};

export const filterBeginnerTrainerPuzzles = (puzzles, categoryKey) => {
  const list = Array.isArray(puzzles) ? puzzles : [];
  const config = BEGINNER_TRAINER_CONFIG[categoryKey] || {
    allowedDifficultyLevels: DEFAULT_BEGINNER_DIFFICULTY_LEVELS,
  };
  const allowedLevels = new Set(config.allowedDifficultyLevels || DEFAULT_BEGINNER_DIFFICULTY_LEVELS);
  const filtered = list.filter((p) => allowedLevels.has(toDifficultyNumber(p?.difficulty)));

  if (!Array.isArray(config.featuredProblemIds) || config.featuredProblemIds.length === 0) {
    return filtered;
  }

  const positionById = new Map(config.featuredProblemIds.map((id, idx) => [id, idx]));
  // Beginner routes are intentionally a separate content library:
  // only explicitly featured ids should be shown.
  const featuredOnly = filtered.filter((p) => positionById.has(p?.id));
  return [...featuredOnly].sort((a, b) => {
    const aPos = positionById.has(a?.id) ? positionById.get(a.id) : Number.MAX_SAFE_INTEGER;
    const bPos = positionById.has(b?.id) ? positionById.get(b.id) : Number.MAX_SAFE_INTEGER;
    if (aPos !== bPos) return aPos - bPos;
    return (a?.id || "").localeCompare(b?.id || "");
  });
};

export const filterBeginnerArticleItems = (items, articleType) => {
  const list = Array.isArray(items) ? items : [];
  const config = BEGINNER_ARTICLE_CONFIG[articleType] || {
    allowedDifficultyLevels: DEFAULT_BEGINNER_DIFFICULTY_LEVELS,
  };
  const allowedLevels = new Set(config.allowedDifficultyLevels || DEFAULT_BEGINNER_DIFFICULTY_LEVELS);
  return list.filter((item) => allowedLevels.has(toDifficultyNumber(item?.difficulty)));
};
