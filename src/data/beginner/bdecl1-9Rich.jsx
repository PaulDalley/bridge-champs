import React from "react";
import { TextWithColoredSuits } from "../../components/Counting/CountingTrumpsTrainer";

function Bdecl19IntroFiveMajors() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Opening a major</h4>
        <p className="ct-revealRichBody">
          There is one additional small rule when opening <TextWithColoredSuits text="1♥" /> or{" "}
          <TextWithColoredSuits text="1♠" />: we must have at least <strong>five</strong> of them.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          Don&apos;t worry — I will recap all the rules and give you practice hands. It will feel simple and natural
          before you know it!
        </p>
      </section>
    </div>
  );
}

function Bdecl19IntroBetterMinor() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">When hearts or spades aren&apos;t long enough</h4>
        <p className="ct-revealRichBody">
          That sometimes leaves us with a difficult problem. Our longest suits are hearts or spades — but they are{" "}
          <strong>not</strong> long enough to open: you need <strong>five</strong> cards in hearts or in spades to open{" "}
          <TextWithColoredSuits text="1♥" /> or <TextWithColoredSuits text="1♠" />. So what do we do?
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          The answer is simple: we turn our gaze to our clubs and diamonds and open the <strong>longer</strong> of the
          two.
        </p>
        <p className="ct-revealRichBody">
          Occasionally they are the same length, in which case we can open either — but typically{" "}
          <TextWithColoredSuits text="1♣" />.
        </p>
      </section>
    </div>
  );
}

function Bdecl19QBidPrompt() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">On this hand</h4>
        <p className="ct-revealRichBody">What is your opening bid?</p>
      </section>
    </div>
  );
}

function Bdecl19QBidReveal() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">
          <TextWithColoredSuits text="1♦" />
        </span>
        <span> — correct.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Explanation</h4>
        <p className="ct-revealRichBody">
          <TextWithColoredSuits text="1♦" /> is the correct bid.
        </p>
        <p className="ct-revealRichBody">
          To begin with, let&apos;s rule out <TextWithColoredSuits text="1NT" />. To open{" "}
          <TextWithColoredSuits text="1NT" /> you need to be <em className="ct-revealRichKey">balanced</em> and have{" "}
          <span className="ct-revealGold">15–17 points</span>. We are balanced, but we only have{" "}
          <strong>13 points</strong>.
        </p>
        <p className="ct-revealRichBody">
          We can&apos;t open on a four-card heart suit or a four-card spade suit, because we need{" "}
          <strong>five</strong> cards in hearts or in spades to open <TextWithColoredSuits text="1♥" /> or{" "}
          <TextWithColoredSuits text="1♠" />.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Bridge shorthand you&apos;ll hear at the table</h4>
        <p className="ct-revealRichBody">
          People group the four suits into two families so they can talk faster. <span className="ct-revealGold">Majors</span>{" "}
          means hearts and spades — they matter a bit more in the scoring story, and they come with stricter opening
          rules (like the five-card rule you just saw). <span className="ct-revealGold">Minors</span> means clubs and
          diamonds — still full partners in the auction. When hearts and spades are each too short to open, we often
          compare the minors and open the longer one.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          So we open our better suit between diamonds and clubs (<em className="ct-revealRichKey">better minor</em>).
          Since diamonds is longer, we open <TextWithColoredSuits text="1♦" />!
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          <strong>Well done.</strong>
        </p>
      </section>
    </div>
  );
}

export const BDECL1_9_CUSTOM_PROMPTS = [
  {
    id: "bdecl1-9-intro-five-majors",
    type: "INFO",
    atRoundIdx: -1,
    promptText: <Bdecl19IntroFiveMajors />,
  },
  {
    id: "bdecl1-9-intro-better-minor",
    type: "INFO",
    atRoundIdx: -1,
    promptText: <Bdecl19IntroBetterMinor />,
  },
  {
    id: "bdecl1-9-q-bid",
    type: "PLAY_DECISION",
    atRoundIdx: -1,
    promptText: <Bdecl19QBidPrompt />,
    options: [
      { id: "open_1c", label: "1♣" },
      { id: "open_1d", label: "1♦" },
      { id: "open_1h", label: "1♥" },
      { id: "open_1s", label: "1♠" },
      { id: "open_1nt", label: "1NT" },
    ],
    expectedChoice: "open_1d",
    expectedChoiceDisplay: "1♦",
    wrongTryText: "Not quite — try again.",
    revealText: <Bdecl19QBidReveal />,
  },
];
