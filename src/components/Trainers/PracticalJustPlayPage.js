import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TRAINER_CATEGORY_TABS } from "./trainerCategoryTabs";
import BeginnerJustPlayHands from "../Beginner/BeginnerJustPlayHands";
import "../Counting/CountingTrumpsTrainer.css";

/**
 * Practical Learning "Just play" page.
 * Keeps the standard trainer top category row while rendering the just-play hands experience.
 */
function PracticalJustPlayPage() {
  const [justPlayTrainer, setJustPlayTrainer] = useState("declare");

  return (
    <div className="ct-page ct-page--fullhands ct-page--beginnerPractice">
      <div className="ct-layout ct-layout--fullhands">
        <div className="ct-stage">
          <div className="ct-topNavWrap">
            <div className="ct-topNav" aria-label="Just play navigation">
              <div className="ct-categoryRow" aria-label="Trainer category">
                <div className="ct-categoryTabs" role="tablist">
                  {TRAINER_CATEGORY_TABS.map((c) => (
                    <Link
                      key={c.key}
                      to={c.path}
                      className={`ct-categoryTab ${c.key === "justPlay" ? "ct-categoryTab--active" : ""}`}
                      role="tab"
                      aria-selected={c.key === "justPlay"}
                    >
                      {c.label}
                      {c.new && <span className="ct-newBadge" aria-label="New">New</span>}
                    </Link>
                  ))}
                </div>
              </div>
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
            </div>
          </div>

          <BeginnerJustPlayHands trainer={justPlayTrainer} />
        </div>
      </div>
    </div>
  );
}

export default PracticalJustPlayPage;
