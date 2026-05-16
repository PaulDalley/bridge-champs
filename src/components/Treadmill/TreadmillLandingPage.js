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

// Structured data for Google. WebApplication marks the page as a tool, and
// FAQPage gets the Q&A on the landing eligible for rich results in SERPs.
const STRUCTURED_DATA = {
  webApplication: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Bridge Treadmill",
    url: CANONICAL,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any (web browser)",
    description:
      "Bridge speed drills: Card Rush, hand shape recognition, opponent shape, and building blocks. Timed reps and streaks for fast bridge skills.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Bridge Champions", url: SITE_ORIGIN },
  },
  faqPage: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the Bridge Treadmill?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The Bridge Treadmill is a set of timed online bridge drills designed to build the fast, automatic skills you need at the table — counting hand shapes, spotting winners, reading opponents, and counting suits. Each drill is short, repeatable, and tracks your streak so you can see your progress.",
        },
      },
      {
        "@type": "Question",
        name: "Which bridge drills are included?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Four drills: Card Rush (spot the winning card fast), Hand Shape (recognise distributions instantly), Opponent Shape (read the layout from clues), and Building Blocks (count suits and tricks under time pressure).",
        },
      },
      {
        "@type": "Question",
        name: "Do I need an account to use the Treadmill?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You can try the drills as a guest, but creating a free account gets you onto the leaderboard and lets you track streaks over time. Sign-up takes about 30 seconds.",
        },
      },
      {
        "@type": "Question",
        name: "Is the Bridge Treadmill free?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes — the core treadmill drills are free to use. A small number of advanced features are reserved for paid members, but the speed drills themselves are open.",
        },
      },
      {
        "@type": "Question",
        name: "How long should I spend on it?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "A few minutes a day is plenty. The drills are designed for short, frequent reps — like flash cards. Most players notice a difference at the table after a couple of weeks of regular use.",
        },
      },
    ],
  },
};

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
        <title>Bridge Treadmill — Online Bridge Speed Drills | Bridge Champions</title>
        <meta
          name="description"
          content="Free online bridge speed drills: Card Rush, hand shape, opponent shape, and building blocks. Timed reps, streaks, and a leaderboard. Practice in 5 minutes a day."
        />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Bridge Treadmill — Online Bridge Speed Drills" />
        <meta
          property="og:description"
          content="Race the clock, build a streak — hand shape, opponent shape, building blocks, and Card Rush in one place."
        />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(STRUCTURED_DATA.webApplication)}</script>
        <script type="application/ld+json">{JSON.stringify(STRUCTURED_DATA.faqPage)}</script>
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

      <section className="tmLanding-about" aria-labelledby="tmLanding-about-title">
        <div className="tmLanding-aboutInner">
          <h2 id="tmLanding-about-title" className="tmLanding-aboutTitle">
            What is the Bridge Treadmill?
          </h2>
          <p className="tmLanding-aboutLead">
            The Bridge Treadmill is a set of short, timed bridge drills designed to build the
            fast, automatic skills you need at the table. Most players know the theory but freeze
            when the clock is ticking. The Treadmill turns the slow stuff into reflex.
          </p>
          <p className="tmLanding-aboutBody">
            Each drill is short, repeatable, and tracks your streak. You can play as a guest, or
            create a free account to climb the leaderboard. A few minutes a day is plenty — like
            flash cards for bridge skills.
          </p>
        </div>
      </section>

      <section className="tmLanding-drills" aria-labelledby="tmLanding-drills-title">
        <div className="tmLanding-drillsInner">
          <h2 id="tmLanding-drills-title" className="tmLanding-drillsTitle">
            Choose your drill
          </h2>
          <p className="tmLanding-drillsLead">
            Four drills, each targeting one fast-thinking skill at the bridge table.
          </p>
          <ul className="tmLanding-drillGrid">
            <li className="tmLanding-drillCard">
              <h3 className="tmLanding-drillName">Card Rush</h3>
              <p className="tmLanding-drillBlurb">
                See the key play of a hand fast — draw trumps, set up a side suit, tap dummy, go for
                ruffs. Trains the hand-recognition reflex behind almost every contract, for declarer
                and defence.
              </p>
              <p className="tmLanding-drillSkill">
                <strong>Builds:</strong> hand-plan recognition, declarer and defender reflexes.
              </p>
              <Link className="tmLanding-drillLink" to="/treadmill/card-rush">
                Learn more about Card Rush →
              </Link>
            </li>
            <li className="tmLanding-drillCard">
              <h3 className="tmLanding-drillName">Hand Shape</h3>
              <p className="tmLanding-drillBlurb">
                See a hand — name the shape. Trains you to read distribution at a glance, so you stop
                miscounting when the auction speeds up.
              </p>
              <p className="tmLanding-drillSkill">
                <strong>Builds:</strong> hand-shape recognition, bidding judgement, faster hand evaluation.
              </p>
              <Link className="tmLanding-drillLink" to="/treadmill/practice">
                Start the Treadmill →
              </Link>
            </li>
            <li className="tmLanding-drillCard">
              <h3 className="tmLanding-drillName">Opponent Shape</h3>
              <p className="tmLanding-drillBlurb">
                Read what the opponents must hold based on the auction and play. Builds the
                detective skill that separates intermediate players from solid ones.
              </p>
              <p className="tmLanding-drillSkill">
                <strong>Builds:</strong> deductive counting, reading the auction, picturing unseen hands.
              </p>
              <Link className="tmLanding-drillLink" to="/treadmill/practice">
                Start the Treadmill →
              </Link>
            </li>
            <li className="tmLanding-drillCard">
              <h3 className="tmLanding-drillName">Building Blocks</h3>
              <p className="tmLanding-drillBlurb">
                Quick reps on the basic counting skills every bridge player needs — suits, points,
                tricks. The foundation that makes the other drills click.
              </p>
              <p className="tmLanding-drillSkill">
                <strong>Builds:</strong> fast counting, point-count accuracy, trick-count fluency.
              </p>
              <Link className="tmLanding-drillLink" to="/treadmill/practice">
                Start the Treadmill →
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="tmLanding-faq" aria-labelledby="tmLanding-faq-title">
        <div className="tmLanding-faqInner">
          <h2 id="tmLanding-faq-title" className="tmLanding-faqTitle">
            Bridge Treadmill — FAQ
          </h2>
          <dl className="tmLanding-faqList">
            <div className="tmLanding-faqItem">
              <dt className="tmLanding-faqQ">What is the Bridge Treadmill?</dt>
              <dd className="tmLanding-faqA">
                A set of timed online bridge drills built around the fast skills you need at the
                table — counting hand shapes, spotting winners, reading opponents, counting suits.
                Each drill is short and repeatable, with streaks and a leaderboard.
              </dd>
            </div>
            <div className="tmLanding-faqItem">
              <dt className="tmLanding-faqQ">Which drills are included?</dt>
              <dd className="tmLanding-faqA">
                Four: Card Rush, Hand Shape, Opponent Shape, and Building Blocks. Each targets one
                fast-thinking skill so you can pick the one that matches what you want to improve.
              </dd>
            </div>
            <div className="tmLanding-faqItem">
              <dt className="tmLanding-faqQ">Do I need an account?</dt>
              <dd className="tmLanding-faqA">
                You can play as a guest, but a free account gets you on the leaderboard and tracks
                your streaks over time. Sign-up takes about 30 seconds.
              </dd>
            </div>
            <div className="tmLanding-faqItem">
              <dt className="tmLanding-faqQ">Is it free?</dt>
              <dd className="tmLanding-faqA">
                Yes — the speed drills are free to use. A small number of advanced features are
                reserved for paid members, but the core drills are open to everyone.
              </dd>
            </div>
            <div className="tmLanding-faqItem">
              <dt className="tmLanding-faqQ">How long should I spend on it?</dt>
              <dd className="tmLanding-faqA">
                A few minutes a day is enough. The drills work the same way as flash cards — short,
                frequent reps build up far better than occasional long sessions. Most players notice
                a difference at the table after a couple of weeks.
              </dd>
            </div>
          </dl>
          <div className="tmLanding-faqCta">
            <Link className="tmLanding-cta tmLanding-cta--primary" to="/treadmill/practice">
              Start the Treadmill
            </Link>
          </div>
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
