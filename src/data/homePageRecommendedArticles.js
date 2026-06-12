/**
 * Homepage: "Recent and recommended articles" strip (JustAdded component).
 * Add or edit entries here — each item is one link on the front page.
 *
 * - path: site-relative URL (e.g. /bidding/advanced/yt6au7gwYwPahTxQ4kd5)
 * - label: link text shown on the homepage (include → at the end if you like)
 */

export const HOME_PAGE_RECOMMENDED_ARTICLES_TITLE =
  "This week, last week, and recent articles";

/** @type {{ label: string, path: string }[]} */
export const HOME_PAGE_RECOMMENDED_ARTICLES = [
  {
    label: "This week: Over the Shoulder — bidding (5 new) →",
    path: "/bidding/practice?difficulty=2&problem=bid2-44",
  },
  {
    label: "This week: Over the Shoulder — declarer (5 new) →",
    path: "/declarer/practice?difficulty=2&problem=cp2-11",
  },
  {
    label: "Last week: Loser count in the bidding →",
    path: "/bidding/practice?difficulty=2&problem=bid2-34",
  },
  {
    label: "Last week: Better rebid fundamentals →",
    path: "/bidding/practice?difficulty=2&problem=bid2-39",
  },
  {
    label: "Recent article: Opening 2C — avoid whenever possible →",
    path: "/bidding/advanced/opening-2c-avoid-whenever-possible",
  },
  {
    label: "Recent article: Takeout doubles — complete guide →",
    path: "/bidding/advanced/takeout-doubles-complete-guide",
  },
];
