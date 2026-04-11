import React from "react";
import { TextWithColoredSuits } from "../../components/Counting/CountingTrumpsTrainer";

function Bdecl17Intro() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Let&apos;s begin with a <em className="ct-revealRichKey">central idea</em> of bridge.
        </p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          The first person to make a bid needs <span className="ct-revealGold">12+ points</span>.
        </p>
      </section>
    </div>
  );
}

function Bdecl17QPassPrompt() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          If we do <em className="ct-revealRichKey">not</em> have <span className="ct-revealGold">12+ points</span>, what do
          you think we do?
        </p>
      </section>
    </div>
  );
}

function Bdecl17QPassReveal() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">Pass</span>
        <span> — the right idea.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          If we choose <strong>not</strong> to bid — typically because we do not have enough points — we simply{" "}
          <strong>pass</strong>.
        </p>
        <p className="ct-revealRichBody">
          Get well acquainted with <strong>Pass</strong>; often it will be a <em className="ct-revealRichKey">good idea</em>.
        </p>
      </section>
    </div>
  );
}

function Bdecl17QHcpPrompt() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">How many points do we have?</h4>
        <p className="ct-revealRichBody">Remember the scale:</p>
        <ul className="ct-revealRichPoints">
          <li>
            <span className="ct-revealRichPointTitle">Aces</span>
            <span> — 4</span>
          </li>
          <li>
            <span className="ct-revealRichPointTitle">Kings</span>
            <span> — 3</span>
          </li>
          <li>
            <span className="ct-revealRichPointTitle">Queens</span>
            <span> — 2</span>
          </li>
          <li>
            <span className="ct-revealRichPointTitle">Jacks</span>
            <span> — 1</span>
          </li>
        </ul>
      </section>
    </div>
  );
}

function Bdecl17QHcpReveal() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">12</span>
        <span> — correct.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Explanation</h4>
        <p className="ct-revealRichBody">We have 12 points in total:</p>
        <ul className="ct-revealRichPoints">
          <li>
            <span className="ct-revealRichPointTitle">
              <TextWithColoredSuits text="AK" /> in diamonds
            </span>
            <span> — 7</span>
          </li>
          <li>
            <span className="ct-revealRichPointTitle">
              <TextWithColoredSuits text="KQ" /> in clubs
            </span>
            <span> — 5</span>
          </li>
        </ul>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichFooter">
          Don&apos;t worry if you don&apos;t like maths — we don&apos;t necessarily need much other arithmetic in bridge.
        </p>
      </section>
    </div>
  );
}

function Bdecl17QEnoughPrompt() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <h4 className="ct-revealRichHeading">So — do we have enough points to open?</h4>
      </section>
    </div>
  );
}

function Bdecl17QEnoughReveal() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Explanation</h4>
        <p className="ct-revealRichBody">
          <strong>Yes</strong> — we need <span className="ct-revealGold">12 or more points</span> to begin the bidding.
        </p>
      </section>
    </div>
  );
}

function Bdecl17LongestSuitTeach() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          <strong>Great</strong> — you&apos;ve counted your points and decided it&apos;s correct to{" "}
          <strong>open the bidding</strong>. So what shall we open?
        </p>
        <p className="ct-revealRichBody">Let&apos;s look at a very good guiding principle:</p>
      </section>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody">
          <span className="ct-revealGold">
            When opening, it is typically correct to open your longest suit.
          </span>
        </p>
      </section>
    </div>
  );
}

function Bdecl17QOpenPrompt() {
  return (
    <div className="ct-revealRich">
      <section className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody">
          Let&apos;s say we open on the <strong>one level</strong> — the normal start (we&apos;ll look at other opening
          bids later).
        </p>
        <h4 className="ct-revealRichHeading">What are we going to open?</h4>
      </section>
    </div>
  );
}

function Bdecl17QOpenReveal() {
  return (
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">
        <span className="ct-revealRichBadge ct-revealRichBadge--violet">
          <TextWithColoredSuits text="1♦" />
        </span>
        <span> — the right opening.</span>
      </p>
      <section className="ct-revealRichCard ct-revealRichCard--amber">
        <h4 className="ct-revealRichHeading">Keep it simple</h4>
        <p className="ct-revealRichBody">
          One of the most important habits in good bridge is <em className="ct-revealRichKey">simple, clear thinking</em>.
          Whenever we can, we keep it simple — and this is a perfect example: open{" "}
          <TextWithColoredSuits text="1♦" />.
        </p>
      </section>
    </div>
  );
}

/** Custom prompts for LBFS Stage 1 problem bdecl1-7 — rich layout (no ## / ** in user-facing strings). */
export const BDECL1_7_CUSTOM_PROMPTS = [
  {
    id: "bdecl1-7-intro",
    type: "INFO",
    atRoundIdx: -1,
    promptText: <Bdecl17Intro />,
  },
  {
    id: "bdecl1-7-q-pass-or-not",
    type: "PLAY_DECISION",
    atRoundIdx: -1,
    promptText: <Bdecl17QPassPrompt />,
    options: [
      { id: "say_gin", label: "Say Gin" },
      { id: "pass", label: "Pass" },
      { id: "uno", label: "Uno" },
      { id: "yahtzee", label: "Yahtzee" },
    ],
    expectedChoice: "pass",
    wrongTryText: "Not quite — try again.",
    revealText: <Bdecl17QPassReveal />,
  },
  {
    id: "bdecl1-7-q-hcp-count",
    type: "PLAY_DECISION",
    atRoundIdx: -1,
    promptText: <Bdecl17QHcpPrompt />,
    options: [
      { id: "pts10", label: "10" },
      { id: "pts11", label: "11" },
      { id: "pts12", label: "12" },
      { id: "pts13", label: "13" },
    ],
    expectedChoice: "pts12",
    expectedChoiceDisplay: "12",
    wrongTryText: "Not quite — try again.",
    revealText: <Bdecl17QHcpReveal />,
  },
  {
    id: "bdecl1-7-q-enough-to-open",
    type: "PLAY_DECISION",
    atRoundIdx: -1,
    promptText: <Bdecl17QEnoughPrompt />,
    options: [
      { id: "open_yes", label: "Yes" },
      { id: "open_no", label: "No" },
    ],
    expectedChoice: "open_yes",
    wrongTryText: "Not quite — try again.",
    revealText: <Bdecl17QEnoughReveal />,
  },
  {
    id: "bdecl1-7-longest-suit-teach",
    type: "INFO",
    atRoundIdx: -1,
    promptText: <Bdecl17LongestSuitTeach />,
  },
  {
    id: "bdecl1-7-q-open-call",
    type: "PLAY_DECISION",
    atRoundIdx: -1,
    promptText: <Bdecl17QOpenPrompt />,
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
    revealText: <Bdecl17QOpenReveal />,
  },
];
