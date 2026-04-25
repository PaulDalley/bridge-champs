import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { TRAINER_CATEGORY_TABS } from "../Trainers/trainerCategoryTabs";
import { sendPracticeEvent } from "../../utils/analytics";
import Signup from "../Auth/Signup";
import {
  startFacebookLogin,
  startGoogleLogin,
  signupEmailAndPasswordLogin,
  setProfileName,
} from "../../store/actions/authActions";
import HandShapeMissingClubTrainer from "./HandShapeMissingClubTrainer";
import OpponentShapeTrainer from "./OpponentShapeTrainer";
import BuildingBlocksTrainer from "./BuildingBlocksTrainer";
import "../Counting/CountingTrumpsTrainer.css";
import "./TreadmillPracticePage.css";

const NARROW_MAX_PX = 480;
const TOOL_KEYS = {
  HAND_SHAPE: "hand-shape",
  OPPONENT_SHAPE: "opponent-shape",
  BUILDING_BLOCKS: "building-blocks",
};

function TreadmillPracticePage({
  history,
  uid,
  authReady,
  subscriptionActive,
  isAdmin,
  startFacebookLogin: doFacebookLogin,
  startGoogleLogin: doGoogleLogin,
  signupEmailAndPasswordLogin: doSignupEmail,
  setProfileName: doSetProfileName,
}) {
  const practiceViewSentRef = useRef(false);
  const [activeTool, setActiveTool] = useState(TOOL_KEYS.HAND_SHAPE);
  const [isNarrowViewport, setIsNarrowViewport] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(`(max-width: ${NARROW_MAX_PX}px)`).matches : false
  );

  useEffect(() => {
    if (practiceViewSentRef.current) return;
    practiceViewSentRef.current = true;
    sendPracticeEvent("practice_view", {
      trainer: "Treadmill",
      category_key: "treadmill",
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mq = window.matchMedia(`(max-width: ${NARROW_MAX_PX}px)`);
    const update = () => setIsNarrowViewport(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const isLocalhost =
    typeof window !== "undefined" && /localhost|127\.0\.0\.1/.test(window.location?.hostname || "");

  const showGuestSignup = authReady && !uid;
  const canUseOpponentShape = isAdmin || !!subscriptionActive;
  const canUseBuildingBlocks = isAdmin || !!subscriptionActive;

  return (
    <div
      className={`ct-page ${isLocalhost ? "ct-page--localhost" : ""} ${isNarrowViewport ? "tm-page--narrow" : ""}`}
    >
      <div className="ct-layout">
        <div className="ct-stage">
          <div className="ct-topNavWrap">
            <div className="ct-topNav" aria-label="Treadmill navigation">
              <div className="ct-categoryRow" aria-label="Trainer category">
                <div className="ct-categoryTabs" role="tablist">
                  {TRAINER_CATEGORY_TABS.map((c) => (
                    <Link
                      key={c.key}
                      to={c.path}
                      className={`ct-categoryTab ${c.key === "treadmill" ? "ct-categoryTab--active" : ""}`}
                      role="tab"
                      aria-selected={c.key === "treadmill"}
                    >
                      {c.label}
                      {c.new && (
                        <span className="ct-newBadge" aria-label="New">
                          New
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="ct-topNavRow ct-topNavRow--diff" aria-label="Treadmill tools">
                <span className="ct-topNavLabel">Tool</span>
                <div className="ct-diffTabs" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTool === TOOL_KEYS.HAND_SHAPE}
                    className={`ct-diffTab tm-toolTabBtn ${
                      activeTool === TOOL_KEYS.HAND_SHAPE ? "ct-diffTab--active" : ""
                    }`}
                    onClick={() => setActiveTool(TOOL_KEYS.HAND_SHAPE)}
                  >
                    Hand shape
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTool === TOOL_KEYS.OPPONENT_SHAPE}
                    className={`ct-diffTab tm-toolTabBtn ${
                      activeTool === TOOL_KEYS.OPPONENT_SHAPE ? "ct-diffTab--active" : ""
                    }`}
                    onClick={() => setActiveTool(TOOL_KEYS.OPPONENT_SHAPE)}
                  >
                    Opponent shape {!canUseOpponentShape ? "🔒" : ""}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTool === TOOL_KEYS.BUILDING_BLOCKS}
                    className={`ct-diffTab tm-toolTabBtn ${
                      activeTool === TOOL_KEYS.BUILDING_BLOCKS ? "ct-diffTab--active" : ""
                    }`}
                    onClick={() => setActiveTool(TOOL_KEYS.BUILDING_BLOCKS)}
                  >
                    Building blocks
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="tm-main">
            {activeTool === TOOL_KEYS.BUILDING_BLOCKS ? (
              canUseBuildingBlocks ? (
                <BuildingBlocksTrainer />
              ) : (
                <section className="tm-lockedPanel" aria-live="polite">
                  <h2 className="tm-lockedPanel-title">Building blocks is for paid members</h2>
                  <p className="tm-lockedPanel-body">
                    This tool is available to active Basic and Premium subscribers.
                  </p>
                  <div className="tm-lockedPanel-actions">
                    {!uid ? (
                      <button
                        type="button"
                        className="ct-btn"
                        onClick={() => history.push("/login")}
                      >
                        Log in
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="ct-btn ct-btn--secondary"
                      onClick={() => history.push("/membership")}
                    >
                      View membership
                    </button>
                  </div>
                </section>
              )
            ) : activeTool === TOOL_KEYS.HAND_SHAPE ? (
              <HandShapeMissingClubTrainer
                uid={uid || ""}
                canRecordLeaderboard={authReady && !!uid}
                belowLeaderboardSlot={
                  showGuestSignup ? (
                    <section className="tm-signupPanel" aria-label="Create account">
                      <Signup
                        embedded
                        embeddedTitle="Create username to compete on the leaderboard."
                        embeddedSubtitle="30 second sign up, then you're ready to play!"
                        facebookLogin={doFacebookLogin}
                        googleLogin={doGoogleLogin}
                        emailLogin={doSignupEmail}
                        setProfileName={doSetProfileName}
                        history={history}
                        redirectPathAfterAuth="/treadmill/practice"
                      />
                    </section>
                  ) : null
                }
              />
            ) : canUseOpponentShape ? (
              <OpponentShapeTrainer />
            ) : (
              <section className="tm-lockedPanel" aria-live="polite">
                <h2 className="tm-lockedPanel-title">Opponent shape is for paid members</h2>
                <p className="tm-lockedPanel-body">
                  This tool is available to active Basic and Premium subscribers.
                </p>
                <div className="tm-lockedPanel-actions">
                  {!uid ? (
                    <button
                      type="button"
                      className="ct-btn"
                      onClick={() => history.push("/login")}
                    >
                      Log in
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="ct-btn ct-btn--secondary"
                    onClick={() => history.push("/membership")}
                  >
                    View membership
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {isLocalhost && (
        <div className="tm-viewportHint" aria-hidden="true">
          {isNarrowViewport ? `Phone-width (≤${NARROW_MAX_PX}px)` : `Desktop width (>${NARROW_MAX_PX}px)`}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  uid: state.auth?.uid,
  authReady: state.auth?.authReady === true,
  subscriptionActive: state.auth?.subscriptionActive === true,
  isAdmin: state.auth?.a === true,
});

const mapDispatchToProps = (dispatch) => ({
  startFacebookLogin: () => dispatch(startFacebookLogin()),
  startGoogleLogin: () => dispatch(startGoogleLogin()),
  signupEmailAndPasswordLogin: (email, password) => dispatch(signupEmailAndPasswordLogin(email, password)),
  setProfileName: (firstName, surname) => dispatch(setProfileName(firstName, surname)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TreadmillPracticePage));
