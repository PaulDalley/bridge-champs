import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import BeginnerScratchBanner from "./BeginnerScratchBanner";
import BeginnerGuestSignupNudge from "./BeginnerGuestSignupNudge";
import {
  BEGINNER_BIDDING_PUZZLES,
  BEGINNER_DECLARER_PUZZLES,
  BEGINNER_DEFENCE_PUZZLES,
} from "../../data/beginner/beginnerPracticePuzzles";
import CountingTrumpsTrainer from "../Counting/CountingTrumpsTrainer";
import BeginnerJustPlayHands from "./BeginnerJustPlayHands";
import "../Counting/CountingTrumpsTrainer.css";

/**
 * Which beginner “stage” tabs appear and which routes are allowed.
 * Restore Stages 2 and 4 when ready: append "defence", "bidding" in stage order.
 */
const BEGINNER_VISIBLE_CATEGORY_KEYS = ["declarer", "justPlay"];

const BEGINNER_CATEGORY_LABELS = {
  declarer: "Declarer",
  defence: "Defence",
  justPlay: "Just play",
  bidding: "Bidding",
};

const BEGINNER_CATEGORY_PATHS = {
  declarer: "/beginner/practice/declarer",
  defence: "/beginner/practice/defence",
  justPlay: "/beginner/practice/just-play",
  bidding: "/beginner/practice/bidding",
};

const BEGINNER_TRAINER_LABELS = {
  declarer: "Beginner Declarer",
  defence: "Beginner Defence",
  bidding: "Beginner Bidding",
};

/** First N Stage‑1 (declarer) hands free on /beginner/practice; rest of that tab stays paywalled. */
const BEGINNER_FREE_PUBLIC_PRACTICE_SLOTS = 6;

const BEGINNER_PUZZLES_BY_CATEGORY = {
  declarer: BEGINNER_DECLARER_PUZZLES,
  defence: BEGINNER_DEFENCE_PUZZLES,
  bidding: BEGINNER_BIDDING_PUZZLES,
};

const resolveBeginnerCategoryKey = (categoryFromRoute) => {
  const raw = (categoryFromRoute || "").toString().trim().toLowerCase();
  if (raw === "just-play" || raw === "justplay") return "justPlay";
  if (raw === "declarer" || raw === "defence" || raw === "bidding") return raw;
  return "declarer";
};

/** Stages 1–3 style tabs: hide inner difficulty row; Stage 4 keeps it for bidding parity. */
const BEGINNER_HIDE_DIFFICULTY_TABS = new Set(["declarer", "defence", "justPlay"]);

function buildBeginnerCategoryTabs() {
  return BEGINNER_VISIBLE_CATEGORY_KEYS.map((key) => ({
    key,
    label: BEGINNER_CATEGORY_LABELS[key],
    path: BEGINNER_CATEGORY_PATHS[key],
  }));
}

function BeginnerPracticeCategoryTabRow({ activeKey, tabs, bottomRow = null }) {
  return (
    <div className="ct-topNavWrap">
      <div className="ct-topNav" aria-label="Beginner practice navigation">
        <div className="ct-categoryRow" aria-label="Trainer category">
          <div className="ct-categoryTabs" role="tablist">
            {tabs.map((c) => (
              <Link
                key={c.key}
                to={c.path}
                className={`ct-categoryTab ${c.key === activeKey ? "ct-categoryTab--active" : ""}`}
                role="tab"
                aria-selected={c.key === activeKey}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
        {bottomRow}
      </div>
    </div>
  );
}

function BeginnerPracticePage({ match }) {
  const [justPlayTrainer, setJustPlayTrainer] = useState("declare");
  const rawSlug = (match?.params?.categoryKey || "").toString().trim().toLowerCase();
  if (rawSlug === "counting") {
    return <Redirect to="/beginner/practice/just-play" />;
  }

  const categoryKey = resolveBeginnerCategoryKey(match?.params?.categoryKey);
  if (!BEGINNER_VISIBLE_CATEGORY_KEYS.includes(categoryKey)) {
    return <Redirect to="/beginner/practice/declarer" />;
  }

  const beginnerCategoryTabsOverride = buildBeginnerCategoryTabs();

  if (categoryKey === "justPlay") {
    const justPlaySubNav = (
      <div className="ct-categoryRow ct-categoryRow--justPlaySub" aria-label="Just play mode">
        <div className="ct-categoryTabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={justPlayTrainer === "declare"}
            className={`ct-categoryTab ${justPlayTrainer === "declare" ? "ct-categoryTab--active" : ""}`}
            onClick={() => setJustPlayTrainer("declare")}
          >
            declare
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={justPlayTrainer === "defend"}
            className={`ct-categoryTab ${justPlayTrainer === "defend" ? "ct-categoryTab--active" : ""}`}
            onClick={() => setJustPlayTrainer("defend")}
          >
            defend
          </button>
        </div>
      </div>
    );

    return (
      <Fragment>
        <div className="ct-page ct-page--beginnerPractice ct-page--fullhands ct-beginnerDeclarerStage">
          <div className="ct-layout ct-layout--fullhands">
            <div className="ct-stage">
              <BeginnerPracticeCategoryTabRow
                activeKey={categoryKey}
                tabs={beginnerCategoryTabsOverride}
                bottomRow={justPlaySubNav}
              />
              <BeginnerJustPlayHands trainer={justPlayTrainer} />
            </div>
          </div>
        </div>
        <BeginnerScratchBanner />
        <BeginnerGuestSignupNudge redirectPath={match.url} />
      </Fragment>
    );
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
        beginnerCategoryTabsOverride={beginnerCategoryTabsOverride}
        puzzlesOverride={puzzlesOverride}
        beginnerPublicPracticeCount={BEGINNER_FREE_PUBLIC_PRACTICE_SLOTS}
      />
      <BeginnerScratchBanner />
      <BeginnerGuestSignupNudge redirectPath={match.url} />
    </Fragment>
  );
}

export default BeginnerPracticePage;
