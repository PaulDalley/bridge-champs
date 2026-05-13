import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Signup from "../Auth/Signup";
import {
  startFacebookLogin,
  startGoogleLogin,
  signupEmailAndPasswordLogin,
  setProfileName,
} from "../../store/actions/authActions";
import "./TreadmillLandingPage.css";
import { sendTreadmillEvent, treadmillAuthSegmentForGa } from "../../utils/analytics";

const SITE_ORIGIN = "https://bridgechampions.com";
const CANONICAL = `${SITE_ORIGIN}/treadmill`;

function TreadmillPreviewMock() {
  return (
    <div className="tmLanding-preview" aria-hidden="true">
      <div className="tmLanding-previewGlow" />
      <div className="tmLanding-previewFrame">
        <div className="tmLanding-previewTop">
          <span className="tmLanding-previewLabel">Hand shape</span>
          <span className="tmLanding-previewStreak">Streak 5</span>
        </div>
        <div className="tmLanding-previewTimer" role="presentation">
          <span className="tmLanding-previewTimerVal">0:42</span>
          <span className="tmLanding-previewTimerHint">left</span>
        </div>
        <div className="tmLanding-previewSuits" role="presentation">
          <span className="tmLanding-suit tmLanding-suit--spades">♠</span>
          <span className="tmLanding-suit tmLanding-suit--hearts">♥</span>
          <span className="tmLanding-suit tmLanding-suit--diamonds">♦</span>
          <span className="tmLanding-suit tmLanding-suit--clubs">♣</span>
        </div>
        <div className="tmLanding-previewShape" role="presentation">
          <div className="tmLanding-shapeCell">
            <span className="tmLanding-shapeN">4</span>
            <span className="tmLanding-shapeSuit">♠</span>
          </div>
          <div className="tmLanding-shapeCell">
            <span className="tmLanding-shapeN">3</span>
            <span className="tmLanding-shapeSuit">♥</span>
          </div>
          <div className="tmLanding-shapeCell">
            <span className="tmLanding-shapeN">3</span>
            <span className="tmLanding-shapeSuit">♦</span>
          </div>
          <div className="tmLanding-shapeCell tmLanding-shapeCell--dash">
            <span className="tmLanding-shapeQ">?</span>
            <span className="tmLanding-shapeSuit tmLanding-shapeSuit--muted">♣</span>
          </div>
        </div>
        <p className="tmLanding-previewFoot">Tap the missing length — next hand loads when you nail it.</p>
      </div>
    </div>
  );
}

function TreadmillLandingPage({
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
  const showGuestSignup = authReady && !uid;
  const treadmillLandingGaSentRef = useRef(false);

  useEffect(() => {
    if (treadmillLandingGaSentRef.current) return;
    treadmillLandingGaSentRef.current = true;
    sendTreadmillEvent("treadmill_landing_view", {
      auth_segment: treadmillAuthSegmentForGa({ uid, subscriptionActive, isAdmin }),
    });
  }, [uid, subscriptionActive, isAdmin]);

  return (
    <div className="tmLanding">
      <Helmet>
        <title>Bridge Treadmill — speed drills | Bridge Champions</title>
        <meta
          name="description"
          content="Quick bridge drills: hand shape, opponent shape, building blocks, and Card Rush. Timed reps and streaks — practice online."
        />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Bridge Treadmill — speed drills" />
        <meta
          property="og:description"
          content="Race the clock, build a streak — hand shape, opponent shape, building blocks, and Card Rush in one place."
        />
        <meta property="og:url" content={CANONICAL} />
      </Helmet>

      <header className="tmLanding-hero">
        <div className="tmLanding-heroOverlay" aria-hidden />
        <div className="tmLanding-heroDecor" aria-hidden />
        <div className="tmLanding-heroGrid">
          <div className="tmLanding-heroCopy">
            <p className="tmLanding-eyebrow">Speed drills · online</p>
            <h1 className="tmLanding-title">
              The <span className="tmLanding-titleAccent">Treadmill</span>
            </h1>
            <p className="tmLanding-lead">
              Race the clock, chase a streak — then jump straight into the real trainer.
            </p>
            <div className="tmLanding-ctaRow">
              <Link
                className="tmLanding-cta tmLanding-cta--primary tmLanding-cta--hero"
                to="/treadmill/practice"
              >
                Start Treadmill
              </Link>
            </div>
            <div className="tmLanding-chips" role="list">
              <span className="tmLanding-chip tmLanding-chip--gold" role="listitem">
                Timed reps
              </span>
              <span className="tmLanding-chip tmLanding-chip--coral" role="listitem">
                Streaks
              </span>
              <span className="tmLanding-chip tmLanding-chip--mint" role="listitem">
                4 drill modes
              </span>
            </div>
          </div>
          <TreadmillPreviewMock />
        </div>
      </header>

      <section className="tmLanding-voices" aria-labelledby="tmLanding-voices-title">
        <div className="tmLanding-voicesInner">
          <div className="tmLanding-voicesHead">
            <h2 id="tmLanding-voices-title" className="tmLanding-voicesTitle">
              What players say
            </h2>
            <div className="tmLanding-voicesSuits" aria-hidden="true">
              <span className="tmLanding-voicesSuit tmLanding-voicesSuit--spades">♠</span>
              <span className="tmLanding-voicesSuit tmLanding-voicesSuit--hearts">♥</span>
              <span className="tmLanding-voicesSuit tmLanding-voicesSuit--diamonds">♦</span>
              <span className="tmLanding-voicesSuit tmLanding-voicesSuit--clubs">♣</span>
            </div>
          </div>

          <figure className="tmLanding-paulQuote">
            <div className="tmLanding-paulQuote-pane" aria-hidden="true">
              <span className="tmLanding-paulQuote-paneMark">“</span>
            </div>
            <div className="tmLanding-paulQuote-main">
              <blockquote className="tmLanding-paulQuote-body">
                <span className="tmLanding-paulQuote-lead">Short reps, not long theory.</span>
                <span className="tmLanding-paulQuote-detail">
                  Keep at it in short bursts — counting — trumps first — starts to feel automatic; the rest of the hand
                  follows.
                </span>
              </blockquote>
              <figcaption className="tmLanding-paulMeta">
                <div className="tmLanding-paulAvatar" aria-hidden>
                  P
                </div>
                <div className="tmLanding-paulMetaText">
                  <cite className="tmLanding-paulName">Paul</cite>
                  <span className="tmLanding-paulRole">Bridge Champions</span>
                </div>
              </figcaption>
            </div>
          </figure>

          <ul className="tmLanding-voiceGrid" aria-label="More testimonials">
            <li className="tmLanding-voiceCard tmLanding-voiceCard--gold">
              <p className="tmLanding-voiceQuote">
                Love it — A few minutes a day and I&apos;m noticing a huge difference.
              </p>
              <p className="tmLanding-voiceBy">— Member</p>
            </li>
            <li className="tmLanding-voiceCard tmLanding-voiceCard--coral">
              <p className="tmLanding-voiceQuote">It&apos;s a great feeling to do at the table.</p>
              <p className="tmLanding-voiceBy">— Member</p>
            </li>
            <li className="tmLanding-voiceCard tmLanding-voiceCard--violet">
              <p className="tmLanding-voiceQuote">
                My partner was very impressed when I knew our opponent&apos;s hand shape.
              </p>
              <p className="tmLanding-voiceBy">— Member</p>
            </li>
          </ul>
        </div>
      </section>

      {showGuestSignup ? (
        <section className="tmLanding-signup" aria-labelledby="tmLanding-signup-heading">
          <div className="tmLanding-signupInner">
            <p className="tmLanding-signupKicker">Takes 30 seconds</p>
            <h2 id="tmLanding-signup-heading" className="tmLanding-visuallyHidden">
              Create account for the leaderboard
            </h2>
            <Signup
              embedded
              embeddedTitle="Create username to compete on the leaderboard."
              embeddedSubtitle={"30 second sign up, then you're ready to play!"}
              facebookLogin={doFacebookLogin}
              googleLogin={doGoogleLogin}
              emailLogin={doSignupEmail}
              setProfileName={doSetProfileName}
              history={history}
              redirectPathAfterAuth="/treadmill/practice"
            />
          </div>
        </section>
      ) : null}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TreadmillLandingPage));
