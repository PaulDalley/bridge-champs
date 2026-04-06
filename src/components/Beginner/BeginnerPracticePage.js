import React from "react";
import {
  BEGINNER_BIDDING_PUZZLES,
  BEGINNER_COUNTING_PUZZLES,
  BEGINNER_DECLARER_PUZZLES,
  BEGINNER_DEFENCE_PUZZLES,
} from "../../data/beginner/beginnerPracticePuzzles";
import CountingTrumpsTrainer from "../Counting/CountingTrumpsTrainer";

// Beginner practical category names can be edited here.
const BEGINNER_CATEGORY_LABELS = {
  declarer: "Stage 1",
  defence: "Stage 2",
  counting: "Stage 3",
  bidding: "Stage 4",
};

const BEGINNER_CATEGORY_PATHS = {
  declarer: "/beginner/practice/declarer",
  defence: "/beginner/practice/defence",
  counting: "/beginner/practice/counting",
  bidding: "/beginner/practice/bidding",
};

const BEGINNER_TRAINER_LABELS = {
  declarer: "Beginner Declarer",
  defence: "Beginner Defence",
  counting: "Beginner Counting",
  bidding: "Beginner Bidding",
};

/** Only source for /beginner/practice — not CardPlay / Defence / Counting / Bidding trainers. */
const BEGINNER_PUZZLES_BY_CATEGORY = {
  declarer: BEGINNER_DECLARER_PUZZLES,
  defence: BEGINNER_DEFENCE_PUZZLES,
  counting: BEGINNER_COUNTING_PUZZLES,
  bidding: BEGINNER_BIDDING_PUZZLES,
};

const resolveBeginnerCategoryKey = (categoryFromRoute) => {
  const key = (categoryFromRoute || "").toString().trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(BEGINNER_CATEGORY_PATHS, key) ? key : "declarer";
};

/** Stages 1–3: no difficulty tiers; Stage 4 keeps them for parity with main bidding trainer. */
const BEGINNER_HIDE_DIFFICULTY_TABS = new Set(["declarer", "defence", "counting"]);

function BeginnerPracticePage({ match }) {
  const categoryKey = resolveBeginnerCategoryKey(match?.params?.categoryKey);
  const puzzlesOverride = BEGINNER_PUZZLES_BY_CATEGORY[categoryKey] || [];

  return (
    <CountingTrumpsTrainer
      trainerLabel={BEGINNER_TRAINER_LABELS[categoryKey]}
      categoryKey={categoryKey}
      beginnerModeOverride={true}
      beginnerIsolatedPuzzleList={true}
      hideDifficultyTabs={BEGINNER_HIDE_DIFFICULTY_TABS.has(categoryKey)}
      categoryLabelsOverride={BEGINNER_CATEGORY_LABELS}
      categoryPathOverrides={BEGINNER_CATEGORY_PATHS}
      puzzlesOverride={puzzlesOverride}
    />
  );
}

export default BeginnerPracticePage;
