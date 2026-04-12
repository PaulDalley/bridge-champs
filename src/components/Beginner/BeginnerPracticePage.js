import React, { Fragment } from "react";
import { Redirect } from "react-router-dom";
import BeginnerScratchBanner from "./BeginnerScratchBanner";
import BeginnerGuestSignupNudge from "./BeginnerGuestSignupNudge";
import {
  BEGINNER_BIDDING_PUZZLES,
  BEGINNER_COUNTING_PUZZLES,
  BEGINNER_DECLARER_PUZZLES,
  BEGINNER_DEFENCE_PUZZLES,
} from "../../data/beginner/beginnerPracticePuzzles";
import CountingTrumpsTrainer from "../Counting/CountingTrumpsTrainer";

/**
 * Which beginner “stage” tabs appear and which routes are allowed.
 * Restore Stages 2–4 when ready: ["declarer", "defence", "counting", "bidding"]
 */
const BEGINNER_VISIBLE_CATEGORY_KEYS = ["declarer"];

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

/** First N Stage‑1 (declarer) hands free on /beginner/practice; rest of that tab stays paywalled. */
const BEGINNER_FREE_PUBLIC_PRACTICE_SLOTS = 5;

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
  if (!BEGINNER_VISIBLE_CATEGORY_KEYS.includes(categoryKey)) {
    return <Redirect to="/beginner/practice/declarer" />;
  }
  const puzzlesOverride = BEGINNER_PUZZLES_BY_CATEGORY[categoryKey] || [];

  return (
    <Fragment>
      <CountingTrumpsTrainer
        trainerLabel={BEGINNER_TRAINER_LABELS[categoryKey]}
        categoryKey={categoryKey}
        beginnerModeOverride={true}
        beginnerIsolatedPuzzleList={true}
        hideDifficultyTabs={BEGINNER_HIDE_DIFFICULTY_TABS.has(categoryKey)}
        categoryLabelsOverride={BEGINNER_CATEGORY_LABELS}
        categoryPathOverrides={BEGINNER_CATEGORY_PATHS}
        beginnerVisibleCategoryKeys={BEGINNER_VISIBLE_CATEGORY_KEYS}
        puzzlesOverride={puzzlesOverride}
        beginnerPublicPracticeCount={BEGINNER_FREE_PUBLIC_PRACTICE_SLOTS}
      />
      <BeginnerScratchBanner />
      <BeginnerGuestSignupNudge redirectPath={match.url} />
    </Fragment>
  );
}

export default BeginnerPracticePage;
