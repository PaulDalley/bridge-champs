import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { TRAINER_CATEGORY_TABS } from "../Trainers/trainerCategoryTabs";
import { sendPracticeEvent, sendTreadmillEvent, treadmillAuthSegmentForGa } from "../../utils/analytics";
import Signup from "../Auth/Signup";
import {
  startFacebookLogin,
  startGoogleLogin,
  signupEmailAndPasswordLogin,
  setProfileName,
} from "../../store/actions/authActions";
import {
  TREADMILL_TRAINER_HAND_SHAPE,
  TREADMILL_TRAINER_OPPONENT_SHAPE,
  TREADMILL_TRAINER_BUILDING_BLOCKS,
  incrementTreadmillDailyCount,
  treadmillDailyLimitReached,
  treadmillFreeRoundsRemaining,
} from "../../utils/treadmillDailyTries";
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

/** Guest / free-tier only — do not show when `treadmillUnlimited` (Basic, Premium, or admin). */
const TREADMILL_GUEST_ACCOUNT_PROMO_NOTE =
  "Create an account below — 4 free correct answers per day on this drill, unlimited with Basic or Premium.";

const TREADMILL_EMBEDDED_SIGNUP_TITLE = "Create a username to play";
const TREADMILL_EMBEDDED_SIGNUP_SUBTITLE = "30 second sign up, then you're ready to play!";

const TREADMILL_DAILY_LIMIT_DONE_NOTE =
  "You've used today's 4 free correct answers on this drill. Subscribe for unlimited access (Basic or Premium).";

function treadmillLockedPreviewNote({ treadmillUnlimited, uid, dailyExhausted }) {
  if (treadmillUnlimited) return undefined;
  if (!uid) return TREADMILL_GUEST_ACCOUNT_PROMO_NOTE;
  if (dailyExhausted) return TREADMILL_DAILY_LIMIT_DONE_NOTE;
  return undefined;
}

function toolFromPathname(pathname) {
  const p = pathname || "";
  if (p.endsWith("/opponent-shape")) return TOOL_KEYS.OPPONENT_SHAPE;
  if (p.endsWith("/building-blocks")) return TOOL_KEYS.BUILDING_BLOCKS;
  return TOOL_KEYS.HAND_SHAPE;
}

function pathnameForTool(tool) {
  if (tool === TOOL_KEYS.OPPONENT_SHAPE) return "/treadmill/practice/opponent-shape";
  if (tool === TOOL_KEYS.BUILDING_BLOCKS) return "/treadmill/practice/building-blocks";
  return "/treadmill/practice";
}

/** GA4 event param `treadmill_tool` — snake_case per GA4 conventions. */
function treadmillToolGaValue(tool) {
  if (tool === TOOL_KEYS.OPPONENT_SHAPE) return "opponent_shape";
  if (tool === TOOL_KEYS.BUILDING_BLOCKS) return "building_blocks";
  return "hand_shape";
}

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
  const treadmillToolGaSentRef = useRef(null);
  const [activeTool, setActiveTool] = useState(() => toolFromPathname(history.location?.pathname));
  const [isNarrowViewport, setIsNarrowViewport] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(`(max-width: ${NARROW_MAX_PX}px)`).matches : false
  );

  useEffect(() => {
    if (practiceViewSentRef.current) return;
    practiceViewSentRef.current = true;
    sendPracticeEvent("practice_view", {
      trainer: "Treadmill",
      category_key: "treadmill",
      treadmill_tool: treadmillToolGaValue(toolFromPathname(history.location.pathname)),
    });
  }, [history.location.pathname]);

  useEffect(() => {
    setActiveTool(toolFromPathname(history.location?.pathname));
  }, [history.location?.pathname]);

  useEffect(() => {
    if (treadmillToolGaSentRef.current === activeTool) return;
    treadmillToolGaSentRef.current = activeTool;
    sendTreadmillEvent("treadmill_tool_select", {
      treadmill_tool: treadmillToolGaValue(activeTool),
      auth_segment: treadmillAuthSegmentForGa({
        uid,
        subscriptionActive,
        isAdmin,
      }),
    });
  }, [activeTool, uid, subscriptionActive, isAdmin]);

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
  const treadmillUnlimited = isAdmin || !!subscriptionActive;
  const [dailyTick, setDailyTick] = useState(0);

  const consumeDaily = useCallback(
    (trainerId) => {
      if (!uid || treadmillUnlimited) return;
      incrementTreadmillDailyCount(uid, trainerId);
      setDailyTick((t) => t + 1);
    },
    [uid, treadmillUnlimited]
  );

  const opponentDailyExhausted = useMemo(
    () =>
      !!uid &&
      !treadmillUnlimited &&
      treadmillDailyLimitReached(uid, TREADMILL_TRAINER_OPPONENT_SHAPE, treadmillUnlimited),
    [uid, treadmillUnlimited, dailyTick]
  );
  const buildingDailyExhausted = useMemo(
    () =>
      !!uid &&
      !treadmillUnlimited &&
      treadmillDailyLimitReached(uid, TREADMILL_TRAINER_BUILDING_BLOCKS, treadmillUnlimited),
    [uid, treadmillUnlimited, dailyTick]
  );
  const handDailyBlocked = useMemo(
    () =>
      !!uid &&
      !treadmillUnlimited &&
      treadmillDailyLimitReached(uid, TREADMILL_TRAINER_HAND_SHAPE, treadmillUnlimited),
    [uid, treadmillUnlimited, dailyTick]
  );

  const oppLocked = !uid || opponentDailyExhausted;
  const bbLocked = !uid || buildingDailyExhausted;

  const handFreeRemaining = useMemo(
    () => treadmillFreeRoundsRemaining(uid, TREADMILL_TRAINER_HAND_SHAPE, treadmillUnlimited),
    [uid, treadmillUnlimited, dailyTick]
  );

  const loginReturnPath = `${history.location.pathname || "/treadmill/practice"}${
    history.location.search || ""
  }`;

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
                    onClick={() => {
                      const path = pathnameForTool(TOOL_KEYS.HAND_SHAPE);
                      if (history.location.pathname !== path) history.replace(path);
                    }}
                  >
                    Hand shape {!uid ? "🔒" : ""}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTool === TOOL_KEYS.OPPONENT_SHAPE}
                    className={`ct-diffTab tm-toolTabBtn ${
                      activeTool === TOOL_KEYS.OPPONENT_SHAPE ? "ct-diffTab--active" : ""
                    }`}
                    onClick={() => {
                      const path = pathnameForTool(TOOL_KEYS.OPPONENT_SHAPE);
                      if (history.location.pathname !== path) history.replace(path);
                    }}
                  >
                    Opponent shape {!uid ? "🔒" : ""}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTool === TOOL_KEYS.BUILDING_BLOCKS}
                    className={`ct-diffTab tm-toolTabBtn ${
                      activeTool === TOOL_KEYS.BUILDING_BLOCKS ? "ct-diffTab--active" : ""
                    }`}
                    onClick={() => {
                      const path = pathnameForTool(TOOL_KEYS.BUILDING_BLOCKS);
                      if (history.location.pathname !== path) history.replace(path);
                    }}
                  >
                    Building blocks {!uid ? "🔒" : ""}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="tm-main">
            {activeTool === TOOL_KEYS.BUILDING_BLOCKS ? (
              <>
                <BuildingBlocksTrainer
                  lockedPreview={bbLocked}
                  previewNote={treadmillLockedPreviewNote({
                    treadmillUnlimited,
                    uid,
                    dailyExhausted: buildingDailyExhausted,
                  })}
                  onDailyRoundConsumed={
                    uid && !treadmillUnlimited
                      ? () => consumeDaily(TREADMILL_TRAINER_BUILDING_BLOCKS)
                      : undefined
                  }
                />
                {!uid ? (
                  <section className="tm-signupPanel" aria-label="Create account">
                    <Signup
                      embedded
                      embeddedTitle={TREADMILL_EMBEDDED_SIGNUP_TITLE}
                      embeddedSubtitle={TREADMILL_EMBEDDED_SIGNUP_SUBTITLE}
                      facebookLogin={doFacebookLogin}
                      googleLogin={doGoogleLogin}
                      emailLogin={doSignupEmail}
                      setProfileName={doSetProfileName}
                      history={history}
                      redirectPathAfterAuth={loginReturnPath}
                    />
                  </section>
                ) : buildingDailyExhausted && !treadmillUnlimited ? (
                  <section className="tm-previewCta" aria-label="Membership options">
                    <div className="tm-previewCta-actions">
                      <button
                        type="button"
                        className="ct-btn ct-btn--secondary"
                        onClick={() => history.push("/membership")}
                      >
                        View membership
                      </button>
                    </div>
                  </section>
                ) : null}
              </>
            ) : activeTool === TOOL_KEYS.HAND_SHAPE ? (
              <HandShapeMissingClubTrainer
                uid={uid || ""}
                treadmillUnlimited={treadmillUnlimited}
                lockedPreview={!uid}
                previewNote={treadmillLockedPreviewNote({
                  treadmillUnlimited,
                  uid,
                  dailyExhausted: false,
                })}
                dailyInteractionBlocked={handDailyBlocked}
                dailyFreeRemaining={handFreeRemaining}
                onDailyRoundConsumed={() => consumeDaily(TREADMILL_TRAINER_HAND_SHAPE)}
                onSubscribeClick={() => history.push("/membership")}
                canRecordLeaderboard={authReady && !!uid}
                belowLeaderboardSlot={
                  showGuestSignup ? (
                    <section className="tm-signupPanel" aria-label="Create account">
                      <Signup
                        embedded
                        embeddedTitle={TREADMILL_EMBEDDED_SIGNUP_TITLE}
                        embeddedSubtitle={TREADMILL_EMBEDDED_SIGNUP_SUBTITLE}
                        facebookLogin={doFacebookLogin}
                        googleLogin={doGoogleLogin}
                        emailLogin={doSignupEmail}
                        setProfileName={doSetProfileName}
                        history={history}
                        redirectPathAfterAuth={loginReturnPath}
                      />
                    </section>
                  ) : null
                }
              />
            ) : (
              <>
                <OpponentShapeTrainer
                  lockedPreview={oppLocked}
                  previewNote={treadmillLockedPreviewNote({
                    treadmillUnlimited,
                    uid,
                    dailyExhausted: opponentDailyExhausted,
                  })}
                  onDailyRoundConsumed={
                    uid && !treadmillUnlimited
                      ? () => consumeDaily(TREADMILL_TRAINER_OPPONENT_SHAPE)
                      : undefined
                  }
                />
                {!uid ? (
                  <section className="tm-signupPanel" aria-label="Create account">
                    <Signup
                      embedded
                      embeddedTitle={TREADMILL_EMBEDDED_SIGNUP_TITLE}
                      embeddedSubtitle={TREADMILL_EMBEDDED_SIGNUP_SUBTITLE}
                      facebookLogin={doFacebookLogin}
                      googleLogin={doGoogleLogin}
                      emailLogin={doSignupEmail}
                      setProfileName={doSetProfileName}
                      history={history}
                      redirectPathAfterAuth={loginReturnPath}
                    />
                  </section>
                ) : opponentDailyExhausted && !treadmillUnlimited ? (
                  <section className="tm-previewCta" aria-label="Membership options">
                    <div className="tm-previewCta-actions">
                      <button
                        type="button"
                        className="ct-btn ct-btn--secondary"
                        onClick={() => history.push("/membership")}
                      >
                        View membership
                      </button>
                    </div>
                  </section>
                ) : null}
              </>
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
