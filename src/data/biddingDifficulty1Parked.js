/**
 * Bidding difficulty 1 — problems removed from the live list (parked for later).
 *
 * • “Licence to bid” pair: live app uses different `bid1-17` / `bid1-18` — before merging those parked entries back,
 *   rename every `id` here (and nested prompt ids) so nothing duplicates `BIDDING_PUZZLES` in BiddingTrainer.js.
 * • `bid1-23` (weak two / step in vulnerable): stash as-is; re-enable by splicing into `BIDDING_PUZZLES` after `bid1-22`.
 *
 * Restore: import and splice into the array; edit `title` numbers to match order.
 */
export const BIDDING_DIFFICULTY_1_PARKED = [
  {
    id: "bid1-17",
    difficulty: 1,
    title: "Licence to bid (17): FUN 6+ — bid game on nothing?",
    trumpSuit: "H",
    contract: "—",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♣ 1♥ X ?",
    vulnerability: "EW Vul",
    shownHands: {
      DECLARER: { S: "9876", H: "JT98", D: "2", C: "5432" },
      DUMMY: { S: "5", H: "KQ765", D: "9876", C: "J109" },
      LHO: { S: "QJT", H: "43", D: "AJT5", C: "AK65" },
      RHO: { S: "AK432", H: "A2", D: "KQ43", C: "Q8" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Licence to bid · FUN 6+",
      promptThemeTint: "active",
      contractLabel: "Little or no points — when is it right to bid anyway?",
      contractLabelBeforeStartOnly: true,
      auctionOpponentsRed: true,
      auctionResolvedText: "1♣ 1♥ X 4♥",
      auctionShowResolvedDuringInfoPromptId: "bid1-17-worry",
      hidePlayDecisionHeading: true,
      customPrompts: [
        {
          id: "bid1-17-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "Let's look at when it is correct to bid with little or no points.\n\nFUN 6+",
          videoUrl: "",
        },
        {
          id: "bid1-17-fun",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "FUN 6+ stands for:\n\n• Fit (with partner)\n• Unbalanced\n• Not vulnerable\n• 6+ card suit\n\nWe often only need one or two of these factors — but the more we have, the more we should push.",
          videoUrl: "",
        },
        {
          id: "bid1-17-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "You have 1 point. West opens 1♣, partner bids 1♥, and RHO doubles. What do you do?",
          options: [
            { id: "pass", label: "Pass" },
            { id: "2h", label: "2♥" },
            { id: "3h", label: "3♥" },
            { id: "4h", label: "4♥" },
          ],
          expectedChoice: "4h",
          noContinue: false,
          revealText:
            "The correct bid is 4♥.\n\nWhy it works (FUN 6+):\n\nF — Fit: we likely have a big heart fit.\n\nU — Unbalanced: singleton = unbalanced.\n\nN — Not vulnerable: we are white, they are red.\n\n6+ — we do not have every factor here, and that's fine.\n\nOne or two factors can be enough. Three factors mean we should bid very aggressively.",
          videoUrl: "",
        },
        {
          id: "bid1-17-worry",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "Are you worried about going two or three off?\n\nDon't be — that will often still be a top board.",
          infoEndsWithReveal:
            "You ended up getting doubled in 4♥, going 3 off when the opponents are making slam — but even bidding game is a better score for them!",
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-18",
    difficulty: 1,
    title: "Licence to bid (18): Dare to bid over 2/1?",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "W",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "1♥ P 2♣ ?",
    vulnerability: "EW Vul",
    shownHands: {
      DECLARER: { S: "KQ109876", H: "2", D: "Q109", C: "43" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "Licence to bid · FUN 6+",
      promptThemeTint: "active",
      contractLabel: "Opponents in a game force — do you step in?",
      contractLabelBeforeStartOnly: true,
      auctionOpponentsRed: true,
      auctionResolvedText: "1♥ P 2♣ 4♠",
      auctionShowResolvedDuringInfoPromptId: "bid1-18-fun",
      hidePlayDecisionHeading: true,
      customPrompts: [
        {
          id: "bid1-18-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "The opponents are playing 2/1, which means they have shown a game forcing auction. Do you dare step into that?",
          options: [
            { id: "pass", label: "Pass" },
            { id: "2s", label: "2♠" },
            { id: "3s", label: "3♠" },
            { id: "4s", label: "4♠" },
          ],
          expectedChoice: "4s",
          noContinue: false,
          revealText:
            "4♠ is the bid that a multi-time world champion made. 2♠ and 3♠ are not clearly \"wrong\", but the best players are choosing to be more active in select situations.",
          videoUrl: "",
        },
        {
          id: "bid1-18-fun",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "Let's use FUN 6+ to see why he chose this bid.\n\n1. We don't know about a fit — but when our side first steps into the auction we don't consider this.\n\n2. Unbalanced — we have a singleton; that's the key marker.\n\n3. Not vul — that's the time to bid; here we are not vulnerable. (Advanced point: when the opponents are vulnerable and have game on, we have even more licence to bid.)\n\n4. 6+ — we get even more active when we have a 6-card suit. A good 7-card suit largely accounts for why we chose such an \"aggressive\" bid of 4♠.",
          videoUrl: "",
        },
      ],
    },
  },
  {
    id: "bid1-23",
    difficulty: 1,
    title: "2-level overcalls (23): Weak two — step in vulnerable?",
    trumpSuit: "S",
    contract: "—",
    dealerCompass: "E",
    declarerCompass: "S",
    viewerCompass: "S",
    visibleFullHandSeats: ["DECLARER"],
    auction: "2♥ ?",
    vulnerability: "All Vul",
    shownHands: {
      DECLARER: { S: "KJ987", H: "2", D: "AQ92", C: "762" },
    },
    rounds: [],
    promptOptions: {
      promptPlacement: "right",
      hideAuction: false,
      disableWarmupTrumpGuess: true,
      questionNumbers: [],
      themeLabel: "2-level overcalls",
      promptThemeTint: "twoLevel",
      contractLabel: "East opens a weak 2♥ — both sides vulnerable, you are South",
      contractLabelBeforeStartOnly: true,
      auctionAllRed: true,
      hidePlayDecisionHeading: true,
      customPrompts: [
        {
          id: "bid1-23-intro",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "##Two-level overcalls##\n\nBoth sides vulnerable (all red). East opens a weak 2♥.",
          videoUrl: "",
        },
        {
          id: "bid1-23-q",
          type: "PLAY_DECISION",
          atRoundIdx: -1,
          promptText:
            "The opponent on your right, East, opens a weak 2♥ — do you step in, vulnerable?",
          options: [
            { id: "notEnough", label: "This hand is not good enough for me, especially vulnerable." },
            { id: "goodEnough", label: "This hand is good enough for a 2♠ bid." },
          ],
          expectedChoice: "goodEnough",
          noContinue: false,
          revealText:
            "[[ALERT]]\nThis hand IS good enough.\n[[/ALERT]]\n\nFirstly, a side-note — should we be conservative when vulnerable? It is not as straightforward as people think; sometimes we have to be more aggressive when vulnerable!\n\nBut that is not in the scope of this topic — it will be a very near-future topic though.",
          videoUrl: "",
        },
        {
          id: "bid1-23-beauty",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "By now, if you have been doing the other bidding problems, you should appreciate that this hand has some beauty that other people might not see when they just count the 10 points it contains.",
          videoUrl: "",
        },
        {
          id: "bid1-23-reasons",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "1. All the points are in the long suits.\n\n2. The presence of 10s and 9s in the long suits.\n\n3. Shapely 5431 shape is good. It has a singleton. It is nothing spectacular, but it is a lot stronger than 5332.\n\n4. Touching on the topic of vulnerability — when I am entering the bidding with a \"sound\" hand, I do not fear the vulnerability. (A lot more on vulnerability in future topics.)",
          videoUrl: "",
        },
        {
          id: "bid1-23-minimum",
          type: "INFO",
          atRoundIdx: -1,
          promptText:
            "Overall, however, I would say this is a minimum. With any less than, say, 10 points, we can pass and still sleep that night.",
          videoUrl: "",
        },
      ],
    },
  },
];
