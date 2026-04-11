import React from "react";
import { TextWithColoredSuits } from "../../components/Counting/CountingTrumpsTrainer";

function Bdecl18IntroNt() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Opening 1NT</h4>
        <p className="ct-revealRichBody">
          It is very common in bridge to open <TextWithColoredSuits text="1NT" />. It has a very simple but specific
          meaning — it shows <span className="ct-revealGold">15–17 points</span>, and a{" "}
          <em className="ct-revealRichKey">balanced hand</em>.
        </p>
      </section>
    </div>
  );
}

function Bdecl18IntroBalanced() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Balanced, for now</h4>
        <p className="ct-revealRichBody">
          The simplest way to define <strong>balanced</strong>, for now, is any hand <strong>without a singleton</strong>{" "}
          (only one card in a suit) and <strong>without a six-card or longer suit</strong>.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          If you look at the example hand, you can see it&apos;s quite balanced — all the suits are similar length.
          That&apos;s what we mean by <em className="ct-revealRichKey">balanced</em>.
        </p>
        <p className="ct-revealRichBody">
          Suppose you had a hand with a six-card suit and a one-card suit (a singleton). You can appreciate that the
          suits are very different in length — we call that <strong>distributional</strong> or{" "}
          <strong>unbalanced</strong>.
        </p>
      </section>
    </div>
  );
}

function Bdecl18QBidPrompt() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">Your call</h4>
        <p className="ct-revealRichBody">
          Please count your points and tell me what you think your bid should be?
        </p>
      </section>
    </div>
  );
}

function Bdecl18QBidReveal() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">
          <TextWithColoredSuits text="1NT" />
        </span>
        <span> — well done.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Explanation</h4>
        <p className="ct-revealRichBody">
          <TextWithColoredSuits text="1NT" />! We have <span className="ct-revealGold">16</span> points:{" "}
          <strong>4</strong> in spades, <strong>5</strong> in hearts, <strong>4</strong> in diamonds, and{" "}
          <strong>3</strong> in clubs — totalling 16.
        </p>
        <p className="ct-revealRichBody">
          We are also balanced — we don&apos;t have a singleton (only one card in a suit) and we don&apos;t have a
          six-card or longer suit.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          <strong>Congratulations</strong> on your first <TextWithColoredSuits text="1NT" /> opening!
        </p>
      </section>
    </div>
  );
}

export const BDECL1_8_CUSTOM_PROMPTS = [
  {
    id: "bdecl1-8-intro-nt",
    type: "INFO",
    atRoundIdx: -1,
    promptText: <Bdecl18IntroNt />,
  },
  {
    id: "bdecl1-8-intro-balanced",
    type: "INFO",
    atRoundIdx: -1,
    promptText: <Bdecl18IntroBalanced />,
  },
  {
    id: "bdecl1-8-q-bid",
    type: "PLAY_DECISION",
    atRoundIdx: -1,
    promptText: <Bdecl18QBidPrompt />,
    options: [
      { id: "open_1c", label: "1♣" },
      { id: "open_1d", label: "1♦" },
      { id: "open_1h", label: "1♥" },
      { id: "open_1s", label: "1♠" },
      { id: "open_1nt", label: "1NT" },
      { id: "pass_open", label: "Pass" },
    ],
    expectedChoice: "open_1nt",
    expectedChoiceDisplay: "1NT",
    wrongTryText: "Not quite — try again.",
    revealText: <Bdecl18QBidReveal />,
  },
];
