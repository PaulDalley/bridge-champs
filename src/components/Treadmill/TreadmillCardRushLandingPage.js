import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "./TreadmillCardRushLandingPage.css";
import { sendTreadmillEvent } from "../../utils/analytics";

const SITE_ORIGIN = "https://bridgechampions.com";
const CANONICAL = `${SITE_ORIGIN}/treadmill/card-rush`;
const TRAINER_PATH = "/treadmill/practice/card-rush";

// Schema.org markup: WebApplication for the tool itself, FAQPage for the Q&A.
// Both eligible for rich results in Google search.
const STRUCTURED_DATA = {
  webApplication: {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Card Rush — Bridge Speed Drill",
    url: CANONICAL,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any (web browser)",
    description:
      "Card Rush is a free online bridge drill. Recognise the key play of each hand — draw trumps, set up a side suit, tap dummy, go for ruffs — under time pressure. Builds hand-recognition reflexes for declarer and defence.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Bridge Champions", url: SITE_ORIGIN },
  },
  faqPage: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Card Rush in bridge?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Card Rush is a timed online bridge drill. You're dropped into a real hand and have to recognise the key element fast — as declarer, that's things like drawing trumps, setting up a side suit, going for ruffs, or knocking out a high card to set up a trick source. As a defender, it's things like tapping dummy, drawing dummy's trumps, or cashing the defence's tricks. You pick a card, but the win condition is recognising the right plan.",
        },
      },
      {
        "@type": "Question",
        name: "What skills does Card Rush build?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Card Rush trains you to recognise the key element of each hand fast — draw trumps, set up a side suit, go for ruffs, set up a trick source. The same on defence: drawing dummy's trumps, tapping dummy, setting up the defenders' tricks, cashing in the right order. It's the hand-recognition reflex that fluent players have and slow players don't.",
        },
      },
      {
        "@type": "Question",
        name: "How is Card Rush different from playing full bridge hands?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Full hands take 5–15 minutes each and force you to think about everything at once. Card Rush isolates the trick-play decision so you can do dozens of reps in the same time. It's the difference between playing a round of golf and going to the driving range.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need an account to play Card Rush?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You can play as a guest. A free account gets you onto the Card Rush leaderboard and lets you track your streak across sessions.",
        },
      },
      {
        "@type": "Question",
        name: "Is Card Rush free?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes — Card Rush is free to play. No paywall on the drill itself.",
        },
      },
      {
        "@type": "Question",
        name: "How often should I use Card Rush?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Short, frequent sessions work best. Five minutes a day will improve your card recognition more than one long session a week. Treat it like flash cards for bridge.",
        },
      },
    ],
  },
};

function CardRushPreviewMock() {
  return (
    <div className="cardRushLanding-preview" aria-hidden="true">
      <div className="cardRushLanding-previewFrame">
        <div className="cardRushLanding-previewTop">
          <span className="cardRushLanding-previewBadge">Card Rush</span>
          <span className="cardRushLanding-previewTimer">0:42</span>
        </div>
        <div className="cardRushLanding-previewTable">
          <div className="cardRushLanding-previewSeat cardRushLanding-previewSeat--n">
            <span className="cardRushLanding-suit cardRushLanding-suit--spades">♠</span> Q J 9
          </div>
          <div className="cardRushLanding-previewTrick">
            <span className="cardRushLanding-trickCard cardRushLanding-trickCard--w">♠ 4</span>
            <span className="cardRushLanding-trickCard cardRushLanding-trickCard--n">♠ Q</span>
            <span className="cardRushLanding-trickCard cardRushLanding-trickCard--e">♠ K</span>
          </div>
          <div className="cardRushLanding-previewSeat cardRushLanding-previewSeat--s">
            <span className="cardRushLanding-suit cardRushLanding-suit--spades">♠</span> A 7 3
          </div>
        </div>
        <p className="cardRushLanding-previewFoot">Your turn — pick the right card before the clock runs out.</p>
      </div>
    </div>
  );
}

export default function TreadmillCardRushLandingPage() {
  const seenRef = useRef(false);

  useEffect(() => {
    if (seenRef.current) return;
    seenRef.current = true;
    sendTreadmillEvent("card_rush_landing_view", {});
  }, []);

  return (
    <div className="cardRushLanding">
      <Helmet>
        <title>Card Rush — Free Online Bridge Speed Drill | Bridge Champions</title>
        <meta
          name="description"
          content="Card Rush is a free online bridge drill. Recognise the key play of each hand — draw trumps, set up a side suit, tap dummy — under time pressure. Play now."
        />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Card Rush — Free Online Bridge Speed Drill" />
        <meta
          property="og:description"
          content="Recognise the key play of each hand under time pressure — a free online bridge drill for declarer and defence."
        />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(STRUCTURED_DATA.webApplication)}</script>
        <script type="application/ld+json">{JSON.stringify(STRUCTURED_DATA.faqPage)}</script>
      </Helmet>

      <header className="cardRushLanding-hero">
        <div className="cardRushLanding-heroOverlay" aria-hidden />
        <div className="cardRushLanding-heroGrid">
          <div className="cardRushLanding-heroCopy">
            <p className="cardRushLanding-eyebrow">Bridge Treadmill · Speed Drill</p>
            <h1 className="cardRushLanding-title">
              Card <span className="cardRushLanding-titleAccent">Rush</span>
            </h1>
            <p className="cardRushLanding-lead">
              See the key play before the clock runs out — draw trumps, set up a side suit, tap dummy,
              go for ruffs. The fastest way to train the hand-recognition reflexes you need at the
              bridge table.
            </p>
            <div className="cardRushLanding-ctaRow">
              <Link
                className="cardRushLanding-cta cardRushLanding-cta--primary"
                to={TRAINER_PATH}
              >
                Play Card Rush
              </Link>
              <Link className="cardRushLanding-cta cardRushLanding-cta--ghost" to="/treadmill">
                See all Treadmill drills
              </Link>
            </div>
            <div className="cardRushLanding-chips">
              <span className="cardRushLanding-chip">Free to play</span>
              <span className="cardRushLanding-chip">Timed reps</span>
              <span className="cardRushLanding-chip">Leaderboard</span>
            </div>
          </div>
          <CardRushPreviewMock />
        </div>
      </header>

      <section className="cardRushLanding-section" aria-labelledby="cardRush-what">
        <div className="cardRushLanding-sectionInner">
          <h2 id="cardRush-what" className="cardRushLanding-sectionTitle">
            What is Card Rush?
          </h2>
          <p className="cardRushLanding-lead2">
            Card Rush is a timed bridge drill that trains you to recognise the key element of each
            hand — fast.
          </p>
          <p className="cardRushLanding-body">
            You're dropped straight into a real bridge position. As declarer, that might be: do I
            draw trumps, set up a side suit, go for a ruff, or knock out a high card to set up a
            trick source? As a defender: do I tap dummy, draw dummy's trumps, cash my tricks, or
            switch suits? You click a card — but the win condition is recognising the right plan,
            not just picking a legal card.
          </p>
          <p className="cardRushLanding-body">
            That's the whole point. Most online bridge practice forces you to think about everything
            at once: the auction, the contract, the plan, the play. Card Rush strips that down to the
            one question that matters on this hand, so you can do <em>dozens of plan-recognition reps</em>
            in the time it would take to play one full hand. It's the bridge driving range.
          </p>
        </div>
      </section>

      <section className="cardRushLanding-section cardRushLanding-section--tinted" aria-labelledby="cardRush-builds">
        <div className="cardRushLanding-sectionInner">
          <h2 id="cardRush-builds" className="cardRushLanding-sectionTitle">
            What Card Rush builds
          </h2>
          <p className="cardRushLanding-body">
            Card Rush trains the recognition reflex behind almost every hand. Most players know the
            ideas in theory — they just don't see them <em>fast enough</em> at the table. The drill
            fixes that by isolating the recognition.
          </p>
          <h3 className="cardRushLanding-subhead">As declarer</h3>
          <ul className="cardRushLanding-skillList">
            <li>
              <strong>Drawing trumps</strong> — knowing when to pull trumps immediately versus when
              to wait.
            </li>
            <li>
              <strong>Setting up a side suit</strong> — spotting that the contract depends on a side
              suit and how to build it.
            </li>
            <li>
              <strong>Going for ruffs</strong> — recognising the ruffing-value hands where extra
              tricks come from short suits.
            </li>
            <li>
              <strong>Setting up a trick source</strong> — knocking out a high card or attacking a
              suit to create winners.
            </li>
          </ul>
          <h3 className="cardRushLanding-subhead">As a defender</h3>
          <ul className="cardRushLanding-skillList">
            <li>
              <strong>Tapping dummy</strong> — forcing dummy to ruff so its trumps lose their value.
            </li>
            <li>
              <strong>Drawing dummy's trumps</strong> — leading trumps to strip declarer of a key
              resource.
            </li>
            <li>
              <strong>Setting up the defenders' tricks</strong> — building winners in the right suit
              before declarer establishes theirs.
            </li>
            <li>
              <strong>Cashing in the right order</strong> — taking your tricks while you still can.
            </li>
          </ul>
          <p className="cardRushLanding-body">
            Each rep is short, the feedback is instant, and the streak counter keeps you honest. It's
            the kind of practice that <em>actually</em> moves the needle on your card play.
          </p>
        </div>
      </section>

      <section className="cardRushLanding-section" aria-labelledby="cardRush-how">
        <div className="cardRushLanding-sectionInner">
          <h2 id="cardRush-how" className="cardRushLanding-sectionTitle">
            How Card Rush works
          </h2>
          <ol className="cardRushLanding-stepList">
            <li>
              <strong>Start the drill.</strong> Click into Card Rush and a live bridge trick is dealt
              to you straight away — no setup, no waiting.
            </li>
            <li>
              <strong>See the position.</strong> You see your hand, dummy, and any cards already
              played to the trick.
            </li>
            <li>
              <strong>Pick the right card.</strong> Click the card you want to play. The clock is
              running.
            </li>
            <li>
              <strong>Instant feedback.</strong> You see immediately whether your card was right.
              Wrong answers show you the correct play so you learn the pattern.
            </li>
            <li>
              <strong>Next puzzle.</strong> A new position loads. Build your streak. Keep going.
            </li>
          </ol>
          <div className="cardRushLanding-inlineCta">
            <Link className="cardRushLanding-cta cardRushLanding-cta--primary" to={TRAINER_PATH}>
              Start Card Rush
            </Link>
          </div>
        </div>
      </section>

      <section className="cardRushLanding-section cardRushLanding-section--tinted" aria-labelledby="cardRush-who">
        <div className="cardRushLanding-sectionInner">
          <h2 id="cardRush-who" className="cardRushLanding-sectionTitle">
            Who Card Rush is for
          </h2>
          <p className="cardRushLanding-body">
            Card Rush works for any bridge player who wants their card play to be faster and more
            accurate at the table. A few examples:
          </p>
          <ul className="cardRushLanding-whoList">
            <li>
              <strong>Newer players</strong> who freeze on simple trick-play decisions and want to
              build automatic recognition.
            </li>
            <li>
              <strong>Club players</strong> who know the theory but slow down (and make mistakes)
              when the clock pressure is on.
            </li>
            <li>
              <strong>Tournament players</strong> who want to sharpen reflexes before a session — a
              short Card Rush warm-up is faster than playing practice hands.
            </li>
            <li>
              <strong>Returning players</strong> who haven't played in a while and want a low-stakes
              way to get back into table tempo.
            </li>
          </ul>
        </div>
      </section>

      <section className="cardRushLanding-section" aria-labelledby="cardRush-faq">
        <div className="cardRushLanding-sectionInner">
          <h2 id="cardRush-faq" className="cardRushLanding-sectionTitle">
            Card Rush — FAQ
          </h2>
          <dl className="cardRushLanding-faqList">
            <div className="cardRushLanding-faqItem">
              <dt className="cardRushLanding-faqQ">What is Card Rush in bridge?</dt>
              <dd className="cardRushLanding-faqA">
                A timed online bridge drill. You're dropped into a real hand and have to recognise
                the key element fast — as declarer, things like drawing trumps, setting up a side
                suit, going for ruffs, or knocking out a high card. As a defender, things like
                tapping dummy, drawing dummy's trumps, or cashing the defence's tricks. You click a
                card, but the win condition is recognising the right plan.
              </dd>
            </div>
            <div className="cardRushLanding-faqItem">
              <dt className="cardRushLanding-faqQ">What skills does it build?</dt>
              <dd className="cardRushLanding-faqA">
                The hand-recognition reflex behind almost every contract. As declarer: when to draw
                trumps, when to set up a side suit, when to go for ruffs, when to attack a trick
                source. As a defender: when to tap dummy, when to draw dummy's trumps, when to set
                up the defenders' tricks. It's the reflex fluent players have and slow players don't.
              </dd>
            </div>
            <div className="cardRushLanding-faqItem">
              <dt className="cardRushLanding-faqQ">How is it different from playing full hands?</dt>
              <dd className="cardRushLanding-faqA">
                Full hands take 5–15 minutes and force you to think about everything at once. Card
                Rush isolates the trick-play decision so you can do dozens of reps in the same time.
                It's the difference between playing a round of golf and going to the driving range.
              </dd>
            </div>
            <div className="cardRushLanding-faqItem">
              <dt className="cardRushLanding-faqQ">Do I need an account?</dt>
              <dd className="cardRushLanding-faqA">
                You can play as a guest. A free account gets you onto the Card Rush leaderboard and
                tracks your streak across sessions.
              </dd>
            </div>
            <div className="cardRushLanding-faqItem">
              <dt className="cardRushLanding-faqQ">Is Card Rush free?</dt>
              <dd className="cardRushLanding-faqA">Yes — Card Rush is free to play.</dd>
            </div>
            <div className="cardRushLanding-faqItem">
              <dt className="cardRushLanding-faqQ">How often should I play?</dt>
              <dd className="cardRushLanding-faqA">
                Short, frequent sessions work best. Five minutes a day will improve your card
                recognition more than one long session a week. Treat it like flash cards for bridge.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="cardRushLanding-cta cardRushLanding-cta--band" aria-labelledby="cardRush-cta">
        <div className="cardRushLanding-ctaBandInner">
          <h2 id="cardRush-cta" className="cardRushLanding-ctaBandTitle">
            Ready to play?
          </h2>
          <p className="cardRushLanding-ctaBandBody">
            Card Rush takes ten seconds to start. No setup, no setup wizard. Just the drill.
          </p>
          <Link className="cardRushLanding-cta cardRushLanding-cta--primary cardRushLanding-cta--big" to={TRAINER_PATH}>
            Play Card Rush
          </Link>
        </div>
      </section>
    </div>
  );
}
