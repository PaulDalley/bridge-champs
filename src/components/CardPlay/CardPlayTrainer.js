import React from "react";
import { PLAY_ENGINE_COMPASS_CLOCKWISE } from "../../bridge/compassPlayOrder";
import { TRAINER_ENGINE_COMPASS, TRAINER_PUZZLE_DEFAULTS_V2 } from "../../bridge/trainerCompassEngine";
import CountingTrumpsTrainer, { TextWithColoredSuits } from "../Counting/CountingTrumpsTrainer";

/** Rich prompt copy for cp1-12 (`FormattedRevealText` accepts React nodes). */
const CP1_12_INTRO = (
  <div className="ct-revealRichRoot">
    <div className="ct-revealRich">
      <p className="ct-revealRichEyebrow">Tournament hand</p>
      <p className="ct-revealRichBody">This was a hand from the Adelaide National Open tournament that tripped up some players.</p>
      <p className="ct-revealRichBody ct-revealRichBody--tightAfterHeading">
        Please have a think what you would do, and answer this question — <strong>where are your 9 tricks coming from?</strong>
      </p>
    </div>
  </div>
);

const CP1_12_EIGHT_TRICKS = (
  <div className="ct-revealRichRoot">
    <div className="ct-revealRich">
      <p className="ct-revealRichBody">This is a good way of thinking about the hand —</p>
      <div className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody" style={{ margin: 0 }}>
          &ldquo;If I play clubs, which looks like a good source of tricks, I will have 3 club tricks, 3 hearts and 2 diamonds — that totals 8
          tricks.&rdquo;
        </p>
      </div>
    </div>
  </div>
);

const CP1_12_NINTH_QUESTION = (
  <div className="ct-revealRichRoot">
    <p className="ct-revealRichBody" style={{ margin: 0 }}>
      So where is the <strong>9th trick</strong> coming from?
    </p>
  </div>
);

const CP1_12_NINTH_REVEAL = (
  <div className="ct-revealRichRoot">
    <div className="ct-revealRich">
      <p className="ct-revealRichLead" style={{ color: "#0f766e" }}>
        Hearts! Let&apos;s look at why.
      </p>
      <p className="ct-revealRichBody">
        We could definitely make a spade trick, but the problem is — No Trump contracts are often a race, us against them!
      </p>
      <p className="ct-revealRichBody">
        If we take a spade trick, the opponents can knock out our second diamond stopper. Then the gates are wide open for their diamond winners,
        before we have set up clubs.
      </p>
    </div>
  </div>
);

const CP1_12_FOUR_THREE = (
  <div className="ct-revealRichRoot">
    <div className="ct-revealRich">
      <div className="ct-revealRichCard ct-revealRichCard--amber ct-revealPullQuote" role="figure" aria-label="Key phrase">
        <p className="ct-revealPullQuoteText">See the 4-3 fits.</p>
      </div>
      <p className="ct-revealRichBody">
        They are often a good source of tricks. In bridge our greatest source of tricks will often be our long suit; a 4-3 fit does indeed qualify as a
        &ldquo;long suit&rdquo;.
      </p>
      <p className="ct-revealRichBody">When you see your 4-3 fits, you will score more tricks.</p>
    </div>
  </div>
);

const CP1_12_HEART_CHANCES = (
  <div className="ct-revealRichRoot">
    <div className="ct-revealRich">
      <p className="ct-revealRichBody">
        If the hearts break 3-3 our 4th heart is good, or if the{" "}
        <span className="ct-revealHonorInline" aria-label="Jack of hearts">
          <TextWithColoredSuits text="J♥" />
        </span>{" "}
        comes down singleton or doubleton, the{" "}
        <span className="ct-revealHonorInline" aria-label="Ten of hearts">
          <TextWithColoredSuits text="10♥" />
        </span>{" "}
        will still score.
      </p>
      <p className="ct-revealRichBody">All up we have about a 50% chance of scoring 4 heart tricks!</p>
      <p className="ct-revealRichBody ct-revealRichBody--muted">
        When you glanced at this hand did you realise you had such a good chance of scoring 4 heart tricks?
      </p>
    </div>
  </div>
);

const CP1_12_ALWAYS = (
  <div className="ct-revealRichRoot">
    <p className="ct-revealRichLead" style={{ margin: 0, textAlign: "center" }}>
      Always see the 4-3.
    </p>
  </div>
);

const CP1_16_HEARTS_PRO = (
  <div className="ct-revealRichRoot">
    <div className="ct-revealRich">
      <p className="ct-revealRichBody">
        Declarer, as a priority, continued going after the heart suit, in a way that was a bit counter-intuitive to some people. Many people are focused
        on the{" "}
        <span className="ct-revealHonorInline">
          <TextWithColoredSuits text="K♥" />
        </span>{" "}
        scoring a trick. While that is nice, this player was more focused on the 4-3.
      </p>
      <div className="ct-revealRichCard ct-revealRichCard--amber ct-revealPullQuote" role="figure" aria-label="Key phrase">
        <p className="ct-revealPullQuoteText">See the 4-3.</p>
      </div>
    </div>
  </div>
);

const CP1_16_TRUMP_COUNT_EXPLAIN = (
  <div className="ct-revealRichRoot">
    <div className="ct-revealRich">
      <p className="ct-revealRichBody">There is 1 trump remaining.</p>
      <p className="ct-revealRichBody ct-revealRichBody--tightAfterHeading">
        Two rounds have been played where both opponents followed suit in trumps. That is 4 trumps played by the opponents. We have seen 4 of their
        trumps, and they started with 5, so 1 is still outstanding.
      </p>
    </div>
  </div>
);

const CP1_16_HEART_DIST_EXPLAIN = (
  <div className="ct-revealRichRoot">
    <div className="ct-revealRich">
      <p className="ct-revealRichBody">
        The original heart distribution was 4333. Even though the King loses, the 4th heart is a trick. It is a very useful trick since we can throw away
        our club loser on it.
      </p>
    </div>
  </div>
);

const CP1_16_REST_OURS = (
  <div className="ct-revealRichRoot">
    <p className="ct-revealRichBody" style={{ margin: 0 }}>
      As you can see, the rest of the tricks are now ours.
    </p>
  </div>
);

const CP1_13_INTRO = (
  <div className="ct-revealRichRoot">
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">You are declaring 3NT.</p>
      <p className="ct-revealRichBody">
        Lets count our certain tricks - a great habit at the start of a hand.
      </p>
      <div className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody" style={{ margin: 0 }}>
          1 spade, 1 heart, 2 clubs, and 4 diamonds = 8 tricks.
        </p>
      </div>
      <p className="ct-revealRichBody ct-revealRichBody--tightAfterHeading">
        Not a bad start. Think about where your <strong>9th trick</strong> will come from.
      </p>
    </div>
  </div>
);

const CP1_13_WRAP = (
  <div className="ct-revealRichRoot">
    <div className="ct-revealRich">
      <div className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody" style={{ margin: 0 }}>
          Your 4th spade is now a winner, the 4-3 fit is once again the source of more winners.
        </p>
      </div>
      <p className="ct-revealRichBody">
        We now have made our contract: 2 spade tricks, 1 heart, 2 clubs and 4 diamonds for a total of 9 tricks.
      </p>
    </div>
  </div>
);

const CP1_15_COUNT_CERTAIN = (
  <div className="ct-revealRichRoot">
    <div className="ct-revealRich">
      <p className="ct-revealRichLead">Lets count your certain tricks.</p>
      <div className="ct-revealRichCard ct-revealRichCard--slate">
        <p className="ct-revealRichBody" style={{ margin: 0 }}>
          4 spades, 2 hearts, 3 clubs, 2 diamonds — total 11 tricks.
        </p>
      </div>
      <p className="ct-revealRichBody">
        Here we have two 4-3 fits that might give us more tricks, clubs and hearts.
      </p>
      <p className="ct-revealRichBody ct-revealRichBody--tightAfterHeading">
        Lets watch the play and see if we can keep track of them.
      </p>
    </div>
  </div>
);

const CP1_15_HEART_FIRST_MSG = (
  <div className="ct-revealRichRoot">
    <div className="ct-revealRich">
      <p className="ct-revealRichBody">
        In this hand, testing clubs first would be a mistake. If clubs don&apos;t break and we then lose a heart trick, the opponents can cash their
        club winner and we are 1 off.
      </p>
      <div className="ct-revealRichCard ct-revealRichCard--amber">
        <p className="ct-revealRichBody" style={{ margin: 0 }}>
          That is why we make the seemingly strange-looking play of losing a heart first. Now we are in position to see whether hearts or clubs break
          and give us the extra trick.
        </p>
      </div>
    </div>
  </div>
);

const CP1_15_HEART_DIST_MSG = (
  <div className="ct-revealRichRoot">
    <div className="ct-revealRich">
      <p className="ct-revealRichBody">
        We were hoping the original heart distribution would be <strong>4-3-3-3</strong>, however it has shown to be <strong>4-2-3-4</strong>.
      </p>
      <p className="ct-revealRichBody ct-revealRichBody--tightAfterHeading">
        So unfortunately our 4th heart is not a trick. Let&apos;s carry on.
      </p>
    </div>
  </div>
);

const CP1_15_CLUB_EXPLAIN = (
  <div className="ct-revealRichRoot">
    <div className="ct-revealRich">
      <p className="ct-revealRichBody">
        The clubs broke <strong>4-3-3-3</strong>, so our 4th club is the last remaining club and will be our 12th trick!
      </p>
    </div>
  </div>
);

const CARDPLAY_PUZZLES_ALL = [
  {
    id: "cp1-1",
    difficulty: 1,
    title: "4♠: spade lead — ruffs or long suit?",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S", // you are South, declaring
    // (auction hidden for this puzzle)
    auction: "1D P 1S P 1N P 2D P 2S P 4S P P P",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://www.youtube.com/embed/FFURF5yHtCs",
      customPrompts: [
        {
          id: "cp1-1-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "This is pattern recognition practice. We won't play the hand out — we're just using the layout to train your eye. Take a good look at dummy and come up with an impression of the main theme.",
        },
        {
          id: "cp1-1-q1",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "Is this the type of hand where you try to ruff stuff in dummy, or set up dummy’s long suit?",
          options: [
            { id: "ruffs", label: "Try to ruff stuff in dummy" },
            { id: "setup", label: "Set up dummy’s long suit" },
          ],
          expectedChoice: "setup",
          noContinue: true,
          revealText:
            "This meets the conditions for setting up a long suit.\n\n✓ Dummy has opening strength values\n✓ Dummy has a long suit\n\nIn these type of hands it is preferable to go after the long suit rather than look for ruffs.",
          videoUrl: "",
        },
      ],
    },
    // East/West cards only (You + Dummy).
    shownHands: {
      // East (You / Declarer)
      DECLARER: { S: "AQJ74", H: "532", D: "Q7", C: "A53" },
      // West (Dummy)
      DUMMY: { S: "K92", H: "Q7", D: "KJ652", C: "K84" },
    },
    // Question-only exercise: no animated play.
    rounds: [],
  },
  {
    id: "cp1-2",
    difficulty: 1,
    title: "2♠: plan after two club leads",
    trumpSuit: "S",
    contract: "2♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S", // you are South, declaring
    auction: "2♠",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      videoUrlBeforeStart: "https://www.youtube.com/embed/ym_K5LU58P8",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-2-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "We'll look at a couple of tricks only. The main aim is again to build an impression of the main themes — pattern recognition. When you're ready, continue to the play.",
        },
        {
          id: "cp1-2-plan",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "At this point, what is your plan?",
          options: [
            { id: "setup_diamonds", label: "Try setup dummy’s long diamond suit" },
            { id: "draw_trumps", label: "Draw trumps" },
            { id: "ruff_hearts", label: "Ruff hearts" },
          ],
          expectedChoice: "ruff_hearts",
          noContinue: true,
          motivationText: "Nice work — keep practising these patterns. Reps build instincts.",
          videoUrl: "",
          revealText:
            "With this type of dummy it is typically best to go after ruffs, because\n\n✓ Dummy is weaker than opening values\n✓ Dummy has a shortage\n\nIt is worth noting — it’s typically not of much use to try setup a long suit in such a weak dummy.",
        },
      ],
    },
    shownHands: {
      // Dummy (North)
      DUMMY: { S: "J72", H: "2", D: "A7643", C: "7643" },
      // You (South)
      DECLARER: { S: "AK953", H: "A983", D: "Q2", C: "K2" },
    },
    rounds: [
      {
        label: "Trick 1",
        plays: [
          { seat: "LHO", card: { rank: "7", suit: "C" } },
          { seat: "DUMMY", card: { rank: "3", suit: "C" } },
          { seat: "RHO", card: { rank: "A", suit: "C" } }, // club to the Ace
          { seat: "DECLARER", card: { rank: "2", suit: "C" } }, // you play low
        ],
      },
      {
        label: "Trick 2",
        plays: [
          // RHO won Trick 1 with the Ace and continues clubs back.
          { seat: "RHO", card: { rank: "9", suit: "C" } },
          { seat: "DECLARER", card: { rank: "K", suit: "C" } }, // you win with the King
          { seat: "LHO", card: { rank: "5", suit: "C" } },
          { seat: "DUMMY", card: { rank: "4", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "cp1-3",
    difficulty: 1,
    title: "4♥: diamond lead — what at trick 2?",
    trumpSuit: "H",
    contract: "4♥",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "1♥ P 2♥ P 4♥ P P P",
    promptOptions: {
      promptThemeTint: "knockAce",
      themeLabel: "Theme: Knocking out the Ace",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://www.youtube.com/embed/ss01mt3cHmk",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-3-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "We'll only play out one trick here. The goal is to build your pattern recognition — get an impression of the main themes, then we'll ask what you'd do next.",
        },
        {
          id: "cp1-3-trick2",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "We won the first trick. What do we do at trick 2?",
          options: [
            { id: "spades", label: "Play spades" },
            { id: "hearts", label: "Play hearts" },
            { id: "diamonds", label: "Play diamonds" },
            { id: "clubs", label: "Play clubs" },
          ],
          expectedChoice: "spades",
          noContinue: true,
          wrongTryText: "Good try! Think about setting up your trick source first.",
          motivationText: "Well done — setting up your trick source first is a key habit.",
          revealText:
            "The right idea is to set up your trick source in spades first. Trick sources like that are often our #1 priority. We will try to get a ruff in dummy as well, but step 1 is often to set up your trick source.\n\nThis also lines up with the idea of \"drawing the ace\" — do not create any additional losers; just lose the ace you were always going to lose anyway.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "QJ3", H: "Q53", D: "82", C: "T8642" },
      DECLARER: { S: "K4", H: "AK9862", D: "A94", C: "A7" },
    },
    rounds: [
      {
        label: "Trick 1 (Q♦ lead)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "D" } },
          { seat: "DUMMY", card: { rank: "2", suit: "D" } },
          { seat: "RHO", card: { rank: "3", suit: "D" } },
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "cp1-4",
    difficulty: 1,
    newUntil: "2026-03-25",
    title: "1NT: which suit creates no extra losers?",
    trumpSuit: "NT",
    contract: "1NT",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "1NT P P P",
    promptOptions: {
      promptThemeTint: "knockAce",
      themeLabel: "Theme: Knocking out the Ace",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://www.youtube.com/embed/Swmhaela-Ic",
      focusNote: "We are just looking at 2 suits for this question.",
      customPrompts: [
        {
          id: "cp1-4-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "This is a quick visual puzzle. Glance at the hand and decide which suit you can aim to play without creating extra losers.",
        },
        {
          id: "cp1-4-suit",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Which suit can you aim to play without creating extra losers?",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
          ],
          expectedChoice: "spades",
          noContinue: true,
          revealText:
            "Spades.\n\nThis is a classic case of \"knocking out the Ace\". In spades you only lose the Ace you were always going to lose. In hearts, by contrast, you risk losing the Queen — which the defence otherwise have no chance of scoring on their own if you do not play the suit.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "KQJ2", H: "AJ543", D: "", C: "" },
      DECLARER: { S: "876", H: "KT9", D: "", C: "" },
    },
    rounds: [],
  },
  {
    id: "cp1-5",
    difficulty: 1,
    title: "1NT: focus on spades — knock out the Ace and King",
    newUntil: "2026-03-25",
    trumpSuit: "NT",
    contract: "1NT",
    auction: "1NT P P P",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    promptOptions: {
      promptThemeTint: "knockAce",
      themeLabel: "Theme: Knocking out the Ace",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/TtJjusUvE1k",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-5-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "Before we play the hand, let's get our pattern recognition going. We first want to consider playing a suit that does NOT create any extra losers.",
        },
        {
          id: "cp1-5-suit",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Which suit is that?",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "spades",
          noContinue: false,
          motivationText: "Exactly! Well done.",
          revealText:
            "Spades! Our eyes need to first focus on spades. We would like to \"knock out the Ace\" and king, thereby opening up a trick source.",
          videoUrl: "",
        },
        {
          id: "cp1-5-now-1",
          type: "PLAY_DECISION",
          atRoundIdx: 4,
          promptText: "What do we play now?",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "spades",
          noContinue: false,
          wrongTryText:
            "If we had played diamonds, we may have lost to the Queen and gone down. By playing spades we ensure our contract.",
          motivationText: "Spades — we need to knock out the Ace and King.",
          revealText: "Spades! We need to knock out the Ace and King to set up our trick source.",
        },
        {
          id: "cp1-5-now-2",
          type: "PLAY_DECISION",
          atRoundIdx: 6,
          promptText: "So what do we play now?",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "spades",
          noContinue: true,
          revealText:
            "We need to keep going with spades — we have almost created those two extra tricks, without creating any extra losers. Well done!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "QJT9", H: "8765", D: "KT2", C: "32" },
      DECLARER: { S: "76", H: "5432", D: "AJ98", C: "AKQ" },
      LHO: { S: "A54", H: "AKQJ", D: "Q43", C: "8765" },
      RHO: { S: "K832", H: "9", D: "7652", C: "JT94" },
    },
    rounds: [
      {
        label: "Trick 1 (West cashes ♥A)",
        plays: [
          { seat: "LHO", card: { rank: "A", suit: "H" } },
          { seat: "DUMMY", card: { rank: "8", suit: "H" } },
          { seat: "RHO", card: { rank: "9", suit: "H" } },
          { seat: "DECLARER", card: { rank: "5", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (West cashes ♥K)",
        plays: [
          { seat: "LHO", card: { rank: "K", suit: "H" } },
          { seat: "DUMMY", card: { rank: "7", suit: "H" } },
          { seat: "RHO", card: { rank: "8", suit: "S" }, showOut: true },
          { seat: "DECLARER", card: { rank: "4", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (West cashes ♥Q)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "H" } },
          { seat: "DUMMY", card: { rank: "6", suit: "H" } },
          { seat: "RHO", card: { rank: "3", suit: "S" }, showOut: true },
          { seat: "DECLARER", card: { rank: "3", suit: "H" } },
        ],
      },
      {
        label: "Trick 4 (West cashes ♥J)",
        plays: [
          { seat: "LHO", card: { rank: "J", suit: "H" } },
          { seat: "DUMMY", card: { rank: "5", suit: "H" } },
          { seat: "RHO", card: { rank: "2", suit: "S" }, showOut: true },
          { seat: "DECLARER", card: { rank: "2", suit: "H" } },
        ],
      },
      {
        label: "Trick 5 (West plays a club, South wins)",
        plays: [
          { seat: "LHO", card: { rank: "8", suit: "C" } },
          { seat: "DUMMY", card: { rank: "3", suit: "C" } },
          { seat: "RHO", card: { rank: "J", suit: "C" } },
          { seat: "DECLARER", card: { rank: "A", suit: "C" } },
        ],
      },
      {
        label: "Trick 6 (We play a spade, they win)",
        plays: [
          { seat: "DECLARER", card: { rank: "7", suit: "S" } },
          { seat: "LHO", card: { rank: "5", suit: "S" } },
          { seat: "DUMMY", card: { rank: "9", suit: "S" } },
          { seat: "RHO", card: { rank: "K", suit: "S" } },
        ],
      },
      {
        label: "Trick 7 (They play a club, South wins)",
        plays: [
          { seat: "RHO", card: { rank: "T", suit: "C" } },
          { seat: "DECLARER", card: { rank: "K", suit: "C" } },
          { seat: "LHO", card: { rank: "7", suit: "C" } },
          { seat: "DUMMY", card: { rank: "2", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "cp1-6",
    difficulty: 1,
    title: "3NT: heart lead — what suit do you play?",
    newUntil: "2026-04-15",
    trumpSuit: null,
    contract: "3NT",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    promptOptions: {
      promptThemeTint: "knockAce",
      themeLabel: "Theme: Knocking out the Ace",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/lf4rid34UWI",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-6-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "This is also a quick problem that combines pattern recognition along with some simple counting.",
        },
        {
          id: "cp1-6-suit",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "What suit do you play?",
          options: [
            { id: "hearts", label: "Hearts" },
            { id: "spades", label: "Spades" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "clubs",
          noContinue: true,
          revealText:
            "It is correct to play Clubs. Bridge is a game that changes from hand to hand. The diamond suit is an excellent candidate for setting up tricks without creating extra losers.\n\nUnfortunately we do not have the luxury of \"time\". If we lose the lead, the opponents will cash 4 hearts (as well as the A♦) and we will go 1 down.\n\nSo cash the ♣ King and then take the club finesse — hope it works. If it doesn't, at least you gave yourself a chance!\n\nYou plan to make 3 spade tricks, 1 heart, 5 clubs for a total of 9 tricks.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "K92", H: "76", D: "762", C: "AJT84" },
      DECLARER: { S: "AQ32", H: "K4", D: "KQJT", C: "K93" },
      LHO: { S: "876", H: "9532", D: "985", C: "Q76" },
      RHO: { S: "JT5", H: "AQ982", D: "A43", C: "98" },
    },
    rounds: [
      {
        label: "Trick 1 (♥5 lead to the Ace)",
        plays: [
          { seat: "LHO", card: { rank: "5", suit: "H" } },
          { seat: "DUMMY", card: { rank: "6", suit: "H" } },
          { seat: "RHO", card: { rank: "A", suit: "H" } },
          { seat: "DECLARER", card: { rank: "4", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (Heart back, your King wins)",
        plays: [
          { seat: "RHO", card: { rank: "9", suit: "H" } },
          { seat: "DECLARER", card: { rank: "K", suit: "H" } },
          { seat: "LHO", card: { rank: "3", suit: "H" } },
          { seat: "DUMMY", card: { rank: "7", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "cp1-7",
    difficulty: 1,
    newUntil: "2026-04-30",
    title: "2♠: ruff in dummy before drawing trumps",
    trumpSuit: "S",
    contract: "2♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    promptOptions: {
      promptThemeTint: "drawTrumps",
      themeLabel: "Theme: Drawing and not drawing trumps",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/_wLCdwVH2Ro",
      startAutoPlayThroughRoundIdx: 0,
      watchNote: "Watch what happens if we try to cross to dummy in order to play a heart to our King. To get the play going",
      watchNoteOnlyAfterPlayCardReveal: true,
      customPrompts: [
        {
          id: "cp1-7-trick2",
          type: "PLAY_CARD",
          atRoundIdx: 0,
          promptText: "Please play your trick 2 card by clicking on it.",
          expectedSuit: "H",
          correctRevealText: "Well done!",
          wrongRevealText: "Good try, that looks logical but it doesn't work.",
          revealText:
            "We must get our heart ruffs going straight away by playing a heart at trick 2!\n\nThis is a typical \"ruff stuff in dummy before drawing trumps\".\n\nIt is important to do that before drawing ANY trumps.\n\nWere you thinking of crossing to dummy with a spade to play a heart up to the King?\n\nWatch what happens if we do that.",
          noContinue: false,
          motivationText: "",
        },
        {
          id: "cp1-7-note",
          type: "INFO",
          atRoundIdx: 5,
          promptText:
            "Now we don't get any ruffs! The defenders drew the rest of our trumps.\n\nPlaying even one trump is an error. When we say \"ruff in dummy before drawing trumps\", we often mean before drawing any trumps.\n\nKeep going — you're building good habits.",
        },
      ],
    },
    shownHands: {
      LHO: { S: "865", H: "AQJT", D: "KJ9", C: "AT8" },
      DUMMY: { S: "AK2", H: "97", D: "Q864", C: "Q732" },
      RHO: { S: "43", H: "652", D: "T532", C: "KJ96" },
      DECLARER: { S: "QJT97", H: "K843", D: "A7", C: "54" },
    },
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (J♦ lead, low from dummy, low from East — you win the Ace)",
        plays: [
          { seat: "LHO", card: { rank: "J", suit: "D" } },
          { seat: "DUMMY", card: { rank: "4", suit: "D" } },
          { seat: "RHO", card: { rank: "3", suit: "D" } },
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (Spade to the Ace)",
        plays: [
          { seat: "DECLARER", card: { rank: "7", suit: "S" } },
          { seat: "LHO", card: { rank: "8", suit: "S" } },
          { seat: "DUMMY", card: { rank: "A", suit: "S" } },
          { seat: "RHO", card: { rank: "3", suit: "S" } },
        ],
      },
      {
        label: "Trick 3 (Heart to the King — loses to West's Ace)",
        plays: [
          { seat: "DUMMY", card: { rank: "7", suit: "H" } },
          { seat: "RHO", card: { rank: "2", suit: "H" } },
          { seat: "DECLARER", card: { rank: "K", suit: "H" } },
          { seat: "LHO", card: { rank: "A", suit: "H" } },
        ],
      },
      {
        label: "Trick 4 (West leads another spade — you win with the Queen)",
        plays: [
          { seat: "LHO", card: { rank: "5", suit: "S" } },
          { seat: "DUMMY", card: { rank: "2", suit: "S" } },
          { seat: "RHO", card: { rank: "4", suit: "S" } },
          { seat: "DECLARER", card: { rank: "Q", suit: "S" } },
        ],
      },
      {
        label: "Trick 5 (You play another heart — West wins)",
        plays: [
          { seat: "DECLARER", card: { rank: "4", suit: "H" } },
          { seat: "LHO", card: { rank: "Q", suit: "H" } },
          { seat: "DUMMY", card: { rank: "9", suit: "H" } },
          { seat: "RHO", card: { rank: "6", suit: "H" } },
        ],
      },
      {
        label: "Trick 6 (West leads third spade — East discards a club)",
        plays: [
          { seat: "LHO", card: { rank: "6", suit: "S" } },
          { seat: "DUMMY", card: { rank: "K", suit: "S" } },
          { seat: "RHO", card: { rank: "9", suit: "C" }, showOut: true },
          { seat: "DECLARER", card: { rank: "9", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "cp1-8",
    difficulty: 1,
    newUntil: "2026-04-30",
    title: "6♠: club lead — what at trick 2?",
    trumpSuit: "S",
    contract: "6♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "drawTrumps",
      themeLabel: "Theme: Drawing and not drawing trumps",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/lIEdLDG0Yyw",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-8-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "You pick up a beautiful 23 point hand, and end up in the contract of 6♠.",
        },
        {
          id: "cp1-8-trick2",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "What is our plan?",
          options: [
            { id: "setup_clubs", label: "Setup the long clubs" },
            { id: "ruff_stuff", label: "Ruff stuff in dummy" },
            { id: "draw_trumps", label: "Just draw trumps" },
          ],
          expectedChoice: "ruff_stuff",
          noContinue: false,
          revealText:
            "It's too weak for setting up the club suit, but it is useful for ruffing stuff!",
        },
        {
          id: "cp1-8-ruff-what",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "What are we going to ruff?",
          options: [
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "diamonds",
          noContinue: false,
          revealText:
            "We will aim to ruff a diamond. On this hand we will \"create a shortage\" in dummy, by pitching dummy's diamonds on our setup heart tricks.",
        },
        {
          id: "cp1-8-draw-trumps",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "Finally, last piece of the puzzle. Can we start by drawing any trumps?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          noContinue: false,
          continueButtonLabel: "Show me the play",
          revealText:
            "No — if we draw a trump, the opponents can draw a second trump after we knock out the ♥A. So, we table a heart at trick 2, and follow the rule \"Ruff stuff in dummy BEFORE drawing trumps\".",
        },
        {
          id: "cp1-8-shortage-message",
          type: "INFO",
          atRoundIdx: 4,
          promptText: "This is the key, \"creating a shortage\" in diamonds.",
        },
        {
          id: "cp1-8-draw-trumps-done",
          type: "INFO",
          atRoundIdx: 8,
          promptText: "Now we just draw trumps, making our contract.",
        },
      ],
    },
    shownHands: {
      LHO: { S: "754", H: "AT62", D: "864", C: "JT9" },
      DUMMY: { S: "82", H: "43", D: "AT3", C: "85432" },
      RHO: { S: "63", H: "9875", D: "Q975", C: "KQ76" },
      DECLARER: { S: "AKQJT9", H: "KQJ", D: "KJ2", C: "A" },
    },
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    revealFullHandsAtEnd: ["LHO", "RHO"],
    // RULE: Every trick's plays array MUST be in clockwise order: leader first, then next player clockwise (N→E→S→W). Leader = who won previous trick (trick 1 = opening leader).
    rounds: [
      {
        label: "Trick 1 (Club lead, you win with the Ace)",
        plays: [
          { seat: "LHO", card: { rank: "9", suit: "C" } },
          { seat: "DUMMY", card: { rank: "5", suit: "C" } },
          { seat: "RHO", card: { rank: "6", suit: "C" } },
          { seat: "DECLARER", card: { rank: "A", suit: "C" } },
        ],
      },
      {
        label: "Trick 2 (Heart lead, Ace wins)",
        plays: [
          { seat: "DECLARER", card: { rank: "K", suit: "H" } },
          { seat: "LHO", card: { rank: "A", suit: "H" } },
          { seat: "DUMMY", card: { rank: "3", suit: "H" } },
          { seat: "RHO", card: { rank: "5", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (Spade back, you win Ace, dummy plays 2♠)",
        plays: [
          { seat: "LHO", card: { rank: "4", suit: "S" } },
          { seat: "DUMMY", card: { rank: "2", suit: "S" } },
          { seat: "RHO", card: { rank: "6", suit: "S" } },
          { seat: "DECLARER", card: { rank: "A", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (Queen of hearts, both follow)",
        plays: [
          { seat: "DECLARER", card: { rank: "Q", suit: "H" } },
          { seat: "LHO", card: { rank: "6", suit: "H" } },
          { seat: "DUMMY", card: { rank: "4", suit: "H" } },
          { seat: "RHO", card: { rank: "7", suit: "H" } },
        ],
      },
      {
        label: "Trick 5 (Jack of hearts, both follow, pitch diamond from dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "J", suit: "H" } },
          { seat: "LHO", card: { rank: "2", suit: "H" } },
          { seat: "DUMMY", card: { rank: "3", suit: "D" } },
          { seat: "RHO", card: { rank: "8", suit: "H" } },
        ],
      },
      {
        label: "Trick 6 (South leads diamond, dummy wins with Ace)",
        plays: [
          { seat: "DECLARER", card: { rank: "2", suit: "D" } },
          { seat: "LHO", card: { rank: "4", suit: "D" } },
          { seat: "DUMMY", card: { rank: "A", suit: "D" } },
          { seat: "RHO", card: { rank: "5", suit: "D" } },
        ],
      },
      {
        label: "Trick 7 (Dummy leads 10♦, declarer wins K♦)",
        plays: [
          { seat: "DUMMY", card: { rank: "T", suit: "D" } },
          { seat: "RHO", card: { rank: "7", suit: "D" } },
          { seat: "DECLARER", card: { rank: "K", suit: "D" } },
          { seat: "LHO", card: { rank: "6", suit: "D" } },
        ],
      },
      {
        label: "Trick 8 (Diamond ruffed with 8♠ in dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "J", suit: "D" } },
          { seat: "LHO", card: { rank: "8", suit: "D" } },
          { seat: "DUMMY", card: { rank: "8", suit: "S" } },
          { seat: "RHO", card: { rank: "9", suit: "D" } },
        ],
      },
      {
        label: "Trick 9 (Club from dummy, spade from hand)",
        plays: [
          { seat: "DUMMY", card: { rank: "8", suit: "C" } },
          { seat: "RHO", card: { rank: "7", suit: "C" } },
          { seat: "DECLARER", card: { rank: "9", suit: "S" } },
          { seat: "LHO", card: { rank: "T", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "cp1-9",
    difficulty: 1,
    newUntil: "2026-04-30",
    title: "6♣: diamond lead — can we just draw trumps?",
    trumpSuit: "C",
    contract: "6♣",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "drawTrumps",
      themeLabel: "Theme: Drawing and not drawing trumps",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/Y0b3rq-rKtQ",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-9-intro-1",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "This is a hand from the 2023 Gold Coast round of 4, where a player from the team that won the entire event managed to go down in 6♣.",
        },
        {
          id: "cp1-9-intro-2",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "I've been trying to train your instincts to appreciate that very often we want to ruff stuff in dummy before drawing trumps. However, even though that is my instinct, I always ask myself one question:\n\n##Can I just draw trumps?##",
        },
        {
          id: "cp1-9-q1",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "Can I just draw trumps?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: false,
          revealText:
            "Yes. The key is counting tricks.\n\nIf trumps break 3-1, we still have 12 tricks: 5 clubs, 2 spades, 1 heart, 3 diamonds, and 1 spade ruff.\n\nSo we can safely draw trumps.\n\nOn this deal trumps broke 2-2, so declarer should make 13 tricks.",
        },
        {
          id: "cp1-9-how-ruff",
          type: "INFO",
          atRoundIdx: 0,
          promptText: "Wait but how did we ruff a spade, dummy has 3?",
        },
        {
          id: "cp1-9-watch-prompt",
          type: "INFO",
          atRoundIdx: 0,
          promptText: "We pitched a spade on our diamond, once again we \"created the shortage\".",
          continueButtonLabel: "watch the play",
        },
        {
          id: "cp1-9-critical-moment",
          type: "INFO",
          atRoundIdx: 4,
          promptText: "This is the critical moment, we \"create a shortage\".",
        },
        {
          id: "cp1-9-end-message",
          type: "INFO",
          atRoundIdx: 8,
          promptText: "There are no trumps out, you have the rest.",
        },
      ],
    },
    shownHands: {
      LHO: { S: "QT632", H: "987", D: "J62", C: "Q2" },
      DUMMY: { S: "K98", H: "AJT53", D: "K3", C: "754" },
      RHO: { S: "J", H: "KQ642", D: "T9875", C: "T9" },
      DECLARER: { S: "A754", H: "", D: "AQ4", C: "AKJ863" },
    },
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (Diamond lead, king wins in dummy)",
        plays: [
          { seat: "LHO", card: { rank: "J", suit: "D" } },
          { seat: "DUMMY", card: { rank: "K", suit: "D" } },
          { seat: "RHO", card: { rank: "5", suit: "D" } },
          { seat: "DECLARER", card: { rank: "4", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (Ace of clubs)",
        plays: [
          { seat: "DUMMY", card: { rank: "4", suit: "C" } },
          { seat: "RHO", card: { rank: "9", suit: "C" } },
          { seat: "DECLARER", card: { rank: "A", suit: "C" } },
          { seat: "LHO", card: { rank: "2", suit: "C" } },
        ],
      },
      {
        label: "Trick 3 (King of clubs)",
        plays: [
          { seat: "DECLARER", card: { rank: "K", suit: "C" } },
          { seat: "LHO", card: { rank: "Q", suit: "C" } },
          { seat: "DUMMY", card: { rank: "7", suit: "C" } },
          { seat: "RHO", card: { rank: "T", suit: "C" } },
        ],
      },
      {
        label: "Trick 4 (Ace of diamonds)",
        plays: [
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
          { seat: "LHO", card: { rank: "2", suit: "D" } },
          { seat: "DUMMY", card: { rank: "3", suit: "D" } },
          { seat: "RHO", card: { rank: "7", suit: "D" } },
        ],
      },
      {
        label: "Trick 5 (Queen of diamonds, pitch a spade from dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "Q", suit: "D" } },
          { seat: "LHO", card: { rank: "6", suit: "D" } },
          { seat: "DUMMY", card: { rank: "8", suit: "S" } },
          { seat: "RHO", card: { rank: "8", suit: "D" } },
        ],
      },
      {
        label: "Trick 6 (King of spades)",
        plays: [
          { seat: "DECLARER", card: { rank: "4", suit: "S" } },
          { seat: "LHO", card: { rank: "2", suit: "S" } },
          { seat: "DUMMY", card: { rank: "K", suit: "S" } },
          { seat: "RHO", card: { rank: "J", suit: "S" } },
        ],
      },
      {
        label: "Trick 7 (Ace of spades)",
        plays: [
          { seat: "DUMMY", card: { rank: "9", suit: "S" } },
          { seat: "RHO", card: { rank: "2", suit: "H" }, showOut: true },
          { seat: "DECLARER", card: { rank: "A", suit: "S" } },
          { seat: "LHO", card: { rank: "3", suit: "S" } },
        ],
      },
      {
        label: "Trick 8 (Spade ruffed in dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "5", suit: "S" } },
          { seat: "LHO", card: { rank: "6", suit: "S" } },
          { seat: "DUMMY", card: { rank: "5", suit: "C" } },
          { seat: "RHO", card: { rank: "4", suit: "H" } },
        ],
      },
      {
        label: "Trick 9 (Ace of hearts, pitch a spade)",
        plays: [
          { seat: "DUMMY", card: { rank: "A", suit: "H" } },
          { seat: "RHO", card: { rank: "K", suit: "H" } },
          { seat: "DECLARER", card: { rank: "7", suit: "S" } },
          { seat: "LHO", card: { rank: "7", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "cp1-10",
    difficulty: 1,
    newUntil: "2026-04-30",
    title: "4♥: heart lead — Ruffing a lot (cross ruffing)",
    trumpSuit: "H",
    contract: "4♥",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "ruffingLot",
      themeLabel: "Theme: Ruffing a lot (cross ruffing)",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/1P949kKAanI",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-10-intro-1",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "Continue",
          promptText:
            "These problems look at hands where \"Ruffing a lot\" might be a good idea, or might not.\n\nLet's build this into our pattern recognition.\n\nI call it \"ruffing a lot\", but similar ideas are often called \"cross ruffing\".",
        },
        {
          id: "cp1-10-intro-2",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "What are the first thoughts that come to mind when looking at this?\n\nA common first thought is: \"There is a 5-card suit, and I want to think about setting that up.\"\n\nHowever, sometimes we can count enough tricks on a cross ruff.",
        },
        {
          id: "cp1-10-intro-3",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "The typical features of a cross ruff include:\n\n✓ High trumps — often (not always) we need strong trumps so we can't get overruffed.\n✓ Few side winners — not many tricks to set up outside trumps; usually just a few cashable aces and kings.\n✓ Cash first, then ruff — use those winners before ruffing everything, or you might not get to cash them later.",
        },
        {
          id: "cp1-10-watch",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "Watch the play",
          promptText: "This hand is a very beautiful example of a cross ruff.",
        },
        {
          id: "cp1-10-cash-winners",
          type: "INFO",
          atRoundIdx: 2,
          continueButtonLabel: "Continue",
          promptText:
            "As you can see, we first cash our winners in the side suits before embarking on a cross ruff.",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "K432", H: "AQ84", D: "8", C: "A432" },
      DECLARER: { S: "", H: "KJT97", D: "A5432", C: "Q32" },
      LHO: { S: "A9865", H: "6532", D: "K863", C: "7" },
      RHO: { S: "QJT7", H: "", D: "QT97", C: "KJT986" },
    },
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (Heart lead shown on table)",
        plays: [{ seat: "LHO", card: { rank: "2", suit: "H" } }],
      },
      {
        label: "Trick 1 (continued — win the lead in hand)",
        plays: [
          { seat: "LHO", card: { rank: "2", suit: "H" } },
          { seat: "DUMMY", card: { rank: "4", suit: "H" } },
          { seat: "RHO", card: { rank: "8", suit: "C" }, showOut: true },
          { seat: "DECLARER", card: { rank: "K", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (Ace of diamonds, all follow)",
        plays: [
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
          { seat: "LHO", card: { rank: "3", suit: "D" } },
          { seat: "DUMMY", card: { rank: "8", suit: "D" } },
          { seat: "RHO", card: { rank: "7", suit: "D" } },
        ],
      },
      {
        label: "Trick 3 (Low club to the Ace in dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "2", suit: "C" } },
          { seat: "LHO", card: { rank: "7", suit: "C" } },
          { seat: "DUMMY", card: { rank: "A", suit: "C" } },
          { seat: "RHO", card: { rank: "6", suit: "C" } },
        ],
      },
      {
        label: "Trick 4 (Low spade from dummy, ruff in hand)",
        plays: [
          { seat: "DUMMY", card: { rank: "2", suit: "S" } },
          { seat: "RHO", card: { rank: "7", suit: "S" } },
          { seat: "DECLARER", card: { rank: "7", suit: "H" } },
          { seat: "LHO", card: { rank: "5", suit: "S" } },
        ],
      },
      {
        label: "Trick 5 (Diamond ruffed in dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "4", suit: "D" } },
          { seat: "LHO", card: { rank: "6", suit: "D" } },
          { seat: "DUMMY", card: { rank: "8", suit: "H" } },
          { seat: "RHO", card: { rank: "9", suit: "D" } },
        ],
      },
      {
        label: "Trick 6 (Spade from dummy, ruff in hand)",
        plays: [
          { seat: "DUMMY", card: { rank: "3", suit: "S" } },
          { seat: "RHO", card: { rank: "T", suit: "S" } },
          { seat: "DECLARER", card: { rank: "9", suit: "H" } },
          { seat: "LHO", card: { rank: "8", suit: "S" } },
        ],
      },
      {
        label: "Trick 7 (Diamond ruffed in dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "5", suit: "D" } },
          { seat: "LHO", card: { rank: "8", suit: "D" } },
          { seat: "DUMMY", card: { rank: "Q", suit: "H" } },
          { seat: "RHO", card: { rank: "T", suit: "D" } },
        ],
      },
      {
        label: "Trick 8 (Spade from dummy, ruff in hand)",
        plays: [
          { seat: "DUMMY", card: { rank: "4", suit: "S" } },
          { seat: "RHO", card: { rank: "J", suit: "S" } },
          { seat: "DECLARER", card: { rank: "T", suit: "H" } },
          { seat: "LHO", card: { rank: "6", suit: "S" } },
        ],
      },
      {
        label: "Trick 9 (Diamond ruffed in dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "3", suit: "D" } },
          { seat: "LHO", card: { rank: "K", suit: "D" } },
          { seat: "DUMMY", card: { rank: "A", suit: "H" } },
          { seat: "RHO", card: { rank: "Q", suit: "D" } },
        ],
      },
      {
        label: "Trick 10 (Spade from dummy, ruff in hand)",
        plays: [
          { seat: "DUMMY", card: { rank: "K", suit: "S" } },
          { seat: "RHO", card: { rank: "Q", suit: "S" } },
          { seat: "DECLARER", card: { rank: "J", suit: "H" } },
          { seat: "LHO", card: { rank: "9", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "cp1-11",
    difficulty: 1,
    newUntil: "2026-04-30",
    title: "5♦: club lead — can we just draw trumps?",
    trumpSuit: "D",
    contract: "5♦",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "ruffingLot",
      themeLabel: "Theme: Ruffing a lot (cross ruffing)",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/h14m5rRY6Cg",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-11-clue",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "Clue: this is a bit of a trick question.\n\nWe learn excellent ideas including:\n\n• Set up trick sources\n• Set up 5-card suits\n• Ruff stuff in dummy\n• Cross ruff",
        },
        {
          id: "cp1-11-plan",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "So, let's take a deep breath. Dummy has come down - what are we going to do?",
          options: [
            { id: "ruff_stuff", label: "Ruff stuff" },
            { id: "setup_side", label: "Setup our side suit" },
            { id: "cross_ruff", label: "Cross ruff" },
            { id: "draw_trumps", label: "Draw trumps" },
          ],
          expectedChoice: "draw_trumps",
          noContinue: true,
          revealText:
            "We can and should simply draw trumps.\n\nThis is a trick question, and it's one we have to ask ourselves every time dummy comes down. Even though the answer is often \"no\", it is the start of any good plan.\n\nWe have 11 top tricks, provided we take those trumps out as soon as possible. Any delay and the opponents will get a club ruff.\n\nSo always ask, no matter what you have just learned about declarer play:\n\n\"Can I just draw trumps?\"",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "A72", H: "74", D: "T86", C: "AQ743" },
      DECLARER: { S: "65", H: "A93", D: "KQJ75", C: "KJ6" },
      // East has exactly 2 clubs. West holds the Ace of diamonds.
      LHO: { S: "KQJ9", H: "KQ6", D: "A43", C: "T52" },
      RHO: { S: "T843", H: "JT852", D: "92", C: "98" },
    },
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (2♣ lead shown on table)",
        plays: [{ seat: "LHO", card: { rank: "2", suit: "C" } }],
      },
    ],
  },
  {
    id: "cp1-12",
    difficulty: 1,
    ...TRAINER_PUZZLE_DEFAULTS_V2,
    trainerEngine: TRAINER_ENGINE_COMPASS,
    seatMode: "compass",
    playEngine: PLAY_ENGINE_COMPASS_CLOCKWISE,
    title: "3NT: See the 4-3 (Adelaide)",
    trumpSuit: null,
    contract: "3NT",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "1NT P 2C P 2H P 3NT P P P",
    promptOptions: {
      promptThemeTint: "see43",
      themeLabel: "Theme: See the 4-3",
      contractLabel: "3NT by South",
      promptPlacement: "right",
      hideAuction: false,
      videoUrlBeforeStart: "https://youtube.com/shorts/UF2VOeUTh2w?si=Jlimar4HlRIIWLva",
      auctionHighlightCall: { row: 1, seat: "N" },
      auctionHighlightNote: "Stayman",
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: false,
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-12-intro",
          type: "INFO",
          atRoundIdx: 0,
          promptText: CP1_12_INTRO,
        },
        {
          id: "cp1-12-eight-tricks",
          type: "INFO",
          atRoundIdx: 0,
          promptText: CP1_12_EIGHT_TRICKS,
        },
        {
          id: "cp1-12-ninth-trick",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: CP1_12_NINTH_QUESTION,
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "hearts",
          revealText: CP1_12_NINTH_REVEAL,
        },
        {
          id: "cp1-12-four-three",
          type: "INFO",
          atRoundIdx: 0,
          promptText: CP1_12_FOUR_THREE,
        },
        {
          id: "cp1-12-heart-chances",
          type: "INFO",
          atRoundIdx: 0,
          promptText: CP1_12_HEART_CHANCES,
        },
        {
          id: "cp1-12-always",
          type: "INFO",
          atRoundIdx: 0,
          promptText: CP1_12_ALWAYS,
        },
      ],
    },
    shownHands: {
      north: { S: "Q53", H: "T865", D: "AT", C: "KQ93" },
      south: { S: "KT82", H: "AKQ", D: "K9", C: "JT86" },
      west: { S: "A964", H: "732", D: "743", C: "A54" },
      east: { S: "J7", H: "J94", D: "QJ8652", C: "72" },
    },
    visibleFullHandSeats: ["N", "S"],
    revealFullHandsAtEnd: ["E", "W"],
    rounds: [
      {
        label: "Trick 1 (♦7, ♦10, ♦2, ♦K)",
        plays: [
          { seat: "W", card: { rank: "7", suit: "D" } },
          { seat: "N", card: { rank: "T", suit: "D" } },
          { seat: "E", card: { rank: "2", suit: "D" } },
          { seat: "S", card: { rank: "K", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "cp1-13",
    difficulty: 1,
    ...TRAINER_PUZZLE_DEFAULTS_V2,
    trainerEngine: TRAINER_ENGINE_COMPASS,
    seatMode: "compass",
    playEngine: PLAY_ENGINE_COMPASS_CLOCKWISE,
    title: "3NT: See the 4-3 — find trick 9",
    trumpSuit: null,
    contract: "3NT",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "see43",
      themeLabel: "Theme: See the 4-3",
      contractLabel: "3NT by South",
      promptPlacement: "right",
      hideAuction: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/OQqMaJbhETM?si=QgycONDhhNzUVfe-",
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: false,
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-13-intro",
          type: "INFO",
          atRoundIdx: 0,
          promptText: CP1_13_INTRO,
        },
        {
          id: "cp1-13-finesse-choice",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "The heart finesse is my only chance at making this contract?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          revealText:
            "No, the heart finesse is not our only chance.\n\nThe heart finesse is a good chance for our 9th trick, but we have more chances than just that. By now hopefully you are able to \"see the 4-3\".",
        },
        {
          id: "cp1-13-watch-play",
          type: "INFO",
          atRoundIdx: 0,
          promptText: "Watch the play.",
          continueButtonLabel: "Watch the play",
          infoContinueToRoundIdx: 1,
        },
        {
          id: "cp1-13-keep-spades",
          type: "INFO",
          atRoundIdx: 2,
          promptText:
            "We keep going with the spade suit as we are trying to set up our 4th one!",
        },
        {
          id: "cp1-13-spade-distribution",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 5,
          fixed: { S: 4, N: 3 },
          expectedDistribution: { W: 3, N: 3, E: 3, S: 4 },
          promptText: "What was the original spade distribution?",
        },
        {
          id: "cp1-13-wrap",
          type: "INFO",
          atRoundIdx: 5,
          promptText: CP1_13_WRAP,
          continueButtonLabel: "Show me the full hand",
        },
      ],
    },
    shownHands: {
      south: { S: "A675", H: "98", D: "AK3J", C: "K45" },
      north: { S: "342", H: "AQ76", D: "Q2T", C: "8A9" },
      west: { S: "T89", H: "T432", D: "974", C: "6Q7" },
      east: { S: "KJQ", H: "KJ5", D: "658", C: "J3T2" },
    },
    visibleFullHandSeats: ["N", "S"],
    revealFullHandsAtEnd: ["E", "W"],
    rounds: [
      {
        label: "Opening lead shown (♠10)",
        plays: [{ seat: "W", card: { rank: "T", suit: "S" } }],
      },
      {
        label: "Trick 1 (♠10, ♠2, ♠J, ♠5)",
        plays: [
          { seat: "W", card: { rank: "T", suit: "S" } },
          { seat: "N", card: { rank: "2", suit: "S" } },
          { seat: "E", card: { rank: "J", suit: "S" } },
          { seat: "S", card: { rank: "5", suit: "S" } },
        ],
      },
      {
        label: "Trick 2 (♣2, ♣4, ♣Q, ♣A)",
        plays: [
          { seat: "E", card: { rank: "2", suit: "C" } },
          { seat: "S", card: { rank: "4", suit: "C" } },
          { seat: "W", card: { rank: "Q", suit: "C" } },
          { seat: "N", card: { rank: "A", suit: "C" } },
        ],
      },
      {
        label: "Trick 3 (♠3, ♠Q, ♠6, ♠9)",
        plays: [
          { seat: "N", card: { rank: "3", suit: "S" } },
          { seat: "E", card: { rank: "Q", suit: "S" } },
          { seat: "S", card: { rank: "6", suit: "S" } },
          { seat: "W", card: { rank: "8", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (♣J, ♣K, ♣6, ♣8)",
        plays: [
          { seat: "E", card: { rank: "J", suit: "C" } },
          { seat: "S", card: { rank: "K", suit: "C" } },
          { seat: "W", card: { rank: "6", suit: "C" } },
          { seat: "N", card: { rank: "8", suit: "C" } },
        ],
      },
      {
        label: "Trick 5 (♠A, ♠9, ♠4, ♠K)",
        plays: [
          { seat: "S", card: { rank: "A", suit: "S" } },
          { seat: "W", card: { rank: "9", suit: "S" } },
          { seat: "N", card: { rank: "4", suit: "S" } },
          { seat: "E", card: { rank: "K", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "cp1-14",
    difficulty: 1,
    ...TRAINER_PUZZLE_DEFAULTS_V2,
    trainerEngine: TRAINER_ENGINE_COMPASS,
    seatMode: "compass",
    playEngine: PLAY_ENGINE_COMPASS_CLOCKWISE,
    title: "4♠: See the 4-3 — diamond start",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    preserveEndStateAtDone: true,
    auction: "",
    promptOptions: {
      promptThemeTint: "see43",
      themeLabel: "Theme: See the 4-3",
      contractLabel: "4♠ by South",
      promptPlacement: "right",
      hideAuction: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/sTos0LZisl0?si=byK6hO7DGr5Uwcwy",
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: false,
      customPrompts: [
        {
          id: "cp1-14-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "You are declaring 4♠.",
        },
        {
          id: "cp1-14-trumps-after-ruff",
          type: "SINGLE_NUMBER",
          atRoundIdx: 2,
          promptText:
            "A diamond has just been ruffed. How many spades are left with the opponents?",
          expectedAnswer: 4,
          successText:
            "They started with 5 — after this ruff, they have 4 left.",
        },
        {
          id: "cp1-14-trumps-drawn-msg",
          type: "INFO",
          atRoundIdx: 4,
          promptText:
            "All the trumps are drawn. You have lost 3 tricks already, the first three. You cannot afford to lose a heart.",
        },
        {
          id: "cp1-14-heart-finesse-check",
          type: "PLAY_DECISION",
          atRoundIdx: 4,
          promptText:
            "If the heart finesse loses, I will go down in this contract?",
          options: [
            { id: "true", label: "True" },
            { id: "false", label: "False" },
          ],
          expectedChoice: "false",
          revealText:
            "You can still make it even if the heart finesse is losing.\n\nRemember to \"See the 4-3\", it is a big source of tricks and will help you make more contracts. On this hand the K♥ is offside, but because the clubs break, we can establish our 4th club trick, and pitch a heart.",
        },
        {
          id: "cp1-14-watch-play",
          type: "INFO",
          atRoundIdx: 4,
          promptText: "Watch the play.",
          continueButtonLabel: "Watch the play",
        },
        {
          id: "cp1-14-clubs-good-msg",
          type: "INFO",
          atRoundIdx: 7,
          promptText:
            "Our 4th club is good, since the club suit has broken 3-3 (the club suit was 4333).",
        },
        {
          id: "cp1-14-crossruff-msg",
          type: "INFO",
          atRoundIdx: 8,
          promptText:
            "Now just a simple cross ruff, there are no trumps out.",
        },
      ],
    },
    shownHands: {
      // Same honor profile / lengths as the draft deal; spot cards redistributed so suits don’t read as straight ladders (still one full deck).
      north: { S: "Q3K6", H: "QA", D: "2Q6", C: "753K" },
      south: { S: "8A5T", H: "35", D: "T973", C: "6AQ" },
      east: { S: "94J", H: "K9287", D: "58", C: "28J" },
      west: { S: "27", H: "4JT6", D: "AKJ4", C: "4T9" },
    },
    visibleFullHandSeats: ["N", "S"],
    rounds: [
      {
        label: "Trick 1 (♦A, ♦2, ♦5, ♦3 — West leads)",
        plays: [
          { seat: "W", card: { rank: "A", suit: "D" } },
          { seat: "N", card: { rank: "2", suit: "D" } },
          { seat: "E", card: { rank: "5", suit: "D" } },
          { seat: "S", card: { rank: "3", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (♦K, ♦6, ♦8, ♦7)",
        plays: [
          { seat: "W", card: { rank: "K", suit: "D" } },
          { seat: "N", card: { rank: "6", suit: "D" } },
          { seat: "E", card: { rank: "8", suit: "D" } },
          { seat: "S", card: { rank: "7", suit: "D" } },
        ],
      },
      {
        label: "Trick 3 (♦4, ♦Q, ♠4 ruff, ♦9)",
        plays: [
          { seat: "W", card: { rank: "4", suit: "D" } },
          { seat: "N", card: { rank: "Q", suit: "D" } },
          { seat: "E", card: { rank: "4", suit: "S" } },
          { seat: "S", card: { rank: "9", suit: "D" } },
        ],
      },
      {
        label: "Trick 4 (♠9, ♠5, ♠2, ♠K — East leads)",
        plays: [
          { seat: "E", card: { rank: "9", suit: "S" } },
          { seat: "S", card: { rank: "5", suit: "S" } },
          { seat: "W", card: { rank: "2", suit: "S" } },
          { seat: "N", card: { rank: "K", suit: "S" } },
        ],
      },
      {
        label: "Trick 5 (♠Q, ♠J, ♠8, ♠7 — North leads)",
        plays: [
          { seat: "N", card: { rank: "Q", suit: "S" } },
          { seat: "E", card: { rank: "J", suit: "S" } },
          { seat: "S", card: { rank: "8", suit: "S" } },
          { seat: "W", card: { rank: "7", suit: "S" } },
        ],
      },
      {
        label: "Trick 6 (Club 3, 2, Q, 4)",
        plays: [
          { seat: "N", card: { rank: "3", suit: "C" } },
          { seat: "E", card: { rank: "2", suit: "C" } },
          { seat: "S", card: { rank: "Q", suit: "C" } },
          { seat: "W", card: { rank: "4", suit: "C" } },
        ],
      },
      {
        label: "Trick 7 (Club A, 9, 5, 8)",
        plays: [
          { seat: "S", card: { rank: "A", suit: "C" } },
          { seat: "W", card: { rank: "9", suit: "C" } },
          { seat: "N", card: { rank: "5", suit: "C" } },
          { seat: "E", card: { rank: "8", suit: "C" } },
        ],
      },
      {
        label: "Trick 8 (Club 6, 10, K, J)",
        plays: [
          { seat: "S", card: { rank: "6", suit: "C" } },
          { seat: "W", card: { rank: "T", suit: "C" } },
          { seat: "N", card: { rank: "K", suit: "C" } },
          { seat: "E", card: { rank: "J", suit: "C" } },
        ],
      },
      {
        label: "Trick 9 (7 of clubs, 2 of hearts, 3 of hearts, 4 of hearts)",
        plays: [
          { seat: "N", card: { rank: "7", suit: "C" } },
          { seat: "E", card: { rank: "2", suit: "H" } },
          { seat: "S", card: { rank: "3", suit: "H" } },
          { seat: "W", card: { rank: "4", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "cp1-15",
    difficulty: 1,
    ...TRAINER_PUZZLE_DEFAULTS_V2,
    trainerEngine: TRAINER_ENGINE_COMPASS,
    seatMode: "compass",
    playEngine: PLAY_ENGINE_COMPASS_CLOCKWISE,
    title: "6NT: two 4-3 fits",
    trumpSuit: null,
    contract: "6NT",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "see43",
      themeLabel: "Theme: See the 4-3",
      contractLabel: "6NT by South",
      promptPlacement: "right",
      hideAuction: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/WIK-3V4cl6w?si=8G0ey6kZ7h3ztHSx",
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: false,
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-15-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText: "You are declaring 6NT!",
        },
        {
          id: "cp1-15-count-certain",
          type: "INFO",
          atRoundIdx: 0,
          promptText: CP1_15_COUNT_CERTAIN,
        },
        {
          id: "cp1-15-heart-first-msg",
          type: "INFO",
          atRoundIdx: 1,
          promptText: CP1_15_HEART_FIRST_MSG,
        },
        {
          id: "cp1-15-heart-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 4,
          fixed: { S: 4, N: 3 },
          expectedDistribution: { W: 2, N: 3, E: 4, S: 4 },
          promptText: "The heart suit distribution was",
        },
        {
          id: "cp1-15-heart-dist-msg",
          type: "INFO",
          atRoundIdx: 4,
          promptText: CP1_15_HEART_DIST_MSG,
        },
        {
          id: "cp1-15-club-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "C",
          atRoundIdx: 7,
          fixed: { S: 4, N: 3 },
          expectedDistribution: { W: 3, N: 3, E: 3, S: 4 },
          promptText: "What was the original club distribution?",
        },
        {
          id: "cp1-15-club-explain",
          type: "INFO",
          atRoundIdx: 7,
          promptText: CP1_15_CLUB_EXPLAIN,
          continueButtonLabel: "Reveal full hand",
          infoEndsWithReveal:
            "The clubs broke 4-3-3-3, so our 4th club is the last remaining club and will be our 12th trick!\n\nSo in the end, we will make 4 spades, 2 hearts, 2 diamonds, and 4 club tricks for a total of 12 tricks!",
        },
      ],
    },
    shownHands: {
      north: { S: "KJ4", H: "8743", D: "AK", C: "9874" },
      south: { S: "AQT5", H: "AK5", D: "753", C: "AKQ" },
      west: { S: "983", H: "J6", D: "QJT86", C: "J52" },
      east: { S: "762", H: "QT29", D: "942", C: "T63" },
    },
    visibleFullHandSeats: ["N", "S"],
    revealFullHandsAtEnd: ["E", "W"],
    rounds: [
      {
        label: "Trick 1 (♦Q, ♦A, ♦2, ♦3)",
        plays: [
          { seat: "W", card: { rank: "Q", suit: "D" } },
          { seat: "N", card: { rank: "A", suit: "D" } },
          { seat: "E", card: { rank: "2", suit: "D" } },
          { seat: "S", card: { rank: "3", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (♥3, ♥2, ♥5, ♥J)",
        plays: [
          { seat: "N", card: { rank: "3", suit: "H" } },
          { seat: "E", card: { rank: "2", suit: "H" } },
          { seat: "S", card: { rank: "5", suit: "H" } },
          { seat: "W", card: { rank: "J", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (♦6, ♦K, ♦4, ♦5)",
        plays: [
          { seat: "W", card: { rank: "6", suit: "D" } },
          { seat: "N", card: { rank: "K", suit: "D" } },
          { seat: "E", card: { rank: "4", suit: "D" } },
          { seat: "S", card: { rank: "5", suit: "D" } },
        ],
      },
      {
        label: "Trick 4 (♥4, ♥9, ♥K, ♥6)",
        plays: [
          { seat: "N", card: { rank: "4", suit: "H" } },
          { seat: "E", card: { rank: "9", suit: "H" } },
          { seat: "S", card: { rank: "K", suit: "H" } },
          { seat: "W", card: { rank: "6", suit: "H" } },
        ],
      },
      {
        label: "Trick 5 (♥A, ♠3, ♥7, ♥10)",
        plays: [
          { seat: "S", card: { rank: "A", suit: "H" } },
          { seat: "W", card: { rank: "3", suit: "S" } },
          { seat: "N", card: { rank: "7", suit: "H" } },
          { seat: "E", card: { rank: "T", suit: "H" } },
        ],
      },
      {
        label: "Trick 6 (♣A, ♣2, ♣4, ♣3)",
        plays: [
          { seat: "S", card: { rank: "A", suit: "C" } },
          { seat: "W", card: { rank: "2", suit: "C" } },
          { seat: "N", card: { rank: "4", suit: "C" } },
          { seat: "E", card: { rank: "3", suit: "C" } },
        ],
      },
      {
        label: "Trick 7 (♣K, ♣5, ♣7, ♣6)",
        plays: [
          { seat: "S", card: { rank: "K", suit: "C" } },
          { seat: "W", card: { rank: "5", suit: "C" } },
          { seat: "N", card: { rank: "7", suit: "C" } },
          { seat: "E", card: { rank: "6", suit: "C" } },
        ],
      },
      {
        label: "Trick 8 (♣Q, ♣J, ♣8, ♣10)",
        plays: [
          { seat: "S", card: { rank: "Q", suit: "C" } },
          { seat: "W", card: { rank: "J", suit: "C" } },
          { seat: "N", card: { rank: "8", suit: "C" } },
          { seat: "E", card: { rank: "T", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "cp1-16",
    difficulty: 1,
    ...TRAINER_PUZZLE_DEFAULTS_V2,
    trainerEngine: TRAINER_ENGINE_COMPASS,
    seatMode: "compass",
    playEngine: PLAY_ENGINE_COMPASS_CLOCKWISE,
    title: "4♠: trump lead — count losers",
    trumpSuit: null,
    contract: "4♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "see43",
      themeLabel: "Theme: See the 4-3",
      contractLabel: "4♠ by South",
      promptPlacement: "right",
      hideAuction: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/ZK2l3yNFMbs?si=d-85CClBGT13JnZM",
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: false,
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp1-16-loser-intro",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "You are declaring 4S and the opponents have led a trump. It is a great idea, especially in suit contracts, to count losers.\n\nOur loser count: On a bad day, you could lose 3 heart tricks and a club.",
        },
        {
          id: "cp1-16-watch-play",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "Let's watch the play, and see how a top international expert played the hand. Keep focused as you will need to follow along.",
          continueButtonLabel: "Continue",
        },
        {
          id: "cp1-16-trump-track-intro",
          type: "INFO",
          atRoundIdx: 3,
          promptText: "Let's, as always, keep track of what's going on with trumps.",
        },
        {
          id: "cp1-16-opp-trumps-started",
          type: "SINGLE_NUMBER",
          atRoundIdx: 3,
          promptText: "At the beginning of the hand, the opponents started with how many trumps?",
          expectedAnswer: 5,
          autoContinueOnCorrect: true,
        },
        {
          id: "cp1-16-trump-fit-info",
          type: "INFO",
          atRoundIdx: 3,
          promptText: "We had a 4-4 fit; the opponents started with 5 trumps.",
        },
        {
          id: "cp1-16-trumps-left",
          type: "SINGLE_NUMBER",
          atRoundIdx: 3,
          promptText: "How many are left?",
          expectedAnswer: 1,
          autoContinueOnCorrect: true,
        },
        {
          id: "cp1-16-trumps-count-explain",
          type: "INFO",
          atRoundIdx: 3,
          promptText: CP1_16_TRUMP_COUNT_EXPLAIN,
          continueButtonLabel: "Continue",
        },
        {
          id: "cp1-16-draw-final-trump",
          type: "INFO",
          atRoundIdx: 3,
          promptText: "Declarer decided to draw the final trump.",
          continueButtonLabel: "Continue",
        },
        {
          id: "cp1-16-heart-plan",
          type: "INFO",
          atRoundIdx: 4,
          promptText: CP1_16_HEARTS_PRO,
          continueButtonLabel: "Continue",
        },
        {
          id: "cp1-16-heart-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 7,
          fixed: { S: 3, N: 4 },
          expectedDistribution: { W: 3, N: 4, E: 3, S: 3 },
          promptText: "What was the original heart distribution?",
        },
        {
          id: "cp1-16-heart-dist-explain",
          type: "INFO",
          atRoundIdx: 7,
          promptText: CP1_16_HEART_DIST_EXPLAIN,
        },
        {
          id: "cp1-16-watch-rest",
          type: "INFO",
          atRoundIdx: 7,
          promptText: "Let's watch the rest of the play.",
          continueButtonLabel: "Let's watch the rest of the play",
        },
        {
          id: "cp1-16-final-reveal",
          type: "INFO",
          atRoundIdx: 10,
          promptText: CP1_16_REST_OURS,
          continueButtonLabel: "Reveal the full hand",
        },
      ],
    },
    shownHands: {
      north: { S: "AQJ7", H: "K642", D: "54", C: "A75" },
      south: { S: "KT86", H: "875", D: "AKJ", C: "KT9" },
      west: { S: "42", H: "T93", D: "QT82", C: "J632" },
      east: { S: "953", H: "AQJ", D: "9763", C: "Q84" },
    },
    visibleFullHandSeats: ["N", "S"],
    revealFullHandsAtEnd: ["E", "W"],
    rounds: [
      {
        label: "Opening lead shown (♠2)",
        plays: [{ seat: "W", card: { rank: "2", suit: "S" } }],
      },
      {
        label: "Trick 1 (♠2, ♠7, ♠5, ♠8)",
        plays: [
          { seat: "W", card: { rank: "2", suit: "S" } },
          { seat: "N", card: { rank: "7", suit: "S" } },
          { seat: "E", card: { rank: "5", suit: "S" } },
          { seat: "S", card: { rank: "8", suit: "S" } },
        ],
      },
      {
        label: "Trick 2 (♥5, ♥3, ♥2, ♥J)",
        plays: [
          { seat: "S", card: { rank: "5", suit: "H" } },
          { seat: "W", card: { rank: "3", suit: "H" } },
          { seat: "N", card: { rank: "2", suit: "H" } },
          { seat: "E", card: { rank: "J", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (♠3, ♠6, ♠4, ♠J)",
        plays: [
          { seat: "E", card: { rank: "3", suit: "S" } },
          { seat: "S", card: { rank: "6", suit: "S" } },
          { seat: "W", card: { rank: "4", suit: "S" } },
          { seat: "N", card: { rank: "J", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (♠A, ♠9, ♠10, ♣2)",
        plays: [
          { seat: "N", card: { rank: "A", suit: "S" } },
          { seat: "E", card: { rank: "9", suit: "S" } },
          { seat: "S", card: { rank: "T", suit: "S" } },
          { seat: "W", card: { rank: "2", suit: "C" } },
        ],
      },
      {
        label: "Trick 5 (♥4, ♥Q, ♥7, ♥9)",
        plays: [
          { seat: "N", card: { rank: "4", suit: "H" } },
          { seat: "E", card: { rank: "Q", suit: "H" } },
          { seat: "S", card: { rank: "7", suit: "H" } },
          { seat: "W", card: { rank: "9", suit: "H" } },
        ],
      },
      {
        label: "Trick 6 (♦3, ♦A, ♦2, ♦4)",
        plays: [
          { seat: "E", card: { rank: "3", suit: "D" } },
          { seat: "S", card: { rank: "A", suit: "D" } },
          { seat: "W", card: { rank: "2", suit: "D" } },
          { seat: "N", card: { rank: "4", suit: "D" } },
        ],
      },
      {
        label: "Trick 7 (♥8, ♥10, ♥K, ♥A)",
        plays: [
          { seat: "S", card: { rank: "8", suit: "H" } },
          { seat: "W", card: { rank: "T", suit: "H" } },
          { seat: "N", card: { rank: "K", suit: "H" } },
          { seat: "E", card: { rank: "A", suit: "H" } },
        ],
      },
      {
        label: "Trick 8 (♦6, ♦K, ♦8, ♦5)",
        plays: [
          { seat: "E", card: { rank: "6", suit: "D" } },
          { seat: "S", card: { rank: "K", suit: "D" } },
          { seat: "W", card: { rank: "8", suit: "D" } },
          { seat: "N", card: { rank: "5", suit: "D" } },
        ],
      },
      {
        label: "Trick 9 (♦J, ♦Q, ♠Q ruffs, ♦7)",
        plays: [
          { seat: "S", card: { rank: "J", suit: "D" } },
          { seat: "W", card: { rank: "Q", suit: "D" } },
          { seat: "N", card: { rank: "Q", suit: "S" } },
          { seat: "E", card: { rank: "7", suit: "D" } },
        ],
      },
      {
        label: "Trick 10 (♥6, ♦9, ♣9, ♣3)",
        plays: [
          { seat: "N", card: { rank: "6", suit: "H" } },
          { seat: "E", card: { rank: "9", suit: "D" } },
          { seat: "S", card: { rank: "9", suit: "C" } },
          { seat: "W", card: { rank: "3", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "cp2-2",
    difficulty: 2,
    title: "4♠: diamond lead — goal and trick 2",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "1♠ P 2♠ P 4♠ P P P",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/GEJcHaaWVeg",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-2-goal",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "What is your main goal?",
          options: [
            { id: "ruff_diamonds", label: "To ruff diamonds in dummy" },
            { id: "setup_hearts", label: "To set up hearts" },
          ],
          expectedChoice: "setup_hearts",
          motivationText: "Right — dummy has opening values and a long suit. Go after the long suit!",
          revealText:
            "Set up hearts. Since dummy has opening values and a long suit (5+ cards), it's very often a good idea to go after the long suit!",
          videoUrl: "",
        },
        {
          id: "cp2-2-trick2",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "At trick 2, should we draw some trumps or go after hearts before drawing any trumps?",
          options: [
            { id: "draw_trumps", label: "Draw some trumps" },
            { id: "play_heart", label: "Play a heart" },
          ],
          expectedChoice: "play_heart",
          noContinue: true,
          motivationText: "Using entries productively is a key habit.",
          revealText:
            "Play a heart. There are two very good reasons for this.\n\nReason 1 — We often set up our long suits before drawing trumps. More than 50% of the time we delay drawing trumps for this reason. If in doubt, go after the long suit first.\n\nReason 2 — We want to use our entries productively. We are in dummy and poised to play a heart towards the Jack. Let's not squander that entry by playing a trump — which is something we can do from either hand. Put simply, use our entries productively: do something from hand that we can't do from the other hand — play a heart!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "KQJT", H: "AJT92", D: "2", C: "654" },
      DECLARER: { S: "A987", H: "653", D: "A43", C: "A32" },
    },
    rounds: [
      {
        label: "Trick 1 (Q♦ lead)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "D" } },
          { seat: "DUMMY", card: { rank: "2", suit: "D" } },
          { seat: "RHO", card: { rank: "3", suit: "D" } },
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "cp2-1",
    difficulty: 2,
    title: "3NT: club lead — hearts or spades?",
    trumpSuit: null,
    contract: "3NT",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S", // you are South, declaring
    auction: "1N P 3N P P P",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/KBA3CXalFkQ",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-1-hearts",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText:
            "That heart suit looks very tempting. Are you going to play it",
          options: [
            { id: "immediately", label: "1. Immediately" },
            { id: "next_trick_or_two", label: "2. Within the next trick or 2" },
            { id: "not_at_all", label: "3. Not at all" },
          ],
          expectedChoice: "not_at_all",
          noContinue: true,
          motivationText: "Nice work — keep practising these patterns.",
          revealText:
            "Not at all. The key concept is to not create any extra losers. Knock out the aces and kings in the correct order: start with diamonds, then spades. Play your 3–2 spade fit, not your 5–3 heart fit — spades don’t create extra losers, whereas hearts might.\n\nIn the end you make 3 clubs, 3 diamonds, 2 hearts (A and K), 1 spade. You lose the A and K of spades, A of diamonds, A of clubs.",
        },
      ],
    },
    shownHands: {
      // North (Dummy): Qxx AJ8xx K10x xx
      DUMMY: { S: "Q32", H: "AJ876", D: "KT2", C: "65" },
      // South (You / Declarer): J10 K109 QJxx KQJx
      DECLARER: { S: "JT", H: "KT9", D: "QJ98", C: "KQJ7" },
    },
    rounds: [
      {
        label: "Trick 1 (2♣ to the Ace)",
        plays: [
          { seat: "LHO", card: { rank: "2", suit: "C" } },
          { seat: "DUMMY", card: { rank: "5", suit: "C" } },
          { seat: "RHO", card: { rank: "A", suit: "C" } },
          { seat: "DECLARER", card: { rank: "7", suit: "C" } },
        ],
      },
      {
        label: "Trick 2 (club back)",
        plays: [
          { seat: "RHO", card: { rank: "3", suit: "C" } },
          { seat: "DECLARER", card: { rank: "K", suit: "C" } },
          { seat: "LHO", card: { rank: "4", suit: "C" } },
          { seat: "DUMMY", card: { rank: "6", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "cp2-3",
    difficulty: 2,
    title: "4♥: diamond lead — what at trick 2?",
    trumpSuit: "H",
    contract: "4♥",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "1♥ 2♦ 4♥ P P P",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/-b60sY7rNuc",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-3-trick2",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "Lead is Q♦, won by the ace. What do you play at trick 2?",
          options: [
            { id: "spade", label: "Spade" },
            { id: "heart", label: "Heart" },
            { id: "diamond", label: "Diamond" },
            { id: "club", label: "Club" },
          ],
          expectedChoice: "club",
          noContinue: true,
          wrongTryText: "Good try! Think about where your tricks will come from — the long club suit is the key.",
          revealText:
            "Play a club. Is ruffing a tempting idea? It shouldn't be — go for the long club suit; that's what yields the best results.\n\nIs drawing trumps the obvious move? Even with 9 trumps, we should lay off the trumps till we have set up the clubs, or at least started them. Trumps are also entries, which you may need to either hand. Laying off trumps keeps you flexible to begin with.\n\nFire off a club, confidently begin to set up your long suit!\n\nOnce again, we are using entries productively by playing a club towards the King.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "Q2", H: "A432", D: "2", C: "KT9876" },
      DECLARER: { S: "A32", H: "KT987", D: "AK2", C: "32" },
    },
    rounds: [
      {
        label: "Trick 1 (Q♦ lead)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "D" } },
          { seat: "DUMMY", card: { rank: "2", suit: "D" } },
          { seat: "RHO", card: { rank: "3", suit: "D" } },
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "cp2-4",
    difficulty: 2,
    title: "4♠: club lead — what's the key theme?",
    newUntil: "2026-04-01",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "1♠ P 2♠ P 4♠ P P P",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/Pn-N-AYXCCo",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-4-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "This was a hand from recent play where a top international expert went wrong.\n\nThis is a quick problem, to help improve your pattern recognition, we won't play the hand out.",
        },
        {
          id: "cp2-4-theme",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "Glance at dummy and try to figure out what the key theme is.",
          options: [
            { id: "setup_side", label: "Setup side suit" },
            { id: "draw_trumps", label: "Draw trumps" },
            { id: "setup_tricks", label: "Setup trick sources" },
            { id: "ruff_dummy", label: "Ruff stuff in dummy" },
          ],
          expectedChoice: "ruff_dummy",
          noContinue: true,
          revealText:
            "Ruff stuff in dummy. This hand is all about ruffing a diamond in dummy. It is a bit of a blindspot because dummy has 3 diamonds!\n\nCash ♦A and ♦K, then play a diamond, just simply losing that trick. We are now ready to ruff our 4th diamond in dummy. Don't draw any trumps first — if you do, the defence can continue trumps and prevent you getting the ruff.\n\nRuff stuff in dummy does not always mean a singleton or doubleton in dummy!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "A98", H: "AQT", D: "762", C: "AT84" },
      DECLARER: { S: "QJT73", H: "43", D: "AKJ4", C: "K3" },
      LHO: { S: "652", H: "986", D: "QT98", C: "762" },
      RHO: { S: "K4", H: "KJ752", D: "53", C: "QJ98" },
    },
    rounds: [
      {
        label: "Trick 1 (2♣ lead, East plays 9, you play the K)",
        plays: [
          { seat: "LHO", card: { rank: "2", suit: "C" } },
          { seat: "DUMMY", card: { rank: "4", suit: "C" } },
          { seat: "RHO", card: { rank: "9", suit: "C" } },
          { seat: "DECLARER", card: { rank: "K", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "cp2-5",
    difficulty: 2,
    title: "3NT: use your entries productively",
    newUntil: "2026-04-30",
    trumpSuit: null,
    contract: "3NT",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "1NT P 3NT P P P",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/pKVWX3tFZoM",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-5-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "This was a hand from the 2026 US National in St Louis. One player made it while the other didn't.\n\nThe key theme is — always use your entries productively. When you are in a hand, ask yourself: what can I do from this hand that I can't do from the other hand?",
        },
        {
          id: "cp2-5-trick3",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "What do we play now?",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "hearts",
          noContinue: true,
          wrongTryText: "Think: what suit can we play to good effect from dummy that we can't play from our own hand?",
          motivationText: "",
          revealText:
            "Hearts. Lead low from dummy towards your QJx — you may need to do it twice. Use this entry while you have it; treat every entry like gold!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "AT6", H: "9874", D: "AT72", C: "T5" },
      DECLARER: { S: "QJ85", H: "QJ3", D: "84", C: "AKQJ" },
    },
    rounds: [
      {
        label: "Trick 1 (King of diamonds, all small)",
        plays: [
          { seat: "LHO", card: { rank: "K", suit: "D" } },
          { seat: "DUMMY", card: { rank: "2", suit: "D" } },
          { seat: "RHO", card: { rank: "3", suit: "D" } },
          { seat: "DECLARER", card: { rank: "4", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (Queen of diamonds, Ace wins)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "D" } },
          { seat: "DUMMY", card: { rank: "A", suit: "D" } },
          { seat: "RHO", card: { rank: "6", suit: "D" } },
          { seat: "DECLARER", card: { rank: "8", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "cp2-6",
    difficulty: 2,
    title: "4♠: use entries, then draw trumps",
    newUntil: "2026-12-31",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "entriesProductive",
      themeLabel: "Theme: Using entries productively",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/LhjJh25vzG4",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-6-trick2",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "We have just won the A♦. What should we do now?",
          options: [
            { id: "draw_trump_or_two", label: "1. Draw a trump or 2" },
            { id: "play_hearts", label: "2. Play hearts" },
            { id: "play_diamonds", label: "3. Play diamonds" },
            { id: "play_clubs", label: "4. Play clubs" },
          ],
          expectedChoice: "play_hearts",
          revealText:
            "Play a heart. Let's follow two guiding principles.\n\n1) Always use our entry productively. We are in dummy, so ask ourselves: what can we do in dummy that we can't do from our hand?\n\nTaking a heart finesse needs to be done by leading a heart from the north hand, so do it now.\n\n2) Sometimes it's best to think of trumps as entries, or even the \"entry suit\". We are perfectly positioned in dummy, so there is no reason to start playing our entry suit yet.",
        },
        {
          id: "cp2-6-what-now",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "Going well so far, what now?",
          options: [
            { id: "continue_hearts", label: "1. Continue with the heart suit" },
            { id: "play_trumps", label: "2. Play some trumps" },
            { id: "play_diamonds", label: "3. Play diamonds" },
            { id: "play_clubs", label: "4. Play clubs" },
          ],
          expectedChoice: "play_trumps",
          revealText:
            "It's a good idea now to draw some trumps.\n\nWe are now in our hand. There is nothing productive we can do from our hand, and there is no gain in playing either minor suit.\n\nSo, since we have nothing productive to do, we should look closely at the trump suit.\n\nWe want to take another heart finesse, so whatever we do with trumps, let's make sure to use our only remaining entry productively.",
        },
        {
          id: "cp2-6-how-many-trumps",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "So what should we do with trumps?",
          options: [
            { id: "draw_1", label: "1. Just draw 1 round" },
            { id: "draw_2", label: "2. Draw 2 rounds" },
            { id: "draw_3", label: "3. Draw 3 rounds" },
            { id: "draw_4_if_needed", label: "4. Draw 4 rounds if needed" },
          ],
          expectedChoice: "draw_3",
          revealText:
            "Draw 3 rounds. There is no reason to delay. Draw 3 rounds, but make sure to end in dummy, as we want to use that entry.",
        },
        {
          id: "cp2-6-spade-distribution",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 3,
          fixed: { DUMMY: 3, DECLARER: 5, LHO: 1 },
          expectedDistribution: { LHO: 1, DUMMY: 3, RHO: 4, DECLARER: 5 },
          promptText:
            "What is the spade distribution?\n\nNorth is 3, South is 5, West is 1. Fill in East.",
        },
        {
          id: "cp2-6-east-trumps-left",
          type: "SINGLE_NUMBER",
          atRoundIdx: 3,
          promptText:
            "How many trumps are still outstanding?\n\n(Hint: remember how many trumps East started with, and how many rounds have been played.)",
          expectedAnswer: 2,
        },
        {
          id: "cp2-6-east-trumps-left-explain",
          type: "INFO",
          atRoundIdx: 3,
          promptText:
            "The answer is 2. East started with 4, and we have drawn two rounds, East following both times, with 2 trumps remaining.",
        },
        {
          id: "cp2-6-one-more-trump",
          type: "INFO",
          atRoundIdx: 5,
          promptText: "We know East has 1 more trump, so let's draw the final trump now.",
        },
        {
          id: "cp2-6-hearts-winners",
          type: "PLAY_DECISION",
          atRoundIdx: 6,
          promptText: "Are our remaining hearts winners, or not sure yet?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          noContinue: true,
          revealText:
            "Yes.\n\nSince both opponents followed to two rounds of hearts, the suit is breaking 3-2. Therefore our last two hearts will be winners.",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "K72", H: "9876", D: "A5", C: "7642" },
      DECLARER: { S: "AQJ95", H: "AQJ4", D: "32", C: "A5" },
      LHO: { S: "T", H: "K32", D: "Q864", C: "JT983" },
      RHO: { S: "8643", H: "T5", D: "KJT97", C: "KQ" },
    },
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (Q♦ lead, dummy wins A♦)",
        plays: [
          { seat: "LHO", card: { rank: "Q", suit: "D" } },
          { seat: "DUMMY", card: { rank: "A", suit: "D" } },
          { seat: "RHO", card: { rank: "7", suit: "D" } },
          { seat: "DECLARER", card: { rank: "2", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (Heart from dummy: small, Q, small)",
        plays: [
          { seat: "DUMMY", card: { rank: "9", suit: "H" } },
          { seat: "LHO", card: { rank: "2", suit: "H" } },
          { seat: "DECLARER", card: { rank: "Q", suit: "H" } },
          { seat: "RHO", card: { rank: "5", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (A♠, all follow)",
        plays: [
          { seat: "DECLARER", card: { rank: "A", suit: "S" } },
          { seat: "LHO", card: { rank: "T", suit: "S" } },
          { seat: "DUMMY", card: { rank: "2", suit: "S" } },
          { seat: "RHO", card: { rank: "3", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (Q♠, West discards a club)",
        plays: [
          { seat: "DECLARER", card: { rank: "Q", suit: "S" } },
          { seat: "LHO", card: { rank: "3", suit: "C" }, showOut: true },
          { seat: "DUMMY", card: { rank: "7", suit: "S" } },
          { seat: "RHO", card: { rank: "4", suit: "S" } },
        ],
      },
      {
        label: "Trick 5 (Spade to the King; West discards a diamond)",
        plays: [
          { seat: "DECLARER", card: { rank: "5", suit: "S" } },
          { seat: "LHO", card: { rank: "4", suit: "D" }, showOut: true },
          { seat: "DUMMY", card: { rank: "K", suit: "S" } },
          { seat: "RHO", card: { rank: "6", suit: "S" } },
        ],
      },
      {
        label: "Trick 6 (Heart from dummy: small, J, small)",
        plays: [
          { seat: "DUMMY", card: { rank: "8", suit: "H" } },
          { seat: "RHO", card: { rank: "T", suit: "H" } },
          { seat: "DECLARER", card: { rank: "J", suit: "H" } },
          { seat: "LHO", card: { rank: "3", suit: "H" } },
        ],
      },
      {
        label: "Trick 7 (J♠, West and North discard clubs, East follows)",
        plays: [
          { seat: "DECLARER", card: { rank: "J", suit: "S" } },
          { seat: "LHO", card: { rank: "8", suit: "C" }, showOut: true },
          { seat: "DUMMY", card: { rank: "2", suit: "C" }, showOut: true },
          { seat: "RHO", card: { rank: "8", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "cp2-7",
    difficulty: 2,
    title: "4♠: entries first, long suit priority",
    newUntil: "2026-12-31",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "entriesProductive",
      themeLabel: "Theme: Using entries productively",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/ArED5qGmybs",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-7-general-plan",
          type: "INFO",
          atRoundIdx: 1,
          promptText: "Have a think about what you want to do on this hand, a general plan.",
        },
        {
          id: "cp2-7-theme-intro",
          type: "INFO",
          atRoundIdx: 1,
          promptText:
            "Throughout this site I emphasise setting up long suits as a priority, before drawing trumps.\n\nThe question often arises, when should I draw trumps though, and how many?\n\nLet's call trumps the \"entry suit\" for this hand. And see if that label helps us answer the question.",
        },
        {
          id: "cp2-7-which-hand-hearts",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText:
            "We have decided to set up our 5 card heart suit as a matter of priority. Which hand would it be best to play the heart suit from?",
          options: [
            { id: "doesnt_matter", label: "1. Doesn't matter" },
            { id: "lead_from_dummy", label: "2. I want to lead hearts from dummy" },
            { id: "play_from_hand", label: "3. I want to play hearts immediately out of hand." },
          ],
          expectedChoice: "lead_from_dummy",
          revealText:
            "Keep it simple. It looks natural to play low towards AQJxx. So let's use our \"entry suit\" to jump over to dummy, in order for us to play a heart.",
        },
        {
          id: "cp2-7-draw-another-trump",
          type: "PLAY_DECISION",
          atRoundIdx: 2,
          promptText: "Should we draw another trump?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          revealText:
            "No, we do not need to draw more trumps.\n\nRemember we are calling it our entry suit. No need to touch our entry suit, we are in the perfect hand.",
        },
        {
          id: "cp2-7-what-now-spade-entry",
          type: "PLAY_DECISION",
          atRoundIdx: 3,
          promptText: "What now?",
          options: [
            { id: "play_spade", label: "1. Play a spade" },
            { id: "play_heart", label: "2. Play a heart" },
            { id: "play_diamond", label: "3. Play a diamond" },
            { id: "play_club", label: "4. Play a club" },
          ],
          expectedChoice: "play_spade",
          revealText:
            "Play a trump.\n\nWe want to jump back over to dummy so let's use our entry suit.\n\nWe want to continue setting up our heart suit as a matter of priority. It still looks natural to take the heart finesse again.",
        },
        {
          id: "cp2-7-spade-distribution",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 4,
          fixed: { DUMMY: 4, DECLARER: 4, RHO: 1 },
          expectedDistribution: { LHO: 4, DUMMY: 4, RHO: 1, DECLARER: 4 },
          promptText:
            "What was the original spade distribution?\n\nNorth is 4, South is 4, East is 1. Fill in West.",
        },
        {
          id: "cp2-7-west-started-4",
          type: "INFO",
          atRoundIdx: 4,
          promptText: "West started with 4 trumps.",
        },
        {
          id: "cp2-7-west-trumps-left",
          type: "SINGLE_NUMBER",
          atRoundIdx: 4,
          promptText:
            "How many trumps does West have left?\n\n(Hint: think of the number West started with, and also think about how many rounds we have played.)",
          expectedAnswer: 2,
          autoContinueOnCorrect: true,
        },
        {
          id: "cp2-7-west-trumps-left-explain",
          type: "INFO",
          atRoundIdx: 4,
          promptText:
            "West has two left. We know West started with 4 trumps and has followed twice to both rounds, leaving 2 left.",
        },
        {
          id: "cp2-7-what-now-keep-hearts",
          type: "PLAY_DECISION",
          atRoundIdx: 5,
          promptText: "What now?",
          options: [
            { id: "play_trumps", label: "Play trumps" },
            { id: "play_hearts", label: "Play hearts" },
            { id: "play_diamonds", label: "Play diamonds" },
            { id: "play_clubs", label: "Play clubs" },
          ],
          expectedChoice: "play_hearts",
          revealText:
            "We keep the focus from the start of the hand till the end of the hand. We want to set up the long suit.\n\nAs for trumps, that is our entry suit. We are in the correct hand. We may want to use our Q♠ later to jump back to our hand.",
        },
        {
          id: "cp2-7-ruffing-choice",
          type: "INFO",
          atRoundIdx: 5,
          promptText:
            "We have played two rounds of the suit. The Ace will take care of the third round, but if the suit breaks 4-2 we need to ruff one. So we decide to ruff one now.",
        },
        {
          id: "cp2-7-heart-distribution",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 6,
          fixed: { DUMMY: 2, DECLARER: 5, LHO: 2 },
          expectedDistribution: { LHO: 2, DUMMY: 2, RHO: 4, DECLARER: 5 },
          promptText: "So the initial heart distribution was?",
        },
        {
          id: "cp2-7-entry-wrap",
          type: "INFO",
          atRoundIdx: 6,
          promptText:
            "As you can see, the Q♠ is once again our entry suit. We want to get back to our hand and enjoy our heart winners.",
        },
        {
          id: "cp2-7-final-message",
          type: "INFO",
          atRoundIdx: 7,
          promptText:
            "We will make 10 tricks now.\n\nWe will just play our heart and club winners.\n\nWe will lose a diamond, and the J♠. That, along with the A♣ will be 3 losers in total.",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "AK94", H: "72", D: "KT64", C: "832" },
      DECLARER: { S: "QT63", H: "AQJ85", D: "5", C: "KQ7" },
      LHO: { S: "J875", H: "43", D: "A983", C: "T64" },
      RHO: { S: "2", H: "KT96", D: "QJ72", C: "AJ95" },
    },
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (4♣ lead, East wins A♣)",
        plays: [
          { seat: "LHO", card: { rank: "4", suit: "C" } },
          { seat: "DUMMY", card: { rank: "2", suit: "C" } },
          { seat: "RHO", card: { rank: "A", suit: "C" } },
          { seat: "DECLARER", card: { rank: "7", suit: "C" } },
        ],
      },
      {
        label: "Trick 2 (East continues clubs, South wins K♣)",
        plays: [
          { seat: "RHO", card: { rank: "J", suit: "C" } },
          { seat: "DECLARER", card: { rank: "K", suit: "C" } },
          { seat: "LHO", card: { rank: "6", suit: "C" } },
          { seat: "DUMMY", card: { rank: "8", suit: "C" } },
        ],
      },
      {
        label: "Trick 3 (Low spade to the Ace)",
        plays: [
          { seat: "DECLARER", card: { rank: "3", suit: "S" } },
          { seat: "LHO", card: { rank: "5", suit: "S" } },
          { seat: "DUMMY", card: { rank: "A", suit: "S" } },
          { seat: "RHO", card: { rank: "2", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (Heart to the Queen finesse)",
        plays: [
          { seat: "DUMMY", card: { rank: "2", suit: "H" } },
          { seat: "RHO", card: { rank: "6", suit: "H" } },
          { seat: "DECLARER", card: { rank: "Q", suit: "H" } },
          { seat: "LHO", card: { rank: "3", suit: "H" } },
        ],
      },
      {
        label: "Trick 5 (Spade to King; West discards diamond)",
        plays: [
          { seat: "DECLARER", card: { rank: "6", suit: "S" } },
          { seat: "LHO", card: { rank: "7", suit: "S" } },
          { seat: "DUMMY", card: { rank: "K", suit: "S" } },
          { seat: "RHO", card: { rank: "2", suit: "D" }, showOut: true },
        ],
      },
      {
        label: "Trick 6 (Heart to the Jack finesse)",
        plays: [
          { seat: "DUMMY", card: { rank: "7", suit: "H" } },
          { seat: "RHO", card: { rank: "9", suit: "H" } },
          { seat: "DECLARER", card: { rank: "J", suit: "H" } },
          { seat: "LHO", card: { rank: "4", suit: "H" } },
        ],
      },
      {
        label: "Trick 7 (Ruff a heart in dummy)",
        plays: [
          { seat: "DECLARER", card: { rank: "5", suit: "H" } },
          { seat: "LHO", card: { rank: "8", suit: "D" }, showOut: true },
          { seat: "DUMMY", card: { rank: "4", suit: "S" }, showOut: true },
          { seat: "RHO", card: { rank: "T", suit: "H" } },
        ],
      },
      {
        label: "Trick 8 (Spade entry to the 10; West discards diamond)",
        plays: [
          { seat: "DUMMY", card: { rank: "9", suit: "S" } },
          { seat: "RHO", card: { rank: "7", suit: "D" }, showOut: true },
          { seat: "DECLARER", card: { rank: "Q", suit: "S" } },
          { seat: "LHO", card: { rank: "8", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "cp2-8",
    difficulty: 2,
    title: "3NT: entries productively — majors and knock-out",
    newUntil: "2026-12-31",
    trumpSuit: null,
    contract: "3NT",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "entriesProductive",
      themeLabel: "Theme: Using entries productively",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/U43p6sSuHyU",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-8-intro-focus",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "There is usually lots to think about on a bridge hand, interpreting the lead, the auction and many other factors.\n\nHowever, I want to narrow our focus for this hand, like the previous two, and focus only on using our entries productively.",
        },
        {
          id: "cp2-8-knock-ace-prior",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "If you have worked through declarer stage 1 (problems 3–6), you have already seen this idea.\n\nA suit like hearts is a strong candidate: you \"knock out the Ace\" and turn the suit into winners for our side.",
        },
        {
          id: "cp2-8-combine-entries",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "However, on this hand, we want to combine with the idea of using our entries productively.",
        },
        {
          id: "cp2-8-spade-hand-matters",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "Let's look at the major suits.\n\nHearts and spades will both matter — but not in the same way.\n\nStart with spades — does it matter which hand we tackle that suit from?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "yes",
          revealText:
            "Yes it does.\n\nWe want to play toward dummy's ♠AJ109 — lead low toward that tenace. If West has the king or queen, a finesse can pick up an extra trick; if not, your entries still let you develop the suit in an orderly way.",
        },
        {
          id: "cp2-8-heart-hand-matters",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "Does it matter which hand we play the ♥ suit from?",
          options: [
            { id: "yes", label: "Yes" },
            { id: "no", label: "No" },
          ],
          expectedChoice: "no",
          revealText:
            "No it doesn't. We can play ♥ from either hand — it's a straightforward suit: cash honors and eventually lose to the ace.",
        },
        {
          id: "cp2-8-which-suit-first",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "Which suit should we play first — hearts or spades?\n\nBe guided now, and always, by the idea of using your entries productively.\n\nYou are in your hand: seize the moment and do something from your hand that can't be done from dummy.\n\nI will play:",
          options: [
            { id: "spade", label: "Spade" },
            { id: "heart", label: "Heart" },
          ],
          expectedChoice: "spade",
          revealText: "Let's lead a spade up.",
        },
        {
          id: "cp2-8-jack-surprise",
          type: "INFO",
          atRoundIdx: 1,
          promptText:
            "Interesting — the Jack won the trick, a slight surprise. What should we do now?",
        },
        {
          id: "cp2-8-after-jack",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "Play:",
          options: [
            { id: "spades", label: "Spades" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "hearts",
          revealText:
            "Now is an excellent time to play hearts. You were looking forward to playing that suit. Since there is nothing you particularly want to do from dummy, now is the time to play a heart.\n\nWe want to stay off spades, as those are best played from our hand, finessing.",
        },
        {
          id: "cp2-8-continue-hearts-or-what",
          type: "PLAY_DECISION",
          atRoundIdx: 2,
          promptText: "We win another trick. Should we continue with hearts or what?\n\nI would play:",
          options: [
            { id: "spade", label: "Spade" },
            { id: "heart", label: "Heart" },
            { id: "diamond", label: "Diamond" },
            { id: "club", label: "Club" },
          ],
          expectedChoice: "spade",
          revealText:
            "Play a spade. Once again, without wanting to sound repetitive, we use our entry to do what cannot be done from the other hand.",
        },
        {
          id: "cp2-8-after-diamond-return",
          type: "PLAY_DECISION",
          atRoundIdx: 4,
          promptText: "A question I expect you to get right — what do we play now?",
          options: [
            { id: "spade", label: "Spade" },
            { id: "heart", label: "Heart" },
            { id: "diamond", label: "Diamond" },
            { id: "club", label: "Club" },
          ],
          expectedChoice: "spade",
          revealText:
            "Spade — from the start to the end, we have kept our focus on using entries productively.",
        },
        {
          id: "cp2-8-spade-distribution",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 5,
          fixed: { DECLARER: 3, DUMMY: 4, RHO: 2 },
          expectedDistribution: { LHO: 4, DUMMY: 4, RHO: 2, DECLARER: 3 },
          promptText: "What was the original spade distribution?",
        },
        {
          id: "cp2-8-hearts-going-well",
          type: "INFO",
          atRoundIdx: 6,
          promptText: "We are doing well — now all that's left is to continue with our heart suit.",
        },
        {
          id: "cp2-8-knock-ace-hearts",
          type: "INFO",
          atRoundIdx: 7,
          promptText: "We keep persisting — let's \"knock out the Ace\" and set up our 9th trick.",
        },
        {
          id: "cp2-8-done-9",
          type: "INFO",
          atRoundIdx: 11,
          promptText: "Our final heart is good, for a total of 9 tricks.",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "AJ109", H: "J1098", D: "32", C: "AJ7" },
      DECLARER: { S: "876", H: "KQ3", D: "AQ5", C: "10432" },
      LHO: { S: "Q432", H: "65", D: "8762", C: "K5" },
      RHO: { S: "K5", H: "A42", D: "KJT9", C: "Q986" },
    },
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (2♦ lead: low, King, Ace)",
        plays: [
          { seat: "LHO", card: { rank: "2", suit: "D" } },
          { seat: "DUMMY", card: { rank: "3", suit: "D" } },
          { seat: "RHO", card: { rank: "K", suit: "D" } },
          { seat: "DECLARER", card: { rank: "A", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (Low spade to the Jack)",
        plays: [
          { seat: "DECLARER", card: { rank: "8", suit: "S" } },
          { seat: "LHO", card: { rank: "3", suit: "S" } },
          { seat: "DUMMY", card: { rank: "J", suit: "S" } },
          { seat: "RHO", card: { rank: "5", suit: "S" } },
        ],
      },
      {
        label: "Trick 3 (Heart: low, King, low)",
        plays: [
          { seat: "DUMMY", card: { rank: "9", suit: "H" } },
          { seat: "RHO", card: { rank: "2", suit: "H" } },
          { seat: "DECLARER", card: { rank: "K", suit: "H" } },
          { seat: "LHO", card: { rank: "6", suit: "H" } },
        ],
      },
      {
        label: "Trick 4 (Spade: low, low, 10, King)",
        plays: [
          { seat: "DECLARER", card: { rank: "7", suit: "S" } },
          { seat: "LHO", card: { rank: "4", suit: "S" } },
          { seat: "DUMMY", card: { rank: "T", suit: "S" } },
          { seat: "RHO", card: { rank: "K", suit: "S" } },
        ],
      },
      {
        label: "Trick 5 (Diamond return: win the Queen — Ace already cashed)",
        plays: [
          { seat: "RHO", card: { rank: "9", suit: "D" } },
          { seat: "DUMMY", card: { rank: "2", suit: "D" } },
          { seat: "DECLARER", card: { rank: "Q", suit: "D" } },
          { seat: "LHO", card: { rank: "6", suit: "D" } },
        ],
      },
      {
        label: "Trick 6 (Spade: low, 9, East discards club)",
        plays: [
          { seat: "DECLARER", card: { rank: "6", suit: "S" } },
          { seat: "LHO", card: { rank: "2", suit: "S" } },
          { seat: "DUMMY", card: { rank: "9", suit: "S" } },
          { seat: "RHO", card: { rank: "9", suit: "C" }, showOut: true },
        ],
      },
      {
        label: "Trick 7 (Ace of spades)",
        plays: [
          { seat: "DUMMY", card: { rank: "A", suit: "S" } },
          { seat: "RHO", card: { rank: "8", suit: "C" }, showOut: true },
          { seat: "DECLARER", card: { rank: "4", suit: "C" }, showOut: true },
          { seat: "LHO", card: { rank: "Q", suit: "S" } },
        ],
      },
      {
        label: "Trick 8 (Heart: low, Queen, low)",
        plays: [
          { seat: "DUMMY", card: { rank: "8", suit: "H" } },
          { seat: "RHO", card: { rank: "4", suit: "H" } },
          { seat: "DECLARER", card: { rank: "Q", suit: "H" } },
          { seat: "LHO", card: { rank: "5", suit: "H" } },
        ],
      },
      {
        label: "Trick 9 (Heart: South leads; Ace wins for East)",
        plays: [
          { seat: "DECLARER", card: { rank: "3", suit: "H" } },
          { seat: "LHO", card: { rank: "8", suit: "D" }, showOut: true },
          { seat: "DUMMY", card: { rank: "J", suit: "H" } },
          { seat: "RHO", card: { rank: "A", suit: "H" } },
        ],
      },
      {
        label: "Trick 10 (Diamond — East leads; North pitches lowest club)",
        plays: [
          { seat: "RHO", card: { rank: "J", suit: "D" } },
          { seat: "DECLARER", card: { rank: "5", suit: "D" } },
          { seat: "LHO", card: { rank: "7", suit: "D" } },
          { seat: "DUMMY", card: { rank: "7", suit: "C" }, showOut: true },
        ],
      },
      {
        label: "Trick 11 (Diamond — East leads; discards)",
        plays: [
          { seat: "RHO", card: { rank: "T", suit: "D" } },
          { seat: "DECLARER", card: { rank: "3", suit: "C" }, showOut: true },
          { seat: "LHO", card: { rank: "8", suit: "D" } },
          { seat: "DUMMY", card: { rank: "J", suit: "C" }, showOut: true },
        ],
      },
      {
        label: "Trick 12 (East leads a club; North wins the Ace)",
        plays: [
          { seat: "RHO", card: { rank: "6", suit: "C" } },
          { seat: "DECLARER", card: { rank: "2", suit: "C" } },
          { seat: "LHO", card: { rank: "K", suit: "C" } },
          { seat: "DUMMY", card: { rank: "A", suit: "C" } },
        ],
      },
    ],
  },
  {
    id: "cp2-9",
    difficulty: 2,
    title: "4♠: heart finesse — dummy's entry and the five-card suit",
    newUntil: "2026-12-31",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "entriesProductive",
      themeLabel: "Theme: Using entries productively",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/cC7f208jmeg",
      startAutoPlayThroughRoundIdx: 0,
      customPrompts: [
        {
          id: "cp2-9-plan-trick2",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "What is your plan here, and what do you play to trick 2?",
          options: [
            { id: "trumps", label: "Trumps" },
            { id: "hearts", label: "Hearts" },
            { id: "diamonds", label: "Diamonds" },
            { id: "clubs", label: "Clubs" },
          ],
          expectedChoice: "hearts",
          revealText: "Hearts. Use Dummy's only sure entry wisely, don't waste it!",
        },
        {
          id: "cp2-9-dummy-five",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "Before explaining why, did you notice dummy's five-card ♣ suit?\n\nI talk a lot about the power of five-card suits, and I always at least glance to see whether I can set one up.",
        },
        {
          id: "cp2-9-dummy-weak",
          type: "INFO",
          atRoundIdx: 0,
          promptText:
            "Here dummy is too weak for that (see my Declarer Play article \"Pattern recognition #2 — Suss\").",
        },
        {
          id: "cp2-9-play-heart-ten",
          type: "PLAY_CARD",
          atRoundIdx: 0,
          promptText: "So how do you play the heart suit? Please play the trick by clicking the cards.",
          playCardUserPlaysDummyFirst: true,
          playCardAutoPlaysBefore: [{ seat: "RHO", card: { rank: "2", suit: "H" } }],
          playCardAutoPlayAfter: { seat: "LHO", card: { rank: "A", suit: "H" } },
          playCardEndHandAfterContinue: true,
          expectedSuit: "H",
          expectedRank: "T",
          correctRevealText: "Well done!",
          wrongRevealText: "Nice try.",
          revealText:
            "The winning play is to finesse the ♥J — that gives you the best chance of making 2 ♥ tricks.",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "43", H: "Q76", D: "A32", C: "JT985" },
      DECLARER: { S: "AKQ1098", H: "K108", D: "54", C: "32" },
      LHO: { S: "762", H: "A543", D: "KQJT", C: "AK7" },
      RHO: { S: "J5", H: "J92", D: "9876", C: "Q64" },
    },
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (♦K lead: ♦A wins in dummy)",
        plays: [
          { seat: "LHO", card: { rank: "K", suit: "D" } },
          { seat: "DUMMY", card: { rank: "A", suit: "D" } },
          { seat: "RHO", card: { rank: "9", suit: "D" } },
          { seat: "DECLARER", card: { rank: "5", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (Low ♥ from dummy — ♥10 from hand; West wins ♥A)",
        plays: [
          { seat: "DUMMY", card: { rank: "7", suit: "H" } },
          { seat: "RHO", card: { rank: "2", suit: "H" } },
          { seat: "DECLARER", card: { rank: "T", suit: "H" } },
          { seat: "LHO", card: { rank: "A", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "cp2-10",
    difficulty: 2,
    title: "4♠: spectacular crossruff — two 5–0 breaks",
    newUntil: "2026-12-31",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    auction: "",
    promptOptions: {
      promptThemeTint: "entriesProductive",
      themeLabel: "Theme: Using entries productively",
      promptPlacement: "right",
      hideAuction: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      hideOpponentLabels: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/WvrNS2Kkbtw",
      skipAutoPlayOnStart: true,
      customPrompts: [
        {
          id: "cp2-10-spectacular",
          type: "INFO",
          atRoundIdx: 1,
          promptText: "This is a spectacular declarer-play hand.",
        },
        {
          id: "cp2-10-prelim",
          type: "INFO",
          atRoundIdx: 1,
          promptText: "Before we go further, let's do some preliminary work.",
        },
        {
          id: "cp2-10-dist-hearts",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 1,
          fixed: { DUMMY: 5, RHO: 0, DECLARER: 3 },
          expectedDistribution: { LHO: 5, DUMMY: 5, RHO: 0, DECLARER: 3 },
          promptText: "The ♥ distribution is — fill in the missing seat.",
        },
        {
          id: "cp2-10-exp-hearts",
          type: "INFO",
          atRoundIdx: 1,
          promptText: "We can work out that West started with 5 ♥.",
        },
        {
          id: "cp2-10-dist-spades",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 1,
          fixed: { DUMMY: 4, DECLARER: 4, LHO: 0 },
          expectedDistribution: { LHO: 0, DUMMY: 4, RHO: 5, DECLARER: 4 },
          promptText: "What about the trump distribution? Fill in the missing seat.",
        },
        {
          id: "cp2-10-exp-spades",
          type: "INFO",
          atRoundIdx: 1,
          promptText:
            "East started with 5 ♠. Two 5–0 breaks — is that going to slow you down, or are you going to treat this hand like any other and stick with good principles?",
        },
        {
          id: "cp2-10-which-suit",
          type: "PLAY_DECISION",
          atRoundIdx: 1,
          promptText: "Which suit do you think declarer played next?",
          options: [
            { id: "trump", label: "Trump" },
            { id: "heart", label: "Heart" },
            { id: "diamond", label: "Diamond" },
            { id: "club", label: "Club" },
          ],
          expectedChoice: "heart",
          revealText:
            "Play a ♥. Good bridge principles like this don't have many exceptions — this hand was no exception.",
        },
        {
          id: "cp2-10-east-trumps-left",
          type: "SINGLE_NUMBER",
          atRoundIdx: 3,
          promptText:
            "Let's keep track of trumps — we know East started with 5. How many does East have left?\n\n(hint: think about how many rounds have been drawn and how many times East has ruffed)",
          expectedAnswer: 1,
        },
        {
          id: "cp2-10-exp-trumps-left",
          type: "INFO",
          atRoundIdx: 3,
          promptText:
            "East has 1 ♠ left — after ruffing twice and drawing two rounds.",
        },
        {
          id: "cp2-10-claimed",
          type: "INFO",
          atRoundIdx: 3,
          promptText:
            "Declarer actually claimed: the hand was high, with ♥ all winners and the rest a crossruff. One trump is still out with East — it wins eventually.",
        },
        {
          id: "cp2-10-wrap",
          type: "INFO",
          atRoundIdx: 3,
          promptText: "Two 5–0 breaks didn't slow declarer down — entries were used productively.",
        },
      ],
    },
    shownHands: {
      DUMMY: { S: "8765", H: "AKQ97", D: "A32", C: "2" },
      DECLARER: { S: "AK43", H: "382", D: "4", C: "AKQJ6" },
      LHO: { S: "", H: "JT654", D: "K765", C: "9854" },
      RHO: { S: "QJT92", H: "", D: "QJT98", C: "T73" },
    },
    visibleFullHandSeats: ["DUMMY", "DECLARER"],
    revealFullHandsAtEnd: ["LHO", "RHO"],
    rounds: [
      {
        label: "Trick 1 (♥J, ♥A; ♠2 ruff — East wins)",
        plays: [
          { seat: "LHO", card: { rank: "J", suit: "H" } },
          { seat: "DUMMY", card: { rank: "A", suit: "H" } },
          { seat: "RHO", card: { rank: "2", suit: "S" } },
          { seat: "DECLARER", card: { rank: "8", suit: "H" } },
        ],
      },
      {
        label: "Trick 2 (East leads — East, South, West, North: ♠Q, ♠A, ♦4, ♠5)",
        plays: [
          { seat: "RHO", card: { rank: "Q", suit: "S" } },
          { seat: "DECLARER", card: { rank: "A", suit: "S" } },
          { seat: "LHO", card: { rank: "4", suit: "D" } },
          { seat: "DUMMY", card: { rank: "5", suit: "S" } },
        ],
      },
      {
        label: "Trick 3 (♥2, ♥4, ♥7, ♠6 ruff)",
        plays: [
          { seat: "DECLARER", card: { rank: "2", suit: "H" } },
          { seat: "LHO", card: { rank: "4", suit: "H" } },
          { seat: "DUMMY", card: { rank: "7", suit: "H" } },
          { seat: "RHO", card: { rank: "6", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (♠J, ♠K, ♣8, ♠6 from dummy)",
        plays: [
          { seat: "RHO", card: { rank: "J", suit: "S" } },
          { seat: "DECLARER", card: { rank: "K", suit: "S" } },
          { seat: "LHO", card: { rank: "8", suit: "C" } },
          { seat: "DUMMY", card: { rank: "6", suit: "S" } },
        ],
      },
    ],
  },
  {
    id: "cp2-11",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Over the Shoulder #1 (1)",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["north", "south"],
    revealFullHandsAtEnd: ["east", "west"],
    auction: "1♣ P 1♥ P 1♠ P 2♠ 3♥ 4♠ P P P",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Over the Shoulder #1",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Over the Shoulder #1",
      promptThemeTint: "overShoulderDeclarer",
      showTrickTally: true,
      revealOriginalOnDone: true,
      videoUrlBeforeStart: "https://youtube.com/shorts/Lnr1t7pSA6Q?si=0OsUMGKCmahLLsBS",
      customPrompts: [
        {
          id: "cp2-11-knockout",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "continue",
          promptText:
            'There are a lot of possibilities, what should you do? This expert declarer was guided by by the typical and very good idea - "Knock out the Ace". (See declarer theme: knocking out the ace, for more).',
          videoUrl: "",
        },
        {
          id: "cp2-11-queen-ruff",
          type: "INFO",
          atRoundIdx: 3,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  East has just ruffed with the <TextWithColoredSuits text="Q♠" />.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  <strong>Rule: Always assume a card is the players lowest card.</strong>
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  This applies for discards and ruffs, there is no reason to think that east is doing
                  the unnatural thing of using a higher card than necessary. A logical conclusion is
                  that east has a singleton <TextWithColoredSuits text="Q♠" />.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-11-take-stock",
          type: "INFO",
          atRoundIdx: 4,
          continueButtonLabel: "continue",
          continueButtonLabel: "Lets watch the play",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Lets take stock. So far you have won 1 diamond trick and 2 ruffs. That is 3 tricks.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  This looks like a hand that you will have to try to cash winners and get as many
                  ruffs as possible. An alternative idea of setting up club tricks and drawing trumps
                  is not plausible, your trump position is too fragile.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Let us assume that east started with a singleton <TextWithColoredSuits text="Q♠" />.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  We can potentially score 4 ruffs in dummy, the <TextWithColoredSuits text="A♣" />,{" "}
                  <TextWithColoredSuits text="K♦" />. That is another 6 tricks, bringing the total to
                  9.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  We can then ruff 1 heart in hand with the <TextWithColoredSuits text="K♠" />, that
                  will be the 10th trick - we ruff high because we expected east to have 6 hearts,
                  that would give west 2.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-11-exit",
          type: "INFO",
          atRoundIdx: 9,
          continueButtonLabel: "Show me the current position",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  North will now just exit, and then ruff with the{" "}
                  <TextWithColoredSuits text="9♠" />, which is sitting over the{" "}
                  <TextWithColoredSuits text="J♠" />.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-11-summary-decisions",
          type: "INFO",
          atRoundIdx: 9,
          continueButtonLabel: "Reveal the original starting position",
          revealFullHandSeats: ["north", "east", "south", "west"],
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  This hand was made by a series of sensible decisions
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">1. Knock out the Ace, a good principle</p>
                <p className="ct-revealRichBody">
                  2. Count tricks - apart from top tricks, visualise making 4 of dummy&apos;s trumps
                  - that was the key to seeing 10 tricks. Especially once you realised East had a
                  singleton trump and couldn&apos;t overruff
                </p>
                <p className="ct-revealRichBody">
                  3. Making sure to ruff high with the <TextWithColoredSuits text="K♠" />, simply
                  remembering that east would have 6 hearts for the bidding.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "A973", H: "97542", D: "J85", C: "10" },
      east: { S: "Q", H: "AKQ1086", D: "93", C: "J732" },
      south: { S: "K1062", H: "", D: "KQ76", C: "AQ986" },
      west: { S: "J854", H: "J3", D: "A1042", C: "K54" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads ♥J; South ruffs ♠2)",
        plays: [
          { seat: "W", card: { rank: "J", suit: "H" } },
          { seat: "N", card: { rank: "2", suit: "H" } },
          { seat: "E", card: { rank: "6", suit: "H" } },
          { seat: "S", card: { rank: "2", suit: "S" }, showOut: true },
        ],
      },
      {
        label: "Trick 2 (South leads ♦Q — knocking out the Ace; South wins)",
        plays: [
          { seat: "S", card: { rank: "Q", suit: "D" } },
          { seat: "W", card: { rank: "2", suit: "D" } },
          { seat: "N", card: { rank: "5", suit: "D" } },
          { seat: "E", card: { rank: "3", suit: "D" } },
        ],
      },
      {
        label: "Trick 3 (South leads ♦6; West takes the ♦A)",
        plays: [
          { seat: "S", card: { rank: "6", suit: "D" } },
          { seat: "W", card: { rank: "A", suit: "D" } },
          { seat: "N", card: { rank: "8", suit: "D" } },
          { seat: "E", card: { rank: "9", suit: "D" } },
        ],
      },
      {
        label: "Trick 4 (West leads ♦4; East ruffs ♠Q)",
        plays: [
          { seat: "W", card: { rank: "4", suit: "D" } },
          { seat: "N", card: { rank: "J", suit: "D" } },
          { seat: "E", card: { rank: "Q", suit: "S" }, showOut: true },
          { seat: "S", card: { rank: "7", suit: "D" } },
        ],
      },
      {
        label: "Trick 5 (East cashes ♥A; South ruffs ♠6)",
        plays: [
          { seat: "E", card: { rank: "A", suit: "H" } },
          { seat: "S", card: { rank: "6", suit: "S" }, showOut: true },
          { seat: "W", card: { rank: "3", suit: "H" } },
          { seat: "N", card: { rank: "4", suit: "H" } },
        ],
      },
      {
        label: "Trick 6 (South cashes ♦K)",
        plays: [
          { seat: "S", card: { rank: "K", suit: "D" } },
          { seat: "W", card: { rank: "T", suit: "D" } },
          { seat: "N", card: { rank: "5", suit: "H" } },
          { seat: "E", card: { rank: "2", suit: "C" } },
        ],
      },
      {
        label: "Trick 7 (South cashes ♣A)",
        plays: [
          { seat: "S", card: { rank: "A", suit: "C" } },
          { seat: "W", card: { rank: "4", suit: "C" } },
          { seat: "N", card: { rank: "T", suit: "C" } },
          { seat: "E", card: { rank: "3", suit: "C" } },
        ],
      },
      {
        label: "Trick 8 (South leads ♣6; North ruffs ♠3)",
        plays: [
          { seat: "S", card: { rank: "6", suit: "C" } },
          { seat: "W", card: { rank: "5", suit: "C" } },
          { seat: "N", card: { rank: "3", suit: "S" }, showOut: true },
          { seat: "E", card: { rank: "7", suit: "C" } },
        ],
      },
      {
        label: "Trick 9 (North leads ♥9; South ruffs ♠K)",
        plays: [
          { seat: "N", card: { rank: "9", suit: "H" } },
          { seat: "E", card: { rank: "Q", suit: "H" } },
          { seat: "S", card: { rank: "K", suit: "S" }, showOut: true },
          { seat: "W", card: { rank: "K", suit: "C" }, showOut: true },
        ],
      },
      {
        label: "Trick 10 (South leads ♣8; West ruffs ♠4, North over-ruffs ♠7)",
        plays: [
          { seat: "S", card: { rank: "8", suit: "C" } },
          { seat: "W", card: { rank: "4", suit: "S" }, showOut: true },
          { seat: "N", card: { rank: "7", suit: "S" }, showOut: true },
          { seat: "E", card: { rank: "T", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "cp2-12",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Over the Shoulder #1 (2)",
    trumpSuit: "H",
    contract: "2♥",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["north", "south"],
    revealFullHandsAtEnd: ["east", "west"],
    auction: "1♥ X 2♥ P P P",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Over the Shoulder #1",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Over the Shoulder #1",
      promptThemeTint: "overShoulderDeclarer",
      videoUrlBeforeStart: "https://youtube.com/shorts/mCfT5FoFnnM?si=5UKSihaNYdfQfzBS",
      customPrompts: [
        {
          id: "cp2-12-strategy",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "We are in 2♥. Is this the type of dummy we should go for setting up our long suit or for ruffs in dummy?",
          options: [
            { id: "ruffs", label: "Ruffs in dummy" },
            { id: "setup", label: "Set up Spade suit" },
          ],
          expectedChoice: "ruffs",
          continueButtonLabel: "continue",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  Dummy needs to typically have opening values to be able to successfully set up a
                  side suit. With a weak dummy (say 10 or less points as a good guide), normally we
                  want to go for ruffs. See article{" "}
                  <a
                    href="https://bridgechampions.com/declarer/articles/pattern-recognition-1-ruffing-strategy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pattern recognition 1: ruffing strategy
                  </a>
                  .
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  There is no reason to duck, so don&apos;t duck. Lets win the{" "}
                  <TextWithColoredSuits text="A♦" /> and play a club immediately. We are rushing to
                  do this because otherwise the opponents will play trumps.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-12-count",
          type: "INFO",
          atRoundIdx: 3,
          continueButtonLabel: "Watch the play",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">What do we do here? Lets count tricks.</p>
                <p className="ct-revealRichBody">
                  The best way to do this is think about what happens if we win the{" "}
                  <TextWithColoredSuits text="A♥" /> (the Ace of trumps).
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  &quot;If I win the <TextWithColoredSuits text="A♥" />, I can ruff a club, return to
                  hand with the <TextWithColoredSuits text="A♠" /> and ruff another club. Total trick
                  count would be <TextWithColoredSuits text="A♠" />, <TextWithColoredSuits text="A♦" />
                  , 2 club ruffs which is 4. I then expect/hope to make 4 trumps (I will try draw them
                  by playing the <TextWithColoredSuits text="Q♥" /> and{" "}
                  <TextWithColoredSuits text="J♥" /> when I get a chance).&quot;
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  If, however, I try take the heart finesse now and it loses, another heart back will
                  limit me to 1 club ruff. It will be the same tricks as before but 1 less ruff, which
                  totals 7, and 1 off.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  Overall - lets win the <TextWithColoredSuits text="A♥" /> and go for ruffs.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-12-skills",
          type: "INFO",
          atRoundIdx: 12,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">Lets just check our skills for following trumps.</p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-12-trumps-start",
          type: "SINGLE_NUMBER",
          atRoundIdx: 12,
          promptText:
            "How many trumps did the opponents start with at the beginning of the hand?",
          expectedAnswer: 5,
        },
        {
          id: "cp2-12-trumps-left",
          type: "SINGLE_NUMBER",
          atRoundIdx: 12,
          promptText: "How many do they have left?",
          expectedAnswer: 1,
        },
        {
          id: "cp2-12-trumps-explain",
          type: "INFO",
          atRoundIdx: 12,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  We have drawn 2 rounds, with the <TextWithColoredSuits text="A♥" /> and the{" "}
                  <TextWithColoredSuits text="Q♥" />, both opponents followed, so that is 4 trumps of
                  theirs gone. Leaving 1 left. The last two tricks will be ours.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "Q10942", H: "1073", D: "A972", C: "8" },
      east: { S: "J83", H: "865", D: "KQ10", C: "K532" },
      south: { S: "A5", H: "AQJ42", D: "83", C: "10974" },
      west: { S: "K76", H: "K9", D: "J654", C: "AQJ6" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads ♦4)",
        plays: [{ seat: "W", card: { rank: "4", suit: "D" } }],
      },
      {
        label: "Trick 1 completed (dummy wins the ♦A)",
        keepExistingTrickCards: true,
        plays: [
          { seat: "N", card: { rank: "A", suit: "D" } },
          { seat: "E", card: { rank: "T", suit: "D" } },
          { seat: "S", card: { rank: "3", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (dummy leads ♣8; East wins the ♣K)",
        plays: [
          { seat: "N", card: { rank: "8", suit: "C" } },
          { seat: "E", card: { rank: "K", suit: "C" } },
          { seat: "S", card: { rank: "4", suit: "C" } },
          { seat: "W", card: { rank: "6", suit: "C" } },
        ],
      },
      {
        label: "Trick 3 (East leads a trump ♥5)",
        plays: [{ seat: "E", card: { rank: "5", suit: "H" } }],
      },
      {
        label: "Trick 3 completed (South wins the ♥A)",
        keepExistingTrickCards: true,
        plays: [
          { seat: "S", card: { rank: "A", suit: "H" } },
          { seat: "W", card: { rank: "9", suit: "H" } },
          { seat: "N", card: { rank: "3", suit: "H" } },
        ],
      },
      {
        label: "Trick 4 (South leads ♣7; dummy ruffs with ♥7)",
        plays: [
          { seat: "S", card: { rank: "7", suit: "C" } },
          { seat: "W", card: { rank: "J", suit: "C" } },
          { seat: "N", card: { rank: "7", suit: "H" } },
          { seat: "E", card: { rank: "2", suit: "C" } },
        ],
      },
      {
        label: "Trick 5 (dummy leads ♠2; South wins the ♠A — back to hand)",
        plays: [
          { seat: "N", card: { rank: "2", suit: "S" } },
          { seat: "E", card: { rank: "3", suit: "S" } },
          { seat: "S", card: { rank: "A", suit: "S" } },
          { seat: "W", card: { rank: "6", suit: "S" } },
        ],
      },
      {
        label: "Trick 6 (South leads ♣9; dummy ruffs with ♥10)",
        plays: [
          { seat: "S", card: { rank: "9", suit: "C" } },
          { seat: "W", card: { rank: "Q", suit: "C" } },
          { seat: "N", card: { rank: "T", suit: "H" } },
          { seat: "E", card: { rank: "5", suit: "C" } },
        ],
      },
      {
        label: "Trick 7 (dummy leads ♠Q; West wins the ♠K)",
        plays: [
          { seat: "N", card: { rank: "Q", suit: "S" } },
          { seat: "E", card: { rank: "8", suit: "S" } },
          { seat: "S", card: { rank: "5", suit: "S" } },
          { seat: "W", card: { rank: "K", suit: "S" } },
        ],
      },
      {
        label: "Trick 8 (West cashes ♣A)",
        plays: [
          { seat: "W", card: { rank: "A", suit: "C" } },
          { seat: "N", card: { rank: "9", suit: "S" } },
          { seat: "E", card: { rank: "3", suit: "C" } },
          { seat: "S", card: { rank: "T", suit: "C" } },
        ],
      },
      {
        label: "Trick 9 (West leads ♦6; East wins the ♦Q)",
        plays: [
          { seat: "W", card: { rank: "6", suit: "D" } },
          { seat: "N", card: { rank: "7", suit: "D" } },
          { seat: "E", card: { rank: "Q", suit: "D" } },
          { seat: "S", card: { rank: "8", suit: "D" } },
        ],
      },
      {
        label: "Trick 10 (East leads ♦K; South ruffs with ♥2)",
        plays: [
          { seat: "E", card: { rank: "K", suit: "D" } },
          { seat: "S", card: { rank: "2", suit: "H" } },
          { seat: "W", card: { rank: "5", suit: "D" } },
          { seat: "N", card: { rank: "9", suit: "D" } },
        ],
      },
      {
        label: "Trick 11 (South leads ♥Q; West wins the ♥K)",
        plays: [
          { seat: "S", card: { rank: "Q", suit: "H" } },
          { seat: "W", card: { rank: "K", suit: "H" } },
          { seat: "N", card: { rank: "4", suit: "S" } },
          { seat: "E", card: { rank: "6", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "cp2-13",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Over the Shoulder #1 (3)",
    trumpSuit: "NT",
    contract: "1NT",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["north", "south"],
    revealFullHandsAtEnd: ["east", "west"],
    auction: "1♦ 1NT P P P",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Over the Shoulder #1",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Over the Shoulder #1",
      promptThemeTint: "overShoulderDeclarer",
      videoUrlBeforeStart: "https://youtube.com/shorts/EpXc0h8iHdc?si=oOhbNl8SKqR-F29S",
      customPrompts: [
        {
          id: "cp2-13-duck",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  One indication that ducking might be a good idea - you are happy if the opponents
                  switch to any of the other suits. If, however, you really didn&apos;t want the
                  opponents to switch (you had a weaker suit somewhere else), you should take the
                  trick immediately before they can switch.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-13-count",
          type: "INFO",
          atRoundIdx: 1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Surprising to see a switch, but we are okay with that, it has setup another spade
                  trick at least. Lets count our tricks, assuming the{" "}
                  <TextWithColoredSuits text="K♦" /> is onside.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  <TextWithColoredSuits text="Our absolute top tricks are: 1♠, 2♥, 2♦ - that totals 5. There are lots of possibilities for more tricks - the club suit, the spade suit (could break 3-3 for example. The heart suit could break or you can actually play for west to just hold one of the honors (Can you see how to do that? - You'll see soon)." />
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">Declarer decided to go after spades to begin with.</p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-13-dist",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 4,
          fixed: { S: 4, N: 3 },
          expectedDistribution: { S: 4, N: 3, W: 2, E: 4 },
          promptText: "The original spade distribution was?",
        },
        {
          id: "cp2-13-dist-explain",
          type: "INFO",
          atRoundIdx: 4,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  <TextWithColoredSuits text="The spades have not broken, so you only have 2♠ tricks, 2♥, 2♦ which totals 6." />
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  <TextWithColoredSuits text="IF we try make a club trick, maybe the opponents can setup 3♦ tricks before we can setup our club - that would give them 2♣, 3♦, 2♠, which is 7 tricks for them, and 1 down for us." />
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  <TextWithColoredSuits text="However, IF we try setup hearts and it works, the opponents only have 2♠ tricks, 1♥, 2♣ - which only totals 5 tricks at the point we have 2♠, 3♥, 2♦ = 7. In other words, we will make 7 tricks in time!" />
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Note: It is not always so easy to do but this is how counting winners and losers
                  works, exposure to the process will help you get there.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-13-done",
          type: "INFO",
          atRoundIdx: 9,
          continueButtonLabel: "Reveal the full hand",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">You have made 7 tricks well done</p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "872", H: "K1095", D: "973", C: "QJ9" },
      east: { S: "KQ94", H: "J3", D: "K842", C: "A85" },
      south: { S: "AJ103", H: "A74", D: "AQ6", C: "1076" },
      west: { S: "65", H: "Q862", D: "J105", C: "K432" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads ♦J; South ducks)",
        plays: [
          { seat: "W", card: { rank: "J", suit: "D" } },
          { seat: "N", card: { rank: "3", suit: "D" } },
          { seat: "E", card: { rank: "2", suit: "D" } },
          { seat: "S", card: { rank: "6", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (West switches ♠6; South wins the ♠A)",
        plays: [
          { seat: "W", card: { rank: "6", suit: "S" } },
          { seat: "N", card: { rank: "8", suit: "S" } },
          { seat: "E", card: { rank: "Q", suit: "S" } },
          { seat: "S", card: { rank: "A", suit: "S" } },
        ],
      },
      {
        label: "Trick 3 (South leads ♠J; East wins the ♠K)",
        plays: [
          { seat: "S", card: { rank: "J", suit: "S" } },
          { seat: "W", card: { rank: "5", suit: "S" } },
          { seat: "N", card: { rank: "2", suit: "S" } },
          { seat: "E", card: { rank: "K", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (East leads ♦4; South wins the ♦Q — King onside)",
        plays: [
          { seat: "E", card: { rank: "4", suit: "D" } },
          { seat: "S", card: { rank: "Q", suit: "D" } },
          { seat: "W", card: { rank: "5", suit: "D" } },
          { seat: "N", card: { rank: "7", suit: "D" } },
        ],
      },
      {
        label: "Trick 5 (South cashes ♠10; West shows out)",
        plays: [
          { seat: "S", card: { rank: "T", suit: "S" } },
          { seat: "W", card: { rank: "2", suit: "C" } },
          { seat: "N", card: { rank: "7", suit: "S" } },
          { seat: "E", card: { rank: "4", suit: "S" } },
        ],
      },
      {
        label: "Trick 6 (South leads ♥4; dummy's ♥10 loses to East's ♥J)",
        plays: [
          { seat: "S", card: { rank: "4", suit: "H" } },
          { seat: "W", card: { rank: "2", suit: "H" } },
          { seat: "N", card: { rank: "T", suit: "H" } },
          { seat: "E", card: { rank: "J", suit: "H" } },
        ],
      },
      {
        label: "Trick 7 (East cashes ♦K; South wins the ♦A)",
        plays: [
          { seat: "E", card: { rank: "K", suit: "D" } },
          { seat: "S", card: { rank: "A", suit: "D" } },
          { seat: "W", card: { rank: "T", suit: "D" } },
          { seat: "N", card: { rank: "9", suit: "D" } },
        ],
      },
      {
        label: "Trick 8 (South cashes ♥A)",
        plays: [
          { seat: "S", card: { rank: "A", suit: "H" } },
          { seat: "W", card: { rank: "6", suit: "H" } },
          { seat: "N", card: { rank: "5", suit: "H" } },
          { seat: "E", card: { rank: "3", suit: "H" } },
        ],
      },
      {
        label: "Trick 9 (South leads ♥7; dummy's ♥9 wins, West keeps the ♥Q)",
        plays: [
          { seat: "S", card: { rank: "7", suit: "H" } },
          { seat: "W", card: { rank: "8", suit: "H" } },
          { seat: "N", card: { rank: "9", suit: "H" } },
          { seat: "E", card: { rank: "8", suit: "D" } },
        ],
      },
      {
        label: "Trick 10 (dummy's ♥K captures West's ♥Q)",
        plays: [
          { seat: "N", card: { rank: "K", suit: "H" } },
          { seat: "E", card: { rank: "5", suit: "C" } },
          { seat: "S", card: { rank: "6", suit: "C" } },
          { seat: "W", card: { rank: "Q", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "cp2-14",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Over the Shoulder #1 (4)",
    trumpSuit: "H",
    contract: "6♥",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["north", "south"],
    auction: "",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Over the Shoulder #1",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Over the Shoulder #1",
      promptThemeTint: "overShoulderDeclarer",
      videoUrlBeforeStart: "https://youtube.com/shorts/uGvE0Pzz1R4?si=Y9y3wdDyOrn0g07D",
      customPrompts: [
        {
          id: "cp2-14-count",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "continue",
          spotlightSeat: "south",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  In suit contracts it is a good idea to look at the long trump hand and count losers
                  (see counting problems Theme: counting Losers).
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  <TextWithColoredSuits text="We potentially have 1♠ loser, no ♥ losers, no ♣, and 2♦. That totals 3." />
                </p>
                <p className="ct-revealRichBody">
                  We can easily ruff one of diamond losers, bringing the total loser count down to 2.
                  We also have the
                  simple spade finesse as an option, anything else?
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-14-plan",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "Continue with the play",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  As mentioned in previous problems on &quot;see the 4-3&quot;, the 4-3 fit is often a
                  source of extra tricks. Here the diamonds are a 4-3, if they setup, we can pitch
                  dummy&apos;s spade on the 4th diamond, which will take care of our spade loser.
                </p>
                <p className="ct-revealRichBody">
                  There is one more small but significant thing to the hand, that could make the
                  difference between making the slam or not.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  <strong>
                    Rule: It is good technique to eliminate suits if you can, before losing the lead.
                    Sometimes you can afford to do that when you have lots of trumps
                  </strong>
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Our card sense should be telling us to eliminate clubs, it is the type of thing
                  that might be good, and won&apos;t be bad.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-14-entries",
          type: "INFO",
          atRoundIdx: 1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  This declarer used her entries productively and immediately played a club - always
                  do from one hand what you cant do from the other hand - here it was convenient to
                  ruff a club.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-14-trumps",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 2,
          fixed: { S: 6, N: 5 },
          expectedDistribution: { S: 6, N: 5, W: 1, E: 1 },
          promptText: "What was the original trump distribution?",
        },
        {
          id: "cp2-14-trumps-msg",
          type: "INFO",
          atRoundIdx: 2,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  Well counted — the trumps were 1-1, so both opponents are now out of trumps.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-14-diamonds",
          type: "INFO",
          atRoundIdx: 3,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Declarer is now about to try diamonds, but notice a great play coming up - can you
                  spot what might happen?
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-14-duck",
          type: "PLAY_DECISION",
          atRoundIdx: 5,
          promptText: "Do you win the Ace or duck?",
          options: [
            { id: "win", label: "Win the Ace" },
            { id: "duck", label: "Duck it" },
          ],
          expectedChoice: "duck",
          continueButtonLabel: "Reveal the current position",
          revealText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  Duck!! what is the rush to see if the diamonds break? If they don&apos;t you will
                  take the spade finesse. But what if west has no more diamonds to return? Forced to
                  return a spade, or a club - but remember you eliminated clubs!
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-14-endplay",
          type: "INFO",
          atRoundIdx: 6,
          continueButtonLabel: "continue",
          revealFullHandSeats: ["north", "east", "south", "west"],
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  West is stuck on lead now, and even though diamonds didn&apos;t break, and spade
                  finesse was offside, you managed to find an endplay.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-14-summary",
          type: "INFO",
          atRoundIdx: 6,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichHeading">Summary</p>
                <p className="ct-revealRichBody">
                  You don&apos;t need great foresight to plan this play, just a bit of good technique -
                  eliminating clubs because it can&apos;t hurt, and often is &quot;just a good
                  idea&quot;.
                </p>
                <p className="ct-revealRichBody">
                  In this position, whatever west returns, will either give you a spade trick or a
                  ruff and discard to throw your spade away.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "72", H: "KJ764", D: "A84", C: "A53" },
      east: { S: "1054", H: "9", D: "10965", C: "KQ1087" },
      south: { S: "AQ", H: "AQ10853", D: "K732", C: "2" },
      west: { S: "KJ9863", H: "2", D: "QJ", C: "J964" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads ♣4; dummy wins the ♣A)",
        plays: [
          { seat: "W", card: { rank: "4", suit: "C" } },
          { seat: "N", card: { rank: "A", suit: "C" } },
          { seat: "E", card: { rank: "7", suit: "C" } },
          { seat: "S", card: { rank: "2", suit: "C" } },
        ],
      },
      {
        label: "Trick 2 (dummy leads ♣3; South ruffs ♥10)",
        plays: [
          { seat: "N", card: { rank: "3", suit: "C" } },
          { seat: "E", card: { rank: "8", suit: "C" } },
          { seat: "S", card: { rank: "T", suit: "H" } },
          { seat: "W", card: { rank: "6", suit: "C" } },
        ],
      },
      {
        label: "Trick 3 (South draws trumps ♥3; dummy's ♥K wins — both opponents show out)",
        plays: [
          { seat: "S", card: { rank: "3", suit: "H" } },
          { seat: "W", card: { rank: "2", suit: "H" } },
          { seat: "N", card: { rank: "K", suit: "H" } },
          { seat: "E", card: { rank: "9", suit: "H" } },
        ],
      },
      {
        label: "Trick 4 (dummy leads ♣5; South ruffs ♥8 — clubs eliminated)",
        plays: [
          { seat: "N", card: { rank: "5", suit: "C" } },
          { seat: "E", card: { rank: "K", suit: "C" } },
          { seat: "S", card: { rank: "8", suit: "H" } },
          { seat: "W", card: { rank: "9", suit: "C" } },
        ],
      },
      {
        label: "Trick 5 (South leads ♦K)",
        plays: [
          { seat: "S", card: { rank: "K", suit: "D" } },
          { seat: "W", card: { rank: "J", suit: "D" } },
          { seat: "N", card: { rank: "4", suit: "D" } },
          { seat: "E", card: { rank: "5", suit: "D" } },
        ],
      },
      {
        label: "Trick 6 (South leads ♦2; West plays ♦Q)",
        plays: [
          { seat: "S", card: { rank: "2", suit: "D" } },
          { seat: "W", card: { rank: "Q", suit: "D" } },
        ],
      },
      {
        label: "Trick 6 completed (dummy ducks ♦8; West wins ♦Q — endplayed)",
        keepExistingTrickCards: true,
        plays: [
          { seat: "N", card: { rank: "8", suit: "D" } },
          { seat: "E", card: { rank: "6", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "cp2-15",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Over the Shoulder #1 (5)",
    trumpSuit: "S",
    contract: "6♠",
    dealerCompass: "S",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["north", "south"],
    auction: "",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Over the Shoulder #1",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Over the Shoulder #1",
      promptThemeTint: "overShoulderDeclarer",
      videoUrlBeforeStart: "https://youtube.com/shorts/JLoHRjVILZA?si=GZuLyZe0COmVhd-s",
      customPrompts: [
        {
          id: "cp2-15-intro",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "Watch the play",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  This is an amazing hand where the expert declarer found an almost certain way to
                  make this contract, focused on the idea of &quot;set up long suits&quot;. He was
                  aware that the quality 6 card club suit was his reliable ticket to making this
                  contract.
                </p>
                <p className="ct-revealRichBody">
                  Lets watch what he did and follow the play, keeping track of the suits.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-15-duck",
          type: "INFO",
          atRoundIdx: 1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  A stunning strategy, ducking a club trick despite the suit looking so good.
                  Declarer&apos;s basic logic - &quot;I have <TextWithColoredSuits text="5♠ tricks, 1♥, and 2♦" /> which
                  totals 8. I want to make a humble 4 tricks in clubs. I&apos;ll duck one and then ruff
                  one&quot;.
                </p>
                <p className="ct-revealRichBody">
                  Do you see what that will do? At the expense of a single ruff, the suit will be
                  setup despite a 4-2 break.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-15-clubbreak",
          type: "DISTRIBUTION_GUESS",
          suit: "C",
          atRoundIdx: 3,
          fixed: { N: 6, S: 1, W: 2 },
          expectedDistribution: { N: 6, S: 1, W: 2, E: 4 },
          promptText:
            "What is the most extreme break the clubs can be now that both players have followed twice?",
        },
        {
          id: "cp2-15-clubbreak-msg",
          type: "INFO",
          atRoundIdx: 3,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  The clubs are 4-2 at worst. Try visualise that the{" "}
                  <TextWithColoredSuits text="A♣" /> and <TextWithColoredSuits text="K♣" /> will take
                  care of the remaining 2 clubs, all we need to do is now draw trumps and cross to
                  dummy in diamonds.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-15-spadebreak",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 4,
          fixed: { S: 5, N: 2 },
          expectedDistribution: { S: 5, N: 2, W: 4, E: 2 },
          promptText: "What was the spade break?",
        },
        {
          id: "cp2-15-spadebreak-msg",
          type: "INFO",
          atRoundIdx: 4,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  West started with 4, east started with 2. You&apos;ve drawn 3 rounds, lets draw
                  wests final trump.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-15-trumpsdrawn",
          type: "INFO",
          atRoundIdx: 5,
          continueButtonLabel: "Reveal the hand",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  Trumps are drawn, you&apos;ve got 12 tricks with the hand being fully in control
                  despite each black suit breaking 4-2.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-15-final",
          type: "INFO",
          atRoundIdx: 5,
          revealFullHandSeats: ["north", "east", "south", "west"],
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Ducking a club is a nice touch, but the key point is
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  <strong>
                    Rule: When we are focused on setting up long suits, creative possibilities will
                    come up.
                  </strong>
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "K5", H: "92", D: "K43", C: "AK8432" },
      east: { S: "83", H: "J765", D: "876", C: "QJ109" },
      south: { S: "AQJ42", H: "AQ43", D: "AJ5", C: "6" },
      west: { S: "10976", H: "K108", D: "Q1092", C: "75" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads a trump ♠6; South wins ♠Q)",
        plays: [
          { seat: "W", card: { rank: "6", suit: "S" } },
          { seat: "N", card: { rank: "5", suit: "S" } },
          { seat: "E", card: { rank: "3", suit: "S" } },
          { seat: "S", card: { rank: "Q", suit: "S" } },
        ],
      },
      {
        label: "Trick 2 (South leads ♣6; dummy DUCKS ♣2; East wins ♣9)",
        plays: [
          { seat: "S", card: { rank: "6", suit: "C" } },
          { seat: "W", card: { rank: "5", suit: "C" } },
          { seat: "N", card: { rank: "2", suit: "C" } },
          { seat: "E", card: { rank: "9", suit: "C" } },
        ],
      },
      {
        label: "Trick 3 (East leads ♠8; dummy's ♠K wins)",
        plays: [
          { seat: "E", card: { rank: "8", suit: "S" } },
          { seat: "S", card: { rank: "2", suit: "S" } },
          { seat: "W", card: { rank: "7", suit: "S" } },
          { seat: "N", card: { rank: "K", suit: "S" } },
        ],
      },
      {
        label: "Trick 4 (dummy leads ♣3; South ruffs ♠4 — clubs set up)",
        plays: [
          { seat: "N", card: { rank: "3", suit: "C" } },
          { seat: "E", card: { rank: "T", suit: "C" } },
          { seat: "S", card: { rank: "4", suit: "S" } },
          { seat: "W", card: { rank: "7", suit: "C" } },
        ],
      },
      {
        label: "Trick 5 (South cashes ♠A; both opponents show out — 4-2)",
        plays: [
          { seat: "S", card: { rank: "A", suit: "S" } },
          { seat: "W", card: { rank: "9", suit: "S" } },
          { seat: "N", card: { rank: "3", suit: "D" } },
          { seat: "E", card: { rank: "6", suit: "D" } },
        ],
      },
      {
        label: "Trick 6 (South draws West's last trump ♠J)",
        plays: [
          { seat: "S", card: { rank: "J", suit: "S" } },
          { seat: "W", card: { rank: "T", suit: "S" } },
          { seat: "N", card: { rank: "2", suit: "H" } },
          { seat: "E", card: { rank: "7", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "cp2-16",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Over the Shoulder #2 (1)",
    trumpSuit: "S",
    contract: "6♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["north", "south"],
    revealFullHandsAtEnd: ["east", "west"],
    auction: "",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Over the Shoulder #2",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Over the Shoulder #2",
      promptThemeTint: "overShoulderDeclarer2",
      videoUrlBeforeStart: "https://youtube.com/shorts/TpNBLpAgr4A?si=cEJ5pFh6exSH-UZ1",
      customPrompts: [
        {
          id: "cp2-16-intro",
          type: "INFO",
          atRoundIdx: 0,
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  On this problem I want us to look at winner and loser count closely, and use it to
                  make a logical plan.
                </p>
                <p className="ct-revealRichBody">
                  Let's start with outright winners: 6 spades, 4 hearts, 1 diamond.
                </p>
                <p className="ct-revealRichBody">
                  We have 11 top tricks and we are shooting for a 12th. Nothing fancy — the best shot
                  is either going to be the diamond finesse or the King of clubs.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  If we play a club to the King and it loses, we have 2 losers in clubs straight away
                  and we go down. Similar with diamonds — if we play a diamond to the Queen and it
                  loses, we will also lose the club Ace, for 1 down.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-16-trumpbreak",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 0,
          fixed: { S: 5, N: 6 },
          expectedDistribution: { S: 5, N: 6, W: 1, E: 1 },
          promptText: "The trump distribution was?",
        },
        {
          id: "cp2-16-trumpbreak-msg",
          type: "INFO",
          atRoundIdx: 0,
          promptText: "All the trumps are gone, they broke 1-1.",
          videoUrl: "",
        },
        {
          id: "cp2-16-what-now",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText: "What should you do now?",
          options: [
            { id: "diamond", label: "Take a diamond finesse" },
            { id: "club", label: "Play a club to the King" },
            { id: "hearts", label: "Cash the heart winners" },
          ],
          expectedChoice: "hearts",
          revealText:
            "Lets say we cash some heart winners. On the 4th heart winner we can pitch a loser, say a club or a diamond, but that still doesn't give us our 12th trick.",
        },
        {
          id: "cp2-16-which-card",
          type: "PLAY_DECISION",
          atRoundIdx: 3,
          promptText:
            "On the 4th heart winner, lets say we throw a minor suit card. Does it matter which card we throw?",
          options: [
            { id: "club", label: "Must throw a club" },
            { id: "diamond", label: "Must throw a diamond" },
            { id: "doesntmatter", label: "Doesn't matter" },
          ],
          expectedChoice: "club",
          continueButtonLabel: "show me the play",
          revealText:
            "Throw a club! It doesn't give us our 12th trick yet, we still need to try get that in one of the minors, we are still only at 11 tricks. However, by throwing a club, it allows us to play a club up to the King. IF it loses, we don't lose a second club and go down straight away (because our heart pitch allowed us to pitch down to a singleton club). The benefit of that is, IF the club to the King loses, we can try a diamond to the Queen.\n\nOverall now we have two chances to make the contract with either the club king or the diamond finesse, that is 75% chance of making, which is a lot better than randomly choosing one of the minors and hoping it works!",
        },
        {
          id: "cp2-16-clubup",
          type: "INFO",
          atRoundIdx: 5,
          continueButtonLabel: "Reveal all the hands",
          promptText:
            "We are now ready to play a club up, if it loses we will try for a diamond finesse. It turns out that the club up worked but the diamond finesse would not have worked.",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "KQ9753", H: "KQ7", D: "94", C: "84" },
      east: { S: "2", H: "62", D: "87532", C: "AJ1032" },
      south: { S: "AJ1084", H: "AJ85", D: "AQ", C: "K6" },
      west: { S: "6", H: "10943", D: "KJ106", C: "Q975" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads ♠6; dummy wins the ♠9 — trumps are 1-1)",
        plays: [
          { seat: "W", card: { rank: "6", suit: "S" } },
          { seat: "N", card: { rank: "9", suit: "S" } },
          { seat: "E", card: { rank: "2", suit: "S" } },
          { seat: "S", card: { rank: "4", suit: "S" } },
        ],
      },
      {
        label: "Trick 2 (cash ♥K)",
        plays: [
          { seat: "N", card: { rank: "K", suit: "H" } },
          { seat: "E", card: { rank: "6", suit: "H" } },
          { seat: "S", card: { rank: "8", suit: "H" } },
          { seat: "W", card: { rank: "3", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (cash ♥Q)",
        plays: [
          { seat: "N", card: { rank: "Q", suit: "H" } },
          { seat: "E", card: { rank: "2", suit: "H" } },
          { seat: "S", card: { rank: "5", suit: "H" } },
          { seat: "W", card: { rank: "4", suit: "H" } },
        ],
      },
      {
        label: "Trick 4 (♥7 to your ♥A; East shows out)",
        plays: [
          { seat: "N", card: { rank: "7", suit: "H" } },
          { seat: "E", card: { rank: "2", suit: "D" }, showOut: true },
          { seat: "S", card: { rank: "A", suit: "H" } },
          { seat: "W", card: { rank: "9", suit: "H" } },
        ],
      },
      {
        label: "Trick 5 (cash the ♥J — dummy pitches a club)",
        plays: [
          { seat: "S", card: { rank: "J", suit: "H" } },
          { seat: "W", card: { rank: "T", suit: "H" } },
          { seat: "N", card: { rank: "8", suit: "C" } },
          { seat: "E", card: { rank: "3", suit: "D" } },
        ],
      },
      {
        label: "Trick 6 (♠8 to dummy's ♠K — ready to play a club up)",
        plays: [
          { seat: "S", card: { rank: "8", suit: "S" } },
          { seat: "W", card: { rank: "6", suit: "D" } },
          { seat: "N", card: { rank: "K", suit: "S" } },
          { seat: "E", card: { rank: "5", suit: "D" } },
        ],
      },
    ],
  },
  {
    id: "cp2-17",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Over the Shoulder #2 (2)",
    trumpSuit: "H",
    contract: "4♥",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["north", "south"],
    revealFullHandsAtEnd: ["east", "west"],
    auction: "",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Over the Shoulder #2",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Over the Shoulder #2",
      promptThemeTint: "overShoulderDeclarer2",
      videoUrlBeforeStart: "https://youtube.com/shorts/5Ea-PBy0vOk?si=1jWECJIl590XIVwT",
      customPrompts: [
        {
          id: "cp2-17-intro",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "follow the play",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  This is a hand that has tripped up several experts. Playing in{" "}
                  <TextWithColoredSuits text="4♥" />, you get the <TextWithColoredSuits text="J♦" /> lead.
                </p>
                <p className="ct-revealRichBody">
                  Declarer quite reasonably won the opening lead and drew trumps. Let's follow the play
                  and decide what to do next.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-17-trumpbreak",
          type: "DISTRIBUTION_GUESS",
          suit: "H",
          atRoundIdx: 2,
          fixed: { S: 6, N: 4 },
          expectedDistribution: { S: 6, N: 4, W: 2, E: 1 },
          promptText: "The trump distribution was?",
        },
        {
          id: "cp2-17-trumpsdrawn",
          type: "INFO",
          atRoundIdx: 2,
          promptText: "The hearts have broken 2-1 and we have drawn all the trumps.",
          videoUrl: "",
        },
        {
          id: "cp2-17-diamonds",
          type: "PLAY_DECISION",
          atRoundIdx: 2,
          promptText: "Do we have anything useful to do with our diamond winners?",
          options: [
            { id: "clubs", label: "Pitch clubs" },
            { id: "spades", label: "Pitch spades" },
            { id: "neither", label: "Neither helps us get to 10 tricks" },
          ],
          expectedChoice: "spades",
          continueButtonLabel: "Reveal full hand",
          revealText:
            "Pitch spades. This seemed to be a bit of an illusion for many people because the spade King looked like a prospect of a trick. Yet, it would have maybe been easier to see if you had two small spades. Pitch both the spades, now just lose 3 clubs, and ruff your 4th club.\n\nIn total you will make 6 heart tricks, 3 diamond tricks, and 1 club ruff for 10 tricks, losing only 3 club tricks.",
        },
      ],
    },
    shownHands: {
      north: { S: "J10", H: "AK94", D: "AQ93", C: "K94" },
      east: { S: "76432", H: "5", D: "76542", C: "AJ" },
      south: { S: "K8", H: "QJ10863", D: "K", C: "8652" },
      west: { S: "AQ95", H: "72", D: "J108", C: "Q1073" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads ♦J; declarer wins the ♦K in hand)",
        plays: [
          { seat: "W", card: { rank: "J", suit: "D" } },
          { seat: "N", card: { rank: "3", suit: "D" } },
          { seat: "E", card: { rank: "2", suit: "D" } },
          { seat: "S", card: { rank: "K", suit: "D" } },
        ],
      },
      {
        label: "Trick 2 (♥3 to dummy's ♥A — first round of trumps)",
        plays: [
          { seat: "S", card: { rank: "3", suit: "H" } },
          { seat: "W", card: { rank: "2", suit: "H" } },
          { seat: "N", card: { rank: "A", suit: "H" } },
          { seat: "E", card: { rank: "5", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (dummy's ♥K draws the last trumps; East discards a spade)",
        plays: [
          { seat: "N", card: { rank: "K", suit: "H" } },
          { seat: "E", card: { rank: "2", suit: "S" } },
          { seat: "S", card: { rank: "6", suit: "H" } },
          { seat: "W", card: { rank: "7", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "cp2-18",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Over the Shoulder #2 (3)",
    trumpSuit: "C",
    contract: "6♣",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["north", "south"],
    revealFullHandsAtEnd: ["east", "west"],
    auction: "",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Over the Shoulder #2",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Over the Shoulder #2",
      promptThemeTint: "overShoulderDeclarer2",
      videoUrlBeforeStart: "https://youtube.com/shorts/4E4Ba3T4WSA?si=G7yugRekg3U7uB7J",
      customPrompts: [
        {
          id: "cp2-18-trumpcount",
          type: "SINGLE_NUMBER",
          atRoundIdx: 0,
          promptText: "How many trumps did the opponents start with on this hand?",
          expectedAnswer: 2,
        },
        {
          id: "cp2-18-trumpcount-msg",
          type: "INFO",
          atRoundIdx: 0,
          promptText: "The opponents started with 2 trumps, so both have been drawn.",
          videoUrl: "",
        },
        {
          id: "cp2-18-count",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "continue",
          promptText:
            "Playing in 6♣ we, as always, try to count to 12 tricks - 7 clubs, 3 diamonds, 1 heart. That totals 11 sure tricks, where is the 12th coming from?\n\nA simple heart to the Queen or spade to the King could be the 12th trick, that's a 50/50 chance. Anything better?",
          videoUrl: "",
        },
        {
          id: "cp2-18-pitch",
          type: "PLAY_DECISION",
          atRoundIdx: 0,
          promptText:
            "We have 3 diamond winners, is there anything useful we can throw on our 3rd winner?",
          options: [
            { id: "spade", label: "A spade" },
            { id: "heart", label: "A heart" },
            { id: "nodiff", label: "No difference, doesn't help us get 12 tricks" },
          ],
          expectedChoice: "heart",
          continueButtonLabel: "show me the play",
          revealText:
            "Pitch a heart. As a running theme of the past few problems, we can often profitably throw something with our extra winners. Here we throw a heart and we try to ruff hearts, hoping the King drops. If it doesn't we fall back on the boring 50/50.\n\nSo we have the heart chance, or the spade up for our 12th trick.\n\nThe key to seeing these type of plays is to count to the 11 tricks, and know that an extra trick in hearts will bring us over the line.",
        },
        {
          id: "cp2-18-kingdropped",
          type: "INFO",
          atRoundIdx: 7,
          continueButtonLabel: "reveal the hand",
          promptText:
            "The king has dropped! We can now just go back to dummy with a club, cash our winning Jack of hearts and pitch a spade. That gives us our 12th trick - which is good since the Ace of spades was offside!",
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "J8", H: "J985", D: "KQ8", C: "Q1084" },
      east: { S: "76432", H: "K63", D: "J642", C: "2" },
      south: { S: "K9", H: "AQ", D: "A9", C: "AKJ9753" },
      west: { S: "AQ105", H: "10742", D: "10753", C: "6" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads ♣6; declarer wins ♣J — both defenders' trumps fall)",
        plays: [
          { seat: "W", card: { rank: "6", suit: "C" } },
          { seat: "N", card: { rank: "4", suit: "C" } },
          { seat: "E", card: { rank: "2", suit: "C" } },
          { seat: "S", card: { rank: "J", suit: "C" } },
        ],
      },
      {
        label: "Trick 2 (cash the ♥A)",
        plays: [
          { seat: "S", card: { rank: "A", suit: "H" } },
          { seat: "W", card: { rank: "2", suit: "H" } },
          { seat: "N", card: { rank: "8", suit: "H" } },
          { seat: "E", card: { rank: "3", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (cash the ♦A)",
        plays: [
          { seat: "S", card: { rank: "A", suit: "D" } },
          { seat: "W", card: { rank: "3", suit: "D" } },
          { seat: "N", card: { rank: "8", suit: "D" } },
          { seat: "E", card: { rank: "2", suit: "D" } },
        ],
      },
      {
        label: "Trick 4 (♦9 over to dummy's ♦K)",
        plays: [
          { seat: "S", card: { rank: "9", suit: "D" } },
          { seat: "W", card: { rank: "5", suit: "D" } },
          { seat: "N", card: { rank: "K", suit: "D" } },
          { seat: "E", card: { rank: "4", suit: "D" } },
        ],
      },
      {
        label: "Trick 5 (cash the ♦Q — pitch the ♥Q from hand)",
        plays: [
          { seat: "N", card: { rank: "Q", suit: "D" } },
          { seat: "E", card: { rank: "6", suit: "D" } },
          { seat: "S", card: { rank: "Q", suit: "H" } },
          { seat: "W", card: { rank: "7", suit: "D" } },
        ],
      },
      {
        label: "Trick 6 (lead a ♥ from dummy; ruff with the ♣A)",
        plays: [
          { seat: "N", card: { rank: "5", suit: "H" } },
          { seat: "E", card: { rank: "6", suit: "H" } },
          { seat: "S", card: { rank: "A", suit: "C" } },
          { seat: "W", card: { rank: "4", suit: "H" } },
        ],
      },
      {
        label: "Trick 7 (♣9 over to dummy's ♣10)",
        plays: [
          { seat: "S", card: { rank: "9", suit: "C" } },
          { seat: "W", card: { rank: "5", suit: "S" } },
          { seat: "N", card: { rank: "T", suit: "C" } },
          { seat: "E", card: { rank: "2", suit: "S" } },
        ],
      },
      {
        label: "Trick 8 (lead another ♥; ruff with the ♣K — the ♥K drops)",
        plays: [
          { seat: "N", card: { rank: "9", suit: "H" } },
          { seat: "E", card: { rank: "K", suit: "H" } },
          { seat: "S", card: { rank: "K", suit: "C" } },
          { seat: "W", card: { rank: "7", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "cp2-19",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Over the Shoulder #2 (4)",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["north", "south"],
    revealFullHandsAtEnd: ["east", "west"],
    auction: "",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Over the Shoulder #2",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Over the Shoulder #2",
      promptThemeTint: "overShoulderDeclarer2",
      videoUrlBeforeStart: "https://youtube.com/shorts/rPSBotAW6qk?si=iwqVsIYicyuMtVAg",
      customPrompts: [
        {
          id: "cp2-19-count",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  As always, let's count tricks. 5 spades, 3 aces. Total is 8. Where are we
                  getting 2 more tricks from?
                </p>
                <p className="ct-revealRichBody">
                  You have prospects for more tricks from setting up clubs, and also from finesses.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-19-finesse",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText: "Which finesses will you hope to take?",
          options: [
            { id: "diamond", label: "Diamond finesse" },
            { id: "club", label: "Club finesse" },
            { id: "neither", label: "Neither" },
          ],
          expectedChoice: "neither",
          revealText:
            "Neither finesse. A bit of a trick question, sorry! It is important to be grounded and keep things simple, so problems like these serve an important purpose.",
        },
        {
          id: "cp2-19-rule",
          type: "INFO",
          atRoundIdx: -1,
          continueButtonLabel: "show me the play",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  <strong>Rule: Always keep it as simple as possible.</strong>
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  On this hand we have the 8 tricks mentioned (5 spades and 3 outside aces). We can
                  take two heart ruffs in dummy, provided we reject the finesses and just take the
                  ruffs.
                </p>
                <p className="ct-revealRichBody">
                  The problem with going for a finesse is that, if it loses, the opponents will draw
                  a second trump!
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-19-final",
          type: "INFO",
          atRoundIdx: 5,
          continueButtonLabel: "reveal the hand",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  We have now made 6 tricks and we have 4 top trumps left, for 10.
                </p>
                <p className="ct-revealRichBody">
                  The difficulty here was ignoring the finesses. This hand would've been easier to
                  make for some people if the minor-suit queens weren't there and they didn't have
                  that option — in such a case it might be easier to notice that you can just make it
                  by taking 2 ruffs!
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "Q94", H: "A", D: "852", C: "976532" },
      east: { S: "653", H: "KQJ10", D: "J1074", C: "J10" },
      south: { S: "AKJ108", H: "9642", D: "AQ", C: "AQ" },
      west: { S: "72", H: "8753", D: "K963", C: "K84" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads ♠2; declarer wins ♠8)",
        plays: [
          { seat: "W", card: { rank: "2", suit: "S" } },
          { seat: "N", card: { rank: "4", suit: "S" } },
          { seat: "E", card: { rank: "3", suit: "S" } },
          { seat: "S", card: { rank: "8", suit: "S" } },
        ],
      },
      {
        label: "Trick 2 (cash the ♥A in dummy)",
        plays: [
          { seat: "S", card: { rank: "2", suit: "H" } },
          { seat: "W", card: { rank: "3", suit: "H" } },
          { seat: "N", card: { rank: "A", suit: "H" } },
          { seat: "E", card: { rank: "T", suit: "H" } },
        ],
      },
      {
        label: "Trick 3 (cash the ♣A)",
        plays: [
          { seat: "N", card: { rank: "2", suit: "C" } },
          { seat: "E", card: { rank: "T", suit: "C" } },
          { seat: "S", card: { rank: "A", suit: "C" } },
          { seat: "W", card: { rank: "4", suit: "C" } },
        ],
      },
      {
        label: "Trick 4 (lead a ♥; ruff in dummy with the ♠9)",
        plays: [
          { seat: "S", card: { rank: "4", suit: "H" } },
          { seat: "W", card: { rank: "5", suit: "H" } },
          { seat: "N", card: { rank: "9", suit: "S" } },
          { seat: "E", card: { rank: "J", suit: "H" } },
        ],
      },
      {
        label: "Trick 5 (cash the ♦A)",
        plays: [
          { seat: "N", card: { rank: "2", suit: "D" } },
          { seat: "E", card: { rank: "4", suit: "D" } },
          { seat: "S", card: { rank: "A", suit: "D" } },
          { seat: "W", card: { rank: "3", suit: "D" } },
        ],
      },
      {
        label: "Trick 6 (lead a ♥; ruff in dummy with the ♠Q)",
        plays: [
          { seat: "S", card: { rank: "6", suit: "H" } },
          { seat: "W", card: { rank: "7", suit: "H" } },
          { seat: "N", card: { rank: "Q", suit: "S" } },
          { seat: "E", card: { rank: "Q", suit: "H" } },
        ],
      },
    ],
  },
  {
    id: "cp2-20",
    difficulty: 2,
    seatMode: "compass",
    playEngine: "compassClockwise",
    title: "Over the Shoulder #2 (5)",
    trumpSuit: "S",
    contract: "4♠",
    dealerCompass: "N",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["north", "south"],
    revealFullHandsAtEnd: ["east", "west"],
    auction: "",
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      showAuctionDuringPlayDecisionReveal: true,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      contractLabel: "Over the Shoulder #2",
      contractLabelBeforeStartOnly: true,
      themeLabel: "Theme: Over the Shoulder #2",
      promptThemeTint: "overShoulderDeclarer2",
      videoUrlBeforeStart: "https://youtube.com/shorts/I7Xb-U0VRyA?si=x34MHkIlvfFH_kIh",
      customPrompts: [
        {
          id: "cp2-20-drawtrumps",
          type: "INFO",
          atRoundIdx: 0,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Declarer decided to draw trumps, as delaying looked like a sure heart ruff.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-20-trumpbreak",
          type: "DISTRIBUTION_GUESS",
          suit: "S",
          atRoundIdx: 2,
          fixed: { N: 4, S: 4 },
          expectedDistribution: { N: 4, S: 4, W: 3, E: 2 },
          promptText: "What was the trump break?",
        },
        {
          id: "cp2-20-trumpbreak-msg",
          type: "INFO",
          atRoundIdx: 2,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  West started with 3, East with 2 — they broke 4342. As always, it's good to have a
                  grasp on the trump suit.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-20-count",
          type: "INFO",
          atRoundIdx: 2,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  You have 9 top tricks after you set up hearts: 4 spades, 3 hearts, the Ace of clubs
                  and the Ace of diamonds.
                </p>
                <p className="ct-revealRichBody">
                  Have a think about where the 10th trick will come from — it looks like you have
                  chances in both minors.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-20-setuphearts",
          type: "INFO",
          atRoundIdx: 2,
          continueButtonLabel: "continue the play",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Declarer went on to set up the heart tricks, a sensible-looking choice.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-20-diamond",
          type: "PLAY_CARD",
          atRoundIdx: 3,
          promptText: "East leads a low diamond — which card do you play?",
          playCardResponderSeat: "S",
          playCardAutoPlaysBefore: [{ seat: "E", card: { rank: "4", suit: "D" } }],
          playCardRequireCorrect: false,
          playCardRevealHideSuccessBanner: true,
          playCardShowNextCustomPromptOnContinue: true,
          expectedSuit: "D",
          expectedRank: "A",
          continueButtonLabel: "continue",
          revealText: (
            <div className="ct-revealRichRoot">
              <div className="ct-revealRich">
                <div className="ct-revealRichCard ct-revealRichCard--slate">
                  <p className="ct-revealRichBody">
                    The Ace of diamonds is correct. This hand, along with several of the previous
                    ones, was difficult to spot because you have the Queen of diamonds as a tempting
                    option — the simple finesse. However, the hand is cold if you reject the finesse.
                  </p>
                </div>
                <div className="ct-revealRichCard ct-revealRichCard--amber">
                  <p className="ct-revealRichBody">
                    <strong>
                      Big idea: when a finesse is available, challenge your instinct to always take
                      it — sometimes you have to stop and think, what about if I don't take the
                      finesse?
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-20-finesse-note",
          type: "INFO",
          atRoundIdx: 3,
          continueButtonLabel: "show me the play",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  I am not suggesting that you stop taking all finesses as of today — they are still
                  an excellent way to make extra tricks. I'm just encouraging you not to play
                  reflexively, and rather let your trick counting and planning guide you.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-20-endplay",
          type: "INFO",
          atRoundIdx: 8,
          continueButtonLabel: "continue",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  The opponents are forced to play clubs for you, or give you your 10th trick by way
                  of a ruff and discard.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
        {
          id: "cp2-20-final",
          type: "INFO",
          atRoundIdx: 9,
          continueButtonLabel: "reveal the hand",
          promptText: (
            <div className="ct-revealRich">
              <section className="ct-revealRichCard ct-revealRichCard--slate">
                <p className="ct-revealRichBody">
                  Now perhaps you can see the end is here: East can play a club into dummy, with only
                  the King remaining, or give you a ruff and discard.
                </p>
              </section>
              <section className="ct-revealRichCard ct-revealRichCard--amber">
                <p className="ct-revealRichBody">
                  If you had taken the diamond finesse you would be 1 off — the opponents would not
                  have been on play at the critical moment. You would have been.
                </p>
              </section>
            </div>
          ),
          videoUrl: "",
        },
      ],
    },
    shownHands: {
      north: { S: "AJ95", H: "Q1094", D: "103", C: "A108" },
      east: { S: "73", H: "A65", D: "87642", C: "Q52" },
      south: { S: "KQ104", H: "KJ83", D: "AQ", C: "J74" },
      west: { S: "862", H: "72", D: "KJ95", C: "K963" },
    },
    rounds: [
      {
        label: "Trick 1 (West leads ♠2; declarer wins ♠K)",
        plays: [
          { seat: "W", card: { rank: "2", suit: "S" } },
          { seat: "N", card: { rank: "5", suit: "S" } },
          { seat: "E", card: { rank: "3", suit: "S" } },
          { seat: "S", card: { rank: "K", suit: "S" } },
        ],
      },
      {
        label: "Trick 2 (♠Q draws trumps)",
        plays: [
          { seat: "S", card: { rank: "Q", suit: "S" } },
          { seat: "W", card: { rank: "6", suit: "S" } },
          { seat: "N", card: { rank: "9", suit: "S" } },
          { seat: "E", card: { rank: "7", suit: "S" } },
        ],
      },
      {
        label: "Trick 3 (♠4 to dummy's ♠A; East shows out — trumps are 4-3-4-2)",
        plays: [
          { seat: "S", card: { rank: "4", suit: "S" } },
          { seat: "W", card: { rank: "8", suit: "S" } },
          { seat: "N", card: { rank: "A", suit: "S" } },
          { seat: "E", card: { rank: "2", suit: "D" }, showOut: true },
        ],
      },
      {
        label: "Trick 4 (dummy leads ♥10 to drive out the ♥A)",
        plays: [
          { seat: "N", card: { rank: "T", suit: "H" } },
          { seat: "E", card: { rank: "A", suit: "H" } },
          { seat: "S", card: { rank: "3", suit: "H" } },
          { seat: "W", card: { rank: "2", suit: "H" } },
        ],
      },
      {
        label: "Trick 5 (East leads ♦4; rise with the ♦A — no finesse)",
        plays: [
          { seat: "E", card: { rank: "4", suit: "D" } },
          { seat: "S", card: { rank: "A", suit: "D" } },
          { seat: "W", card: { rank: "5", suit: "D" } },
          { seat: "N", card: { rank: "3", suit: "D" } },
        ],
      },
      {
        label: "Trick 6 (cash a heart; ♥Q wins)",
        plays: [
          { seat: "S", card: { rank: "8", suit: "H" } },
          { seat: "W", card: { rank: "7", suit: "H" } },
          { seat: "N", card: { rank: "Q", suit: "H" } },
          { seat: "E", card: { rank: "5", suit: "H" } },
        ],
      },
      {
        label: "Trick 7 (♥9; your ♥J wins, West discards)",
        plays: [
          { seat: "N", card: { rank: "9", suit: "H" } },
          { seat: "E", card: { rank: "6", suit: "H" } },
          { seat: "S", card: { rank: "J", suit: "H" } },
          { seat: "W", card: { rank: "3", suit: "C" } },
        ],
      },
      {
        label: "Trick 8 (cash the ♥K)",
        plays: [
          { seat: "S", card: { rank: "K", suit: "H" } },
          { seat: "W", card: { rank: "9", suit: "D" } },
          { seat: "N", card: { rank: "4", suit: "H" } },
          { seat: "E", card: { rank: "7", suit: "D" } },
        ],
      },
      {
        label: "Trick 9 (lead the ♦Q; West wins ♦K and is thrown in)",
        plays: [
          { seat: "S", card: { rank: "Q", suit: "D" } },
          { seat: "W", card: { rank: "K", suit: "D" } },
          { seat: "N", card: { rank: "T", suit: "D" } },
          { seat: "E", card: { rank: "8", suit: "D" } },
        ],
      },
      {
        label: "Trick 10 (West must exit a club; East wins ♣Q and is endplayed)",
        plays: [
          { seat: "W", card: { rank: "6", suit: "C" } },
          { seat: "N", card: { rank: "8", suit: "C" } },
          { seat: "E", card: { rank: "Q", suit: "C" } },
          { seat: "S", card: { rank: "4", suit: "C" } },
        ],
      },
    ],
  },
];

// Temporarily hidden (work-in-progress, not ready for live). Remove ids below to re-enable.
const BC_HIDDEN_DECLARER_IDS = new Set([]);
export const CARDPLAY_PUZZLES =
  process.env.NODE_ENV === "production"
    ? CARDPLAY_PUZZLES_ALL.filter((p) => !(p && BC_HIDDEN_DECLARER_IDS.has(p.id)))
    : CARDPLAY_PUZZLES_ALL;

function isPuzzleNew(puzzle) {
  return !!(puzzle && puzzle.newUntil && new Date() < new Date(puzzle.newUntil));
}

export const CARDPLAY_HAS_NEW = CARDPLAY_PUZZLES.some(isPuzzleNew);

function CardPlayTrainer(routeProps) {
  return <CountingTrumpsTrainer {...routeProps} puzzlesOverride={CARDPLAY_PUZZLES} trainerLabel="Declarer Play" categoryKey="declarer" />;
}

export default CardPlayTrainer;

