import React, { Fragment } from "react";
import { Redirect } from "react-router-dom";
import BeginnerGuestSignupNudge from "./BeginnerGuestSignupNudge";
import {
  BEGINNER_BIDDING_PUZZLES,
  BEGINNER_DECLARER_PUZZLES,
  BEGINNER_DEFENCE_PUZZLES,
} from "../../data/beginner/beginnerPracticePuzzles";
import CountingTrumpsTrainer from "../Counting/CountingTrumpsTrainer";
import "../Counting/CountingTrumpsTrainer.css";

const BEGINNER_VISIBLE_CATEGORY_KEYS = ["declarer", "defence", "bidding"];

const BEGINNER_PUZZLES_BY_CATEGORY = {
  declarer: BEGINNER_DECLARER_PUZZLES,
  defence: BEGINNER_DEFENCE_PUZZLES,
  bidding: BEGINNER_BIDDING_PUZZLES,
};

const resolveBeginnerCategoryKey = (categoryFromRoute) => {
  const raw = (categoryFromRoute || "").toString().trim().toLowerCase();
  if (raw === "just-play" || raw === "justplay") return "justPlay";
  if (raw === "declarer" || raw === "defence" || raw === "bidding" || raw === "counting" || raw === "treadmill")
    return raw;
  return "declarer";
};

function BeginnerPracticePage({ match }) {
  const rawSlug = (match?.params?.categoryKey || "").toString().trim().toLowerCase();
  if (rawSlug === "counting") {
    return <Redirect to="/counting/practice" />;
  }

  const categoryKey = resolveBeginnerCategoryKey(match?.params?.categoryKey);
  if (categoryKey === "justPlay") {
    return <Redirect to="/just-play/practice" />;
  }
  if (categoryKey === "treadmill") {
    return <Redirect to="/treadmill/practice" />;
  }
  if (!BEGINNER_VISIBLE_CATEGORY_KEYS.includes(categoryKey)) {
    return <Redirect to="/beginner/practice/declarer" />;
  }

  const puzzlesOverride = BEGINNER_PUZZLES_BY_CATEGORY[categoryKey] || [];

  return (
    <Fragment>
      <CountingTrumpsTrainer
        trainerLabel="Beginner"
        categoryKey={categoryKey}
        activeCategoryKeyOverride="beginner"
        beginnerModeOverride={false}
        beginnerIsolatedPuzzleList={false}
        hideDifficultyTabs={false}
        puzzlesOverride={puzzlesOverride}
      />
      <BeginnerGuestSignupNudge redirectPath={match.url} />
    </Fragment>
  );
}

export default BeginnerPracticePage;
